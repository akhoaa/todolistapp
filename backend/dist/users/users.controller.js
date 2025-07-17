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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const response_helper_1 = require("../common/response.helper");
const common_2 = require("../common");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getMe(req, res) {
        const user = req['user'];
        if (!user || !user._id) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Get user failed');
        }
        try {
            const result = await this.usersService.getMe(user._id);
            return (0, response_helper_1.successResponse)(res, result, 'Get user success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Get user failed');
        }
    }
    async updateMe(req, dto, res) {
        const user = req['user'];
        if (!user || !user._id) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Update user failed');
        }
        try {
            const result = await this.usersService.updateMe(user._id, dto);
            return (0, response_helper_1.successResponse)(res, result, 'Update user success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Update user failed');
        }
    }
    async getAll(req, res) {
        const user = req['user'];
        if (!user || user.role !== 'admin') {
            return (0, response_helper_1.errorResponse)(res, { status: 403, message: 'Forbidden' }, 'Get users failed');
        }
        try {
            const result = await this.usersService.getAll();
            return (0, response_helper_1.successResponse)(res, result, 'Get users success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Get users failed');
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin user (cần quyền user:update)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Không đủ quyền user:update' }),
    (0, common_2.Permissions)('user:update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách user (cần quyền user:read)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Không đủ quyền user:read' }),
    (0, common_2.Permissions)('user:read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAll", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, common_2.PermissionsGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map