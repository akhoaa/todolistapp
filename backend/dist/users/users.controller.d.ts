import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateMe(req: Request, dto: UpdateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
