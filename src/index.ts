#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { Command } from 'commander';
import { AbpApiClient } from './abp-api-client.js';
import { abpTools } from './tools/index.js';

const program = new Command();

program
  .name('abp-io-mcp-server')
  .description('ABP.IO MCP Server - Interact with ABP applications and services')
  .version('1.3.0')
  .option('--api-key <key>', 'ABP API key for authentication')
  .option('--base-url <url>', 'Base URL for ABP API', 'http://localhost:44300')
  .option('--info-only-mode', 'Enable only informational tools that do not require API authentication')
  .option('--stdio', 'Use stdio transport (for MCP clients)')
  .parse();

const options = program.opts();

async function main() {
  // Initialize API client (even without credentials for tool registration)
  const apiClient = new AbpApiClient({
    baseUrl: options.baseUrl || 'http://localhost:44300',
    apiKey: options.apiKey || '',
  });

  // Create MCP server
  const server = new Server(
    {
      name: 'abp-io-mcp-server',
      version: '1.3.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Initialize tools with API client and filter based on info-only mode
  const allToolHandlers = abpTools(apiClient);
  const toolHandlers = options.infoOnlyMode 
    ? filterInfoOnlyTools(allToolHandlers)
    : allToolHandlers;

  // Register list tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: Object.values(toolHandlers).map((handler): Tool => ({
        name: handler.name,
        description: handler.description,
        inputSchema: handler.inputSchema,
      })),
    };
  });

  // Register call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    const handler = toolHandlers[name];
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }

    // Check for API credentials when tool is actually called (unless in info-only mode)
    if (!options.infoOnlyMode && !options.apiKey) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: ABP.IO API key is required. Please configure --api-key parameter or use --info-only-mode for informational tools only.',
          },
        ],
        isError: true,
      };
    }

    try {
      const result = await handler.execute(args || {});
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Start server FIRST
  if (options.stdio) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    if (options.infoOnlyMode) {
      console.error('ABP.IO MCP Server running in INFO-ONLY mode (no API authentication required)');
      console.error(`Available tools: ${Object.keys(toolHandlers).length} informational tools`);
    } else {
      console.error('ABP.IO MCP Server running on stdio');
      
      // Test API connection AFTER server is running (optional)
      if (options.apiKey) {
        try {
          await apiClient.testConnection();
          console.error(`✓ Connected to ABP API at ${options.baseUrl}`);
        } catch (error) {
          console.error(`⚠ Warning: Could not connect to ABP API at ${options.baseUrl}`);
          console.error(`  Tools are available but will require valid API connection to execute.`);
        }
      } else {
        console.error(`⚠ No API key provided. Tools are available but will require --api-key to execute.`);
        console.error(`  Use --info-only-mode to access informational tools without authentication.`);
      }
    }
  } else {
    console.log('Use --stdio flag to run as MCP server');
    console.log('Use --info-only-mode to enable only informational tools without API authentication');
    process.exit(0);
  }
}

// Filter tools to only include those that don't require API authentication
function filterInfoOnlyTools(allTools: Record<string, any>): Record<string, any> {
  const infoOnlyTools: Record<string, any> = {};
  
  // Include tools that provide static information or documentation
  const infoOnlyToolNames = [
    // Documentation and info tools
    'abp_get_info',
    'abp_get_documentation',
    'abp_get_help',
    'abp_list_available_modules',
    'abp_list_ui_frameworks',
    'abp_list_database_providers',
    'abp_get_cli_commands',
    'abp_get_best_practices',
    'abp_get_troubleshooting_guide',
    // Hybrid UI tools that work with static templates
    'abp_generate_component',
    'abp_get_themes',
    'abp_generate_form',
    'abp_get_ui_examples'
  ];
  
  // Filter existing tools that match info-only criteria
  Object.entries(allTools).forEach(([name, handler]) => {
    if (infoOnlyToolNames.includes(name)) {
      infoOnlyTools[name] = handler;
    }
  });
  
  return infoOnlyTools;
}

// Handle errors
process.on('SIGINT', async () => {
  console.error('\nShutting down ABP.IO MCP Server...');
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 