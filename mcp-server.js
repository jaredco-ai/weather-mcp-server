import express from 'express';
import { weatherTool } from './tools/weatherTool.js';

const app = express();
app.use(express.json());

// Handle both MCP protocol and direct HTTP requests
app.post('/', async (req, res) => {
  try {
    console.log('📦 Request received:', req.body);
    
    const body = req.body;
    
    // Check if this is an MCP protocol message
    if (body.jsonrpc === '2.0' && body.method) {
      console.log('🔌 MCP Protocol message detected');
      
      switch (body.method) {
        case 'initialize':
          res.json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              protocolVersion: '2025-03-26',
              capabilities: {
                tools: { listChanged: false },
              },
              serverInfo: {
                name: 'weather-mcp-server',
                version: '1.0.0',
              },
            },
          });
          return;
          
        case 'tools/list':
          res.json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              tools: [
                {
                  name: 'weatherTool',
                  description: weatherTool.description,
                  inputSchema: weatherTool.inputSchema,
                  outputSchema: weatherTool.outputSchema
                },
              ],
            },
          });
          return;
          
        case 'tools/call':
          try {
            const toolName = body.params.tool || body.params.name; // ✅ handles both formats
            if (toolName !== 'weatherTool') {
              throw new Error(`Tool not found: ${toolName}`);
            }
            
            const result = await weatherTool.run(body.params.arguments);
            res.json({
              jsonrpc: '2.0',
              id: body.id,
              result: {
                toolUseId: body.id,
                isFinal: true,
                output: result
              }
            });
          } catch (error) {
            res.json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32603,
                message: error.message,
              },
            });
          }
          return;
          
        default:
          res.status(400).json({
            jsonrpc: '2.0',
            id: body.id,
            error: {
              code: -32601,
              message: `Method not found: ${body.method}`,
            },
          });
          return;
      }
    }
    
    // Handle direct tool calls (for n8n)
    console.log('🌐 Direct HTTP request detected');
    
    let parameters;
    if (body.location || body.query_type) {
      // Direct parameters: {"location": "NYC", "query_type": "current"}
      parameters = body;
    } else if (body.tool === 'weatherTool' || body.tool_id === 'weatherTool') {
      // Tool wrapper: {"tool": "weatherTool", "parameters": {...}}
      parameters = body.parameters || body.input;
    } else if (body.type === 'call-tool') {
      // Test script format: {"type": "call-tool", "tool_id": "weatherTool", "input": {...}}
      parameters = body.input;
    } else {
      throw new Error(`Invalid request format. Expected MCP protocol or direct tool call.`);
    }
    
    const result = await weatherTool.run(parameters);
    console.log('🌦 Weather result:', result);
    res.json(result);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: error.message,
      type: 'server_error'
    });
  }
});

// Serve tool manifest
app.get('/.well-known/tool-manifest.json', (req, res) => {
  res.json({
    tools: [
      {
        name: 'weatherTool',
        description: weatherTool.description,
        parameters: weatherTool.inputSchema,
      },
    ],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ MCP server running at http://localhost:${PORT}/`);
  console.log(`🔌 Supports both MCP protocol and direct HTTP calls`);
});