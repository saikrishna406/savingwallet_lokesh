import { SupabaseService } from '../../supabase/supabase.service';
import { WalletService } from '../../modules/wallet/wallet.service';
export declare class GoalsService {
    private readonly supabaseService;
    private readonly walletService;
    constructor(supabaseService: SupabaseService, walletService: WalletService);
    getGoals(userId: string): Promise<any[]>;
    createGoal(userId: string, goalData: any): Promise<any>;
    addSavings(userId: string, goalId: string, amount: number): Promise<any>;
}
