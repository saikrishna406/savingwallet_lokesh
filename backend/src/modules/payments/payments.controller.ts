import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-order')
    async createOrder(@CurrentUser() user: any, @Body('amount') amount: number) {
        return this.paymentsService.createOrder(user.id, amount);
    }

    @Post('verify')
    async verifyPayment(@CurrentUser() user: any, @Body() body: any) {
        return this.paymentsService.verifyPayment(user.id, body);
    }
}
