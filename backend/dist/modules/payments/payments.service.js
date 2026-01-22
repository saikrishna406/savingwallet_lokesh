"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const transactions_service_1 = require("../transactions/transactions.service");
const wallet_service_1 = require("../wallet/wallet.service");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto = __importStar(require("crypto"));
let PaymentsService = class PaymentsService {
    constructor(configService, transactionsService, walletService) {
        this.configService = configService;
        this.transactionsService = transactionsService;
        this.walletService = walletService;
        this.razorpay = new razorpay_1.default({
            key_id: this.configService.get('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
        });
    }
    async createOrder(userId, amount) {
        try {
            const options = {
                amount: amount * 100,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
            };
            const order = await this.razorpay.orders.create(options);
            const wallet = await this.walletService.getWallet(userId);
            if (!wallet)
                throw new Error('Wallet not found');
            const transaction = await this.transactionsService.createTransaction({
                userId,
                walletId: wallet.id,
                amount,
                type: 'CREDIT',
                source: 'UPI',
                referenceId: order.id,
                status: 'PENDING'
            });
            return {
                id: order.id,
                currency: order.currency,
                amount: order.amount,
                transactionId: transaction.id
            };
        }
        catch (error) {
            console.error('Razorpay Error:', error);
            throw new common_1.InternalServerErrorException('Failed to create payment order');
        }
    }
    async verifyPayment(userId, body) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
        const secret = this.configService.get('RAZORPAY_KEY_SECRET');
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
        if (generated_signature === razorpay_signature) {
            const amount = body.amount / 100;
            const result = await this.walletService.addFunds(userId, amount, 'UPI', razorpay_payment_id);
            return { success: true, ...result };
        }
        else {
            throw new common_1.BadRequestException('Invalid signature');
        }
    }
    async verifyUpiId(upiId) {
        const isValidFormat = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId);
        if (!isValidFormat) {
            return { valid: false, message: 'Invalid UPI ID format' };
        }
        return { valid: true, name: 'Verified User' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        transactions_service_1.TransactionsService,
        wallet_service_1.WalletService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map