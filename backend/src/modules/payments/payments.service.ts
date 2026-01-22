import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletService } from '../wallet/wallet.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
    private razorpay: Razorpay;

    constructor(
        private configService: ConfigService,
        private transactionsService: TransactionsService,
        private walletService: WalletService
    ) {
        this.razorpay = new Razorpay({
            key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
        });
    }

    async createOrder(userId: string, amount: number) {
        try {
            const options = {
                amount: amount * 100, // Amount in paise
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
            };

            const order = await this.razorpay.orders.create(options);

            // Create a PENDING transaction
            // We need a wallet. Assuming user has one.
            // But we actually need to get the walletId first inside transaction creation?
            // Actually transactionsService.createTransaction expects walletId now.

            // Let's delegate this to WalletService or fetch ID here.
            // Better: Let WalletService handle "Add Funds Request" which returns an order?
            // Or Keep it simple: PaymentsService orchestrates.

            // We'll create the transaction when verification happens? 
            // NO, best practice is to track the intent (Order Created).

            // For now, let's just return the order. 
            // The actual transaction record (ledger) is best created upon VERIFICATION for simplicity in this MVP 
            // OR PENDING now. PENDING is better for audit.

            // We need walletId to create transaction.
            const wallet = await this.walletService.getWallet(userId);
            if (!wallet) throw new Error('Wallet not found');

            const transaction = await this.transactionsService.createTransaction({
                userId,
                walletId: wallet.id,
                amount,
                type: 'CREDIT',
                source: 'UPI', // or 'RAZORPAY'
                referenceId: order.id, // Store Razorpay Order ID
                status: 'PENDING'
            });

            return {
                id: order.id,
                currency: order.currency,
                amount: order.amount,
                transactionId: transaction.id
            };
        } catch (error) {
            console.error('Razorpay Error:', error);
            throw new InternalServerErrorException('Failed to create payment order');
        }
    }

    async verifyPayment(userId: string, body: any) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // ... (existing logic)
            const amount = body.amount / 100;

            const result = await this.walletService.addFunds(
                userId,
                amount,
                'UPI',
                razorpay_payment_id
            );

            return { success: true, ...result };
        } else {
            throw new BadRequestException('Invalid signature');
        }
    }

    async verifyUpiId(upiId: string) {
        // Mock UPI ID Verification for now
        // In production, use Razorpay's Validate VPA API:
        // await this.razorpay.fundAccount.validateVpa({ vpa: { address: upiId } })

        const isValidFormat = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId);

        if (!isValidFormat) {
            return { valid: false, message: 'Invalid UPI ID format' };
        }

        // Simulate API call check
        return { valid: true, name: 'Verified User' };
    }
}
