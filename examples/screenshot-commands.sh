#!/bin/bash
# Screenshot Commands for WeatherTrax MCP Server Submission
# Copy and paste these into your terminal, then take screenshots

echo "=== Screenshot 1: Current Weather Query ==="
echo ""
echo "Command:"
echo "curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherTool -H 'Content-Type: application/json' -d '{\"location\": \"San Francisco, CA\", \"query_type\": \"current\"}' | python3 -m json.tool"
echo ""
echo "Output:"
curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherTool -H 'Content-Type: application/json' -d '{"location": "San Francisco, CA", "query_type": "current"}' 2>/dev/null | python3 -m json.tool

echo ""
echo ""
echo "=== Screenshot 2: Multi-Day Forecast ==="
echo ""
echo "Command:"
echo "curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherTool -H 'Content-Type: application/json' -d '{\"location\": \"New York\", \"query_type\": \"multi_day\", \"num_days\": 3}' | python3 -m json.tool"
echo ""
echo "Output:"
curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherTool -H 'Content-Type: application/json' -d '{"location": "New York", "query_type": "multi_day", "num_days": 3}' 2>/dev/null | python3 -m json.tool

echo ""
echo ""
echo "=== Screenshot 3: Weather Planning Tool ==="
echo ""
echo "Command:"
echo "curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherPlanningTool -H 'Content-Type: application/json' -d '{\"location\": \"Miami, FL\", \"context\": \"outdoor event planning\"}' | python3 -m json.tool"
echo ""
echo "Output:"
curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherPlanningTool -H 'Content-Type: application/json' -d '{"location": "Miami, FL", "context": "outdoor event planning"}' 2>/dev/null | python3 -m json.tool

echo ""
echo ""
echo "=== Screenshot 4: MCP Protocol - JSON-RPC ==="
echo ""
echo "Command:"
echo "curl -X POST https://mcp-weathertrax.jaredco.com/mcp -H 'Content-Type: application/json' -d '{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"tools/call\", \"params\": {\"name\": \"weatherTool\", \"arguments\": {\"location\": \"London, UK\", \"query_type\": \"current\"}}}' | python3 -m json.tool"
echo ""
echo "Output:"
curl -X POST https://mcp-weathertrax.jaredco.com/mcp -H 'Content-Type: application/json' -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "weatherTool", "arguments": {"location": "London, UK", "query_type": "current"}}}' 2>/dev/null | python3 -m json.tool

echo ""
echo ""
echo "=== Screenshot 5: Server Manifest ==="
echo ""
echo "Command:"
echo "curl https://mcp-weathertrax.jaredco.com/.well-known/mcp/manifest | python3 -m json.tool | head -30"
echo ""
echo "Output:"
curl -s https://mcp-weathertrax.jaredco.com/.well-known/mcp/manifest 2>/dev/null | python3 -m json.tool | head -30
