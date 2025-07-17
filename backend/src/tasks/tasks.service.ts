import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(userId: string, dto: CreateTaskDto) {
    try {
      const data = { ...dto, user: userId };
      if (!data.date) data.date = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
      return await this.taskModel.create(data);
    } catch (error) {
      this.logger.error(`create error: ${error.message}`, error.stack, { userId, dto });
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
      this.logger.error(`findAll error: ${error.message}`, error.stack, { userId, query });
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
      this.logger.error(`findOne error: ${error.message}`, error.stack, { userId, id });
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
      this.logger.error(`update error: ${error.message}`, error.stack, { userId, id, dto });
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
      this.logger.error(`remove error: ${error.message}`, error.stack, { userId, id });
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Delete task failed');
    }
  }
} 