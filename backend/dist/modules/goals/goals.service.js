"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../supabase/supabase.service");
let GoalsService = class GoalsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getGoals(userId) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId);
        if (error) {
            throw error;
        }
        return data;
    }
    async createGoal(userId, goalData) {
        const supabase = this.supabaseService.getClient();
        const newGoal = {
            user_id: userId,
            name: goalData.title,
            target_amount: goalData.target_amount,
            current_amount: goalData.current_amount || 0,
            target_date: goalData.target_date,
            status: 'active',
            category: goalData.category || 'General',
            created_at: new Date()
        };
        const { data, error } = await supabase
            .from('goals')
            .insert(newGoal)
            .select()
            .single();
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return data;
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], GoalsService);
//# sourceMappingURL=goals.service.js.map