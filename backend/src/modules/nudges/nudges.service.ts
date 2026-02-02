import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class NudgesService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async createNudge(userId: string, message: string, type: 'reminder' | 'achievement' | 'suggestion' | 'milestone') {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase
            .from('nudges')
            .insert({
                user_id: userId,
                message,
                type,
                read: false
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to create nudge:', error);
            // Don't throw, just log. Nudges are non-critical.
        }

        return data;
    }

    async getNudges(userId: string) {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase
            .from('nudges')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20); // Limit to last 20 notifications

        if (error) {
            throw new InternalServerErrorException('Failed to fetch notifications');
        }

        return data;
    }

    async markRead(userId: string, nudgeId: string) {
        const supabase = this.supabaseService.getClient();

        const { error } = await supabase
            .from('nudges')
            .update({ read: true })
            .eq('id', nudgeId)
            .eq('user_id', userId);

        if (error) {
            throw new InternalServerErrorException('Failed to update notification');
        }

        return { success: true };
    }

    async markAllRead(userId: string) {
        const supabase = this.supabaseService.getClient();

        const { error } = await supabase
            .from('nudges')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) {
            throw new InternalServerErrorException('Failed to mark all as read');
        }

        return { success: true };
    }
}
