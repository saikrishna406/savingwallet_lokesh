import { GoalsService } from './goals.service';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    getGoals(user: any): Promise<any[]>;
    createGoal(user: any, body: any): Promise<any>;
}
