import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class WalletService {
    constructor(
        private supabaseService: SupabaseService,
        private transactionsService: TransactionsService
    ) { }

    async getWallet(userId: string) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Add funds to wallet (CREDIT)
     * Rule: Always update through a transaction
     */
    async addFunds(userId: string, amount: number, source: 'SAVE' | 'UPI' = 'UPI', referenceId?: string) {
        const supabase = this.supabaseService.getClient();

        // 1. Create Transaction (PENDING)
        const transaction = await this.transactionsService.createTransaction({
            userId,
            amount,
            type: 'CREDIT',
            source,
            referenceId,
            status: 'PENDING'
        });

        // 2. Update Wallet Balance
        // Note: In a real production app, this should be a DB transaction/RPC
        const { data: wallet, error } = await supabase.rpc('increment_wallet_balance', {
            row_id: userId, // Assuming rpc takes user_id, or we do a direct update
            amount_to_add: amount
        });

        // Fallback to direct update if RPC doesn't exist (User might not have RPC)
        if (error) {
            // Fetch current balance
            const current = await this.getWallet(userId);
            await supabase
                .from('wallets')
                .update({ balance: (current.balance || 0) + amount })
                .eq('user_id', userId);
        }

        // 3. Mark Transaction SUCCESS
        await this.transactionsService.updateStatus(transaction.id, 'SUCCESS');

        return { success: true, transactionId: transaction.id };
    }

    /**
     * Withdraw funds from wallet (DEBIT)
     */
    async withdrawFunds(userId: string, amount: number, source: 'WITHDRAW' | 'GOAL_CONTRIBUTION', referenceId?: string) {
        const supabase = this.supabaseService.getClient();

        // 1. Check Balance
        const wallet = await this.getWallet(userId);
        if ((wallet.balance || 0) < amount) {
            throw new Error('Insufficient wallet balance');
        }

        // 2. Create Transaction (PENDING)
        const transaction = await this.transactionsService.createTransaction({
            userId,
            amount,
            type: 'DEBIT',
            source,
            referenceId,
            status: 'PENDING'
        });

        // 3. Deduct Wallet Balance
        await supabase
            .from('wallets')
            .update({ balance: (wallet.balance || 0) - amount })
            .eq('user_id', userId);

        // 4. Mark Transaction SUCCESS
        await this.transactionsService.updateStatus(transaction.id, 'SUCCESS');

        return { success: true, transactionId: transaction.id };
    }
}
