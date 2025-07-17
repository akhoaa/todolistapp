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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_shema_1 = require("../users/schemas/user.shema");
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
let AuthService = AuthService_1 = class AuthService {
    userModel;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async signup(dto) {
        try {
            const user = await this.userModel.findOne({ email: dto.email });
            if (user)
                throw new common_1.BadRequestException('Email already exists');
            const hash = await bcrypt.hash(dto.password, 10);
            const otp = generateOTP();
            const newUser = await this.userModel.create({
                name: dto.name,
                email: dto.email,
                password: hash,
                otp,
                otpExpires: new Date(Date.now() + 10 * 60 * 1000),
            });
            console.log(`OTP for ${dto.email}: ${otp}`);
            const token = this.jwtService.sign({ sub: newUser._id, role: newUser.role });
            return { token };
        }
        catch (error) {
            this.logger.error(`signup error: ${error.message}`, error.stack, { dto });
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException('Signup failed');
        }
    }
    async signin(dto) {
        try {
            const user = await this.userModel.findOne({ email: dto.email });
            if (!user)
                throw new common_1.UnauthorizedException('Invalid credentials');
            if (!user.isVerified)
                throw new common_1.UnauthorizedException('Account not verified');
            const isMatch = await bcrypt.compare(dto.password, user.password);
            if (!isMatch)
                throw new common_1.UnauthorizedException('Invalid credentials');
            const token = this.jwtService.sign({ sub: user._id, role: user.role });
            return { token };
        }
        catch (error) {
            this.logger.error(`signin error: ${error.message}`, error.stack, { dto });
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException('Signin failed');
        }
    }
    async forgotPassword(dto) {
        try {
            const user = await this.userModel.findOne({ email: dto.email });
            if (!user)
                throw new common_1.NotFoundException('User not found');
            const otp = generateOTP();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();
            console.log(`OTP for ${dto.email}: ${otp}`);
            return { message: 'OTP sent to email' };
        }
        catch (error) {
            this.logger.error(`forgotPassword error: ${error.message}`, error.stack, { dto });
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Forgot password failed');
        }
    }
    async resetPassword(dto) {
        try {
            const user = await this.userModel.findOne({ email: dto.email });
            if (!user)
                throw new common_1.NotFoundException('User not found');
            if (!user.otp || user.otp !== dto.otp || !user.otpExpires || user.otpExpires < new Date()) {
                throw new common_1.BadRequestException('Invalid or expired OTP');
            }
            user.password = await bcrypt.hash(dto.newPassword, 10);
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            return { message: 'Password reset successful' };
        }
        catch (error) {
            this.logger.error(`resetPassword error: ${error.message}`, error.stack, { dto });
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException('Reset password failed');
        }
    }
    async verify(dto) {
        try {
            const user = await this.userModel.findOne({ email: dto.email });
            if (!user)
                throw new common_1.NotFoundException('User not found');
            if (!user.otp || user.otp !== dto.otp || !user.otpExpires || user.otpExpires < new Date()) {
                throw new common_1.BadRequestException('Invalid or expired OTP');
            }
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            return { message: 'Account verified successfully' };
        }
        catch (error) {
            this.logger.error(`verify error: ${error.message}`, error.stack, { dto });
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException('Verify failed');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_shema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map