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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const response_helper_1 = require("../common/response.helper");
const common_2 = require("../common");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async create(req, dto, res) {
        const user = req['user'];
        if (!user || !user._id) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Create task failed');
        }
        try {
            const task = await this.tasksService.create(user._id, dto);
            return (0, response_helper_1.successResponse)(res, task, 'Create task success', common_1.HttpStatus.CREATED);
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Create task failed');
        }
    }
    async findAll(req, res) {
        const user = req['user'];
        if (!user || !user._id) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Get tasks failed');
        }
        try {
            const tasks = await this.tasksService.findAll(user._id, req.query);
            return (0, response_helper_1.successResponse)(res, tasks, 'Get tasks success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Get tasks failed');
        }
    }
    async findOne(req, id, res) {
        const user = req['user'];
        if (!user || !user._id) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Get task failed');
        }
        try {
            const task = await this.tasksService.findOne(user._id, id);
            return (0, response_helper_1.successResponse)(res, task, 'Get task success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Get task failed');
        }
    }
    async update(req, id, dto, res) {
        const user = req['user'];
        if (!user || !user._id) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Update task failed');
        }
        try {
            const task = await this.tasksService.update(user._id, id, dto);
            return (0, response_helper_1.successResponse)(res, task, 'Update task success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Update task failed');
        }
    }
    async remove(req, id, res) {
        const user = req['user'];
        if (!user || !user._id) {
            return (0, response_helper_1.errorResponse)(res, { status: 401, message: 'Unauthorized' }, 'Delete task failed');
        }
        try {
            const result = await this.tasksService.remove(user._id, id);
            return (0, response_helper_1.successResponse)(res, result, 'Delete task success');
        }
        catch (error) {
            return (0, response_helper_1.errorResponse)(res, error, 'Delete task failed');
        }
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo task (cần quyền task:create)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Không đủ quyền task:create' }),
    (0, common_2.Permissions)('task:create'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật task (cần quyền task:update)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Không đủ quyền task:update' }),
    (0, common_2.Permissions)('task:update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa task (cần quyền task:delete)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Không đủ quyền task:delete' }),
    (0, common_2.Permissions)('task:delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, common_2.PermissionsGuard),
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map