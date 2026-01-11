import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class GoalsService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async getGoals(userId: string) {
        const supabase = this.supabaseService.getClient();

        // Fetch goals for the specific user
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        return data;
    }

    async createGoal(userId: string, goalData: any) {
        const supabase = this.supabaseService.getClient();

        // Prepare goal object
        const newGoal = {
            user_id: userId,
            name: goalData.title, // Map frontend 'title' to DB 'name'
            target_amount: goalData.target_amount,
            current_amount: goalData.current_amount || 0,
            target_date: goalData.target_date,
            status: 'active', // Default status must vary based on constraint check ('active', 'completed')
            category: goalData.category || 'General',
            created_at: new Date()
        };

        const { data, error } = await supabase
            .from('goals')
            .insert(newGoal)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        return data;
    }
}
