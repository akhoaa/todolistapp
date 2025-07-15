import { Controller, Get, Post, Body, Query, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { AddMemberDto } from './dto/add-member.dto';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateProjectDto) {
    const userId = (req as any).user.userId;
    return this.projectsService.create(userId, dto);
  }

  @Get()
  findAll(@Req() req: Request, @Query() query: any) {
    const userId = (req as any).user.userId;
    const role = (req as any).user.role;
    return this.projectsService.findAll(userId, role, query);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user.userId;
    const role = (req as any).user.role;
    return this.projectsService.findOne(userId, role, id);
  }

  @Put(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    const userId = (req as any).user.userId;
    const role = (req as any).user.role;
    return this.projectsService.update(userId, role, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user.userId;
    const role = (req as any).user.role;
    return this.projectsService.remove(userId, role, id);
  }

  @Post(':id/members')
  addMember(@Req() req: Request, @Param('id') id: string, @Body() body: AddMemberDto) {
    const userId = (req as any).user.userId;
    const role = (req as any).user.role;
    return this.projectsService.addMember(userId, role, id, body.userId);
  }

  @Delete(':id/members/:userId')
  removeMember(@Req() req: Request, @Param('id') id: string, @Param('userId') memberId: string) {
    const userId = (req as any).user.userId;
    const role = (req as any).user.role;
    return this.projectsService.removeMember(userId, role, id, memberId);
  }
} 