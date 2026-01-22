import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
    imports: [SupabaseModule, TransactionsModule, WalletModule],
    controllers: [PaymentsController],
    providers: [PaymentsService],
    exports: [PaymentsService]
})
export class PaymentsModule { }
