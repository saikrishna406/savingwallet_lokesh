"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../supabase/supabase.service");
let TransactionsService = class TransactionsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async createTransaction(dto) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('transactions')
            .insert({
            user_id: dto.userId,
            wallet_id: dto.walletId,
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
            throw new common_1.InternalServerErrorException(`Failed to create transaction: ${error.message}`);
        }
        return data;
    }
    async updateStatus(transactionId, status) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('transactions')
            .update({ status })
            .eq('id', transactionId)
            .select()
            .single();
        if (error) {
            throw new common_1.InternalServerErrorException(`Failed to update transaction status: ${error.message}`);
        }
        return data;
    }
    async getUserTransactions(userId) {
        if (!userId) {
            console.error('Error: userId is missing in getUserTransactions');
            throw new common_1.InternalServerErrorException('User ID is undefined');
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
            throw new common_1.InternalServerErrorException(`Failed to fetch transactions: ${error.message}`);
        }
        return data;
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map