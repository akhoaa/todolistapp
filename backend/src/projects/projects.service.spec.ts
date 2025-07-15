import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectModel: any;

  beforeEach(async () => {
    projectModel = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getModelToken(Project.name), useValue: projectModel },
      ],
    }).compile();
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Thêm các test case khác ở đây
}); 