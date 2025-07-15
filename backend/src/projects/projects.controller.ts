import { Controller, Get, Post, Body, Query, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { AddMemberDto } from './dto/add-member.dto';
import { User as UserDecorator } from '../common/user.decorator';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@UserDecorator('userId') userId: string, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(userId, dto);
  }

  @Get()
  findAll(@UserDecorator('userId') userId: string, @UserDecorator('role') role: string, @Query() query: any) {
    return this.projectsService.findAll(userId, role, query);
  }

  @Get(':id')
  findOne(@UserDecorator('userId') userId: string, @UserDecorator('role') role: string, @Param('id') id: string) {
    return this.projectsService.findOne(userId, role, id);
  }

  @Put(':id')
  update(@UserDecorator('userId') userId: string, @UserDecorator('role') role: string, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(userId, role, id, dto);
  }

  @Delete(':id')
  remove(@UserDecorator('userId') userId: string, @UserDecorator('role') role: string, @Param('id') id: string) {
    return this.projectsService.remove(userId, role, id);
  }

  @Post(':id/members')
  addMember(@UserDecorator('userId') userId: string, @UserDecorator('role') role: string, @Param('id') id: string, @Body() body: AddMemberDto) {
    return this.projectsService.addMember(userId, role, id, body.userId);
  }

  @Delete(':id/members/:userId')
  removeMember(@UserDecorator('userId') userId: string, @UserDecorator('role') role: string, @Param('id') id: string, @Param('userId') memberId: string) {
    return this.projectsService.removeMember(userId, role, id, memberId);
  }
} 