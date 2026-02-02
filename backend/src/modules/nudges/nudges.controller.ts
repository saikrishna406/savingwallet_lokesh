import { Controller, Get, Patch, Post, Body, Param, UseGuards } from '@nestjs/common';
import { NudgesService } from './nudges.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('nudges')
@UseGuards(JwtAuthGuard)
export class NudgesController {
    constructor(private readonly nudgesService: NudgesService) { }

    @Get()
    async getNudges(@CurrentUser() user: any) {
        return this.nudgesService.getNudges(user.id);
    }

    @Patch(':id/read')
    async markRead(@CurrentUser() user: any, @Param('id') id: string) {
        return this.nudgesService.markRead(user.id, id);
    }

    @Patch('read-all')
    async markAllRead(@CurrentUser() user: any) {
        return this.nudgesService.markAllRead(user.id);
    }
}
