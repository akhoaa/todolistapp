import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    return this.taskModel.create({ ...dto, user: userId });
  }

  async findAll(userId: string, query: any) {
    const { date, page = 1, limit = 10, completed } = query;
    const filter: any = { user: userId };
    if (date) filter.date = date;
    if (completed !== undefined) filter.completed = completed === 'true' || completed === true;
    const skip = (Number(page) - 1) * Number(limit);
    const data = await this.taskModel.find(filter).skip(skip).limit(Number(limit)).sort({ date: -1 });
    const total = await this.taskModel.countDocuments(filter);
    return { data, page: Number(page), limit: Number(limit), total };
  }

  async findOne(userId: string, id: string) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Task not found');
    if (task.user.toString() !== userId) throw new ForbiddenException('No access');
    return task;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Task not found');
    if (task.user.toString() !== userId) throw new ForbiddenException('No access');
    Object.assign(task, dto);
    await task.save();
    return task;
  }

  async remove(userId: string, id: string) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Task not found');
    if (task.user.toString() !== userId) throw new ForbiddenException('No access');
    await task.deleteOne();
    return { message: 'Task deleted' };
  }
} 