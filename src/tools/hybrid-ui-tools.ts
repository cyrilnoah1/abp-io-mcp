import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

// Check if we're in info-only mode (no API key provided)
const isInfoOnlyMode = (apiClient: AbpApiClient): boolean => {
  return !apiClient || !(apiClient as any).config?.apiKey;
};

export function hybridUiTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    // Component Generation - Works in both modes
    abp_generate_component: {
      name: 'abp_generate_component',
      description: 'Generate reusable UI components (widgets, modals, partials, directives, pipes) - Works in info-only mode with static templates',
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
            required: z.boolean().default(false),
            defaultValue: z.any().optional(),
          })).optional(),
          template: z.string().optional(),
        });
        
        const validatedArgs = schema.parse(args);
        
        if (isInfoOnlyMode(apiClient)) {
          // Generate static template
          return generateStaticComponent(validatedArgs);
        } else {
          // Use API call for full mode
          try {
            const result = await apiClient.generateComponent(validatedArgs);
            return {
              success: true,
              data: result,
              message: `${validatedArgs.type} component '${validatedArgs.name}' generated successfully via API`,
              mode: 'api',
            };
          } catch (error) {
            // Fallback to static template if API fails
            const staticResult = generateStaticComponent(validatedArgs);
            return {
              ...staticResult,
              warning: 'API call failed, generated static template instead',
            };
          }
        }
      },
    } as ToolHandler,

    // Theme Information - Works in both modes
    abp_get_themes: {
      name: 'abp_get_themes',
      description: 'Get available ABP themes - Works in info-only mode with theme information',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        if (isInfoOnlyMode(apiClient)) {
          return getStaticThemeInfo();
        } else {
          try {
            const themes = await apiClient.getThemes();
            return {
              success: true,
              data: themes,
              count: themes.length,
              mode: 'api',
            };
          } catch (error) {
            const staticResult = getStaticThemeInfo();
            return {
              ...staticResult,
              warning: 'API call failed, showing static theme information instead',
            };
          }
        }
      },
    } as ToolHandler,

    // Form Generation - Works in both modes
    abp_generate_form: {
      name: 'abp_generate_form',
      description: 'Generate complex forms with validation - Works in info-only mode with static templates',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The form name',
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
                  enum: ['text', 'email', 'password', 'number', 'date', 'datetime', 'select', 'multiselect', 'checkbox', 'textarea', 'file']
                },
                label: { type: 'string' },
                required: { type: 'boolean', default: false },
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
          entityId: {
            type: 'string',
            description: 'Related entity ID (optional)',
          },
        },
        required: ['name', 'fields'],
      },
      execute: async (args) => {
        const schema = z.object({
          name: z.string(),
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
          entityId: z.string().optional(),
        });
        
        const validatedArgs = schema.parse(args);
        
        if (isInfoOnlyMode(apiClient)) {
          return generateStaticForm(validatedArgs);
        } else {
          try {
            const result = await apiClient.generateForm(validatedArgs as any);
            return {
              success: true,
              data: result,
              message: `Form '${validatedArgs.name}' generated successfully via API`,
              mode: 'api',
            };
          } catch (error) {
            const staticResult = generateStaticForm(validatedArgs);
            return {
              ...staticResult,
              warning: 'API call failed, generated static template instead',
            };
          }
        }
      },
    } as ToolHandler,

    // UI Examples - Info-only mode specialized tool
    abp_get_ui_examples: {
      name: 'abp_get_ui_examples',
      description: 'Get UI code examples and snippets for different frameworks',
      inputSchema: {
        type: 'object',
        properties: {
          framework: {
            type: 'string',
            description: 'UI framework',
            enum: ['mvc', 'angular', 'blazor', 'blazor-server', 'all'],
            default: 'all',
          },
          category: {
            type: 'string',
            description: 'Example category',
            enum: ['forms', 'tables', 'modals', 'widgets', 'navigation', 'all'],
            default: 'all',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { framework = 'all', category = 'all' } = z.object({
          framework: z.enum(['mvc', 'angular', 'blazor', 'blazor-server', 'all']).default('all'),
          category: z.enum(['forms', 'tables', 'modals', 'widgets', 'navigation', 'all']).default('all'),
        }).parse(args);

        return getUiExamples(framework, category);
      },
    } as ToolHandler,
  };
}

// Static template generators
function generateStaticComponent(args: any) {
  const templates = {
    angular: generateAngularComponent(args),
    blazor: generateBlazorComponent(args),
    mvc: generateMvcComponent(args),
    'blazor-server': generateBlazorComponent(args),
  };

  return {
    success: true,
    data: {
      name: args.name,
      type: args.type,
      framework: args.framework,
      code: templates[args.framework as keyof typeof templates],
      properties: args.properties || [],
    },
    message: `Static ${args.type} component template generated for ${args.framework}`,
    mode: 'static',
    usage: 'Copy this code to your project and customize as needed',
  };
}

