import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

export function moduleTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    abp_get_modules: {
      name: 'abp_get_modules',
      description: 'Get all ABP modules',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        const modules = await apiClient.getModules();
        return {
          success: true,
          data: modules,
          count: modules.length,
          installed: modules.filter(m => m.isInstalled).length,
          available: modules.filter(m => !m.isInstalled).length,
        };
      },
    } as ToolHandler,

    abp_get_module: {
      name: 'abp_get_module',
      description: 'Get a specific ABP module by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The module ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        const module = await apiClient.getModule(id);
        return {
          success: true,
          data: module,
        };
      },
    } as ToolHandler,

    abp_install_module: {
      name: 'abp_install_module',
      description: 'Install an ABP module by package name',
      inputSchema: {
        type: 'object',
        properties: {
          packageName: {
            type: 'string',
            description: 'The NuGet package name of the module (e.g., Volo.Abp.Identity.Pro)',
          },
          version: {
            type: 'string',
            description: 'Specific version to install (optional, uses latest if not specified)',
          },
          includePrerelease: {
            type: 'boolean',
            description: 'Include prerelease versions',
            default: false,
          },
        },
        required: ['packageName'],
      },
      execute: async (args) => {
        const schema = z.object({
          packageName: z.string(),
          version: z.string().optional(),
          includePrerelease: z.boolean().default(false),
        });
        
        const validatedArgs = schema.parse(args);
        const module = await apiClient.installModule(validatedArgs.packageName);
        
        return {
          success: true,
          data: module,
          message: `Module '${module.displayName}' installed successfully`,
        };
      },
    } as ToolHandler,

    abp_uninstall_module: {
      name: 'abp_uninstall_module',
      description: 'Uninstall an ABP module',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The module ID',
          },
        },
        required: ['id'],
      },
      execute: async (args) => {
        const { id } = z.object({ id: z.string() }).parse(args);
        await apiClient.uninstallModule(id);
        
        return {
          success: true,
          message: `Module uninstalled successfully`,
        };
      },
    } as ToolHandler,

    abp_get_popular_modules: {
      name: 'abp_get_popular_modules',
      description: 'Get list of popular ABP modules with descriptions',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        const popularModules = [
          {
            name: 'Volo.Abp.Identity.Pro',
            displayName: 'Identity Management',
            description: 'Complete user and role management with advanced features',
            category: 'Authentication & Authorization'
          },
          {
            name: 'Volo.Abp.Account.Pro',
            displayName: 'Account Management',
            description: 'User registration, login, password reset, email verification',
            category: 'Authentication & Authorization'
          },
          {
            name: 'Volo.Saas',
            displayName: 'SaaS Module',
            description: 'Multi-tenancy management for SaaS applications',
            category: 'Multi-Tenancy'
          },
          {
            name: 'Volo.Abp.AuditLogging',
            displayName: 'Audit Logging',
            description: 'Comprehensive audit logging and reporting',
            category: 'Monitoring & Logging'
          },
          {
            name: 'Volo.CmsKit.Pro',
            displayName: 'CMS Kit',
            description: 'Content management with blogs, pages, comments, reactions',
            category: 'Content Management'
          },
          {
            name: 'Volo.Chat',
            displayName: 'Chat Module',
            description: 'Real-time messaging and chat functionality',
            category: 'Communication'
          },
          {
            name: 'Volo.FileManagement',
            displayName: 'File Management',
            description: 'File upload, storage, and management',
            category: 'File & Media'
          },
          {
            name: 'Volo.Payment',
            displayName: 'Payment Module',
            description: 'Payment gateway integrations (Stripe, PayPal, etc.)',
            category: 'E-commerce'
          },
          {
            name: 'Volo.LanguageManagement',
            displayName: 'Language Management',
            description: 'Dynamic localization and language management',
            category: 'Localization'
          },
          {
            name: 'Volo.Abp.TextTemplateManagement',
            displayName: 'Text Template Management',
            description: 'Dynamic text template management',
            category: 'Templates'
          }
        ];

        return {
          success: true,
          data: popularModules,
          count: popularModules.length,
          categories: [...new Set(popularModules.map(m => m.category))],
        };
      },
    } as ToolHandler,
  };
} 