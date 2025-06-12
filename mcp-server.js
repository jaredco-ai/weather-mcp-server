import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import { weatherTool } from './tools/weatherTool.js';
import { handleSummarizeEmail } from './tools/summarizeTool.js';
import { checkApiKey } from './utils/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('📦 Tool input:', req.body);
  next();
});

// Handle all POST requests to root
app.post('/', async (req, res) => {
  try {
    const body = req.body;
    let toolName;
    let parameters;
    
    // Handle different request formats
    if (body.type === 'call-tool') {
      // Format: {"type": "call-tool", "tool_id": "weatherTool", "input": {...}}
      toolName = body.tool_id;
      parameters = body.input;
    } else if (body.tool) {
      // Format: {"tool": "weatherTool", "parameters": {...}}
      toolName = body.tool;
      parameters = body.parameters;
    } else if (body.method === 'tools/call') {
      // MCP format: {"method": "tools/call", "params": {"name": "weatherTool", "arguments": {...}}}
      toolName = body.params.name;
      parameters = body.params.arguments;
    } else {
      // Direct parameters: {"location": "New York", "query_type": "current"}
      toolName = 'weatherTool'; // default
      parameters = body;
    }
    
    console.log(`🛠 Calling tool: ${toolName} with parameters:`, parameters);
    
    let result;
    
    switch (toolName) {
      case 'weatherTool':
        result = await weatherTool.run(parameters, req, { checkApiKey });
        break;
        
      case 'summarize_email':
        result = await handleSummarizeEmail(parameters, req);
        break;
        
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
    
    console.log('🌦 MCP WeatherTool responded:', result);
    res.json(result);
    
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
        description: 'Provides current weather, forecasts, and timing for rain/sun events based on location and date.',
        parameters: {
          type: 'object',
          properties: {
            location: { type: 'string', description: 'City name or ZIP/postal code' },
            date: { type: 'string', format: 'date', description: 'Target date (YYYY-MM-DD)' },
            query_type: {
              type: 'string',
              enum: ['current', 'forecast', 'multi_day', 'sunrise_sunset', 'rain_check'],
              description: 'The type of weather query to run'
            },
            num_days: { type: 'integer', description: 'Number of days (for multi_day)' }
          },
          required: ['location', 'query_type']
        }
      }
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ MCP server running at http://localhost:${PORT}/`);
});