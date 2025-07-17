import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.shema';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getMe(userId: string) {
    try {
      const user = await this.userModel.findById(userId).select('-password');
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      this.logger.error(`getMe error: ${error.message}`, error.stack, { userId });
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Get user failed');
    }
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');
      if (dto.email && dto.email !== user.email) {
        const exists = await this.userModel.findOne({ email: dto.email });
        if (exists) throw new BadRequestException('Email already in use');
        user.email = dto.email;
      }
      if (dto.name) user.name = dto.name;
      if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
      await user.save();
      const { password, ...rest } = user.toObject();
      return rest;
    } catch (error) {
      this.logger.error(`updateMe error: ${error.message}`, error.stack, { userId, dto });
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Update user failed');
    }
  }

  async getAll() {
    try {
      const users = await this.userModel.find({}, '_id name email role');
      return users;
    } catch (error) {
      this.logger.error(`getAll error: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Get users failed');
    }
  }
}
