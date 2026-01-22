import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(user: any, amount: number): Promise<{
        id: string;
        currency: string;
        amount: string | number;
        transactionId: any;
    }>;
    verifyPayment(user: any, body: any): Promise<{
        success: boolean;
        transactionId: any;
    }>;
}
