# ABP.IO MCP Server

A comprehensive Model Context Protocol (MCP) server for ABP.IO that enables AI models to interact with your ABP applications. Provides **48+ tools** for managing modules, entities, users, tenants, UI development, and more.

## What is ABP.IO?

ABP.IO is a comprehensive **open-source web application development framework** for ASP.NET Core that provides:

- **Modern Architecture**: Based on Domain-Driven Design (DDD) and Clean Architecture principles
- **Modular Design**: Pre-built modules for common features (Identity, SaaS, CMS, etc.)
- **Multi-tenancy Support**: Built-in SaaS capabilities
- **Multiple UI Options**: Supports MVC, Angular, Blazor, React Native
- **Development Tools**: ABP Studio, ABP Suite for rapid development
- **Microservice Compatible**: Supports both monolithic and microservice architectures

## Features

This comprehensive MCP server provides **48+ tools** covering all aspects of ABP.IO development, from backend services to complete UI development:

### 🏗️ Application Management
- Create, read, update, delete ABP applications
- Support for different templates (app, microservice, module, console)
- Multiple UI frameworks (MVC, Angular, Blazor, etc.)
- Database provider options (Entity Framework, MongoDB, Dapper)

### 📦 Module Management
- Install and uninstall ABP modules
- Browse popular ABP modules
- Manage module dependencies
- View module information and documentation

### 🗃️ Entity Management
- Create and manage domain entities
- Define entity properties and relationships
- Generate CRUD operations automatically
- Support for DDD patterns (aggregates, value objects)

### 👥 User Management
- Complete user lifecycle management
- Role-based access control
- User filtering and search
- Active/inactive user management

### 🏢 Tenant Management (Multi-tenancy)
- Create and manage tenants for SaaS applications
- Tenant-specific configurations
- Subscription management
- Database separation strategies

### 🔐 Permission Management
- Fine-grained permission system
- Role and user-based permissions
- Permission groups and hierarchies
- Grant/revoke permissions dynamically

### 📋 Audit Logging
- Comprehensive audit trail
- Performance monitoring
- Error tracking and analysis
- Custom audit log reports

### ⚙️ Background Jobs
- Job queue management
- Common ABP background job types
- Job scheduling and monitoring
- Failed job handling

### 🎨 UI Development
- Generate pages (list, detail, create, edit, modal) for multiple frameworks
- Theme management and customization
- Reusable component generation (widgets, modals, partials, directives, pipes)
- Layout management and customization
- Navigation menu management
- Dashboard widget creation and management
- Complex form generation with validation
- Multi-language localization support

## Prerequisites

- Node.js 18 or higher
- Access to an ABP.IO application with API endpoints
- API key or authentication token for your ABP application

## Installation

### Method 1: Using NPX (Recommended)

No installation required! Just use npx to run the latest version:

```bash
npx abp-io-mcp-server --api-key=YOUR_API_KEY --base-url=https://your-abp-app.com --stdio
```

### Method 2: Global Installation

```bash
# Install globally
npm install -g abp-io-mcp-server

# Run the server
abp-io-mcp-server --api-key=YOUR_API_KEY --base-url=https://your-abp-app.com --stdio
```

### Method 3: Local Development

```bash
# Clone the repository
git clone https://github.com/cyrilnoah1/abp-io-mcp.git
cd abp-io-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm run dev -- --api-key=YOUR_API_KEY --base-url=https://your-abp-app.com --stdio
```

## Configuration

### Required Parameters

