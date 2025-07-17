import { Controller, Get, Put, Body, Param, Req, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User as UserDecorator } from '../common/user.decorator';
import { successResponse, errorResponse } from '../common/response.helper';
import { Permissions, PermissionsGuard } from '../common';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response) {
    const user = req['user'] as { _id: string };
    if (!user || !user._id) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Get user failed');
    }
    try {
      const result = await this.usersService.getMe(user._id);
      return successResponse(res, result, 'Get user success');
    } catch (error) {
      return errorResponse(res, error, 'Get user failed');
    }
  }

  @Put('me')
  @ApiOperation({ summary: 'Cập nhật thông tin user (cần quyền user:update)' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không đủ quyền user:update' })
  @Permissions('user:update')
  async updateMe(@Req() req: Request, @Body() dto: UpdateUserDto, @Res() res: Response) {
    const user = req['user'] as { _id: string };
    if (!user || !user._id) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' }, 'Update user failed');
    }
    try {
      const result = await this.usersService.updateMe(user._id, dto);
      return successResponse(res, result, 'Update user success');
    } catch (error) {
      return errorResponse(res, error, 'Update user failed');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách user (cần quyền user:read)' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không đủ quyền user:read' })
  @Permissions('user:read')
  async getAll(@Req() req: Request, @Res() res: Response) {
    const user = req['user'] as { _id: string, role: string };
    if (!user || user.role !== 'admin') {
      return errorResponse(res, { status: 403, message: 'Forbidden' }, 'Get users failed');
    }
    try {
      const result = await this.usersService.getAll();
      return successResponse(res, result, 'Get users success');
    } catch (error) {
      return errorResponse(res, error, 'Get users failed');
    }
  }
}
