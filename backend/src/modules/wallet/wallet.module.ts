import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

import { TransactionsModule } from '../transactions/transactions.module';

@Module({
    imports: [TransactionsModule],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService]
})
export class WalletModule { }
