// mcp-server.js
import { Server, HttpServerTransport } from './local-sdk/server/index.mjs';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from './local-sdk/types/index.mjs';

import dotenv from 'dotenv';
dotenv.config();

import { checkApiKey } from './utils/auth.js';
import { weatherTool } from './tools/weatherTool.js';
import { handleSummarizeEmail } from './tools/summarizeTool.js';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express app to serve the manifest and forward requests
const app = express();

// Serve the tool manifest
app.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known')));

// Start MCP server on the same port
const server = new Server(
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

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tool_ids: ['weatherTool', 'summarize_email'],
  };
});

const PORT = process.env.PORT || 3000;

// Start Express + MCP server
app.listen(PORT, () => {
  console.log(`✅ Server + Manifest available at http://localhost:${PORT}/`);
});

new HttpServerTransport({ port: PORT }).attachTo(server);