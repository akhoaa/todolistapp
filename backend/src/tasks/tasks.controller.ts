import { Controller, Get, Post, Body, Query, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { User as UserDecorator } from '../common/user.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@UserDecorator('userId') userId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(userId, dto);
  }

  @Get()
  findAll(@UserDecorator('userId') userId: string, @Query() query: any) {
    return this.tasksService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@UserDecorator('userId') userId: string, @Param('id') id: string) {
    return this.tasksService.findOne(userId, id);
  }

  @Put(':id')
  update(@UserDecorator('userId') userId: string, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@UserDecorator('userId') userId: string, @Param('id') id: string) {
    return this.tasksService.remove(userId, id);
  }
} 