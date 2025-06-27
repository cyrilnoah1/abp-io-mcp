import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

export function applicationTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    abp_get_applications: {
      name: 'abp_get_applications',
      description: 'Get all ABP applications',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        const applications = await apiClient.getApplications();
        return {
          success: true,
          data: applications,
          count: applications.length,
        };
      },
    } as ToolHandler,

    abp_get_application: {
      name: 'abp_get_application',
      description: 'Get a specific ABP application by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The application ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        const application = await apiClient.getApplication(id);
        return {
          success: true,
          data: application,
        };
      },
    } as ToolHandler,

    abp_create_application: {
      name: 'abp_create_application',
      description: 'Create a new ABP application',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The application name (internal identifier)',
          },
          displayName: {
            type: 'string',
            description: 'The display name for the application',
          },
          template: {
            type: 'string',
            description: 'The ABP template to use (e.g., app, microservice, module)',
            enum: ['app', 'microservice', 'module', 'console'],
          },
          framework: {
            type: 'string',
            description: 'The UI framework',
            enum: ['mvc', 'angular', 'blazor', 'blazor-server', 'react-native', 'maui'],
          },
          database: {
            type: 'string',
            description: 'The database provider',
            enum: ['ef', 'mongodb', 'dapper'],
          },
          connectionString: {
            type: 'string',
            description: 'Database connection string (optional)',
          },
        },
        required: ['name', 'displayName', 'template'],
      },
      execute: async (args) => {
        const schema = z.object({
          name: z.string(),
          displayName: z.string(),
          template: z.enum(['app', 'microservice', 'module', 'console']),
          framework: z.enum(['mvc', 'angular', 'blazor', 'blazor-server', 'react-native', 'maui']).optional(),
          database: z.enum(['ef', 'mongodb', 'dapper']).optional(),
          connectionString: z.string().optional(),
        });
        
        const validatedArgs = schema.parse(args);
        const application = await apiClient.createApplication(validatedArgs);
        
        return {
          success: true,
          data: application,
          message: `Application '${application.displayName}' created successfully`,
        };
      },
    } as ToolHandler,

    abp_update_application: {
      name: 'abp_update_application',
      description: 'Update an existing ABP application',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The application ID',
          },
          displayName: {
            type: 'string',
            description: 'The display name for the application',
          },
          url: {
            type: 'string',
            description: 'The application URL',
          },
          status: {
            type: 'string',
            description: 'The application status',
            enum: ['Running', 'Stopped', 'Error'],
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const schema = z.object({
          id: z.string(),
          displayName: z.string().optional(),
          url: z.string().optional(),
          status: z.enum(['Running', 'Stopped', 'Error']).optional(),
        });
        
        const { id, ...updateData } = schema.parse(args);
        const application = await apiClient.updateApplication(id, updateData);
        
        return {
          success: true,
          data: application,
          message: `Application updated successfully`,
        };
      },
    } as ToolHandler,

    abp_delete_application: {
      name: 'abp_delete_application',
      description: 'Delete an ABP application',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The application ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        await apiClient.deleteApplication(id);
        
        return {
          success: true,
          message: `Application deleted successfully`,
        };
      },
    } as ToolHandler,
  };
} 