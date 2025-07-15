import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.shema';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
export declare class AdminService {
    private userModel;
    private taskModel;
    constructor(userModel: Model<UserDocument>, taskModel: Model<TaskDocument>);
    listUsers(query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    getUser(id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateUser(id: string, dto: any): Promise<{
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
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    reportTasks(query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, TaskDocument, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    reportUsers(query: any): Promise<any>;
}
