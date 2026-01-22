import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

export interface CreateTransactionDto {
    userId: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    source: 'SAVE' | 'WITHDRAW' | 'UPI' | 'GOAL_CONTRIBUTION';
    referenceId?: string;
    status?: 'PENDING' | 'SUCCESS' | 'FAILED';
}

@Injectable()
export class TransactionsService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async createTransaction(dto: CreateTransactionDto) {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: dto.userId,
                amount: dto.amount,
                type: dto.type,
                source: dto.source,
                reference_id: dto.referenceId,
                status: dto.status || 'PENDING',
                created_at: new Date()
            })
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(`Failed to create transaction: ${error.message}`);
        }

        return data;
    }

    async updateStatus(transactionId: string, status: 'SUCCESS' | 'FAILED') {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase
            .from('transactions')
            .update({ status })
            .eq('id', transactionId)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(`Failed to update transaction status: ${error.message}`);
        }

        return data;
    }

    async getUserTransactions(userId: string) {
        if (!userId) {
            console.error('Error: userId is missing in getUserTransactions');
            throw new InternalServerErrorException('User ID is undefined');
        }
        console.log(`Fetching transactions for user: ${userId}`);

        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Error (getUserTransactions):', JSON.stringify(error, null, 2));
            throw new InternalServerErrorException(`Failed to fetch transactions: ${error.message}`);
        }

        return data;
    }
}
