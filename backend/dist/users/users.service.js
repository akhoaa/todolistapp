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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_shema_1 = require("./schemas/user.shema");
const bcrypt = require("bcryptjs");
let UsersService = UsersService_1 = class UsersService {
    userModel;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(userModel) {
        this.userModel = userModel;
    }
    async getMe(userId) {
        try {
            const user = await this.userModel.findById(userId).select('-password');
            if (!user)
                throw new common_1.NotFoundException('User not found');
            return user;
        }
        catch (error) {
            this.logger.error(`getMe error: ${error.message}`, error.stack, { userId });
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Get user failed');
        }
    }
    async updateMe(userId, dto) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            if (dto.email && dto.email !== user.email) {
                const exists = await this.userModel.findOne({ email: dto.email });
                if (exists)
                    throw new common_1.BadRequestException('Email already in use');
                user.email = dto.email;
            }
            if (dto.name)
                user.name = dto.name;
            if (dto.password)
                user.password = await bcrypt.hash(dto.password, 10);
            await user.save();
            const { password, ...rest } = user.toObject();
            return rest;
        }
        catch (error) {
            this.logger.error(`updateMe error: ${error.message}`, error.stack, { userId, dto });
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException('Update user failed');
        }
    }
    async getAll() {
        try {
            const users = await this.userModel.find({}, '_id name email role');
            return users;
        }
        catch (error) {
            this.logger.error(`getAll error: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Get users failed');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_shema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map