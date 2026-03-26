# 🌦 WeatherTrax MCP Server

Fast, reliable weather data for Claude and other MCP clients. Get current conditions and multi-day forecasts for any location worldwide.

**Production Server:** [`https://mcp-weathertrax.jaredco.com`](https://mcp-weathertrax.jaredco.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![MCP Protocol](https://img.shields.io/badge/MCP-2025--03--26-blue)](https://modelcontextprotocol.io/)
[![Tests Passing](https://img.shields.io/badge/tests-67%2F67%20passing-brightgreen)]()

---

## 🚀 Features

- **Real-time Weather Data** - Current conditions, temperature, humidity, wind speed, and more
- **Multi-day Forecasts** - Up to 14-day forecasts with detailed daily breakdowns
- **Planning Tool** - Specialized 7-day forecasts for construction, events, and outdoor work
- **Location Flexibility** - City names, ZIP codes, coordinates, or place names
- **Token-Efficient** - Compact JSON responses optimized for LLM usage
- **Production-Ready** - Rate-limited, monitored, and deployed on Railway
- **MCP Compliant** - Full JSON-RPC 2.0 support with proper tool annotations
- **No Authentication** - Public API, no API keys required

---

## 📖 Table of Contents

- [Quick Start](#-quick-start)
- [Usage Examples](#-usage-examples)
- [Tools Available](#-tools-available)
- [API Documentation](#-api-documentation)
- [MCP Integration](#-mcp-integration)
- [Testing](#-testing)
- [Privacy & Support](#-privacy--support)
- [Development](#-development)

---

## ⚡ Quick Start

### Using with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "weathertrax": {
      "url": "https://mcp-weathertrax.jaredco.com"
    }
  }
}
```

### Using with Direct HTTP Calls

```bash
# Check server health
curl https://mcp-weathertrax.jaredco.com/healthz

# Get server manifest
curl https://mcp-weathertrax.jaredco.com/.well-known/mcp/manifest
```

---

## 💡 Usage Examples

### Example 1: Current Weather Query

Get current weather conditions for any location:

**Request:**
```bash
curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherTool \
  -H "Content-Type: application/json" \
  -d '{
    "location": "San Francisco, CA",
    "query_type": "current"
  }'
```

**Response:**
```json
{
  "summary": "It is currently 54°F and Clear in San Francisco.",
  "temp_high": 54,
  "temp_low": 54,
  "condition": "Clear",
  "wind": "5 mph W",
  "feels_like": 54,
  "humidity": 65,
  "uv_index": 0,
  "visibility": 10,
  "pressure": 1013,
  "cloud_cover": 0,
  "units": {
    "temperature": "°F",
    "distance": "miles",
    "speed": "mph",
    "pressure": "mb"
  }
}
```

### Example 2: Multi-Day Forecast

Retrieve a detailed forecast for the next several days:

**Request:**
```bash
curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherTool \
  -H "Content-Type: application/json" \
  -d '{
    "location": "New York",
    "query_type": "multi_day",
    "num_days": 3
  }'
```

**Response:**
```json
{
  "forecast": [
    {
      "date": "2026-03-26",
      "high": 79,
      "low": 42,
      "condition": "Sunny",
      "precip_chance": 0,
      "wind": "18 mph SW",
      "sunrise": "06:49 AM",
      "sunset": "07:15 PM"
    },
    {
      "date": "2026-03-27",
      "high": 59,
      "low": 39,
      "condition": "Moderate rain",
      "precip_chance": 0.88,
      "wind": "19 mph WNW",
      "sunrise": "06:48 AM",
      "sunset": "07:16 PM"
    },
    {
      "date": "2026-03-28",
      "high": 41,
      "low": 28,
      "condition": "Sunny",
      "precip_chance": 0,
      "wind": "17 mph W",
      "sunrise": "06:46 AM",
      "sunset": "07:17 PM"
    }
  ]
}
```

### Example 3: Weather Planning Tool

Get a 7-day forecast optimized for planning outdoor activities, construction work, or events:

**Request:**
```bash
curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherPlanningTool \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Miami, FL",
    "context": "outdoor event planning",
    "timeframe": "next week"
  }'
```

**Response:**
```json
{
  "forecast": [
    {
      "date": "2026-03-26",
      "high": 82,
      "low": 73,
      "condition": "Sunny",
      "precip_chance": 0,
      "wind": "12 mph E",
      "sunrise": "07:18 AM",
      "sunset": "07:35 PM"
    },
    {
      "date": "2026-03-27",
      "high": 77,
      "low": 72,
      "condition": "Partly Cloudy",
      "precip_chance": 0,
      "wind": "12 mph E",
      "sunrise": "07:17 AM",
      "sunset": "07:35 PM"
    }
    // ... 5 more days
  ],
  "provenance": {
    "source": "World Weather Online",
    "generated_at": "2026-03-26T09:18:36.704Z"
  }
}
```

### Example 4: MCP Protocol - JSON-RPC Call

Using the MCP JSON-RPC protocol to call tools:

**Request:**
```bash
curl -X POST https://mcp-weathertrax.jaredco.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "weatherTool",
      "arguments": {
        "location": "London, UK",
        "query_type": "current"
      }
    }
  }'
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "toolUseId": 1,
    "isFinal": true,
    "output": {
      "summary": "It is currently 48°F and Cloudy in London.",
      "temp_high": 48,
      "temp_low": 48,
      "condition": "Cloudy",
      "wind": "10 mph NW",
      "feels_like": 45,
      "humidity": 78,
      "uv_index": 1,
      "visibility": 10,
      "pressure": 1015,
      "cloud_cover": 75
    }
  }
}
```

---

## 🛠 Tools Available

### 1. **weatherTool** (Current & Forecast)

Retrieve real-time weather conditions or multi-day forecasts.

**Input Schema:**
```json
{
  "location": "string (required) - City name, ZIP, or coordinates",
  "query_type": "string (required) - 'current' or 'multi_day'",
  "num_days": "number (optional) - For multi_day, number of days (1-14, default: 3)"
}
```

**Annotations:**
- `readOnlyHint: true` - No destructive operations
- `category: "Information"`
- `requiresConfirmation: false`

### 2. **weatherPlanningTool** (7-Day Planning)

Specialized tool for planning queries including construction scheduling, outdoor work, event planning, or travel preparation.

**Input Schema:**
```json
{
  "location": "string (required) - City name, ZIP, or place name",
  "context": "string (optional) - Planning context (e.g., 'construction', 'outdoor event')",
  "timeframe": "string (optional) - Timeframe hint (e.g., 'next week', 'Thursday')"
}
```

**Annotations:**
- `readOnlyHint: true` - No destructive operations
- `category: "Information"`
- `requiresConfirmation: false`

---

## 📚 API Documentation

### Base URL
```
https://mcp-weathertrax.jaredco.com
```

### Endpoints

#### Health Check
```
GET /healthz
```
Returns server health and version information.

#### MCP Manifest
```
GET /.well-known/mcp/manifest
```
Returns the MCP protocol manifest with tool definitions.

#### Privacy Policy
```
GET /privacy
```
Returns the server's privacy policy.

#### Direct Tool Calls
```
POST /tools/weatherTool
POST /tools/weatherPlanningTool
```
Direct HTTP endpoints for tool execution (no JSON-RPC wrapper).

#### MCP JSON-RPC
```
POST /mcp
POST /
```
Full MCP protocol support via JSON-RPC 2.0.

**Supported Methods:**
- `initialize` - MCP handshake
- `tools/list` - Discover available tools
- `tools/call` - Execute a tool

### Rate Limits

- **120 requests per minute** per IP address
- Rate limit headers included in responses

### Error Handling

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "hint": "Suggestion for fixing the error",
    "retry_after": null
  }
}
```

**Common Error Codes:**
- `INVALID_INPUT` - Missing or invalid parameters
- `INTERNAL_ERROR` - Server error
- `-32601` - Method not found (JSON-RPC)
- `-32602` - Invalid params (JSON-RPC)

---

## 🔗 MCP Integration

### Protocol Compliance

- **MCP Version:** 2025-03-26
- **Transport:** HTTP with streaming support
- **Authentication:** None required (public API)
- **CORS:** Enabled for all origins

### Discovery

Tools are automatically discovered via the manifest endpoint:

```bash
curl https://mcp-weathertrax.jaredco.com/.well-known/mcp/manifest
```

### Integration Examples

- **Claude Desktop** - Add to `claude_desktop_config.json`
- **n8n Workflows** - Use HTTP Request nodes or Langchain Agent
- **Custom Applications** - Standard HTTP/JSON-RPC calls

[See n8n example workflow →](./weathertrax-mcp-demo/README.md)

---

## 🧪 Testing

### Automated Tests

The server includes comprehensive test coverage:

```bash
# Install dependencies
npm install

# Start the server
npm start

# Run quick tests (8 core tests)
npm test

# Run full test suite (67 tests)
npm run test:full
```

**Test Coverage:**
- ✅ Legacy compatibility (n8n integration)
- ✅ MCP JSON-RPC protocol
- ✅ Origin validation
- ✅ Privacy policy & manifest
- ✅ Error handling
- ✅ Health & monitoring

**Latest Results:** 67/67 tests passing ✅

### Manual Testing

```bash
# Test current weather
curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherTool \
  -H "Content-Type: application/json" \
  -d '{"location": "Tokyo", "query_type": "current"}'

# Test forecast
curl -X POST https://mcp-weathertrax.jaredco.com/tools/weatherTool \
  -H "Content-Type: application/json" \
  -d '{"location": "Paris", "query_type": "multi_day", "num_days": 5}'

# Test MCP protocol
curl -X POST https://mcp-weathertrax.jaredco.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

---

## 🔒 Privacy & Support

### Privacy Policy

We take your privacy seriously. Our privacy policy is available at:
- **URL:** https://mcp-weathertrax.jaredco.com/privacy

**Key Points:**
- Request metadata logged for 14 days (for abuse prevention)
- No persistent storage of location queries
- No cookies or tracking
- TLS encryption enforced

### Support

- **GitHub Issues:** https://github.com/jaredco-ai/weather-mcp-server/issues
- **Email:** support@jaredco.com

### Security

- HTTPS/TLS enforced
- Rate limiting active
- Input validation on all parameters
- Regular security updates

---

## 🛠 Development

### Running Locally

```bash
# Clone repository
git clone https://github.com/jaredco-ai/weather-mcp-server.git
cd weather-mcp-server

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your WEATHER_API_KEY to .env

# Start server
npm start
```

Server runs on `http://localhost:3000`

### Environment Variables

```bash
PORT=3000                    # Server port
WEATHER_API_KEY=your_key     # World Weather Online API key
NODE_ENV=production          # Environment
```

### Project Structure

```
weather-mcp-server/
├── mcp-server.js           # Main server
├── tools/
│   ├── weatherTool.js      # Current & forecast tool
│   └── weatherPlanningTool.js  # Planning tool
├── utils/
│   └── logger.js           # Logging utilities
├── test-suite.js           # Comprehensive tests
├── quick-test.js           # Quick smoke tests
└── weathertrax-mcp-demo/   # n8n workflow examples
```

### Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 5
- **MCP SDK:** @modelcontextprotocol/sdk
- **Weather API:** World Weather Online
- **Hosting:** Railway

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- Built on the [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- Weather data provided by [World Weather Online](https://www.worldweatheronline.com/)
- Hosted on [Railway](https://railway.app/)

---

## 📊 Status

- **Server Status:** 🟢 Production
- **Uptime:** Monitored via Railway
- **API Version:** 1.0.0
- **MCP Protocol:** 2025-03-26

**Last Updated:** March 26, 2026

---

Made with ☀️ for Claude and MCP
