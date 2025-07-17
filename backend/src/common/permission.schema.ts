import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true })
  name: string; // e.g. 'task:create', 'task:update', 'user:read', ...

  @Prop({ type: [String], default: [] })
  roles: string[]; // e.g. ['admin', 'user']
}

export const PermissionSchema = SchemaFactory.createForClass(Permission); 