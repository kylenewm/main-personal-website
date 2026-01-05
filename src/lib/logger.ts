// Structured logging utility
// Replaces scattered console.logs with consistent, filterable logging

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  sessionId?: string;
  component?: string;
  action?: string;
  [key: string]: unknown;
}

// Generate a simple session ID for tracing
let currentSessionId: string | null = null;

export function generateSessionId(): string {
  currentSessionId = Math.random().toString(36).substring(2, 10);
  return currentSessionId;
}

export function getSessionId(): string | null {
  return currentSessionId;
}

// Check if we're in development mode
const isDev = process.env.NODE_ENV === "development";

// Logging functions
function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString().slice(11, 23);
  const sessionPart = context?.sessionId || currentSessionId || "-";
  const componentPart = context?.component || "-";

  return `[${timestamp}] [${level.toUpperCase()}] [${sessionPart}] [${componentPart}] ${message}`;
}

function log(level: LogLevel, message: string, context?: LogContext): void {
  // In production, only log warn and error
  if (!isDev && level === "debug") return;
  if (!isDev && level === "info") return;

  const formattedMessage = formatMessage(level, message, context);
  const contextData = context ? { ...context } : undefined;

  switch (level) {
    case "debug":
      console.debug(formattedMessage, contextData || "");
      break;
    case "info":
      console.info(formattedMessage, contextData || "");
      break;
    case "warn":
      console.warn(formattedMessage, contextData || "");
      break;
    case "error":
      console.error(formattedMessage, contextData || "");
      break;
  }
}

// Public API
export const logger = {
  debug: (message: string, context?: LogContext) => log("debug", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => log("error", message, context),

  // Convenience methods for common events
  voice: {
    connecting: () => log("info", "Voice connection starting", { component: "voice" }),
    connected: () => log("info", "Voice connection established", { component: "voice" }),
    disconnected: (reason?: string) => log("info", `Voice disconnected: ${reason || "user action"}`, { component: "voice" }),
    error: (error: string) => log("error", `Voice error: ${error}`, { component: "voice" }),
    stateChange: (state: string) => log("debug", `Voice state: ${state}`, { component: "voice" }),
  },

  search: {
    query: (query: string, resultsCount: number) => log("info", `Search: "${query}" → ${resultsCount} results`, { component: "search", query, resultsCount }),
    embeddingsGenerated: (count: number) => log("info", `Embeddings generated: ${count} chunks`, { component: "search" }),
    fallbackToKeywords: () => log("warn", "Falling back to keyword search", { component: "search" }),
  },

  contact: {
    submitted: (hasEmail: boolean, hasPhone: boolean) => log("info", `Contact submitted (email: ${hasEmail}, phone: ${hasPhone})`, { component: "contact" }),
    emailSent: () => log("info", "Contact notification email sent", { component: "contact" }),
    emailFailed: (error: string) => log("error", `Contact email failed: ${error}`, { component: "contact" }),
  },

  api: {
    request: (endpoint: string, method: string) => log("debug", `API ${method} ${endpoint}`, { component: "api" }),
    response: (endpoint: string, status: number) => log("debug", `API response ${status} from ${endpoint}`, { component: "api" }),
    error: (endpoint: string, error: string) => log("error", `API error on ${endpoint}: ${error}`, { component: "api" }),
  },
};

export default logger;
