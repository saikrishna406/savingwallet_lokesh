import { SupabaseService } from '../../supabase/supabase.service';
export declare class GoalsService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    getGoals(userId: string): Promise<any[]>;
    createGoal(userId: string, goalData: any): Promise<any>;
}
