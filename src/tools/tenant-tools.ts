import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

export function tenantTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    abp_get_tenants: {
      name: 'abp_get_tenants',
      description: 'Get all ABP tenants with optional filtering',
      inputSchema: {
        type: 'object',
        properties: {
          filter: {
            type: 'string',
            description: 'Filter tenants by name (optional)',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { filter } = z.object({ filter: z.string().optional() }).parse(args);
        const tenants = await apiClient.getTenants(filter);
        return {
          success: true,
          data: tenants,
          count: tenants.length,
          active: tenants.filter(t => t.isActive).length,
          inactive: tenants.filter(t => !t.isActive).length,
        };
      },
    } as ToolHandler,

    abp_get_tenant: {
      name: 'abp_get_tenant',
      description: 'Get a specific ABP tenant by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The tenant ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        const tenant = await apiClient.getTenant(id);
        return {
          success: true,
          data: tenant,
        };
      },
    } as ToolHandler,

    abp_create_tenant: {
      name: 'abp_create_tenant',
      description: 'Create a new ABP tenant',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The tenant name',
          },
          isActive: {
            type: 'boolean',
            description: 'Whether the tenant is active',
            default: true,
          },
          editionId: {
            type: 'string',
            description: 'The edition ID (optional)',
          },
          connectionString: {
            type: 'string',
            description: 'Custom connection string (optional)',
          },
          subscriptionEndDateUtc: {
            type: 'string',
            description: 'Subscription end date in UTC (optional)',
          },
        },
        required: ['name'],
      },
      execute: async (args) => {
        const tenant = await apiClient.createTenant(args);
        return {
          success: true,
          data: tenant,
          message: `Tenant '${tenant.name}' created successfully`,
        };
      },
    } as ToolHandler,

    abp_update_tenant: {
      name: 'abp_update_tenant',
      description: 'Update an existing ABP tenant',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The tenant ID',
          },
          name: {
            type: 'string',
            description: 'The tenant name',
          },
          isActive: {
            type: 'boolean',
            description: 'Whether the tenant is active',
          },
          editionId: {
            type: 'string',
            description: 'The edition ID',
          },
          connectionString: {
            type: 'string',
            description: 'Custom connection string',
          },
          subscriptionEndDateUtc: {
            type: 'string',
            description: 'Subscription end date in UTC',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id, ...updateData } = args;
        const tenant = await apiClient.updateTenant(id, updateData);
        return {
          success: true,
          data: tenant,
          message: `Tenant updated successfully`,
        };
      },
    } as ToolHandler,

    abp_delete_tenant: {
      name: 'abp_delete_tenant',
      description: 'Delete an ABP tenant',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The tenant ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        await apiClient.deleteTenant(id);
        return {
          success: true,
          message: `Tenant deleted successfully`,
        };
      },
    } as ToolHandler,
  };
} 