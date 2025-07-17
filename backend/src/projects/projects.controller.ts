import { Controller, Post, Get, Put, Delete, Body, Param, Req, Res, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { AddMemberDto } from './dto/add-member.dto';
import { User as UserDecorator } from '../common/user.decorator';
import { successResponse, errorResponse } from '../common/response.helper';
import { Permissions, PermissionsGuard } from '../common';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo project (cần quyền project:create)' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không đủ quyền project:create' })
  @Permissions('project:create')
  async create(@Req() req: Request, @Body() dto: CreateProjectDto, @Res() res: Response) {
    const user = req['user'] as { _id: string; role?: string };
    if (!user || !user._id) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Create project failed');
    }
    try {
      const project = await this.projectsService.create(user._id, dto);
      return successResponse(res, project, 'Create project success', HttpStatus.CREATED);
    } catch (error) {
      return errorResponse(res, error, 'Create project failed');
    }
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const user = req['user'] as { _id: string; role?: string };
    if (!user || !user._id || !user.role) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Get projects failed');
    }
    try {
      const projects = await this.projectsService.findAll(user._id, user.role);
      return successResponse(res, projects, 'Get projects success');
    } catch (error) {
      return errorResponse(res, error, 'Get projects failed');
    }
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string, @Res() res: Response) {
    const user = req['user'] as { _id: string; role?: string };
    if (!user || !user._id || !user.role) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Get project failed');
    }
    try {
      const project = await this.projectsService.findOne(user._id, user.role, id);
      return successResponse(res, project, 'Get project success');
    } catch (error) {
      return errorResponse(res, error, 'Get project failed');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật project (cần quyền project:update)' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không đủ quyền project:update' })
  @Permissions('project:update')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateProjectDto, @Res() res: Response) {
    const user = req['user'] as { _id: string; role?: string };
    if (!user || !user._id || !user.role) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Update project failed');
    }
    try {
      const project = await this.projectsService.update(user._id, user.role, id, dto);
      return successResponse(res, project, 'Update project success');
    } catch (error) {
      return errorResponse(res, error, 'Update project failed');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa project (cần quyền project:delete)' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không đủ quyền project:delete' })
  @Permissions('project:delete')
  async remove(@Req() req: Request, @Param('id') id: string, @Res() res: Response) {
    const user = req['user'] as { _id: string; role?: string };
    if (!user || !user._id || !user.role) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Delete project failed');
    }
    try {
      const result = await this.projectsService.remove(user._id, user.role, id);
      return successResponse(res, result, 'Delete project success');
    } catch (error) {
      return errorResponse(res, error, 'Delete project failed');
    }
  }

  @Post(':id/add-member')
  @ApiOperation({ summary: 'Thêm thành viên vào project (cần quyền project:add-member)' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không đủ quyền project:add-member' })
  @Permissions('project:add-member')
  async addMember(@Req() req: Request, @Param('id') id: string, @Body() dto: AddMemberDto, @Res() res: Response) {
    const user = req['user'] as { _id: string; role?: string };
    if (!user || !user._id || !user.role) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Add member failed');
    }
    try {
      const result = await this.projectsService.addMember(user._id, user.role, id, dto.userId);
      return successResponse(res, result, 'Add member success');
    } catch (error) {
      return errorResponse(res, error, 'Add member failed');
    }
  }

  @Delete(':id/members/:userId')
  removeMember(@UserDecorator('userId') userId: string, @UserDecorator('role') role: string, @Param('id') id: string, @Param('userId') memberId: string) {
    return this.projectsService.removeMember(userId, role, id, memberId);
  }
} 