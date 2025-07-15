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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("./schemas/task.schema");
let TasksService = class TasksService {
    taskModel;
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    async create(userId, dto) {
        try {
            return await this.taskModel.create({ ...dto, user: userId });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Create task failed');
        }
    }
    async findAll(userId, query) {
        try {
            const { date, page = 1, limit = 10, completed } = query;
            const filter = { user: userId };
            if (date)
                filter.date = date;
            if (completed !== undefined)
                filter.completed = completed === 'true' || completed === true;
            const skip = (Number(page) - 1) * Number(limit);
            const data = await this.taskModel.find(filter).skip(skip).limit(Number(limit)).sort({ date: -1 });
            const total = await this.taskModel.countDocuments(filter);
            return { data, page: Number(page), limit: Number(limit), total };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Get tasks failed');
        }
    }
    async findOne(userId, id) {
        try {
            const task = await this.taskModel.findById(id);
            if (!task)
                throw new common_1.NotFoundException('Task not found');
            if (task.user.toString() !== userId)
                throw new common_1.ForbiddenException('No access');
            return task;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException)
                throw error;
            throw new common_1.InternalServerErrorException('Get task failed');
        }
    }
    async update(userId, id, dto) {
        try {
            const task = await this.taskModel.findById(id);
            if (!task)
                throw new common_1.NotFoundException('Task not found');
            if (task.user.toString() !== userId)
                throw new common_1.ForbiddenException('No access');
            Object.assign(task, dto);
            await task.save();
            return task;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException)
                throw error;
            throw new common_1.InternalServerErrorException('Update task failed');
        }
    }
    async remove(userId, id) {
        try {
            const task = await this.taskModel.findById(id);
            if (!task)
                throw new common_1.NotFoundException('Task not found');
            if (task.user.toString() !== userId)
                throw new common_1.ForbiddenException('No access');
            await task.deleteOne();
            return { message: 'Task deleted' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException)
                throw error;
            throw new common_1.InternalServerErrorException('Delete task failed');
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map