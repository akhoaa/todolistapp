import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private projectModel;
    constructor(projectModel: Model<ProjectDocument>);
    create(userId: string, dto: CreateProjectDto): Promise<import("mongoose").Document<unknown, {}, ProjectDocument, {}> & Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(userId: string, role: string, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, ProjectDocument, {}> & Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(userId: string, role: string, id: string): Promise<import("mongoose").Document<unknown, {}, ProjectDocument, {}> & Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(userId: string, role: string, id: string, dto: UpdateProjectDto): Promise<import("mongoose").Document<unknown, {}, ProjectDocument, {}> & Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(userId: string, role: string, id: string): Promise<{
        message: string;
    }>;
    addMember(userId: string, role: string, id: string, memberId: string): Promise<import("mongoose").Document<unknown, {}, ProjectDocument, {}> & Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    removeMember(userId: string, role: string, id: string, memberId: string): Promise<import("mongoose").Document<unknown, {}, ProjectDocument, {}> & Project & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
