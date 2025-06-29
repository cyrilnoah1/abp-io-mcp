import { z } from 'zod';
import { AbpApiClient } from '../abp-api-client.js';
import { ToolHandler, ToolHandlers } from './index.js';

export function infoTools(apiClient: AbpApiClient): ToolHandlers {
  return {
    // General ABP Information
    abp_get_info: {
      name: 'abp_get_info',
      description: 'Get general information about the ABP Framework and its capabilities',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        return {
          framework: 'ABP Framework',
          version: '9.2+ (Latest)',
          description: 'Open-source web application framework for .NET',
          website: 'https://abp.io',
          documentation: 'https://abp.io/docs/latest/',
          github: 'https://github.com/abpframework/abp',
          keyFeatures: [
            'Domain Driven Design (DDD) implementation',
            'Modular architecture',
            'Multi-tenancy support',
            'Microservices compatible',
            'Multiple UI framework support (Angular, Blazor, MVC)',
            'Auto API Controllers',
            'Permission system',
            'Audit logging',
            'Background job system',
            'Event bus',
            'Localization',
            'Settings management',
            'Caching',
            'Email & SMS sending',
            'BLOB storage'
          ],
          architecturePatterns: [
            'Domain Driven Design',
            'CQRS',
            'Event Sourcing',
            'Repository Pattern',
            'Unit of Work',
            'Dependency Injection'
          ],
          supportedDatabases: [
            'SQL Server',
            'MySQL',
            'PostgreSQL',
            'Oracle',
            'SQLite',
            'MongoDB'
          ]
        };
      },
    } as ToolHandler,

    // Documentation Links
    abp_get_documentation: {
      name: 'abp_get_documentation',
      description: 'Get links to official ABP documentation and learning resources',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Documentation category to focus on',
            enum: ['getting-started', 'tutorials', 'framework', 'ui', 'modules', 'deployment', 'all'],
            default: 'all',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { category = 'all' } = z.object({
          category: z.enum(['getting-started', 'tutorials', 'framework', 'ui', 'modules', 'deployment', 'all']).default('all'),
        }).parse(args);

        const docs = {
          'getting-started': {
            'Quick Start': 'https://abp.io/docs/latest/get-started',
            'Single Layer Web Application': 'https://abp.io/docs/latest/get-started/single-layer-web-application',
            'Layered Web Application': 'https://abp.io/docs/latest/get-started/layered-web-application',
            'Microservice Solution': 'https://abp.io/docs/latest/get-started/microservice-solution',
            'Pre-Requirements': 'https://abp.io/docs/latest/get-started/pre-requirements'
          },
          'tutorials': {
            'TODO Application': 'https://abp.io/docs/latest/tutorials/todo',
            'Book Store Application': 'https://abp.io/docs/latest/tutorials/book-store',
            'Book Store with ABP Suite': 'https://abp.io/docs/latest/tutorials/book-store-suite',
            'Modular Monolith Application': 'https://abp.io/docs/latest/tutorials/modular-monolith',
            'Microservice Solution': 'https://abp.io/docs/latest/tutorials/microservice',
            'Mobile Application Development': 'https://abp.io/docs/latest/tutorials/mobile'
          },
          'framework': {
            'Domain Driven Design': 'https://abp.io/docs/latest/framework/architecture/domain-driven-design',
            'Modularity': 'https://abp.io/docs/latest/framework/architecture/modularity',
            'Multi-Tenancy': 'https://abp.io/docs/latest/framework/architecture/multi-tenancy',
            'Microservices': 'https://abp.io/docs/latest/framework/architecture/microservices',
            'Authorization': 'https://abp.io/docs/latest/framework/fundamentals/authorization',
            'Localization': 'https://abp.io/docs/latest/framework/fundamentals/localization',
            'Settings': 'https://abp.io/docs/latest/framework/infrastructure/settings',
            'Background Jobs': 'https://abp.io/docs/latest/framework/infrastructure/background-jobs',
            'Audit Logging': 'https://abp.io/docs/latest/framework/infrastructure/audit-logging',
            'Event Bus': 'https://abp.io/docs/latest/framework/infrastructure/event-bus'
          },
          'ui': {
            'MVC / Razor Pages': 'https://abp.io/docs/latest/framework/ui/mvc-razor-pages',
            'Blazor': 'https://abp.io/docs/latest/framework/ui/blazor',
            'Angular': 'https://abp.io/docs/latest/framework/ui/angular',
            'React Native': 'https://abp.io/docs/latest/framework/ui/react-native',
            'LeptonX Theme': 'https://abp.io/docs/latest/ui-themes/leptonx',
            'Basic Theme': 'https://abp.io/docs/latest/ui-themes/basic'
          },
          'modules': {
            'All Modules': 'https://abp.io/docs/latest/modules',
            'Identity': 'https://abp.io/docs/latest/modules/identity',
            'CMS Kit': 'https://abp.io/docs/latest/modules/cms-kit',
            'Audit Logging': 'https://abp.io/docs/latest/modules/audit-logging',
            'Account': 'https://abp.io/docs/latest/modules/account',
            'SaaS': 'https://abp.io/docs/latest/modules/saas',
            'File Management': 'https://abp.io/docs/latest/modules/file-management',
            'Chat': 'https://abp.io/docs/latest/modules/chat',
            'Language Management': 'https://abp.io/docs/latest/modules/language-management',
            'Payment': 'https://abp.io/docs/latest/modules/payment'
          },
          'deployment': {
            'Deployment Overview': 'https://abp.io/docs/latest/deployment',
            'Configuring for Production': 'https://abp.io/docs/latest/deployment/configuring-production',
            'Deploying to Clustered Environment': 'https://abp.io/docs/latest/deployment/clustered-environment',
            'Microservice Solutions': 'https://abp.io/docs/latest/deployment/microservices',
            'Optimizing for Production': 'https://abp.io/docs/latest/deployment/optimizing'
          }
        };

        if (category === 'all') {
          return {
            message: 'ABP Framework Documentation Links',
            categories: docs,
            additionalResources: {
              'Community': 'https://abp.io/community',
              'Blog': 'https://blog.abp.io',
              'YouTube Channel': 'https://www.youtube.com/c/Volosoft',
              'Discord': 'https://discord.gg/abp',
              'GitHub': 'https://github.com/abpframework/abp',
              'Stack Overflow': 'https://stackoverflow.com/questions/tagged/abp'
            }
          };
        } else {
          return {
            message: `ABP Framework Documentation - ${category}`,
            links: docs[category as keyof typeof docs] || {},
          };
        }
      },
    } as ToolHandler,

    // Help and Usage Guide
    abp_get_help: {
      name: 'abp_get_help',
      description: 'Get help and usage information for the ABP MCP Server',
      inputSchema: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'Specific help topic',
            enum: ['setup', 'authentication', 'tools', 'examples', 'troubleshooting'],
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { topic } = z.object({
          topic: z.enum(['setup', 'authentication', 'tools', 'examples', 'troubleshooting']).optional(),
        }).parse(args);

        const helpContent = {
          setup: {
            title: 'ABP MCP Server Setup',
            content: [
              '1. Install the server: npm install -g abp-io-mcp-server',
              '2. Start without API key: abp-io-mcp-server --stdio --info-only-mode',
              '3. Start with API key: abp-io-mcp-server --stdio --api-key YOUR_KEY --base-url http://localhost:44300',
              '4. Configure in Claude Desktop or other MCP clients'
            ],
            configExample: {
              'claude_desktop_config.json': {
                'mcpServers': {
                  'abp-io': {
                    'command': 'abp-io-mcp-server',
                    'args': ['--stdio', '--api-key', 'YOUR_API_KEY', '--base-url', 'http://localhost:44300']
                  }
                }
              }
            }
          },
          authentication: {
            title: 'API Authentication',
            content: [
              'ABP applications typically require authentication for API access.',
              'You need to obtain an API key from your ABP application.',
              'For development, you can often use bearer tokens or create API keys in the admin panel.',
              'Use --info-only-mode to access informational tools without authentication.'
            ],
            modes: {
              'Full Mode': 'Requires --api-key, provides access to all tools',
              'Info-Only Mode': 'No API key needed, only informational tools available'
            }
          },
          tools: {
            title: 'Available Tool Categories',
            categories: [
              'Application Management - Create, manage ABP applications',
              'Module Management - Install, configure ABP modules', 
              'Entity Management - CRUD operations for entities',
              'User Management - User and role operations',
              'Tenant Management - Multi-tenancy operations',
              'Permission Management - Security and authorization',
              'Audit Management - Logging and tracking',
              'Background Jobs - Async task management',
              'UI Tools - Theme, layout, component generation',
              'Info Tools - Documentation and guidance (no API key required)'
            ],
            usage: 'Tools follow ABP\'s REST API conventions: /api/app/{controller}/{action}'
          },
          examples: {
            title: 'Common Usage Examples',
            examples: [
              {
                task: 'Get ABP Framework information',
                tool: 'abp_get_info',
                description: 'No API key required, provides framework overview'
              },
              {
                task: 'List all users',
                tool: 'abp_get_users',
                description: 'Requires API key, returns user list with filtering options'
              },
              {
                task: 'Create a new entity',
                tool: 'abp_create_entity',
                description: 'Requires API key, creates new domain entity'
              },
              {
                task: 'Generate CRUD page',
                tool: 'abp_generate_crud',
                description: 'Requires API key, generates complete CRUD UI'
              },
              {
                task: 'Apply UI theme',
                tool: 'abp_apply_theme',
                description: 'Requires API key, applies and customizes themes'
              }
            ]
          },
          troubleshooting: {
            title: 'Common Issues and Solutions',
            issues: [
              {
                problem: 'API key required error',
                solution: 'Either provide --api-key parameter or use --info-only-mode'
              },
              {
                problem: 'Connection timeout',
                solution: 'Check --base-url parameter and ensure ABP application is running'
              },
              {
                problem: 'Permission denied',
                solution: 'Ensure API key has required permissions for the operation'
              },
              {
                problem: 'Tool not found',
                solution: 'Check tool name spelling and available tools with list command'
              },
              {
                problem: 'Invalid parameters',
                solution: 'Review tool schema and ensure all required parameters are provided'
              }
            ]
          }
        };

        if (topic) {
          return helpContent[topic];
        } else {
          return {
            title: 'ABP MCP Server Help',
            description: 'Model Context Protocol server for ABP Framework applications',
            availableTopics: Object.keys(helpContent),
            quickStart: 'Use --info-only-mode to explore without API authentication',
            documentation: 'https://abp.io/docs/latest/',
            support: 'Visit https://abp.io/support for help and support options'
          };
        }
      },
    } as ToolHandler,

    // Available Modules Information
    abp_list_available_modules: {
      name: 'abp_list_available_modules',
      description: 'List all available ABP modules with descriptions and categories',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Filter by module category',
            enum: ['identity', 'cms', 'commerce', 'communication', 'productivity', 'integration', 'all'],
            default: 'all',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { category = 'all' } = z.object({
          category: z.enum(['identity', 'cms', 'commerce', 'communication', 'productivity', 'integration', 'all']).default('all'),
        }).parse(args);

        const modules = {
          identity: [
            { name: 'Volo.Abp.Identity', displayName: 'Identity', description: 'User and role management', category: 'Identity' },
            { name: 'Volo.Abp.Identity.Pro', displayName: 'Identity Pro', description: 'Enhanced user management with features', category: 'Identity' },
            { name: 'Volo.Abp.Account', displayName: 'Account', description: 'Login, register, and account management', category: 'Identity' },
            { name: 'Volo.Abp.Account.Pro', displayName: 'Account Pro', description: 'Advanced account features', category: 'Identity' },
            { name: 'Volo.Abp.PermissionManagement', displayName: 'Permission Management', description: 'Authorization and permissions', category: 'Identity' }
          ],
          cms: [
            { name: 'Volo.CmsKit', displayName: 'CMS Kit', description: 'Content management system features', category: 'CMS' },
            { name: 'Volo.CmsKit.Pro', displayName: 'CMS Kit Pro', description: 'Advanced CMS features', category: 'CMS' },
            { name: 'Volo.Docs', displayName: 'Docs', description: 'Documentation system', category: 'CMS' },
            { name: 'Volo.Blogging', displayName: 'Blogging', description: 'Blog management system', category: 'CMS' }
          ],
          commerce: [
            { name: 'Volo.Payment', displayName: 'Payment', description: 'Payment processing integration', category: 'Commerce' },
            { name: 'Volo.Saas', displayName: 'SaaS', description: 'Multi-tenant SaaS management', category: 'Commerce' }
          ],
          communication: [
            { name: 'Volo.Chat', displayName: 'Chat', description: 'Real-time chat system', category: 'Communication' },
            { name: 'Volo.Abp.EmailSending', displayName: 'Email Sending', description: 'Email delivery system', category: 'Communication' },
            { name: 'Volo.Abp.Sms', displayName: 'SMS Sending', description: 'SMS messaging system', category: 'Communication' }
          ],
          productivity: [
            { name: 'Volo.FileManagement', displayName: 'File Management', description: 'File upload and management', category: 'Productivity' },
            { name: 'Volo.Forms', displayName: 'Forms', description: 'Dynamic form builder', category: 'Productivity' },
            { name: 'Volo.LanguageManagement', displayName: 'Language Management', description: 'Localization management', category: 'Productivity' },
            { name: 'Volo.Abp.AuditLogging', displayName: 'Audit Logging', description: 'Activity tracking and logging', category: 'Productivity' },
            { name: 'Volo.Abp.BackgroundJobs', displayName: 'Background Jobs', description: 'Async task processing', category: 'Productivity' }
          ],
          integration: [
            { name: 'Volo.Abp.AspNetCore.SignalR', displayName: 'SignalR Integration', description: 'Real-time communication', category: 'Integration' },
            { name: 'Volo.Abp.EventBus.RabbitMQ', displayName: 'RabbitMQ Integration', description: 'Message queue integration', category: 'Integration' },
            { name: 'Volo.Abp.EventBus.Kafka', displayName: 'Kafka Integration', description: 'Apache Kafka integration', category: 'Integration' },
            { name: 'Volo.Abp.Caching.Redis', displayName: 'Redis Cache', description: 'Redis caching integration', category: 'Integration' }
          ]
        };

        if (category === 'all') {
          return {
            message: 'All Available ABP Modules',
            totalModules: Object.values(modules).flat().length,
            categories: modules,
            installationNote: 'Use abp_install_module tool to install modules (requires API key)',
            documentation: 'https://abp.io/docs/latest/modules'
          };
        } else {
          return {
            message: `ABP Modules - ${category}`,
            modules: modules[category as keyof typeof modules] || [],
            installationNote: 'Use abp_install_module tool to install modules (requires API key)'
          };
        }
      },
    } as ToolHandler,

    // UI Framework Information
    abp_list_ui_frameworks: {
      name: 'abp_list_ui_frameworks',
      description: 'List supported UI frameworks and their capabilities',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        return {
          message: 'Supported UI Frameworks in ABP',
          frameworks: [
            {
              name: 'Blazor Server',
              description: 'Server-side Blazor with SignalR',
              features: ['Real-time updates', 'C# throughout', 'SEO friendly', 'Rich components'],
              bestFor: ['Enterprise applications', 'Rich interactivity', 'Rapid development'],
              documentation: 'https://abp.io/docs/latest/framework/ui/blazor'
            },
            {
              name: 'Blazor WebAssembly',
              description: 'Client-side Blazor running in browser',
              features: ['Offline capability', 'Rich client experience', 'C# in browser', 'PWA support'],
              bestFor: ['Single Page Applications', 'Rich client apps', 'Offline scenarios'],
              documentation: 'https://abp.io/docs/latest/framework/ui/blazor'
            },
            {
              name: 'Angular',
              description: 'Modern TypeScript/Angular frontend',
              features: ['TypeScript', 'Reactive forms', 'Rich ecosystem', 'Mobile ready'],
              bestFor: ['Modern SPAs', 'Large teams', 'Complex UIs', 'Mobile apps'],
              documentation: 'https://abp.io/docs/latest/framework/ui/angular'
            },
            {
              name: 'MVC / Razor Pages',
              description: 'Traditional server-rendered pages',
              features: ['Server rendering', 'SEO optimized', 'Simple deployment', 'Quick development'],
              bestFor: ['Traditional web apps', 'SEO requirements', 'Simple scenarios'],
              documentation: 'https://abp.io/docs/latest/framework/ui/mvc-razor-pages'
            },
            {
              name: 'React Native',
              description: 'Cross-platform mobile applications',
              features: ['iOS/Android', 'Native performance', 'Code sharing', 'React ecosystem'],
              bestFor: ['Mobile applications', 'Cross-platform', 'Native feel'],
              documentation: 'https://abp.io/docs/latest/framework/ui/react-native'
            },
            {
              name: 'MAUI',
              description: 'Multi-platform App UI for desktop/mobile',
              features: ['Cross-platform', 'Native controls', 'Blazor integration', 'C# throughout'],
              bestFor: ['Desktop apps', 'Multi-platform', 'Blazor developers'],
              documentation: 'https://abp.io/docs/latest/framework/ui/maui'
            }
          ],
          themes: [
            {
              name: 'LeptonX',
              description: 'Modern, professional theme with multiple layouts',
              features: ['Multiple layouts', 'Dark/light mode', 'RTL support', 'Customizable']
            },
            {
              name: 'Basic Theme',
              description: 'Simple, clean theme for basic applications',
              features: ['Bootstrap based', 'Responsive', 'Clean design', 'Easy to customize']
            }
          ],
          selectionGuide: {
            'Choose Blazor': 'For C# developers, rapid development, real-time features',
            'Choose Angular': 'For modern SPAs, TypeScript teams, complex UIs',
            'Choose MVC': 'For traditional web apps, SEO requirements, simple scenarios',
            'Choose React Native': 'For mobile apps with native feel',
            'Choose MAUI': 'For desktop/mobile apps with native controls'
          }
        };
      },
    } as ToolHandler,

    // Database Provider Information
    abp_list_database_providers: {
      name: 'abp_list_database_providers',
      description: 'List supported database providers and their configurations',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async () => {
        return {
          message: 'Supported Database Providers in ABP',
          providers: [
            {
              name: 'Entity Framework Core',
              description: 'Primary ORM for relational databases',
              supportedDatabases: ['SQL Server', 'MySQL', 'PostgreSQL', 'Oracle', 'SQLite'],
              features: ['Code First', 'Migration support', 'LINQ queries', 'Change tracking'],
              packageName: 'Volo.Abp.EntityFrameworkCore',
              documentation: 'https://abp.io/docs/latest/framework/data/entity-framework-core'
            },
            {
              name: 'MongoDB',
              description: 'NoSQL document database provider',
              supportedDatabases: ['MongoDB'],
              features: ['Document-based', 'Flexible schema', 'High performance', 'Horizontal scaling'],
              packageName: 'Volo.Abp.MongoDB',
              documentation: 'https://abp.io/docs/latest/framework/data/mongodb'
            },
            {
              name: 'Dapper',
              description: 'Micro ORM for performance-critical scenarios',
              supportedDatabases: ['SQL Server', 'MySQL', 'PostgreSQL', 'Oracle', 'SQLite'],
              features: ['High performance', 'Lightweight', 'Raw SQL support', 'Multi-mapping'],
              packageName: 'Volo.Abp.Dapper',
              documentation: 'https://abp.io/docs/latest/framework/data/dapper'
            }
          ],
          databaseSpecifics: {
            'SQL Server': {
              connectionString: 'Server=localhost;Database=MyApp;Trusted_Connection=true',
              package: 'Microsoft.EntityFrameworkCore.SqlServer',
              notes: 'Default choice for .NET applications'
            },
            'MySQL': {
              connectionString: 'Server=localhost;Database=MyApp;Uid=root;Pwd=password',
              package: 'Pomelo.EntityFrameworkCore.MySql',
              notes: 'Popular open-source option'
            },
            'PostgreSQL': {
              connectionString: 'Host=localhost;Database=MyApp;Username=postgres;Password=password',
              package: 'Npgsql.EntityFrameworkCore.PostgreSQL',
              notes: 'Advanced open-source database'
            },
            'Oracle': {
              connectionString: 'Data Source=localhost:1521/XE;User Id=hr;Password=password',
              package: 'Oracle.EntityFrameworkCore',
              notes: 'Enterprise database solution'
            },
            'SQLite': {
              connectionString: 'Data Source=MyApp.db',
              package: 'Microsoft.EntityFrameworkCore.Sqlite',
              notes: 'Lightweight, file-based database'
            },
            'MongoDB': {
              connectionString: 'mongodb://localhost:27017/MyApp',
              package: 'Volo.Abp.MongoDB',
              notes: 'NoSQL document database'
            }
          },
          migrationGuide: 'https://abp.io/docs/latest/framework/data/entity-framework-core/switch-dbms'
        };
      },
    } as ToolHandler,

    // CLI Commands Information
    abp_get_cli_commands: {
      name: 'abp_get_cli_commands',
      description: 'Get information about ABP CLI commands and usage',
      inputSchema: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'Specific CLI command to get help for',
            enum: ['new', 'add-package', 'add-module', 'generate-proxy', 'remove-package', 'update', 'all'],
            default: 'all',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { command = 'all' } = z.object({
          command: z.enum(['new', 'add-package', 'add-module', 'generate-proxy', 'remove-package', 'update', 'all']).default('all'),
        }).parse(args);

        const commands = {
          new: {
            description: 'Create a new ABP solution',
            syntax: 'abp new <solution-name> [options]',
            options: [
              '--template (-t): Solution template (app, module, console)',
              '--ui (-u): UI framework (mvc, blazor, angular, react-native)',
              '--mobile (-m): Mobile framework (react-native, maui)',
              '--database-provider (-d): Database provider (ef, mongodb)',
              '--connection-string (-cs): Database connection string',
              '--create-solution-folder: Create solution folder',
              '--output-folder (-o): Output folder'
            ],
            examples: [
              'abp new BookStore',
              'abp new BookStore --template app --ui angular --database-provider ef',
              'abp new BookStore.Module --template module'
            ]
          },
          'add-package': {
            description: 'Add an ABP package to project',
            syntax: 'abp add-package <package-name> [options]',
            options: [
              '--project (-p): Target project file',
              '--with-source-code: Add with source code',
              '--add-to-solution-file: Add to solution file'
            ],
            examples: [
              'abp add-package Volo.Abp.Account',
              'abp add-package Volo.Abp.Identity.Pro --project MyProject.csproj'
            ]
          },
          'add-module': {
            description: 'Add an ABP module to solution',
            syntax: 'abp add-module <module-name> [options]',
            options: [
              '--solution (-s): Solution file',
              '--skip-db-migrations: Skip database migrations',
              '--with-source-code: Add with source code'
            ],
            examples: [
              'abp add-module Volo.Blogging',
              'abp add-module Volo.CmsKit --with-source-code'
            ]
          },
          'generate-proxy': {
            description: 'Generate client proxies for HTTP APIs',
            syntax: 'abp generate-proxy [options]',
            options: [
              '--type (-t): Client type (js, csharp)',
              '--url (-u): API URL',
              '--output (-o): Output folder',
              '--module (-m): Module name'
            ],
            examples: [
              'abp generate-proxy --type js',
              'abp generate-proxy --type csharp --url https://localhost:44300'
            ]
          },
          'remove-package': {
            description: 'Remove an ABP package from project',
            syntax: 'abp remove-package <package-name> [options]',
            options: [
              '--project (-p): Target project file'
            ],
            examples: [
              'abp remove-package Volo.Abp.Account'
            ]
          },
          update: {
            description: 'Update ABP packages',
            syntax: 'abp update [options]',
            options: [
              '--check-all: Check all packages',
              '--npm: Update NPM packages',
              '--solution-path (-sp): Solution path'
            ],
            examples: [
              'abp update',
              'abp update --check-all'
            ]
          }
        };

        if (command === 'all') {
          return {
            message: 'ABP CLI Commands Reference',
            installation: 'dotnet tool install -g Volo.Abp.Cli',
            updateCli: 'dotnet tool update -g Volo.Abp.Cli',
            commands: commands,
            documentation: 'https://abp.io/docs/latest/cli',
            globalOptions: [
              '--help (-h): Show help',
              '--version (-v): Show version',
              '--verbose: Verbose output'
            ]
          };
        } else {
          return {
            command: command,
            ...commands[command as keyof typeof commands]
          };
        }
      },
    } as ToolHandler,

    // Best Practices Guide
    abp_get_best_practices: {
      name: 'abp_get_best_practices',
      description: 'Get ABP development best practices and guidelines',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Best practices category',
            enum: ['architecture', 'performance', 'security', 'testing', 'deployment', 'all'],
            default: 'all',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { category = 'all' } = z.object({
          category: z.enum(['architecture', 'performance', 'security', 'testing', 'deployment', 'all']).default('all'),
        }).parse(args);

        const practices = {
          architecture: {
            title: 'Architecture Best Practices',
            practices: [
              'Follow Domain Driven Design principles',
              'Keep domain layer pure and independent',
              'Use repositories for data access abstraction',
              'Implement domain services for complex business logic',
              'Use application services as orchestrators',
              'Keep DTOs simple and focused',
              'Use value objects for complex types',
              'Implement proper aggregate boundaries',
              'Use domain events for decoupling',
              'Follow SOLID principles'
            ],
            documentation: 'https://abp.io/docs/latest/framework/architecture/domain-driven-design'
          },
          performance: {
            title: 'Performance Best Practices',
            practices: [
              'Use async/await for I/O operations',
              'Implement proper caching strategies',
              'Use IMemoryCache for frequently accessed data',
              'Implement Redis for distributed caching',
              'Use projection queries to select only needed fields',
              'Implement pagination for large datasets',
              'Use background jobs for heavy operations',
              'Optimize database queries and indexes',
              'Use connection pooling',
              'Monitor and profile application performance'
            ],
            tools: ['Redis Cache', 'Background Jobs', 'Performance Counters']
          },
          security: {
            title: 'Security Best Practices',
            practices: [
              'Use ABP authorization system',
              'Implement proper permission checks',
              'Validate all inputs',
              'Use HTTPS in production',
              'Implement proper authentication',
              'Use strong password policies',
              'Enable audit logging',
              'Implement rate limiting',
              'Use CSRF protection',
              'Keep dependencies updated'
            ],
            features: ['Permission Management', 'Audit Logging', 'Input Validation']
          },
          testing: {
            title: 'Testing Best Practices',
            practices: [
              'Write unit tests for domain logic',
              'Use integration tests for application services',
              'Test with in-memory database for speed',
              'Use test doubles/mocks appropriately',
              'Follow AAA pattern (Arrange, Act, Assert)',
              'Test both success and failure scenarios',
              'Use meaningful test names',
              'Keep tests independent',
              'Use test data builders',
              'Test cross-cutting concerns'
            ],
            tools: ['xUnit', 'Moq', 'TestContainer', 'Shouldly']
          },
          deployment: {
            title: 'Deployment Best Practices',
            practices: [
              'Use environment-specific configurations',
              'Implement health checks',
              'Use connection string encryption',
              'Configure proper logging levels',
              'Use Docker for containerization',
              'Implement CI/CD pipelines',
              'Monitor application metrics',
              'Use feature flags for safe deployments',
              'Implement database migration strategies',
              'Plan for scaling and load balancing'
            ],
            tools: ['Docker', 'Kubernetes', 'Azure DevOps', 'GitHub Actions']
          }
        };

        if (category === 'all') {
          return {
            message: 'ABP Framework Best Practices',
            categories: practices,
            additionalResources: {
              'ABP Best Practices Guide': 'https://abp.io/docs/latest/framework/architecture/best-practices',
              'DDD Implementation Guide': 'https://abp.io/books/implementing-domain-driven-design',
              'Module Development Guide': 'https://abp.io/docs/latest/framework/architecture/modularity',
              'Performance Guide': 'https://abp.io/docs/latest/deployment/optimizing'
            }
          };
        } else {
          return practices[category as keyof typeof practices];
        }
      },
    } as ToolHandler,

    // Troubleshooting Guide
    abp_get_troubleshooting_guide: {
      name: 'abp_get_troubleshooting_guide',
      description: 'Get troubleshooting guide for common ABP issues',
      inputSchema: {
        type: 'object',
        properties: {
          issue: {
            type: 'string',
            description: 'Specific issue category',
            enum: ['startup', 'database', 'authentication', 'modules', 'ui', 'deployment', 'all'],
            default: 'all',
          },
        },
        required: [],
      },
      execute: async (args) => {
        const { issue = 'all' } = z.object({
          issue: z.enum(['startup', 'database', 'authentication', 'modules', 'ui', 'deployment', 'all']).default('all'),
        }).parse(args);

        const troubleshooting = {
          startup: {
            title: 'Application Startup Issues',
            problems: [
              {
                problem: 'Application fails to start',
                solutions: [
                  'Check connection strings in appsettings.json',
                  'Ensure database is accessible',
                  'Verify all required packages are installed',
                  'Check for missing dependencies',
                  'Review startup logs for errors'
                ]
              },
              {
                problem: 'Module dependency errors',
                solutions: [
                  'Check module dependencies order',
                  'Verify all modules are properly registered',
                  'Ensure compatible module versions',
                  'Check for circular dependencies'
                ]
              }
            ]
          },
          database: {
            title: 'Database Connection Issues',
            problems: [
              {
                problem: 'Database connection failed',
                solutions: [
                  'Verify connection string format',
                  'Check database server availability',
                  'Ensure database exists',
                  'Verify credentials and permissions',
                  'Check firewall settings'
                ]
              },
              {
                problem: 'Migration issues',
                solutions: [
                  'Run database update command',
                  'Check for pending migrations',
                  'Verify migration history table',
                  'Resolve migration conflicts',
                  'Use --force flag if necessary'
                ]
              }
            ]
          },
          authentication: {
            title: 'Authentication & Authorization Issues',
            problems: [
              {
                problem: 'Login fails',
                solutions: [
                  'Check user credentials',
                  'Verify user is active',
                  'Check password policies',
                  'Review authentication configuration',
                  'Check for account lockout'
                ]
              },
              {
                problem: 'Permission denied errors',
                solutions: [
                  'Verify user has required permissions',
                  'Check role assignments',
                  'Review permission definitions',
                  'Check tenant-specific permissions',
                  'Verify authorization policies'
                ]
              }
            ]
          },
          modules: {
            title: 'Module Integration Issues',
            problems: [
              {
                problem: 'Module installation failed',
                solutions: [
                  'Check module compatibility',
                  'Verify package sources',
                  'Check network connectivity',
                  'Resolve version conflicts',
                  'Use --with-source-code flag'
                ]
              },
              {
                problem: 'Module not working after installation',
                solutions: [
                  'Check module configuration',
                  'Verify database migrations',
                  'Check module dependencies',
                  'Review module permissions',
                  'Restart application'
                ]
              }
            ]
          },
          ui: {
            title: 'UI Framework Issues',
            problems: [
              {
                problem: 'Angular build errors',
                solutions: [
                  'Run npm install',
                  'Check Node.js version compatibility',
                  'Clear npm cache',
                  'Update Angular CLI',
                  'Check TypeScript version'
                ]
              },
              {
                problem: 'Blazor runtime errors',
                solutions: [
                  'Check browser console',
                  'Verify SignalR connection',
                  'Check for JavaScript errors',
                  'Review component lifecycle',
                  'Check for missing dependencies'
                ]
              }
            ]
          },
          deployment: {
            title: 'Deployment Issues',
            problems: [
              {
                problem: 'Production deployment fails',
                solutions: [
                  'Check environment configurations',
                  'Verify database connections',
                  'Check SSL certificate',
                  'Review production settings',
                  'Check dependency versions'
                ]
              },
              {
                problem: 'Performance issues in production',
                solutions: [
                  'Enable production optimizations',
                  'Configure caching properly',
                  'Optimize database queries',
                  'Use CDN for static files',
                  'Monitor application metrics'
                ]
              }
            ]
          }
        };

        if (issue === 'all') {
          return {
            message: 'ABP Framework Troubleshooting Guide',
            categories: troubleshooting,
            generalTips: [
              'Always check logs first (Application, Database, IIS)',
              'Verify all configurations in appsettings.json',
              'Check package versions and compatibility',
              'Use ABP CLI for common operations',
              'Join ABP community for help and support'
            ],
            supportResources: {
              'Documentation': 'https://abp.io/docs/latest/',
              'Community': 'https://abp.io/community',
              'Discord': 'https://discord.gg/abp',
              'Stack Overflow': 'https://stackoverflow.com/questions/tagged/abp',
              'GitHub Issues': 'https://github.com/abpframework/abp/issues'
            }
          };
        } else {
          return troubleshooting[issue as keyof typeof troubleshooting];
        }
      },
    } as ToolHandler,
  };
} 