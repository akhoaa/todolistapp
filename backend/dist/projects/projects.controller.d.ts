import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Request, Response } from 'express';
import { AddMemberDto } from './dto/add-member.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(req: Request, dto: CreateProjectDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(req: Request, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, id: string, dto: UpdateProjectDto, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(req: Request, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    addMember(req: Request, id: string, dto: AddMemberDto, res: Response): Promise<Response<any, Record<string, any>>>;
    removeMember(userId: string, role: string, id: string, memberId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/project.schema").ProjectDocument, {}> & import("./schemas/project.schema").Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
