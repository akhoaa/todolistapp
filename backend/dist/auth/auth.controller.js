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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const signup_dto_1 = require("./dto/signup.dto");
const signin_dto_1 = require("./dto/signin.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const verify_dto_1 = require("./dto/verify.dto");
const response_helper_1 = require("../common/response.helper");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signup(dto, res) {
        try {
            const result = await this.authService.signup(dto);
            res.cookie('jwt', result.token, {
                httpOnly: true,
                sameSite: 'lax',
            });
            return (0, response_helper_1.successResponse)(res, { ...result, token: undefined }, 'Signup success', common_1.HttpStatus.CREATED);
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Signup failed');
        }
    }
    async signin(dto, res) {
        try {
            const result = await this.authService.signin(dto);
            res.cookie('jwt', result.token, {
                httpOnly: true,
                sameSite: 'lax',
            });
            return (0, response_helper_1.successResponse)(res, { ...result, token: undefined }, 'Signin success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Signin failed');
        }
    }
    async forgotPassword(dto, res) {
        try {
            const result = await this.authService.forgotPassword(dto);
            return (0, response_helper_1.successResponse)(res, result, 'Forgot password success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Forgot password failed');
        }
    }
    async resetPassword(dto, res) {
        try {
            const result = await this.authService.resetPassword(dto);
            return (0, response_helper_1.successResponse)(res, result, 'Reset password success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Reset password failed');
        }
    }
    async verify(dto, res) {
        try {
            const result = await this.authService.verify(dto);
            return (0, response_helper_1.successResponse)(res, result, 'Verify success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Verify failed');
        }
    }
    async logout(res) {
        res.clearCookie('jwt');
        return (0, response_helper_1.successResponse)(res, null, 'Logout success');
    }
    getProfile(req) {
        return req.user;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_dto_1.SigninDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_dto_1.VerifyDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map