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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../supabase/supabase.service");
const transactions_service_1 = require("../transactions/transactions.service");
let WalletService = class WalletService {
    constructor(supabaseService, transactionsService) {
        this.supabaseService = supabaseService;
        this.transactionsService = transactionsService;
    }
    async getWallet(userId) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error)
            throw error;
        return data;
    }
    async addFunds(userId, amount, source = 'UPI', referenceId) {
        const supabase = this.supabaseService.getClient();
        const transaction = await this.transactionsService.createTransaction({
            userId,
            amount,
            type: 'CREDIT',
            source,
            referenceId,
            status: 'PENDING'
        });
        const { data: wallet, error } = await supabase.rpc('increment_wallet_balance', {
            row_id: userId,
            amount_to_add: amount
        });
        if (error) {
            const current = await this.getWallet(userId);
            await supabase
                .from('wallets')
                .update({ balance: (current.balance || 0) + amount })
                .eq('user_id', userId);
        }
        await this.transactionsService.updateStatus(transaction.id, 'SUCCESS');
        return { success: true, transactionId: transaction.id };
    }
    async withdrawFunds(userId, amount, source, referenceId) {
        const supabase = this.supabaseService.getClient();
        const wallet = await this.getWallet(userId);
        if ((wallet.balance || 0) < amount) {
            throw new Error('Insufficient wallet balance');
        }
        const transaction = await this.transactionsService.createTransaction({
            userId,
            amount,
            type: 'DEBIT',
            source,
            referenceId,
            status: 'PENDING'
        });
        await supabase
            .from('wallets')
            .update({ balance: (wallet.balance || 0) - amount })
            .eq('user_id', userId);
        await this.transactionsService.updateStatus(transaction.id, 'SUCCESS');
        return { success: true, transactionId: transaction.id };
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        transactions_service_1.TransactionsService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map