import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

export function uiTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    // Page Generation Tools
    abp_generate_page: {
      name: 'abp_generate_page',
      description: 'Generate specific pages (list, detail, create, edit, modal) for ABP applications',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The page name',
          },
          type: {
            type: 'string',
            description: 'The page type',
            enum: ['list', 'detail', 'create', 'edit', 'modal'],
          },
          entityId: {
            type: 'string',
            description: 'The entity ID (optional for generic pages)',
          },
          framework: {
            type: 'string',
            description: 'The UI framework',
            enum: ['mvc', 'angular', 'blazor', 'blazor-server'],
          },
          route: {
            type: 'string',
            description: 'Custom route for the page (optional)',
          },
          permissions: {
            type: 'array',
            description: 'Required permissions for the page',
            items: { type: 'string' },
          },
          includeSearch: {
            type: 'boolean',
            description: 'Include search functionality (for list pages)',
            default: false,
          },
          includePaging: {
            type: 'boolean',
            description: 'Include paging functionality (for list pages)',
            default: true,
          },
          includeExport: {
            type: 'boolean',
            description: 'Include export functionality (for list pages)',
            default: false,
          },
        },
        required: ['name', 'type', 'framework'],
      },
      execute: async (args) => {
        const schema = z.object({
          name: z.string(),
          type: z.enum(['list', 'detail', 'create', 'edit', 'modal']),
          entityId: z.string().optional(),
          framework: z.enum(['mvc', 'angular', 'blazor', 'blazor-server']),
          route: z.string().optional(),
          permissions: z.array(z.string()).optional(),
          includeSearch: z.boolean().default(false),
          includePaging: z.boolean().default(true),
          includeExport: z.boolean().default(false),
        });
        
        const validatedArgs = schema.parse(args);
        const result = await apiClient.generatePage(validatedArgs);
        
        return {
          success: true,
          data: result,
          message: `${validatedArgs.type} page '${validatedArgs.name}' generated successfully`,
        };
      },
    } as ToolHandler,

    // Theme Management Tools
    abp_get_themes: {
      name: 'abp_get_themes',
      description: 'Get all available ABP themes',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        const themes = await apiClient.getThemes();
        return {
          success: true,
          data: themes,
          count: themes.length,
        };
      },
    } as ToolHandler,

    abp_get_theme: {
      name: 'abp_get_theme',
      description: 'Get a specific ABP theme by name',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The theme name',
          },
        },
        required: ['name'],
      },
      execute: async (args) => {
        const { name } = z.object({ name: z.string() }).parse(args);
        const theme = await apiClient.getTheme(name);
        return {
          success: true,
          data: theme,
        };
      },
    } as ToolHandler,

    abp_apply_theme: {
      name: 'abp_apply_theme',
      description: 'Apply and customize an ABP theme',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The theme name',
          },
          primaryColor: {
            type: 'string',
            description: 'Primary color (hex code)',
          },
          secondaryColor: {
            type: 'string',
            description: 'Secondary color (hex code)',
          },
          customCss: {
            type: 'string',
            description: 'Custom CSS overrides',
          },
        },
        required: ['name'],
      },
      execute: async (args) => {
        const schema = z.object({
          name: z.string(),
          primaryColor: z.string().optional(),
          secondaryColor: z.string().optional(),
          customCss: z.string().optional(),
        });
        
        const validatedArgs = schema.parse(args);
        const result = await apiClient.applyTheme(validatedArgs);
        
        return {
          success: true,
          data: result,
          message: `Theme '${validatedArgs.name}' applied successfully`,
        };
      },
    } as ToolHandler,

    // Component Generation Tools
    abp_generate_component: {
      name: 'abp_generate_component',
      description: 'Generate reusable UI components (widgets, modals, partials, directives, pipes)',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The component name',
          },
          type: {
            type: 'string',
            description: 'The component type',
            enum: ['widget', 'modal', 'partial', 'directive', 'pipe'],
          },
          framework: {
            type: 'string',
            description: 'The UI framework',
            enum: ['mvc', 'angular', 'blazor', 'blazor-server'],
          },
          properties: {
            type: 'array',
            description: 'Component properties/inputs',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                type: { type: 'string' },
                required: { type: 'boolean' },
                defaultValue: {},
              },
              required: ['name', 'type'],
            },
          },
          template: {
            type: 'string',
            description: 'Custom template/HTML for the component',
          },
        },
        required: ['name', 'type', 'framework'],
      },
      execute: async (args) => {
        const schema = z.object({
          name: z.string(),
          type: z.enum(['widget', 'modal', 'partial', 'directive', 'pipe']),
          framework: z.enum(['mvc', 'angular', 'blazor', 'blazor-server']),
          properties: z.array(z.object({
            name: z.string(),
            type: z.string(),
            required: z.boolean().optional(),
            defaultValue: z.any().optional(),
          })).optional(),
          template: z.string().optional(),
        });
        
        const validatedArgs = schema.parse(args);
        const result = await apiClient.generateComponent(validatedArgs);
        
        return {
          success: true,
          data: result,
          message: `${validatedArgs.type} component '${validatedArgs.name}' generated successfully`,
        };
      },
    } as ToolHandler,

    // Layout Management Tools
    abp_get_layouts: {
      name: 'abp_get_layouts',
      description: 'Get all available ABP layouts',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        const layouts = await apiClient.getLayouts();
        return {
          success: true,
          data: layouts,
          count: layouts.length,
        };
      },
    } as ToolHandler,

    abp_get_layout: {
      name: 'abp_get_layout',
      description: 'Get a specific ABP layout by name',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The layout name',
          },
        },
        required: ['name'],
      },
      execute: async (args) => {
        const { name } = z.object({ name: z.string() }).parse(args);
        const layout = await apiClient.getLayout(name);
        return {
          success: true,
          data: layout,
        };
      },
    } as ToolHandler,

    abp_update_layout: {
      name: 'abp_update_layout',
      description: 'Update an ABP layout configuration',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The layout name',
          },
          displayName: {
            type: 'string',
            description: 'The layout display name',
          },
          description: {
            type: 'string',
            description: 'The layout description',
          },
          template: {
            type: 'string',
            description: 'The layout template/HTML',
          },
        },
        required: ['name'],
      },
      execute: async (args) => {
        const schema = z.object({
          name: z.string(),
          displayName: z.string().optional(),
          description: z.string().optional(),
          template: z.string().optional(),
        });
        
        const { name, ...updateData } = schema.parse(args);
        const layout = await apiClient.updateLayout(name, updateData);
        
        return {
          success: true,
          data: layout,
          message: `Layout '${name}' updated successfully`,
        };
      },
    } as ToolHandler,

    // Menu Management Tools
    abp_get_menus: {
      name: 'abp_get_menus',
      description: 'Get all application menus',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        const menus = await apiClient.getMenus();
        return {
          success: true,
          data: menus,
          count: menus.length,
        };
      },
    } as ToolHandler,

    abp_get_menu: {
      name: 'abp_get_menu',
      description: 'Get a specific menu by name',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The menu name',
          },
        },
        required: ['name'],
      },
      execute: async (args) => {
        const { name } = z.object({ name: z.string() }).parse(args);
        const menu = await apiClient.getMenu(name);
        return {
          success: true,
          data: menu,
        };
      },
    } as ToolHandler,

    abp_add_menu_item: {
      name: 'abp_add_menu_item',
      description: 'Add a menu item to an existing menu',
      inputSchema: {
        type: 'object',
        properties: {
          menuName: {
            type: 'string',
            description: 'The menu name to add item to',
          },
          name: {
            type: 'string',
            description: 'The menu item name (internal identifier)',
          },
          displayName: {
            type: 'string',
            description: 'The menu item display name',
          },
          url: {
            type: 'string',
            description: 'The menu item URL',
          },
          icon: {
            type: 'string',
            description: 'The menu item icon (CSS class or icon name)',
          },
          order: {
            type: 'number',
            description: 'The menu item order',
          },
          requiredPermissionName: {
            type: 'string',
            description: 'Required permission to see this menu item',
          },
          target: {
            type: 'string',
            description: 'Link target (_blank, _self, etc.)',
          },
          parentName: {
            type: 'string',
            description: 'Parent menu item name (for sub-menus)',
          },
        },
        required: ['menuName', 'name', 'displayName'],
      },
      execute: async (args) => {
        const schema = z.object({
          menuName: z.string(),
          name: z.string(),
          displayName: z.string(),
          url: z.string().optional(),
          icon: z.string().optional(),
          order: z.number().optional(),
          requiredPermissionName: z.string().optional(),
          target: z.string().optional(),
          parentName: z.string().optional(),
        });
        
        const { menuName, ...itemData } = schema.parse(args);
        const result = await apiClient.addMenuItem(menuName, itemData);
        
        return {
          success: true,
          data: result,
          message: `Menu item '${itemData.displayName}' added to menu '${menuName}' successfully`,
        };
      },
    } as ToolHandler,

    abp_remove_menu_item: {
      name: 'abp_remove_menu_item',
      description: 'Remove a menu item from a menu',
      inputSchema: {
        type: 'object',
        properties: {
          menuName: {
            type: 'string',
            description: 'The menu name',
          },
          itemName: {
            type: 'string',
            description: 'The menu item name to remove',
          },
        },
        required: ['menuName', 'itemName'],
      },
      execute: async (args) => {
        const { menuName, itemName } = z.object({
          menuName: z.string(),
          itemName: z.string(),
        }).parse(args);
        
        await apiClient.removeMenuItem(menuName, itemName);
        
        return {
          success: true,
          message: `Menu item '${itemName}' removed from menu '${menuName}' successfully`,
        };
      },
    } as ToolHandler,

    // Widget Management Tools
    abp_get_widgets: {
      name: 'abp_get_widgets',
      description: 'Get all dashboard widgets',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        const widgets = await apiClient.getWidgets();
        return {
          success: true,
          data: widgets,
          count: widgets.length,
        };
      },
    } as ToolHandler,

    abp_get_widget: {
      name: 'abp_get_widget',
      description: 'Get a specific widget by name',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The widget name',
          },
        },
        required: ['name'],
      },
      execute: async (args) => {
        const { name } = z.object({ name: z.string() }).parse(args);
        const widget = await apiClient.getWidget(name);
        return {
          success: true,
          data: widget,
        };
      },
    } as ToolHandler,

    abp_create_widget: {
      name: 'abp_create_widget',
      description: 'Create a new dashboard widget',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The widget name (internal identifier)',
          },
          displayName: {
            type: 'string',
            description: 'The widget display name',
          },
          description: {
            type: 'string',
            description: 'The widget description',
          },
          type: {
            type: 'string',
            description: 'The widget type',
            enum: ['chart', 'table', 'card', 'custom'],
          },
          configuration: {
            type: 'object',
            description: 'Widget configuration (JSON object)',
          },
          permissions: {
            type: 'array',
            description: 'Required permissions to view the widget',
            items: { type: 'string' },
          },
          refreshInterval: {
            type: 'number',
            description: 'Auto-refresh interval in seconds',
          },
        },
        required: ['name', 'displayName', 'type'],
      },
      execute: async (args) => {
        const schema = z.object({
          name: z.string(),
          displayName: z.string(),
          description: z.string().optional(),
          type: z.enum(['chart', 'table', 'card', 'custom']),
          configuration: z.any().optional(),
          permissions: z.array(z.string()).optional(),
          refreshInterval: z.number().optional(),
        });
        
        const validatedArgs = schema.parse(args);
        const widget = await apiClient.createWidget(validatedArgs);
        
        return {
          success: true,
          data: widget,
          message: `Widget '${validatedArgs.displayName}' created successfully`,
        };
      },
    } as ToolHandler,

    abp_update_widget: {
      name: 'abp_update_widget',
      description: 'Update an existing widget',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The widget name',
          },
          displayName: {
            type: 'string',
            description: 'The widget display name',
          },
          description: {
            type: 'string',
            description: 'The widget description',
          },
          configuration: {
            type: 'object',
            description: 'Widget configuration (JSON object)',
          },
          permissions: {
            type: 'array',
            description: 'Required permissions to view the widget',
            items: { type: 'string' },
          },
          refreshInterval: {
            type: 'number',
            description: 'Auto-refresh interval in seconds',
          },
        },
        required: ['name'],
      },
      execute: async (args) => {
        const schema = z.object({
          name: z.string(),
          displayName: z.string().optional(),
          description: z.string().optional(),
          configuration: z.any().optional(),
          permissions: z.array(z.string()).optional(),
          refreshInterval: z.number().optional(),
        });
        
        const { name, ...updateData } = schema.parse(args);
        const widget = await apiClient.updateWidget(name, updateData);
        
        return {
          success: true,
          data: widget,
          message: `Widget '${name}' updated successfully`,
        };
      },
    } as ToolHandler,

    abp_delete_widget: {
      name: 'abp_delete_widget',
      description: 'Delete a widget',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The widget name',
          },
        },
        required: ['name'],
      },
      execute: async (args) => {
        const { name } = z.object({ name: z.string() }).parse(args);
        await apiClient.deleteWidget(name);
        
        return {
          success: true,
          message: `Widget '${name}' deleted successfully`,
        };
      },
    } as ToolHandler,

    // Form Generation Tools
    abp_generate_form: {
      name: 'abp_generate_form',
      description: 'Generate complex forms with validation',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The form name',
          },
          entityId: {
            type: 'string',
            description: 'Related entity ID (optional)',
          },
          fields: {
            type: 'array',
            description: 'Form fields',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                type: {
                  type: 'string',
                  enum: ['text', 'email', 'password', 'number', 'date', 'datetime', 'select', 'multiselect', 'checkbox', 'textarea', 'file'],
                },
                label: { type: 'string' },
                required: { type: 'boolean' },
                validation: {
                  type: 'object',
                  properties: {
                    minLength: { type: 'number' },
                    maxLength: { type: 'number' },
                    pattern: { type: 'string' },
                    min: { type: 'number' },
                    max: { type: 'number' },
                  },
                },
                options: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      value: {},
                      label: { type: 'string' },
                    },
                    required: ['value', 'label'],
                  },
                },
                defaultValue: {},
              },
              required: ['name', 'type', 'label'],
            },
          },
          layout: {
            type: 'string',
            description: 'Form layout',
            enum: ['horizontal', 'vertical', 'inline'],
            default: 'vertical',
          },
          submitAction: {
            type: 'string',
            description: 'Submit action URL or method name',
          },
          cancelAction: {
            type: 'string',
            description: 'Cancel action URL or method name',
          },
        },
        required: ['name', 'fields'],
      },
      execute: async (args) => {
        const schema = z.object({
          name: z.string(),
          entityId: z.string().optional(),
          fields: z.array(z.object({
            name: z.string(),
            type: z.enum(['text', 'email', 'password', 'number', 'date', 'datetime', 'select', 'multiselect', 'checkbox', 'textarea', 'file']),
            label: z.string(),
            required: z.boolean().optional(),
            validation: z.object({
              minLength: z.number().optional(),
              maxLength: z.number().optional(),
              pattern: z.string().optional(),
              min: z.number().optional(),
              max: z.number().optional(),
            }).optional(),
            options: z.array(z.object({
              value: z.any(),
              label: z.string(),
            })).optional(),
            defaultValue: z.any().optional(),
          })),
          layout: z.enum(['horizontal', 'vertical', 'inline']).default('vertical'),
          submitAction: z.string().optional(),
          cancelAction: z.string().optional(),
        });
        
        const validatedArgs = schema.parse(args);
        const result = await apiClient.generateForm(validatedArgs);
        
        return {
          success: true,
          data: result,
          message: `Form '${validatedArgs.name}' generated successfully with ${validatedArgs.fields.length} fields`,
        };
      },
    } as ToolHandler,

    // Localization Tools
    abp_get_localization_resources: {
      name: 'abp_get_localization_resources',
      description: 'Get all localization resources',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        const resources = await apiClient.getLocalizationResources();
        return {
          success: true,
          data: resources,
          count: resources.length,
        };
      },
    } as ToolHandler,

    abp_get_localization_resource: {
      name: 'abp_get_localization_resource',
      description: 'Get a specific localization resource, optionally for a specific culture',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The resource name',
          },
          culture: {
            type: 'string',
            description: 'The culture code (e.g., en, tr, es) - optional',
          },
        },
        required: ['name'],
      },
      execute: async (args) => {
        const schema = z.object({
          name: z.string(),
          culture: z.string().optional(),
        });
        
        const { name, culture } = schema.parse(args);
        const resource = await apiClient.getLocalizationResource(name, culture);
        
        return {
          success: true,
          data: resource,
        };
      },
    } as ToolHandler,

    abp_update_localization_text: {
      name: 'abp_update_localization_text',
      description: 'Update or add localization text for a specific key and culture',
      inputSchema: {
        type: 'object',
        properties: {
          resourceName: {
            type: 'string',
            description: 'The localization resource name',
          },
          culture: {
            type: 'string',
            description: 'The culture code (e.g., en, tr, es)',
          },
          key: {
            type: 'string',
            description: 'The localization key',
          },
          value: {
            type: 'string',
            description: 'The localized text value',
          },
        },
        required: ['resourceName', 'culture', 'key', 'value'],
      },
      execute: async (args) => {
        const schema = z.object({
          resourceName: z.string(),
          culture: z.string(),
          key: z.string(),
          value: z.string(),
        });
        
        const { resourceName, ...data } = schema.parse(args);
        const result = await apiClient.updateLocalizationText(resourceName, data);
        
        return {
          success: true,
          data: result,
          message: `Localization text for key '${data.key}' updated in culture '${data.culture}'`,
        };
      },
    } as ToolHandler,

    abp_get_supported_cultures: {
      name: 'abp_get_supported_cultures',
      description: 'Get all supported cultures/languages',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        const cultures = await apiClient.getSupportedCultures();
        return {
          success: true,
          data: cultures,
          count: cultures.length,
        };
      },
    } as ToolHandler,
  };
} 