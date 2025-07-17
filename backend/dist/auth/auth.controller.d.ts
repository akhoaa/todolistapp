import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyDto } from './dto/verify.dto';
import { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto, res: Response): Promise<Response<any, Record<string, any>>>;
    signin(dto: SigninDto, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(dto: ForgotPasswordDto, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(dto: ResetPasswordDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verify(dto: VerifyDto, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: Request): Express.User | undefined;
}
