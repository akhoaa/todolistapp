import { AdminService } from './admin.service';
import { Request, Response } from 'express';
import { UpdateUserByAdminDto } from './dto/update-user.dto';
import { CreateUserByAdminDto } from './dto/create-user.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    listUsers(req: Request, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../users/schemas/user.shema").UserDocument, {}> & import("../users/schemas/user.shema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    getUser(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    createUser(req: Request, dto: CreateUserByAdminDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateUser(id: string, dto: UpdateUserByAdminDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteUser(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    reportTasks(req: Request, query: any, res: Response): Promise<Response<any, Record<string, any>>>;
    reportUsers(req: Request, query: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
