import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import { Server, HttpServerTransport } from './local-sdk/server/index.mjs';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from './local-sdk/types/index.mjs';

import { checkApiKey } from './utils/auth.js';
import { weatherTool } from './tools/weatherTool.js';
import { handleSummarizeEmail } from './tools/summarizeTool.js';

// Setup Express app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Serve /.well-known/tool-manifest.json
app.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known')));

// Create MCP server instance
const mcpServer = new Server(
  {
    name: 'weather-mcp',
    version: '0.0.1',
  },
  {
    capabilities: {
      tools: {
        weatherTool: {
          description: weatherTool.description,
          inputSchema: weatherTool.inputSchema,
          outputSchema: weatherTool.outputSchema,
          handler: (input, request) => weatherTool.run(input, request, { checkApiKey }),
        },
        summarize_email: {
          description: 'Summarizes an email into one sentence',
          inputSchema: {
            type: 'object',
            properties: {
              emailText: { type: 'string' },
            },
            required: ['emailText'],
          },
          outputSchema: {
            type: 'object',
            properties: {
              summary: { type: 'string' },
            },
            required: ['summary'],
          },
          handler: handleSummarizeEmail,
        },
      },
    },
  }
);

// Register ListTools handler
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tool_ids: ['weatherTool', 'summarize_email'],
  };
});

// Use Express adapter to bridge HTTP → MCP
const PORT = process.env.PORT || 3000;
new HttpServerTransport({ port: PORT, expressApp: app }).attachTo(mcpServer);

console.log(`✅ Server running on port ${PORT}`);