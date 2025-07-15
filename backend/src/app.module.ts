import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://pdanhkhoa2509:DcaPeEpYtGgQW9vn@cluster0.q1qzjnv.mongodb.net/todolistapp'),
    AuthModule,
    UsersModule,
    TasksModule,
    ProjectsModule,
    AdminModule,
  ],
})
export class AppModule {}
