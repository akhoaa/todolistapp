import { Body, Controller, Post, Res, HttpStatus, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyDto } from './dto/verify.dto';
import { Response, Request } from 'express';
import { successResponse, errorResponse } from '../common/response.helper';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res() res: Response) {
    try {
      const result = await this.authService.signup(dto);
      res.cookie('jwt', result.token, {
        httpOnly: true,
        sameSite: 'lax',
        // secure: false, // chỉ bật khi chạy HTTPS
      });
      return successResponse(res, { ...result, token: undefined }, 'Signup success', HttpStatus.CREATED);
    } catch (error) {
      return errorResponse(res, error, 'Signup failed');
    }
  }

  @Post('signin')
  async signin(@Body() dto: SigninDto, @Res() res: Response) {
    try {
      const result = await this.authService.signin(dto);
      res.cookie('jwt', result.token, {
        httpOnly: true,
        sameSite: 'lax',
        // secure: false, // chỉ bật khi chạy HTTPS
      });
      return successResponse(res, { ...result, token: undefined }, 'Signin success');
    } catch (error) {
      return errorResponse(res, error, 'Signin failed');
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Res() res: Response) {
    try {
      const result = await this.authService.forgotPassword(dto);
      return successResponse(res, result, 'Forgot password success');
    } catch (error) {
      return errorResponse(res, error, 'Forgot password failed');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Res() res: Response) {
    try {
      const result = await this.authService.resetPassword(dto);
      return successResponse(res, result, 'Reset password success');
    } catch (error) {
      return errorResponse(res, error, 'Reset password failed');
    }
  }

  @Post('verify')
  async verify(@Body() dto: VerifyDto, @Res() res: Response) {
    try {
      const result = await this.authService.verify(dto);
      return successResponse(res, result, 'Verify success');
    } catch (error) {
      return errorResponse(res, error, 'Verify failed');
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return successResponse(res, null, 'Logout success');
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
