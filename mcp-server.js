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
      tools: {}
    }
  }
);

// Set up tool handlers
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'weatherTool',
      description: weatherTool.description,
      inputSchema: weatherTool.inputSchema
    },
    {
      name: 'summarize_email',
      description: 'Summarizes an email into one sentence',
      inputSchema: {
        type: 'object',
        properties: {
          emailText: { type: 'string' }
        },
        required: ['emailText']
      }
    }
  ]
}));

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'weatherTool':
      const result = await weatherTool.run(args, request, { checkApiKey });
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      
    case 'summarize_email':
      const summary = await handleSummarizeEmail(args, request);
      return { content: [{ type: 'text', text: JSON.stringify(summary) }] };
      
    default:
      throw new McpError(ErrorCode.METHOD_NOT_FOUND, `Tool not found: ${name}`);
  }
});

// Handle MCP requests
app.post('/', async (req, res) => {
  try {
    const { method, params } = req.body;
    
    if (method === 'tools/list') {
      const response = await mcpServer.request({ method: 'tools/list' }, {});
      res.json(response);
    } else if (method === 'tools/call') {
      const response = await mcpServer.request({ method: 'tools/call', params }, {});
      res.json(response);
    } else {
      res.status(400).json({ error: 'Unsupported method' });
    }
  } catch (err) {
    console.error('❌ MCP server error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Serve tool manifest
app.get('/.well-known/tool-manifest.json', (req, res) => {
  res.json({
    tools: [
      {
        name: 'weatherTool',
        description: weatherTool.description,
        parameters: weatherTool.inputSchema
      },
      {
        name: 'summarize_email',
        description: 'Summarizes an email into one sentence',
        parameters: {
          type: 'object',
          properties: {
            emailText: { type: 'string' }
          },
          required: ['emailText']
        }
      }
    ]
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ MCP server running at http://localhost:${PORT}/`);
});