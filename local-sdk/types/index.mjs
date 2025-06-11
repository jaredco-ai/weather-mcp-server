export const CallToolRequestSchema = 'call_tool';
export const ListToolsRequestSchema = 'list_tools';

export class McpError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export const ErrorCode = {
  UNAUTHORIZED: 'unauthorized',
};
