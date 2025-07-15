import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Request } from 'express';
import { AddMemberDto } from './dto/add-member.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(req: Request, dto: CreateProjectDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/project.schema").ProjectDocument, {}> & import("./schemas/project.schema").Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(req: Request, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/project.schema").ProjectDocument, {}> & import("./schemas/project.schema").Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(req: Request, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/project.schema").ProjectDocument, {}> & import("./schemas/project.schema").Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(req: Request, id: string, dto: UpdateProjectDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/project.schema").ProjectDocument, {}> & import("./schemas/project.schema").Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(req: Request, id: string): Promise<{
        message: string;
    }>;
    addMember(req: Request, id: string, body: AddMemberDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/project.schema").ProjectDocument, {}> & import("./schemas/project.schema").Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeMember(req: Request, id: string, memberId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/project.schema").ProjectDocument, {}> & import("./schemas/project.schema").Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
