import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.shema';
import { Task } from '../tasks/schemas/task.schema';

describe('AdminService', () => {
  let service: AdminService;
  let userModel: any;
  let taskModel: any;

  beforeEach(async () => {
    userModel = {};
    taskModel = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Task.name), useValue: taskModel },
      ],
    }).compile();
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Thêm các test case khác ở đây
}); 