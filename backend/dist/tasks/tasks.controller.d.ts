import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: Request, dto: CreateTaskDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/task.schema").TaskDocument, {}> & import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(req: Request, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/task.schema").TaskDocument, {}> & import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(req: Request, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/task.schema").TaskDocument, {}> & import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(req: Request, id: string, dto: UpdateTaskDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/task.schema").TaskDocument, {}> & import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(req: Request, id: string): Promise<{
        message: string;
    }>;
}
