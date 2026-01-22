import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PaymentsModule } from '../payments/payments.module';

@Module({
    imports: [], // PaymentsModule removed temporarily
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
