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
  .version('1.0.0')
  .option('--api-key <key>', 'ABP API key for authentication')
  .option('--base-url <url>', 'Base URL for ABP API', 'http://localhost:44300')
  .option('--stdio', 'Use stdio transport (for MCP clients)')
  .parse();

const options = program.opts();

async function main() {
  // Validate required options
  if (!options.apiKey) {
    console.error('Error: --api-key is required');
    process.exit(1);
  }

  // Initialize API client
  const apiClient = new AbpApiClient({
    baseUrl: options.baseUrl,
    apiKey: options.apiKey,
  });

  // Test API connection
  try {
    await apiClient.testConnection();
    console.error(`Connected to ABP API at ${options.baseUrl}`);
  } catch (error) {
    console.error(`Failed to connect to ABP API: ${error}`);
    process.exit(1);
  }

  // Create MCP server
  const server = new Server(
    {
      name: 'abp-io-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Initialize tools with API client
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

  // Start server
  if (options.stdio) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('ABP.IO MCP Server running on stdio');
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