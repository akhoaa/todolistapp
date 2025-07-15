import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Giả lập lấy userId từ request, sẽ thay bằng guard sau
  @Get('me')
  getMe(@Req() req: Request) {
    const userId = req.headers['x-user-id'] as string || ((req as any).user?.userId);
    return this.usersService.getMe(userId);
  }

  @Put('me')
  updateMe(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const userId = req.headers['x-user-id'] as string || ((req as any).user?.userId);
    return this.usersService.updateMe(userId, dto);
  }
}
