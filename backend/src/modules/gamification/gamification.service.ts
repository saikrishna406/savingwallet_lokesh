import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { NudgesService } from '../nudges/nudges.service';

@Injectable()
export class GamificationService {
    private readonly logger = new Logger(GamificationService.name);

    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly nudgesService: NudgesService
    ) { }

    async getUserStatus(userId: string) {
        const supabase = this.supabaseService.getClient();

        // Fetch User Streak Data
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('streak_count, last_contribution_date')
            .eq('id', userId)
            .single();

        if (userError) this.logger.error(`Error fetching user streak: ${userError.message}`);

        // Fetch User Badges
        const { data: badges, error: badgesError } = await supabase
            .from('user_badges')
            .select(`
                earned_at,
                badges (
                    slug,
                    name,
                    description,
                    icon
                )
            `)
            .eq('user_id', userId);

        if (badgesError) this.logger.error(`Error fetching user badges: ${badgesError.message}`);

        return {
            streak: user?.streak_count || 0,
            lastContribution: user?.last_contribution_date,
            badges: badges?.map(b => ({
                ...b.badges,
                earned_at: b.earned_at
            })) || []
        };
    }

    /**
     * Called whenever a user makes a savings contribution
     */
    async updateStreak(userId: string) {
        const supabase = this.supabaseService.getClient();

        // 1. Get current streak info
        const { data: user } = await supabase
            .from('users')
            .select('streak_count, last_contribution_date')
            .eq('id', userId)
            .single();

        if (!user) return;

        const now = new Date();
        const lastDate = user.last_contribution_date ? new Date(user.last_contribution_date) : null;

        let newStreak = user.streak_count || 0;
        let shouldUpdate = false;

        if (!lastDate) {
            // First contribution ever
            newStreak = 1;
            shouldUpdate = true;
        } else {
            // Normalize dates to ignore time
            const lastDateString = lastDate.toISOString().split('T')[0];
            const todayString = now.toISOString().split('T')[0];

            // Check yesterday
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split('T')[0];

            if (lastDateString === todayString) {
                // Already contributed today, do nothing
                shouldUpdate = true; // Still update time
            } else if (lastDateString === yesterdayString) {
                // Contributed yesterday, increment streak
                newStreak += 1;
                shouldUpdate = true;
            } else {
                // Missed a day (or more), reset streak
                newStreak = 1;
                shouldUpdate = true;
            }
        }

        if (shouldUpdate) {
            await supabase
                .from('users')
                .update({
                    streak_count: newStreak,
                    last_contribution_date: now
                })
                .eq('id', userId);

            // Check for 'Hot Streak' badge (3 days)
            if (newStreak >= 3) {
                await this.awardBadge(userId, 'savings-streak');
            }

            // Check for '7 Day Streak' milestone (Just a nudge, no badge yet)
            if (newStreak === 7) {
                await this.nudgesService.createNudge(userId, "🔥 You're on fire! 7 days in a row!", 'milestone');
            }
        }

        // Check for 'Early Bird' badge (First contribution)
        await this.awardBadge(userId, 'early-bird');
    }

    async checkGoalCompletionBadges(userId: string) {
        await this.awardBadge(userId, 'goal-crusher');
    }

    private async awardBadge(userId: string, badgeSlug: string) {
        const supabase = this.supabaseService.getClient();

        // 1. Get Badge ID
        const { data: badge } = await supabase
            .from('badges')
            .select('id, name')
            .eq('slug', badgeSlug)
            .single();

        if (!badge) return;

        // 2. Try to insert user_badge (Ignore if exists due to UNIQUE constraint)
        const { error } = await supabase
            .from('user_badges')
            .insert({
                user_id: userId,
                badge_id: badge.id
            })
            .select()
            .single();

        if (!error) {
            this.logger.log(`Awarded badge ${badgeSlug} to user ${userId}`);
            // Send Nudge
            await this.nudgesService.createNudge(userId, `🏆 Achievement Unlocked: ${badge.name}!`, 'achievement');
        }
    }
}
