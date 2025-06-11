import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';

import { weatherTool } from './tools/weatherTool.js';
import { handleSummarizeEmail } from './tools/summarizeTool.js';
import { checkApiKey } from './utils/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const mcpServer = new Server(
  {
    name: 'weather-mcp',
    version: '0.0.1'
  },
  {
    capabilities: {
      tools: {
        weatherTool: {
          description: weatherTool.description,
          inputSchema: weatherTool.inputSchema,
          outputSchema: weatherTool.outputSchema,
          handler: async (input, req) =>
            weatherTool.run(input, req, { checkApiKey })
        },
        summarize_email: {
          description: 'Summarizes an email into one sentence',
          inputSchema: {
            type: 'object',
            properties: {
              emailText: { type: 'string' }
            },
            required: ['emailText']
          },
          outputSchema: {
            type: 'object',
            properties: {
              summary: { type: 'string' }
            },
            required: ['summary']
          },
          handler: handleSummarizeEmail
        }
      }
    }
  }
);

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tool_ids: ['weatherTool', 'summarize_email']
}));

mcpServer.setRequestHandler(CallToolRequestSchema, async ({ tool, parameters }, req) => {
  const selectedTool = mcpServer.capabilities.tools[tool];
  if (!selectedTool) {
    throw new McpError(ErrorCode.NOT_FOUND, `Tool not found: ${tool}`);
  }
  const result = await selectedTool.handler(parameters, req);
  return { output: result };
});

// ✅ Use `.handle()` – it is available
app.post('/', async (req, res) => {
  try {
    const result = await mcpServer.handle(req.body, req); // ✅
    res.json(result);
  } catch (err) {
    console.error('❌ MCP server error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ MCP server running at http://localhost:${PORT}/`);
});