- `--api-key`: Your ABP application API key
- `--base-url`: Base URL of your ABP application (default: http://localhost:44300)
- `--stdio`: Use stdio transport for MCP clients

### Environment Variables

You can also set configuration using environment variables:

```bash
export ABP_API_KEY=your_api_key_here
export ABP_BASE_URL=https://your-abp-app.com
```

## Usage

### With Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Using NPX (Recommended)
```json
{
  "mcpServers": {
    "abp-io": {
      "command": "npx",
      "args": ["-y", "abp-io-mcp-server", "--api-key=YOUR_API_KEY", "--base-url=https://your-abp-app.com", "--stdio"]
    }
  }
}
```

#### Using Local Installation
```json
{
  "mcpServers": {
    "abp-io": {
      "command": "node",
      "args": ["/path/to/abp-io-mcp/dist/index.js", "--api-key=YOUR_API_KEY", "--base-url=https://your-abp-app.com", "--stdio"]
    }
  }
}
```

### With Other MCP Clients

This server follows the standard MCP protocol and can be used with any MCP-compatible client.

## Available Tools

### Application Tools
- `abp_get_applications` - Get all ABP applications
- `abp_get_application` - Get application by ID
- `abp_create_application` - Create new ABP application
- `abp_update_application` - Update existing application
- `abp_delete_application` - Delete application

### Module Tools
- `abp_get_modules` - Get all ABP modules
- `abp_get_module` - Get module by ID
- `abp_install_module` - Install ABP module
- `abp_uninstall_module` - Uninstall module
- `abp_get_popular_modules` - Get popular ABP modules

### Entity Tools
- `abp_get_entities` - Get all entities
- `abp_get_entity` - Get entity by ID
- `abp_create_entity` - Create new entity
- `abp_generate_crud` - Generate CRUD operations

### User Tools
- `abp_get_users` - Get all users
- `abp_get_user` - Get user by ID
- `abp_create_user` - Create new user
- `abp_update_user` - Update user
- `abp_delete_user` - Delete user

### Tenant Tools
- `abp_get_tenants` - Get all tenants
- `abp_get_tenant` - Get tenant by ID
- `abp_create_tenant` - Create new tenant
- `abp_update_tenant` - Update tenant
- `abp_delete_tenant` - Delete tenant

### Permission Tools
- `abp_get_permissions` - Get permissions
- `abp_get_permissions_by_group` - Get permissions by group
- `abp_grant_permission` - Grant permission
- `abp_revoke_permission` - Revoke permission

### Audit Tools
- `abp_get_audit_logs` - Get audit logs
- `abp_get_audit_log` - Get audit log by ID
- `abp_get_audit_summary` - Get audit statistics

### Background Job Tools
- `abp_get_background_jobs` - Get background jobs
- `abp_get_background_job` - Get job by ID
- `abp_enqueue_background_job` - Enqueue new job
- `abp_delete_background_job` - Delete job
- `abp_get_common_job_types` - Get common job types

### UI Development Tools

#### Page Generation
- `abp_generate_page` - Generate pages (list, detail, create, edit, modal)

#### Theme Management
- `abp_get_themes` - Get all available themes
- `abp_get_theme` - Get specific theme details
- `abp_apply_theme` - Apply and customize themes

#### Component Generation
- `abp_generate_component` - Generate reusable UI components

#### Layout Management
- `abp_get_layouts` - Get all available layouts
- `abp_get_layout` - Get specific layout details
- `abp_update_layout` - Update layout configuration

#### Menu Management
- `abp_get_menus` - Get all application menus
- `abp_get_menu` - Get specific menu details
- `abp_add_menu_item` - Add menu items with icons and permissions
- `abp_remove_menu_item` - Remove menu items

#### Widget Management
- `abp_get_widgets` - Get all dashboard widgets
- `abp_get_widget` - Get specific widget details
- `abp_create_widget` - Create new dashboard widgets
- `abp_update_widget` - Update widget configuration
- `abp_delete_widget` - Delete widgets

#### Form Generation
- `abp_generate_form` - Generate complex forms with validation

#### Localization
- `abp_get_localization_resources` - Get all localization resources
- `abp_get_localization_resource` - Get specific resource by culture
- `abp_update_localization_text` - Update/add localized text
- `abp_get_supported_cultures` - Get all supported languages

## Examples

### Creating a New ABP Application

```typescript
// Create a new microservice application with Angular UI
{
  "name": "my-microservice",
  "displayName": "My Microservice App",
  "template": "microservice",
  "framework": "angular",
  "database": "ef"
}
```

### Installing Popular Modules

```typescript
// Install Identity Pro module
{
  "packageName": "Volo.Abp.Identity.Pro"
}

// Install SaaS module
{
  "packageName": "Volo.Saas"
}
```

### Creating a Domain Entity

```typescript
// Create a Product entity
{
  "name": "Product",
  "namespace": "MyApp.Products",
  "isAuditedEntity": true,
  "isMultiTenant": true,
  "properties": [
    {
      "name": "Name",
      "type": "string",
      "isRequired": true,
      "maxLength": 100
    },
    {
      "name": "Price",
      "type": "decimal",
      "isRequired": true
    },
    {
      "name": "Description",
      "type": "string",
      "isRequired": false,
      "maxLength": 500
    }
  ]
}
```

### Managing Users

```typescript
// Create a new user
{
  "userName": "john.doe",
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "roleNames": ["User", "Manager"]
}
```

### Multi-tenant Operations

```typescript
// Create a new tenant
{
  "name": "acme-corp",
  "isActive": true,
  "editionId": "premium-edition-id"
}
```

### UI Development Examples

#### Generating Pages

```typescript
// Generate a product list page with Angular
{
  "name": "ProductList",
  "type": "list",
  "entityId": "product-entity-id",
  "framework": "angular",
  "includeSearch": true,
  "includePaging": true,
  "includeExport": true,
  "permissions": ["Products.Read"]
}

// Generate a modal for creating products
{
  "name": "CreateProductModal",
  "type": "modal",
  "entityId": "product-entity-id",
  "framework": "blazor",
  "permissions": ["Products.Create"]
}
```

#### Theme Customization

```typescript
// Apply a custom theme with brand colors
{
  "name": "LeptonX",
  "primaryColor": "#1e88e5",
  "secondaryColor": "#ffc107",
  "customCss": ".main-header { background: linear-gradient(45deg, #1e88e5, #1976d2); }"
}
```

#### Creating Widgets

```typescript
// Create a sales chart widget
{
  "name": "sales-chart",
  "displayName": "Monthly Sales Chart",
  "description": "Displays monthly sales data in a line chart",
  "type": "chart",
  "configuration": {
    "chartType": "line",
    "dataSource": "/api/sales/monthly",
    "xAxis": "month",
    "yAxis": "amount"
  },
  "permissions": ["Dashboard.SalesData"],
  "refreshInterval": 300
}
```

#### Adding Menu Items

```typescript
// Add a products menu item with sub-items
{
  "menuName": "main",
  "name": "Products",
  "displayName": "Products",
  "icon": "fa-shopping-cart",
  "order": 10,
  "requiredPermissionName": "Products.Read"
}

// Add sub-menu item
{
  "menuName": "main",
  "name": "ProductList",
  "displayName": "Product List",
  "url": "/products",
  "parentName": "Products",
  "order": 1
}
```

#### Generating Forms

```typescript
// Generate a complex product form
{
  "name": "ProductForm",
  "entityId": "product-entity-id",
  "fields": [
    {
      "name": "name",
      "type": "text",
      "label": "Product Name",
      "required": true,
      "validation": {
        "minLength": 3,
        "maxLength": 100
      }
    },
    {
      "name": "category",
      "type": "select",
      "label": "Category",
      "required": true,
      "options": [
        { "value": "electronics", "label": "Electronics" },
        { "value": "clothing", "label": "Clothing" },
        { "value": "books", "label": "Books" }
      ]
    },
    {
      "name": "price",
      "type": "number",
      "label": "Price",
      "required": true,
      "validation": {
        "min": 0.01,
        "max": 999999.99
      }
    },
    {
      "name": "description",
      "type": "textarea",
      "label": "Description",
      "required": false,
      "validation": {
        "maxLength": 500
      }
    }
  ],
  "layout": "vertical",
  "submitAction": "createProduct",
  "cancelAction": "cancel"
}
```

#### Localization Management

```typescript
// Update localization text for multiple languages
{
  "resourceName": "MyApp",
  "culture": "en",
  "key": "WelcomeMessage",
  "value": "Welcome to our application!"
}

{
  "resourceName": "MyApp",
  "culture": "es",
  "key": "WelcomeMessage",
  "value": "¡Bienvenido a nuestra aplicación!"
}
```

## Getting Your ABP API Key

### Method 1: Through ABP Application Settings
1. Log in to your ABP application as admin
2. Go to Administration → Settings
3. Look for API or Integration settings
4. Generate a new API key

### Method 2: Using IdentityServer4/OpenIddict
If your ABP application uses IdentityServer4 or OpenIddict:

1. Create a new client application
2. Set appropriate scopes and permissions
3. Use client credentials flow to get access token

### Method 3: Custom Implementation
You may need to implement custom API authentication based on your ABP application's configuration.

## Development

```bash
# Install dependencies
npm install

# Build in watch mode
npm run watch

# Run development server
npm run dev -- --api-key=YOUR_KEY --base-url=http://localhost:44300 --stdio

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## Docker Support

### Building Docker Image

```bash
docker build -t abp-io-mcp-server .
```

### Running with Docker

```bash
docker run -it abp-io-mcp-server --api-key=YOUR_API_KEY --base-url=https://your-abp-app.com --stdio
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify your ABP application is running
   - Check the base URL is correct
   - Ensure API key is valid

2. **Permission Denied**
   - Verify API key has sufficient permissions
   - Check user roles and permissions in ABP application

3. **Module Not Found**
   - Ensure the ABP module is available in your application
   - Check module dependencies

4. **Entity Creation Failed**
   - Verify entity name is unique
   - Check property definitions are valid
   - Ensure namespace exists

### Debug Mode

Run with debug logging:

```bash
DEBUG=abp-io-mcp-server* npm run dev -- --api-key=YOUR_KEY --stdio
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Related Projects

- [ABP.IO Framework](https://abp.io/) - The official ABP.IO framework
- [ABP.IO Documentation](https://docs.abp.io/) - Comprehensive documentation
- [Lattice HQ MCP](https://github.com/cyrilnoah1/lattice-hq-mcp) - Reference MCP server implementation

## Support

If you encounter any issues:

1. Check the [GitHub Issues](https://github.com/cyrilnoah1/abp-io-mcp/issues)
2. Create a new issue with details about your problem
3. Include your Node.js version, operating system, and any error messages
4. Provide steps to reproduce the issue

## Changelog

### v1.1.0
- **NEW**: Comprehensive UI Development Tools (16 new tools)
  - Page generation for multiple frameworks (MVC, Angular, Blazor, Blazor Server)
  - Theme management and customization
  - Reusable component generation (widgets, modals, partials, directives, pipes)
  - Layout management and customization
  - Navigation menu management with permissions
  - Dashboard widget creation and management
  - Complex form generation with validation
  - Multi-language localization support
- Enhanced API client with UI development methods
- Updated documentation with UI development examples
- Total tools expanded to 48+

### v1.0.0
- Initial release
- Complete ABP.IO API integration
- Support for all major ABP features (32+ tools)
- Docker support
- Comprehensive documentation 