import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './permission.schema';
import { PermissionsGuard } from './permissions.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }])],
  providers: [PermissionsGuard],
  exports: [MongooseModule, PermissionsGuard],
})
export class PermissionModule {} 