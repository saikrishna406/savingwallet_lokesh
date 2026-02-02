-- Gamification Schema Update

-- 1. Add Streak Tracking to Users Table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_contribution_date TIMESTAMP WITH TIME ZONE;

-- 2. Create Badges Table
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, -- e.g., 'early-bird'
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL -- FontAwesome icon name or URL
);

-- 3. Create User Badges Table (Relationship)
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id) -- Prevent duplicate badges
);

-- 4. Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Badges are public readable
CREATE POLICY "Everyone can view badges" ON public.badges FOR SELECT USING (true);

-- User Badges are readable by owner
CREATE POLICY "Users can view own earned badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- 6. Seed Initial Badges
INSERT INTO public.badges (slug, name, description, icon) VALUES
('early-bird', 'Early Bird', 'Made your first saving', 'fa-feather'),
('savings-streak', 'Hot Streak', 'Saved 3 days in a row', 'fa-fire'),
('goal-crusher', 'Goal Crusher', 'Completed your first goal', 'fa-trophy')
ON CONFLICT (slug) DO NOTHING;
