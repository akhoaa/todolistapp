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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const add_member_dto_1 = require("./dto/add-member.dto");
const user_decorator_1 = require("../common/user.decorator");
const response_helper_1 = require("../common/response.helper");
const common_2 = require("../common");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async create(req, dto, res) {
        const user = req['user'];
        if (!user || !user._id) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Create project failed');
        }
        try {
            const project = await this.projectsService.create(user._id, dto);
            return (0, response_helper_1.successResponse)(res, project, 'Create project success', common_1.HttpStatus.CREATED);
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Create project failed');
        }
    }
    async findAll(req, res) {
        const user = req['user'];
        if (!user || !user._id || !user.role) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Get projects failed');
        }
        try {
            const projects = await this.projectsService.findAll(user._id, user.role);
            return (0, response_helper_1.successResponse)(res, projects, 'Get projects success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Get projects failed');
        }
    }
    async findOne(req, id, res) {
        const user = req['user'];
        if (!user || !user._id || !user.role) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Get project failed');
        }
        try {
            const project = await this.projectsService.findOne(user._id, user.role, id);
            return (0, response_helper_1.successResponse)(res, project, 'Get project success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Get project failed');
        }
    }
    async update(req, id, dto, res) {
        const user = req['user'];
        if (!user || !user._id || !user.role) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Update project failed');
        }
        try {
            const project = await this.projectsService.update(user._id, user.role, id, dto);
            return (0, response_helper_1.successResponse)(res, project, 'Update project success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Update project failed');
        }
    }
    async remove(req, id, res) {
        const user = req['user'];
        if (!user || !user._id || !user.role) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Delete project failed');
        }
        try {
            const result = await this.projectsService.remove(user._id, user.role, id);
            return (0, response_helper_1.successResponse)(res, result, 'Delete project success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Delete project failed');
        }
    }
    async addMember(req, id, dto, res) {
        const user = req['user'];
        if (!user || !user._id || !user.role) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Add member failed');
        }
        try {
            const result = await this.projectsService.addMember(user._id, user.role, id, dto.userId);
            return (0, response_helper_1.successResponse)(res, result, 'Add member success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Add member failed');
        }
    }
    removeMember(userId, role, id, memberId) {
        return this.projectsService.removeMember(userId, role, id, memberId);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo project (cần quyền project:create)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Không đủ quyền project:create' }),
    (0, common_2.Permissions)('project:create'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_project_dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật project (cần quyền project:update)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Không đủ quyền project:update' }),
    (0, common_2.Permissions)('project:update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_project_dto_1.UpdateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa project (cần quyền project:delete)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Không đủ quyền project:delete' }),
    (0, common_2.Permissions)('project:delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/add-member'),
    (0, swagger_1.ApiOperation)({ summary: 'Thêm thành viên vào project (cần quyền project:add-member)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Không đủ quyền project:add-member' }),
    (0, common_2.Permissions)('project:add-member'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_member_dto_1.AddMemberDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    __param(0, (0, user_decorator_1.User)('userId')),
    __param(1, (0, user_decorator_1.User)('role')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "removeMember", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('projects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, common_2.PermissionsGuard),
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map