import { SupabaseService } from '../../supabase/supabase.service';
import { TransactionsService } from '../transactions/transactions.service';
export declare class WalletService {
    private supabaseService;
    private transactionsService;
    constructor(supabaseService: SupabaseService, transactionsService: TransactionsService);
    getWallet(userId: string): Promise<any>;
    addFunds(userId: string, amount: number, source?: 'SAVE' | 'UPI', referenceId?: string): Promise<{
        success: boolean;
        transactionId: any;
    }>;
    withdrawFunds(userId: string, amount: number, source: 'WITHDRAW' | 'GOAL_CONTRIBUTION', referenceId?: string): Promise<{
        success: boolean;
        transactionId: any;
    }>;
}
