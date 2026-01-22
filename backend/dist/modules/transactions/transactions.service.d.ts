import { SupabaseService } from '../../supabase/supabase.service';
export interface CreateTransactionDto {
    userId: string;
    walletId?: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    source: 'SAVE' | 'WITHDRAW' | 'UPI' | 'GOAL_CONTRIBUTION';
    referenceId?: string;
    status?: 'PENDING' | 'SUCCESS' | 'FAILED';
}
export declare class TransactionsService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    createTransaction(dto: CreateTransactionDto): Promise<any>;
    updateStatus(transactionId: string, status: 'SUCCESS' | 'FAILED'): Promise<any>;
    getUserTransactions(userId: string): Promise<any[]>;
}
