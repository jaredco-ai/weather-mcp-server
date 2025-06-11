import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import { Server } from './local-sdk/server/index.mjs';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from './local-sdk/types/index.mjs';

import { checkApiKey } from './utils/auth.js';
import { weatherTool } from './tools/weatherTool.js';
import { handleSummarizeEmail } from './tools/summarizeTool.js';

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Serve the tool manifest
app.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known')));

// Parse JSON bodies for incoming requests
app.use(express.json());

// Init MCP server and route requests through Express
const mcpServer = new Server(
  { name: 'weather-mcp', version: '0.0.1' },
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
    }
  }
);

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tool_ids: ['weatherTool', 'summarize_email'],
}));

// Bind Express to MCP
app.post('/', async (req, res) => {
  try {
    const result = await mcpServer.handle(req.body);
    res.json(result);
  } catch (err) {
    console.error('❌ MCP server error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server + Manifest running at http://localhost:${PORT}/`);
});