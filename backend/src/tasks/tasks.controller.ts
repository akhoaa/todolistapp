import { Controller, Post, Get, Put, Delete, Body, Param, Req, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { User as UserDecorator } from '../common/user.decorator';
import { successResponse, errorResponse } from '../common/response.helper';
import { Permissions, PermissionsGuard } from '../common';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo task (cần quyền task:create)' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không đủ quyền task:create' })
  @Permissions('task:create')
  async create(@Req() req: Request, @Body() dto: CreateTaskDto, @Res() res: Response) {
    const user = req['user'] as { _id: string };
    if (!user || !user._id) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Create task failed');
    }
    try {
      const task = await this.tasksService.create(user._id, dto);
      return successResponse(res, task, 'Create task success', HttpStatus.CREATED);
    } catch (error) {
      return errorResponse(res, error, 'Create task failed');
    }
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const user = req['user'] as { _id: string };
    if (!user || !user._id) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Get tasks failed');
    }
    try {
      const tasks = await this.tasksService.findAll(user._id, req.query);
      return successResponse(res, tasks, 'Get tasks success');
    } catch (error) {
      return errorResponse(res, error, 'Get tasks failed');
    }
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string, @Res() res: Response) {
    const user = req['user'] as { _id: string };
    if (!user || !user._id) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Get task failed');
    }
    try {
      const task = await this.tasksService.findOne(user._id, id);
      return successResponse(res, task, 'Get task success');
    } catch (error) {
      return errorResponse(res, error, 'Get task failed');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật task (cần quyền task:update)' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không đủ quyền task:update' })
  @Permissions('task:update')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateTaskDto, @Res() res: Response) {
    const user = req['user'] as { _id: string };
    if (!user || !user._id) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Update task failed');
    }
    try {
      const task = await this.tasksService.update(user._id, id, dto);
      return successResponse(res, task, 'Update task success');
    } catch (error) {
      return errorResponse(res, error, 'Update task failed');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa task (cần quyền task:delete)' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không đủ quyền task:delete' })
  @Permissions('task:delete')
  async remove(@Req() req: Request, @Param('id') id: string, @Res() res: Response) {
    const user = req['user'] as { _id: string };
    if (!user || !user._id) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Delete task failed');
    }
    try {
      const result = await this.tasksService.remove(user._id, id);
      return successResponse(res, result, 'Delete task success');
    } catch (error) {
      return errorResponse(res, error, 'Delete task failed');
    }
  }
} 