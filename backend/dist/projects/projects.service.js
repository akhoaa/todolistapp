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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("./schemas/project.schema");
let ProjectsService = class ProjectsService {
    projectModel;
    constructor(projectModel) {
        this.projectModel = projectModel;
    }
    async create(userId, dto) {
        const project = await this.projectModel.create({
            ...dto,
            owner: userId,
            members: [userId],
        });
        return project;
    }
    async findAll(userId, role, query) {
        const { page = 1, limit = 10, name } = query;
        let filter = {};
        if (role === 'admin') {
        }
        else {
            filter = { $or: [{ owner: userId }, { members: userId }] };
        }
        if (name)
            filter.name = { $regex: name, $options: 'i' };
        const skip = (Number(page) - 1) * Number(limit);
        const data = await this.projectModel.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
        const total = await this.projectModel.countDocuments(filter);
        return { data, page: Number(page), limit: Number(limit), total };
    }
    async findOne(userId, role, id) {
        const project = await this.projectModel.findById(id);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (role !== 'admin' &&
            project.owner.toString() !== userId &&
            !project.members.map(m => m.toString()).includes(userId)) {
            throw new common_1.ForbiddenException('No access');
        }
        return project;
    }
    async update(userId, role, id, dto) {
        const project = await this.projectModel.findById(id);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (role !== 'admin' && project.owner.toString() !== userId) {
            throw new common_1.ForbiddenException('Only owner or admin can update');
        }
        Object.assign(project, dto);
        await project.save();
        return project;
    }
    async remove(userId, role, id) {
        const project = await this.projectModel.findById(id);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (role !== 'admin' && project.owner.toString() !== userId) {
            throw new common_1.ForbiddenException('Only owner or admin can delete');
        }
        await project.deleteOne();
        return { message: 'Project deleted' };
    }
    async addMember(userId, role, id, memberId) {
        const project = await this.projectModel.findById(id);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (role !== 'admin' && project.owner.toString() !== userId) {
            throw new common_1.ForbiddenException('Only owner or admin can add member');
        }
        if (!project.members.map(m => m.toString()).includes(memberId)) {
            project.members.push(new mongoose_2.Types.ObjectId(memberId));
            await project.save();
        }
        return project;
    }
    async removeMember(userId, role, id, memberId) {
        const project = await this.projectModel.findById(id);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (role !== 'admin' && project.owner.toString() !== userId) {
            throw new common_1.ForbiddenException('Only owner or admin can remove member');
        }
        project.members = project.members.filter((m) => m.toString() !== memberId);
        await project.save();
        return project;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map