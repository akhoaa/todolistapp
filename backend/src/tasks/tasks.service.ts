import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(userId: string, dto: CreateTaskDto) {
    try {
      return await this.taskModel.create({ ...dto, user: userId });
    } catch (error) {
      throw new InternalServerErrorException('Create task failed');
    }
  }

  async findAll(userId: string, query: any) {
    try {
      const { date, page = 1, limit = 10, completed } = query;
      const filter: any = { user: userId };
      if (date) filter.date = date;
      if (completed !== undefined) filter.completed = completed === 'true' || completed === true;
      const skip = (Number(page) - 1) * Number(limit);
      const data = await this.taskModel.find(filter).skip(skip).limit(Number(limit)).sort({ date: -1 });
      const total = await this.taskModel.countDocuments(filter);
      return { data, page: Number(page), limit: Number(limit), total };
    } catch (error) {
      throw new InternalServerErrorException('Get tasks failed');
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const task = await this.taskModel.findById(id);
      if (!task) throw new NotFoundException('Task not found');
      if (task.user.toString() !== userId) throw new ForbiddenException('No access');
      return task;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Get task failed');
    }
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    try {
      const task = await this.taskModel.findById(id);
      if (!task) throw new NotFoundException('Task not found');
      if (task.user.toString() !== userId) throw new ForbiddenException('No access');
      Object.assign(task, dto);
      await task.save();
      return task;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Update task failed');
    }
  }

  async remove(userId: string, id: string) {
    try {
      const task = await this.taskModel.findById(id);
      if (!task) throw new NotFoundException('Task not found');
      if (task.user.toString() !== userId) throw new ForbiddenException('No access');
      await task.deleteOne();
      return { message: 'Task deleted' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Delete task failed');
    }
  }
} 