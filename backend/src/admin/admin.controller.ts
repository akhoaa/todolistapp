import { Controller, Get, Query, Param, Put, Delete, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UpdateUserByAdminDto } from './dto/update-user.dto';

function isAdmin(req: Request) {
  return (req as any).user?.role === 'admin';
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers(@Req() req: Request, @Query() query: any) {
    if (!isAdmin(req)) throw new ForbiddenException();
    return this.adminService.listUsers(query);
  }

  @Get('users/:id')
  getUser(@Req() req: Request, @Param('id') id: string) {
    if (!isAdmin(req)) throw new ForbiddenException();
    return this.adminService.getUser(id);
  }

  @Put('users/:id')
  updateUser(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateUserByAdminDto) {
    if (!isAdmin(req)) throw new ForbiddenException();
    return this.adminService.updateUser(id, dto);
  }

  @Delete('users/:id')
  deleteUser(@Req() req: Request, @Param('id') id: string) {
    if (!isAdmin(req)) throw new ForbiddenException();
    return this.adminService.deleteUser(id);
  }

  @Get('report/tasks')
  reportTasks(@Req() req: Request, @Query() query: any) {
    if (!isAdmin(req)) throw new ForbiddenException();
    return this.adminService.reportTasks(query);
  }

  @Get('report/users')
  reportUsers(@Req() req: Request, @Query() query: any) {
    if (!isAdmin(req)) throw new ForbiddenException();
    return this.adminService.reportUsers(query);
  }
} 