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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const update_user_dto_1 = require("./dto/update-user.dto");
const response_helper_1 = require("../common/response.helper");
const create_user_dto_1 = require("./dto/create-user.dto");
const common_2 = require("../common");
function isAdmin(req) {
    return req.user?.role === 'admin';
}
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    listUsers(req, query) {
        if (!isAdmin(req))
            throw new common_1.ForbiddenException();
        return this.adminService.listUsers(query);
    }
    async getUser(id, res) {
        try {
            const user = await this.adminService.getUser(id);
            return (0, response_helper_1.successResponse)(res, user, 'Get user success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Get user failed');
        }
    }
    async createUser(req, dto, res) {
        if (!isAdmin(req))
            throw new common_1.ForbiddenException();
        try {
            const user = await this.adminService.createUser(dto);
            return (0, response_helper_1.successResponse)(res, user, 'Create user success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Create user failed');
        }
    }
    async updateUser(id, dto, res) {
        try {
            const user = await this.adminService.updateUser(id, dto);
            return (0, response_helper_1.successResponse)(res, user, 'Update user success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Update user failed');
        }
    }
    async deleteUser(id, res) {
        try {
            const result = await this.adminService.deleteUser(id);
            return (0, response_helper_1.successResponse)(res, result, 'Delete user success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Delete user failed');
        }
    }
    async reportTasks(req, query, res) {
        if (!isAdmin(req))
            throw new common_1.ForbiddenException();
        try {
            const result = await this.adminService.reportTasks(query);
            return (0, response_helper_1.successResponse)(res, result, 'Report tasks success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Report tasks failed');
        }
    }
    async reportUsers(req, query, res) {
        if (!isAdmin(req))
            throw new common_1.ForbiddenException();
        try {
            const result = await this.adminService.reportUsers(query);
            return (0, response_helper_1.successResponse)(res, result, 'Report users success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Report users failed');
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Quản lý user (cần quyền admin:manage)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Không đủ quyền admin:manage' }),
    (0, common_2.Permissions)('admin:manage'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)('user'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserByAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserByAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('report/tasks'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "reportTasks", null);
__decorate([
    (0, common_1.Get)('report/users'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "reportUsers", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, common_2.PermissionsGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map