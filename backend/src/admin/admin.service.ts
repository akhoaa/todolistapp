import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.shema';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async listUsers(query: any) {
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
  }

  async getUser(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, dto: any) {
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
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await user.deleteOne();
    return { message: 'User deleted' };
  }

  // Dummy report endpoints (implement real logic if needed)
  async reportTasks(query: any) {
    const { date, userId } = query;
    const filter: any = {};
    if (date) filter.date = date;
    if (userId) filter.user = userId;
    const data = await this.taskModel.find(filter);
    return { data };
  }
  async reportUsers(query: any) {
    return { data: [], ...query };
  }
} 