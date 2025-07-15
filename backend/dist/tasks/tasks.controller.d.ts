import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(userId: string, dto: CreateTaskDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/task.schema").TaskDocument, {}> & import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(userId: string, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/task.schema").TaskDocument, {}> & import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(userId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/task.schema").TaskDocument, {}> & import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(userId: string, id: string, dto: UpdateTaskDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/task.schema").TaskDocument, {}> & import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
}
