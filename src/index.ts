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
  .version('1.1.1')
  .option('--api-key <key>', 'ABP API key for authentication')
  .option('--base-url <url>', 'Base URL for ABP API', 'http://localhost:44300')
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
      version: '1.1.1',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Initialize tools with API client (ALWAYS register tools)
  const toolHandlers = abpTools(apiClient);

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

    // Check for API credentials when tool is actually called
    if (!options.apiKey) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: ABP.IO API key is required. Please configure --api-key parameter.',
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
    }
  } else {
    console.log('Use --stdio flag to run as MCP server');
    process.exit(0);
  }
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