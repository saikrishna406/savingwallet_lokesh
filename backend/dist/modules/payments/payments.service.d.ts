import { ConfigService } from '@nestjs/config';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletService } from '../wallet/wallet.service';
export declare class PaymentsService {
    private configService;
    private transactionsService;
    private walletService;
    private razorpay;
    constructor(configService: ConfigService, transactionsService: TransactionsService, walletService: WalletService);
    createOrder(userId: string, amount: number): Promise<{
        id: string;
        currency: string;
        amount: string | number;
        transactionId: any;
    }>;
    verifyPayment(userId: string, body: any): Promise<{
        success: boolean;
        transactionId: any;
    }>;
    verifyUpiId(upiId: string): Promise<{
        valid: boolean;
        message: string;
        name?: undefined;
    } | {
        valid: boolean;
        name: string;
        message?: undefined;
    }>;
}