function generateAngularComponent(args: any) {
  const props = args.properties || [];
  const inputs = props.map((p: any) => `@Input() ${p.name}${p.required ? '' : '?'}: ${p.type};`).join('\n  ');
  
  return {
    typescript: `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-${args.name.toLowerCase()}',
  templateUrl: './${args.name.toLowerCase()}.component.html',
  styleUrls: ['./${args.name.toLowerCase()}.component.scss']
})
export class ${args.name}Component {
  ${inputs}
  
  constructor() { }
  
  ${args.type === 'modal' ? `
  onSave() {
    // Handle save logic
  }
  
  onCancel() {
    // Handle cancel logic
  }` : ''}
}`,
    html: args.template || generateAngularTemplate(args),
    scss: `/* ${args.name} component styles */
.${args.name.toLowerCase()}-container {
  /* Add your styles here */
}`,
  };
}

function generateBlazorComponent(args: any) {
  const props = args.properties || [];
  const parameters = props.map((p: any) => `[Parameter] public ${p.type} ${p.name} { get; set; }${p.defaultValue ? ` = ${JSON.stringify(p.defaultValue)};` : ''}`).join('\n    ');
  
  return {
    razor: `@* ${args.name} ${args.type} component *@

${parameters ? `@code {
    ${parameters}
}` : ''}

${args.template || generateBlazorTemplate(args)}`,
    csharp: args.type === 'widget' ? `using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.Widgets;

namespace YourApp.Web.Components.${args.name}
{
    [Widget(
        AutoInitialize = true,
        RefreshUrl = "/Widgets/${args.name}/Refresh"
    )]
    public class ${args.name}WidgetViewComponent : AbpViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}` : null,
  };
}

function generateMvcComponent(args: any) {
  return {
    csharp: `using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace YourApp.Web.Components.${args.name}
{
    public class ${args.name}ViewComponent : AbpViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}`,
    html: args.template || generateMvcTemplate(args),
    css: `/* ${args.name} component styles */
.${args.name.toLowerCase()}-container {
    /* Add your styles here */
}`,
  };
}

function generateAngularTemplate(args: any) {
  if (args.type === 'modal') {
    return `<div class="modal-header">
  <h4 class="modal-title">${args.name}</h4>
</div>
<div class="modal-body">
  <!-- Add your content here -->
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
  <button type="button" class="btn btn-primary" (click)="onSave()">Save</button>
</div>`;
  }
  return `<div class="${args.name.toLowerCase()}-container">
  <h3>${args.name}</h3>
  <!-- Add your content here -->
</div>`;
}

function generateBlazorTemplate(args: any) {
  if (args.type === 'modal') {
    return `<div class="modal-header">
    <h4 class="modal-title">${args.name}</h4>
</div>
<div class="modal-body">
    <!-- Add your content here -->
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary" @onclick="OnCancel">Cancel</button>
    <button type="button" class="btn btn-primary" @onclick="OnSave">Save</button>
</div>`;
  }
  return `<div class="${args.name.toLowerCase()}-container">
    <h3>${args.name}</h3>
    <!-- Add your content here -->
</div>`;
}

function generateMvcTemplate(args: any) {
  if (args.type === 'modal') {
    return `<div class="modal-header">
    <h4 class="modal-title">${args.name}</h4>
</div>
<div class="modal-body">
    <!-- Add your content here -->
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-primary">Save</button>
</div>`;
  }
  return `<div class="${args.name.toLowerCase()}-container">
    <h3>${args.name}</h3>
    <!-- Add your content here -->
</div>`;
}

function generateStaticForm(args: any) {
  const templates = {
    angular: generateAngularForm(args),
    blazor: generateBlazorForm(args),
    mvc: generateMvcForm(args),
    'blazor-server': generateBlazorForm(args),
  };

  return {
    success: true,
    data: {
      name: args.name,
      fields: args.fields,
      layout: args.layout,
      code: templates.angular, // Default to Angular for now
    },
    message: `Static form template generated for ${args.name}`,
    mode: 'static',
    usage: 'Copy this code to your project and customize as needed',
  };
}

function generateAngularForm(args: any) {
  const formControls = args.fields.map((field: any) => `${field.name}: ['${field.defaultValue || ''}', ${field.required ? 'Validators.required' : ''}]`).join(',\n      ');
  
  return {
    typescript: `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-${args.name.toLowerCase()}',
  templateUrl: './${args.name.toLowerCase()}.component.html'
})
export class ${args.name}Component implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      ${formControls}
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      // Handle form submission
    }
  }

  onCancel() {
    // Handle cancel
  }
}`,
    html: generateAngularFormTemplate(args),
  };
}

