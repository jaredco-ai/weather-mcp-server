// utils/auth.js
import { McpError, ErrorCode } from '../local-sdk/types/index.mjs';
import fs from 'fs';

// Load and cache API keys
const apiKeys = JSON.parse(fs.readFileSync('./api-keys.json', 'utf-8'));

export function checkApiKey(headers) {
  const key = headers['x-api-key'];
  if (!key || !apiKeys.includes(key)) {
    throw new McpError(ErrorCode.UNAUTHORIZED, 'Invalid or missing API key');
  }
}
