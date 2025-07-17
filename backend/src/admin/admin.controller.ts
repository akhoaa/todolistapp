import { Controller, Get, Query, Param, Put, Delete, Body, UseGuards, Req, ForbiddenException, Res, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { UpdateUserByAdminDto } from './dto/update-user.dto';
import { successResponse, errorResponse } from '../common/response.helper';
import { CreateUserByAdminDto } from './dto/create-user.dto';
import { Permissions, PermissionsGuard } from '../common';

function isAdmin(req: Request) {
  return (req as any).user?.role === 'admin';
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Quản lý user (cần quyền admin:manage)' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không đủ quyền admin:manage' })
  @Permissions('admin:manage')
  listUsers(@Req() req: Request, @Query() query: any) {
    if (!isAdmin(req)) throw new ForbiddenException();
    return this.adminService.listUsers(query);
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.adminService.getUser(id);
      return successResponse(res, user, 'Get user success');
    } catch (error) {
      return errorResponse(res, error, 'Get user failed');
    }
  }

  @Post('user')
  async createUser(@Req() req: Request, @Body() dto: CreateUserByAdminDto, @Res() res: Response) {
    if (!isAdmin(req)) throw new ForbiddenException();
    try {
      const user = await this.adminService.createUser(dto);
      return successResponse(res, user, 'Create user success');
    } catch (error) {
      return errorResponse(res, error, 'Create user failed');
    }
  }

  @Put('user/:id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserByAdminDto, @Res() res: Response) {
    try {
      const user = await this.adminService.updateUser(id, dto);
      return successResponse(res, user, 'Update user success');
    } catch (error) {
      return errorResponse(res, error, 'Update user failed');
    }
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.adminService.deleteUser(id);
      return successResponse(res, result, 'Delete user success');
    } catch (error) {
      return errorResponse(res, error, 'Delete user failed');
    }
  }

  @Get('report/tasks')
  async reportTasks(@Req() req: Request, @Query() query: any, @Res() res: Response) {
    if (!isAdmin(req)) throw new ForbiddenException();
    try {
      const result = await this.adminService.reportTasks(query);
      return successResponse(res, result, 'Report tasks success');
    } catch (error) {
      return errorResponse(res, error, 'Report tasks failed');
    }
  }

  @Get('report/users')
  async reportUsers(@Req() req: Request, @Query() query: any, @Res() res: Response) {
    if (!isAdmin(req)) throw new ForbiddenException();
    try {
      const result = await this.adminService.reportUsers(query);
      return successResponse(res, result, 'Report users success');
    } catch (error) {
      return errorResponse(res, error, 'Report users failed');
    }
  }
} 