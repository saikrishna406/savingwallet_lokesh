import { Module } from '@nestjs/common';
import { NudgesController } from './nudges.controller';
import { NudgesService } from './nudges.service';
import { SupabaseModule } from '../../supabase/supabase.module';

@Module({
    imports: [SupabaseModule],
    controllers: [NudgesController],
    providers: [NudgesService],
    exports: [NudgesService]
})
export class NudgesModule { }
