import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyDto } from './dto/verify.dto';
import { User, UserDocument } from '../users/schemas/user.shema';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (user) throw new BadRequestException('Email already exists');
      const hash = await bcrypt.hash(dto.password, 10);
      const otp = generateOTP();
      const newUser = await this.userModel.create({
        name: dto.name,
        email: dto.email,
        password: hash,
        otp,
        otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      });
      // Gửi OTP qua email (mock)
      console.log(`OTP for ${dto.email}: ${otp}`);
      const token = this.jwtService.sign({ sub: newUser._id, role: newUser.role });
      return { token };
    } catch (error) {
      this.logger.error(`signup error: ${error.message}`, error.stack, { dto });
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Signup failed');
    }
  }

  async signin(dto: SigninDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      if (!user.isVerified) throw new UnauthorizedException('Account not verified');
      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
      const token = this.jwtService.sign({ sub: user._id, role: user.role });
      return { token };
    } catch (error) {
      this.logger.error(`signin error: ${error.message}`, error.stack, { dto });
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Signin failed');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user) throw new NotFoundException('User not found');
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      // Gửi OTP qua email (mock)
      console.log(`OTP for ${dto.email}: ${otp}`);
      return { message: 'OTP sent to email' };
    } catch (error) {
      this.logger.error(`forgotPassword error: ${error.message}`, error.stack, { dto });
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Forgot password failed');
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user) throw new NotFoundException('User not found');
      if (!user.otp || user.otp !== dto.otp || !user.otpExpires || user.otpExpires < new Date()) {
        throw new BadRequestException('Invalid or expired OTP');
      }
      user.password = await bcrypt.hash(dto.newPassword, 10);
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return { message: 'Password reset successful' };
    } catch (error) {
      this.logger.error(`resetPassword error: ${error.message}`, error.stack, { dto });
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Reset password failed');
    }
  }

  async verify(dto: VerifyDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user) throw new NotFoundException('User not found');
      if (!user.otp || user.otp !== dto.otp || !user.otpExpires || user.otpExpires < new Date()) {
        throw new BadRequestException('Invalid or expired OTP');
      }
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return { message: 'Account verified successfully' };
    } catch (error) {
      this.logger.error(`verify error: ${error.message}`, error.stack, { dto });
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Verify failed');
    }
  }
}
