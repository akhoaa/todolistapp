import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyDto } from './dto/verify.dto';
import { UserDocument } from '../users/schemas/user.shema';
export declare class AuthService {
    private userModel;
    private jwtService;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    signup(dto: SignupDto): Promise<{
        token: string;
    }>;
    signin(dto: SigninDto): Promise<{
        token: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verify(dto: VerifyDto): Promise<{
        message: string;
    }>;
}
