import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.shema';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { CreateUserByAdminDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async listUsers(query: any) {
    try {
      const { page = 1, limit = 10, search } = query;
      const filter: any = {};
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
    } catch (error) {
      this.logger.error(`listUsers error: ${error.message}`, error.stack, { query });
      throw new InternalServerErrorException('Get users failed');
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.userModel.findById(id).select('-password');
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      this.logger.error(`getUser error: ${error.message}`, error.stack, { id });
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Get user failed');
    }
  }

  async updateUser(id: string, dto: any) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('User not found');
      if (dto.email !== undefined && dto.email !== user.email) {
        const exists = await this.userModel.findOne({ email: dto.email });
        if (exists) throw new BadRequestException('Email already in use');
        user.email = dto.email;
      }
      if (dto.name !== undefined) {
        if (typeof dto.name !== 'string' || dto.name.trim() === '') {
          throw new BadRequestException('Name is required and must not be empty');
        }
        user.name = dto.name;
      }
      if (dto.role !== undefined) user.role = dto.role;
      await user.save();
      const { password, ...rest } = user.toObject();
      return rest;
    } catch (error) {
      this.logger.error(`updateUser error: ${error.message}`, error.stack, { id, dto });
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Update user failed');
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('User not found');
      await user.deleteOne();
      return { message: 'User deleted' };
    } catch (error) {
      this.logger.error(`deleteUser error: ${error.message}`, error.stack, { id });
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Delete user failed');
    }
  }

  async createUser(dto: CreateUserByAdminDto) {
    try {
      const exists = await this.userModel.findOne({ email: dto.email });
      if (exists) throw new BadRequestException('Email already exists');
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
    } catch (error) {
      this.logger.error(`createUser error: ${error.message}`, error.stack, { dto });
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Create user failed');
    }
  }

  // Dummy report endpoints (implement real logic if needed)
  async reportTasks(query: any) {
    try {
      const { date, userId } = query;
      const filter: any = {};
      if (date) filter.date = date;
      if (userId) filter.user = userId;
      const data = await this.taskModel.find(filter);
      return { data };
    } catch (error) {
      this.logger.error(`reportTasks error: ${error.message}`, error.stack, { query });
      throw new InternalServerErrorException('Get report tasks failed');
    }
  }
  async reportUsers(query: any) {
    try {
      return { data: [], ...query };
    } catch (error) {
      this.logger.error(`reportUsers error: ${error.message}`, error.stack, { query });
      throw new InternalServerErrorException('Get report users failed');
    }
  }
} 