function generateAngularFormTemplate(args: any) {
  const fields = args.fields.map((field: any) => {
    switch (field.type) {
      case 'select':
        return `<div class="form-group">
  <label for="${field.name}">${field.label}</label>
  <select id="${field.name}" formControlName="${field.name}" class="form-control">
    ${field.options?.map((opt: any) => `<option value="${opt.value}">${opt.label}</option>`).join('\n    ') || ''}
  </select>
</div>`;
      case 'textarea':
        return `<div class="form-group">
  <label for="${field.name}">${field.label}</label>
  <textarea id="${field.name}" formControlName="${field.name}" class="form-control" rows="3"></textarea>
</div>`;
      case 'checkbox':
        return `<div class="form-check">
  <input type="checkbox" id="${field.name}" formControlName="${field.name}" class="form-check-input">
  <label for="${field.name}" class="form-check-label">${field.label}</label>
</div>`;
      default:
        return `<div class="form-group">
  <label for="${field.name}">${field.label}</label>
  <input type="${field.type}" id="${field.name}" formControlName="${field.name}" class="form-control">
</div>`;
    }
  }).join('\n');

  return `<form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-${args.layout}">
  <h3>${args.name}</h3>
  
  ${fields}
  
  <div class="form-actions">
    <button type="submit" class="btn btn-primary" [disabled]="!form.valid">Submit</button>
    <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
  </div>
</form>`;
}

function generateBlazorForm(args: any) {
  return `<!-- Blazor form template for ${args.name} -->
<EditForm Model="model" OnValidSubmit="OnSubmit">
    <DataAnnotationsValidator />
    <ValidationSummary />
    
    <!-- Add form fields here -->
    
    <div class="form-actions">
        <button type="submit" class="btn btn-primary">Submit</button>
        <button type="button" class="btn btn-secondary" @onclick="OnCancel">Cancel</button>
    </div>
</EditForm>`;
}

function generateMvcForm(args: any) {
  return `<!-- MVC form template for ${args.name} -->
@model YourApp.ViewModels.${args.name}ViewModel

<form asp-action="Create" method="post" class="form-${args.layout}">
    <h3>${args.name}</h3>
    
    <!-- Add form fields here -->
    
    <div class="form-actions">
        <button type="submit" class="btn btn-primary">Submit</button>
        <a asp-action="Index" class="btn btn-secondary">Cancel</a>
    </div>
</form>`;
}

function getStaticThemeInfo() {
  return {
    success: true,
    data: {
      availableThemes: [
        {
          name: 'LeptonX',
          description: 'Modern, professional theme with multiple layouts',
          features: ['Multiple layouts', 'Dark/light mode', 'RTL support', 'Customizable colors'],
          frameworks: ['Angular', 'Blazor', 'MVC'],
          documentation: 'https://abp.io/docs/latest/ui-themes/leptonx'
        },
        {
          name: 'Basic',
          description: 'Simple, clean theme for basic applications',
          features: ['Bootstrap based', 'Responsive', 'Clean design', 'Easy to customize'],
          frameworks: ['Angular', 'Blazor', 'MVC'],
          documentation: 'https://abp.io/docs/latest/ui-themes/basic'
        }
      ],
      customization: {
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
          success: '#28a745',
          info: '#17a2b8',
          warning: '#ffc107',
          danger: '#dc3545'
        },
        variables: {
          'font-family': 'Roboto, sans-serif',
          'border-radius': '0.25rem',
          'box-shadow': '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
        }
      }
    },
    message: 'Static theme information (use API for applying themes to actual applications)',
    mode: 'static',
  };
}

function getUiExamples(framework: string, category: string) {
  const examples = {
    forms: {
      title: 'Form Examples',
      examples: [
        {
          name: 'Basic Form',
          description: 'Simple form with validation',
          code: 'Basic form template code here...'
        },
        {
          name: 'Dynamic Form',
          description: 'Form with dynamic fields',
          code: 'Dynamic form template code here...'
        }
      ]
    },
    tables: {
      title: 'Table Examples',
      examples: [
        {
          name: 'Data Grid',
          description: 'Sortable, filterable data table',
          code: 'Data grid template code here...'
        }
      ]
    },
    modals: {
      title: 'Modal Examples',
      examples: [
        {
          name: 'Confirmation Modal',
          description: 'Simple confirmation dialog',
          code: 'Modal template code here...'
        }
      ]
    }
  };

  if (category === 'all') {
    return {
      success: true,
      data: {
        framework: framework,
        categories: examples,
        totalExamples: Object.values(examples).reduce((sum, cat) => sum + cat.examples.length, 0)
      },
      message: `UI examples for ${framework} framework`,
      mode: 'static',
    };
  } else {
    return {
      success: true,
      data: {
        framework: framework,
        category: category,
        examples: examples[category as keyof typeof examples] || { title: 'No examples found', examples: [] }
      },
      message: `${category} examples for ${framework} framework`,
      mode: 'static',
    };
  }
} 