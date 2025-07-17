import { Permission } from './permission.schema';

export const PERMISSIONS: Omit<Permission, '_id'>[] = [
  // Task permissions
  { name: 'task:create', roles: ['admin', 'user'] },
  { name: 'task:read', roles: ['admin', 'user'] },
  { name: 'task:update', roles: ['admin', 'user'] },
  { name: 'task:delete', roles: ['admin', 'user'] },
  // Project permissions
  { name: 'project:create', roles: ['admin', 'user'] },
  { name: 'project:read', roles: ['admin', 'user'] },
  { name: 'project:update', roles: ['admin'] },
  { name: 'project:delete', roles: ['admin'] },
  { name: 'project:add-member', roles: ['admin'] },
  // User permissions
  { name: 'user:read', roles: ['admin'] },
  { name: 'user:update', roles: ['admin', 'user'] },
  { name: 'user:delete', roles: ['admin'] },
  // Admin permissions
  { name: 'admin:manage', roles: ['admin'] },
  // Report permissions
  { name: 'report:task-list', roles: ['admin'] },
  { name: 'report:user', roles: ['admin'] },
]; 