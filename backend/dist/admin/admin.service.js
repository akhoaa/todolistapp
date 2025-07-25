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
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_shema_1 = require("../users/schemas/user.shema");
const task_schema_1 = require("../tasks/schemas/task.schema");
const bcrypt = require("bcryptjs");
let AdminService = AdminService_1 = class AdminService {
    userModel;
    taskModel;
    logger = new common_1.Logger(AdminService_1.name);
    constructor(userModel, taskModel) {
        this.userModel = userModel;
        this.taskModel = taskModel;
    }
    async listUsers(query) {
        try {
            const { page = 1, limit = 10, search } = query;
            const filter = {};
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ];
            }
            const skip = (Number(page) - 1) * Number(limit);
            const data = await this.userModel.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
            const total = await this.userModel.countDocuments(filter);
            return { data, page: Number(page), limit: Number(limit), total };
        }
        catch (error) {
            this.logger.error(`listUsers error: ${error.message}`, error.stack, { query });
            throw new common_1.InternalServerErrorException('Get users failed');
        }
    }
    async getUser(id) {
        try {
            const user = await this.userModel.findById(id).select('-password');
            if (!user)
                throw new common_1.NotFoundException('User not found');
            return user;
        }
        catch (error) {
            this.logger.error(`getUser error: ${error.message}`, error.stack, { id });
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Get user failed');
        }
    }
    async updateUser(id, dto) {
        try {
            const user = await this.userModel.findById(id);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            if (dto.email !== undefined && dto.email !== user.email) {
                const exists = await this.userModel.findOne({ email: dto.email });
                if (exists)
                    throw new common_1.BadRequestException('Email already in use');
                user.email = dto.email;
            }
            if (dto.name !== undefined) {
                if (typeof dto.name !== 'string' || dto.name.trim() === '') {
                    throw new common_1.BadRequestException('Name is required and must not be empty');
                }
                user.name = dto.name;
            }
            if (dto.role !== undefined)
                user.role = dto.role;
            await user.save();
            const { password, ...rest } = user.toObject();
            return rest;
        }
        catch (error) {
            this.logger.error(`updateUser error: ${error.message}`, error.stack, { id, dto });
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException('Update user failed');
        }
    }
    async deleteUser(id) {
        try {
            const user = await this.userModel.findById(id);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            await user.deleteOne();
            return { message: 'User deleted' };
        }
        catch (error) {
            this.logger.error(`deleteUser error: ${error.message}`, error.stack, { id });
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Delete user failed');
        }
    }
    async createUser(dto) {
        try {
            const exists = await this.userModel.findOne({ email: dto.email });
            if (exists)
                throw new common_1.BadRequestException('Email already exists');
            const hash = await bcrypt.hash(dto.password, 10);
            const user = await this.userModel.create({
                name: dto.name,
                email: dto.email,
                password: hash,
                role: dto.role,
                isVerified: true
            });
            const { password, ...rest } = user.toObject();
            return rest;
        }
        catch (error) {
            this.logger.error(`createUser error: ${error.message}`, error.stack, { dto });
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException('Create user failed');
        }
    }
    async reportTasks(query) {
        try {
            const { date, userId } = query;
            const filter = {};
            if (date)
                filter.date = date;
            if (userId)
                filter.user = userId;
            const data = await this.taskModel.find(filter);
            return { data };
        }
        catch (error) {
            this.logger.error(`reportTasks error: ${error.message}`, error.stack, { query });
            throw new common_1.InternalServerErrorException('Get report tasks failed');
        }
    }
    async reportUsers(query) {
        try {
            return { data: [], ...query };
        }
        catch (error) {
            this.logger.error(`reportUsers error: ${error.message}`, error.stack, { query });
            throw new common_1.InternalServerErrorException('Get report users failed');
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_shema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map