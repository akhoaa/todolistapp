import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
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
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
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
  }

  async signin(dto: SigninDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isVerified) throw new UnauthorizedException('Account not verified');
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    return { token };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new NotFoundException('User not found');
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    // Gửi OTP qua email (mock)
    console.log(`OTP for ${dto.email}: ${otp}`);
    return { message: 'OTP sent to email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
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
  }

  async verify(dto: VerifyDto) {
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
  }
}
