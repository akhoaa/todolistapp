import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(userId: string, dto: CreateProjectDto) {
    try {
      const project = await this.projectModel.create({
        ...dto,
        owner: userId,
        members: [userId],
      });
      return project;
    } catch (error) {
      throw new InternalServerErrorException('Create project failed');
    }
  }

  async findAll(userId: string, role: string, query: any) {
    try {
      const { page = 1, limit = 10, name } = query;
      let filter: any = {};
      if (role === 'admin') {
        // admin thấy tất cả
      } else {
        filter = { $or: [ { owner: userId }, { members: userId } ] };
      }
      if (name) filter.name = { $regex: name, $options: 'i' };
      const skip = (Number(page) - 1) * Number(limit);
      const data = await this.projectModel.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
      const total = await this.projectModel.countDocuments(filter);
      return { data, page: Number(page), limit: Number(limit), total };
    } catch (error) {
      throw new InternalServerErrorException('Get projects failed');
    }
  }

  async findOne(userId: string, role: string, id: string) {
    try {
      const project = await this.projectModel.findById(id);
      if (!project) throw new NotFoundException('Project not found');
      if (
        role !== 'admin' &&
        project.owner.toString() !== userId &&
        !project.members.map(m => m.toString()).includes(userId)
      ) {
        throw new ForbiddenException('No access');
      }
      return project;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Get project failed');
    }
  }

  async update(userId: string, role: string, id: string, dto: UpdateProjectDto) {
    try {
      const project = await this.projectModel.findById(id);
      if (!project) throw new NotFoundException('Project not found');
      if (role !== 'admin' && project.owner.toString() !== userId) {
        throw new ForbiddenException('Only owner or admin can update');
      }
      Object.assign(project, dto);
      await project.save();
      return project;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Update project failed');
    }
  }

  async remove(userId: string, role: string, id: string) {
    try {
      const project = await this.projectModel.findById(id);
      if (!project) throw new NotFoundException('Project not found');
      if (role !== 'admin' && project.owner.toString() !== userId) {
        throw new ForbiddenException('Only owner or admin can delete');
      }
      await project.deleteOne();
      return { message: 'Project deleted' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Delete project failed');
    }
  }

  async addMember(userId: string, role: string, id: string, memberId: string) {
    try {
      const project = await this.projectModel.findById(id);
      if (!project) throw new NotFoundException('Project not found');
      if (role !== 'admin' && project.owner.toString() !== userId) {
        throw new ForbiddenException('Only owner or admin can add member');
      }
      if (!project.members.map(m => m.toString()).includes(memberId)) {
        project.members.push(new Types.ObjectId(memberId));
        await project.save();
      }
      return project;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Add member failed');
    }
  }

  async removeMember(userId: string, role: string, id: string, memberId: string) {
    try {
      const project = await this.projectModel.findById(id);
      if (!project) throw new NotFoundException('Project not found');
      if (role !== 'admin' && project.owner.toString() !== userId) {
        throw new ForbiddenException('Only owner or admin can remove member');
      }
      project.members = project.members.filter((m) => m.toString() !== memberId);
      await project.save();
      return project;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Remove member failed');
    }
  }
} 