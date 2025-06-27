import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

export function entityTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    abp_get_entities: {
      name: 'abp_get_entities',
      description: 'Get all ABP entities, optionally filtered by namespace',
      inputSchema: {
        type: 'object',
        properties: {
          namespace: {
            type: 'string',
            description: 'Filter entities by namespace (optional)',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { namespace } = z.object({ namespace: z.string().optional() }).parse(args);
        const entities = await apiClient.getEntities(namespace);
        return {
          success: true,
          data: entities,
          count: entities.length,
        };
      },
    } as ToolHandler,

    abp_get_entity: {
      name: 'abp_get_entity',
      description: 'Get a specific ABP entity by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The entity ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        const entity = await apiClient.getEntity(id);
        return {
          success: true,
          data: entity,
        };
      },
    } as ToolHandler,

    abp_create_entity: {
      name: 'abp_create_entity',
      description: 'Create a new ABP entity',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The entity name',
          },
          namespace: {
            type: 'string',
            description: 'The entity namespace',
          },
          baseClass: {
            type: 'string',
            description: 'Base class for the entity (optional)',
          },
          isAuditedEntity: {
            type: 'boolean',
            description: 'Whether the entity should be audited',
            default: true,
          },
          isMultiTenant: {
            type: 'boolean',
            description: 'Whether the entity supports multi-tenancy',
            default: false,
          },
          properties: {
            type: 'array',
            description: 'Entity properties',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                type: { type: 'string' },
                isRequired: { type: 'boolean' },
                maxLength: { type: 'number' },
                isNullable: { type: 'boolean' },
                defaultValue: { type: 'string' },
              },
              required: ['name', 'type'],
            },
          },
        },
        required: ['name', 'namespace'],
      },
      execute: async (args) => {
        const entity = await apiClient.createEntity(args);
        return {
          success: true,
          data: entity,
          message: `Entity '${entity.name}' created successfully`,
        };
      },
    } as ToolHandler,

    abp_generate_crud: {
      name: 'abp_generate_crud',
      description: 'Generate CRUD operations for an ABP entity',
      inputSchema: {
        type: 'object',
        properties: {
          entityId: {
            type: 'string',
            description: 'The entity ID',
          },
          generateUI: {
            type: 'boolean',
            description: 'Generate UI pages',
            default: true,
          },
          generateAPI: {
            type: 'boolean',
            description: 'Generate API controllers',
            default: true,
          },
          generateTests: {
            type: 'boolean',
            description: 'Generate unit tests',
            default: true,
          },
        },
        required: ['entityId'],
      },
      execute: async (args) => {
        const { entityId, ...options } = args;
        const result = await apiClient.generateCrud(entityId, options);
        return {
          success: true,
          data: result,
          message: 'CRUD operations generated successfully',
        };
      },
    } as ToolHandler,
  };
} 