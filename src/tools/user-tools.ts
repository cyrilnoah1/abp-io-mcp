import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

export function userTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    abp_get_users: {
      name: 'abp_get_users',
      description: 'Get all ABP users with optional filtering',
      inputSchema: {
        type: 'object',
        properties: {
          filter: {
            type: 'string',
            description: 'Filter users by name, email, or username (optional)',
          },
          maxResultCount: {
            type: 'number',
            description: 'Maximum number of users to return (optional)',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { filter, maxResultCount } = z.object({
          filter: z.string().optional(),
          maxResultCount: z.number().optional(),
        }).parse(args);
        
        const users = await apiClient.getUsers(filter, maxResultCount);
        return {
          success: true,
          data: users,
          count: users.length,
          active: users.filter(u => u.isActive).length,
          inactive: users.filter(u => !u.isActive).length,
        };
      },
    } as ToolHandler,

    abp_get_user: {
      name: 'abp_get_user',
      description: 'Get a specific ABP user by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The user ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        const user = await apiClient.getUser(id);
        return {
          success: true,
          data: user,
        };
      },
    } as ToolHandler,

    abp_create_user: {
      name: 'abp_create_user',
      description: 'Create a new ABP user',
      inputSchema: {
        type: 'object',
        properties: {
          userName: {
            type: 'string',
            description: 'The username',
          },
          name: {
            type: 'string',
            description: 'The first name',
          },
          surname: {
            type: 'string',
            description: 'The last name',
          },
          email: {
            type: 'string',
            description: 'The email address',
          },
          password: {
            type: 'string',
            description: 'The password',
          },
          phoneNumber: {
            type: 'string',
            description: 'The phone number (optional)',
          },
          isActive: {
            type: 'boolean',
            description: 'Whether the user is active',
            default: true,
          },
          roleNames: {
            type: 'array',
            description: 'Array of role names to assign to the user',
            items: {
              type: 'string',
            },
          },
        },
        required: ['userName', 'name', 'surname', 'email', 'password'],
      },
      execute: async (args) => {
        const user = await apiClient.createUser(args);
        return {
          success: true,
          data: user,
          message: `User '${user.userName}' created successfully`,
        };
      },
    } as ToolHandler,

    abp_update_user: {
      name: 'abp_update_user',
      description: 'Update an existing ABP user',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The user ID',
          },
          userName: {
            type: 'string',
            description: 'The username',
          },
          name: {
            type: 'string',
            description: 'The first name',
          },
          surname: {
            type: 'string',
            description: 'The last name',
          },
          email: {
            type: 'string',
            description: 'The email address',
          },
          phoneNumber: {
            type: 'string',
            description: 'The phone number',
          },
          isActive: {
            type: 'boolean',
            description: 'Whether the user is active',
          },
          roleNames: {
            type: 'array',
            description: 'Array of role names to assign to the user',
            items: {
              type: 'string',
            },
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id, ...updateData } = args;
        const user = await apiClient.updateUser(id, updateData);
        return {
          success: true,
          data: user,
          message: `User updated successfully`,
        };
      },
    } as ToolHandler,

    abp_delete_user: {
      name: 'abp_delete_user',
      description: 'Delete an ABP user',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The user ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        await apiClient.deleteUser(id);
        return {
          success: true,
          message: `User deleted successfully`,
        };
      },
    } as ToolHandler,
  };
} 