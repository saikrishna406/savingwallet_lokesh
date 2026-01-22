import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { WalletModule } from '../../modules/wallet/wallet.module';

@Module({
    imports: [SupabaseModule, WalletModule],
    controllers: [GoalsController],
    providers: [GoalsService],
})
export class GoalsModule { }
