import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private taskModel;
    private readonly logger;
    constructor(taskModel: Model<TaskDocument>);
    create(userId: string, dto: CreateTaskDto): Promise<import("mongoose").Document<unknown, {}, TaskDocument, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(userId: string, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, TaskDocument, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(userId: string, id: string): Promise<import("mongoose").Document<unknown, {}, TaskDocument, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(userId: string, id: string, dto: UpdateTaskDto): Promise<import("mongoose").Document<unknown, {}, TaskDocument, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
}
