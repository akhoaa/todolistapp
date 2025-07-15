import { AdminService } from './admin.service';
import { Request } from 'express';
import { UpdateUserByAdminDto } from './dto/update-user.dto';
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
    getUser(req: Request, id: string): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.shema").UserDocument, {}> & import("../users/schemas/user.shema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateUser(req: Request, id: string, dto: UpdateUserByAdminDto): Promise<{
        name: string;
        email: string;
        role: string;
        isVerified: boolean;
        otp?: string;
        otpExpires?: Date;
        _id: unknown;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    deleteUser(req: Request, id: string): Promise<{
        message: string;
    }>;
    reportTasks(req: Request, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../tasks/schemas/task.schema").TaskDocument, {}> & import("../tasks/schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    reportUsers(req: Request, query: any): Promise<any>;
}
