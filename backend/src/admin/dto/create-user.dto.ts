import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserByAdminDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  role: string; // 'user' | 'admin'
} 