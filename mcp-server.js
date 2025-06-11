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

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tool_ids: ['weatherTool', 'summarize_email'],
  };
});

const PORT = process.env.PORT || 3000;
new HttpServerTransport({ port: PORT }).attachTo(server);

// Keep alive
setInterval(() => {}, 1 << 30);


import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup static server for /.well-known/ manifest
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestApp = express();
manifestApp.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known')));

manifestApp.listen(3100, () => {
  console.log("Manifest server available at http://localhost:3100/.well-known/tool-manifest.json");
});