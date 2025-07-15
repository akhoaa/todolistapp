import { Controller, Get, Post, Body, Query, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTaskDto) {
    const userId = (req as any).user.userId;
    return this.tasksService.create(userId, dto);
  }

  @Get()
  findAll(@Req() req: Request, @Query() query: any) {
    const userId = (req as any).user.userId;
    return this.tasksService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user.userId;
    return this.tasksService.findOne(userId, id);
  }

  @Put(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const userId = (req as any).user.userId;
    return this.tasksService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user.userId;
    return this.tasksService.remove(userId, id);
  }
} 