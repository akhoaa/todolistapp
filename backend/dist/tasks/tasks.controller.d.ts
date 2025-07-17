import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request, Response } from 'express';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: Request, dto: CreateTaskDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(req: Request, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, id: string, dto: UpdateTaskDto, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(req: Request, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
