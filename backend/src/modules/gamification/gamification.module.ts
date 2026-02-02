import { Module } from '@nestjs/common';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { NudgesModule } from '../nudges/nudges.module';

@Module({
    imports: [SupabaseModule, NudgesModule],
    controllers: [GamificationController],
    providers: [GamificationService],
    exports: [GamificationService] // Export to use in GoalsService
})
export class GamificationModule { }
