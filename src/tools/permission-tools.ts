import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

export function permissionTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    abp_get_permissions: {
      name: 'abp_get_permissions',
      description: 'Get ABP permissions with optional provider filtering',
      inputSchema: {
        type: 'object',
        properties: {
          providerName: {
            type: 'string',
            description: 'Permission provider name (e.g., "R" for role, "U" for user)',
          },
          providerKey: {
            type: 'string',
            description: 'Provider key (e.g., role name or user ID)',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { providerName, providerKey } = z.object({
          providerName: z.string().optional(),
          providerKey: z.string().optional(),
        }).parse(args);
        
        const permissions = await apiClient.getPermissions(providerName, providerKey);
        return {
          success: true,
          data: permissions,
          count: permissions.length,
          groups: [...new Set(permissions.map(p => p.groupName))],
        };
      },
    } as ToolHandler,

    abp_get_permissions_by_group: {
      name: 'abp_get_permissions_by_group',
      description: 'Get ABP permissions by group name',
      inputSchema: {
        type: 'object',
        properties: {
          groupName: {
            type: 'string',
            description: 'The permission group name',
          },
        },
        required: ['groupName'],
      },
      execute: async (args) => {
        const { groupName } = z.object({ groupName: z.string() }).parse(args);
        const permissions = await apiClient.getPermissionsByGroup(groupName);
        return {
          success: true,
          data: permissions,
          count: permissions.length,
          groupName,
        };
      },
    } as ToolHandler,

    abp_grant_permission: {
      name: 'abp_grant_permission',
      description: 'Grant a permission to a user or role',
      inputSchema: {
        type: 'object',
        properties: {
          providerName: {
            type: 'string',
            description: 'Permission provider name ("R" for role, "U" for user)',
            enum: ['R', 'U'],
          },
          providerKey: {
            type: 'string',
            description: 'Provider key (role name or user ID)',
          },
          permissionName: {
            type: 'string',
            description: 'The permission name to grant',
          },
        },
        required: ['providerName', 'providerKey', 'permissionName'],
      },
      execute: async (args) => {
        const { providerName, providerKey, permissionName } = z.object({
          providerName: z.enum(['R', 'U']),
          providerKey: z.string(),
          permissionName: z.string(),
        }).parse(args);
        
        await apiClient.grantPermission(providerName, providerKey, permissionName);
        return {
          success: true,
          message: `Permission '${permissionName}' granted to ${providerName === 'R' ? 'role' : 'user'} '${providerKey}'`,
        };
      },
    } as ToolHandler,

    abp_revoke_permission: {
      name: 'abp_revoke_permission',
      description: 'Revoke a permission from a user or role',
      inputSchema: {
        type: 'object',
        properties: {
          providerName: {
            type: 'string',
            description: 'Permission provider name ("R" for role, "U" for user)',
            enum: ['R', 'U'],
          },
          providerKey: {
            type: 'string',
            description: 'Provider key (role name or user ID)',
          },
          permissionName: {
            type: 'string',
            description: 'The permission name to revoke',
          },
        },
        required: ['providerName', 'providerKey', 'permissionName'],
      },
      execute: async (args) => {
        const { providerName, providerKey, permissionName } = z.object({
          providerName: z.enum(['R', 'U']),
          providerKey: z.string(),
          permissionName: z.string(),
        }).parse(args);
        
        await apiClient.revokePermission(providerName, providerKey, permissionName);
        return {
          success: true,
          message: `Permission '${permissionName}' revoked from ${providerName === 'R' ? 'role' : 'user'} '${providerKey}'`,
        };
      },
    } as ToolHandler,
  };
} 