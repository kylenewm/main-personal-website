import { NextResponse } from "next/server";

interface HealthCheckResult {
  name: string;
  status: "pass" | "fail";
  latency_ms: number;
  error?: string;
}

interface DeepHealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: HealthCheckResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}

async function checkOpenAIKey(): Promise<HealthCheckResult> {
  const start = Date.now();
  const name = "openai_api_key";

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        name,
        status: "fail",
        latency_ms: Date.now() - start,
        error: "OPENAI_API_KEY not configured",
      };
    }

    // Lightweight check - just verify the key format
    if (!apiKey.startsWith("sk-")) {
      return {
        name,
        status: "fail",
        latency_ms: Date.now() - start,
        error: "OPENAI_API_KEY has invalid format",
      };
    }

    return {
      name,
      status: "pass",
      latency_ms: Date.now() - start,
    };
  } catch (error) {
    return {
      name,
      status: "fail",
      latency_ms: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkRealtimeSession(): Promise<HealthCheckResult> {
  const start = Date.now();
  const name = "realtime_session";

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        name,
        status: "fail",
        latency_ms: Date.now() - start,
        error: "No API key available",
      };
    }

    // Test creating a realtime session
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "echo",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        name,
        status: "fail",
        latency_ms: Date.now() - start,
        error: `API returned ${response.status}: ${errorText.slice(0, 100)}`,
      };
    }

    return {
      name,
      status: "pass",
      latency_ms: Date.now() - start,
    };
  } catch (error) {
    return {
      name,
      status: "fail",
      latency_ms: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkKnowledgeSearch(): Promise<HealthCheckResult> {
  const start = Date.now();
  const name = "knowledge_search";

  try {
    // Import and test search directly to avoid HTTP overhead
    const { searchByKeywords } = await import("@/lib/embeddings");
    const results = searchByKeywords("current role", "professional");

    if (!results || results.length === 0) {
      return {
        name,
        status: "fail",
        latency_ms: Date.now() - start,
        error: "No results returned for test query",
      };
    }

    return {
      name,
      status: "pass",
      latency_ms: Date.now() - start,
    };
  } catch (error) {
    return {
      name,
      status: "fail",
      latency_ms: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkKnowledgeSegments(): Promise<HealthCheckResult> {
  const start = Date.now();
  const name = "knowledge_segments";

  try {
    const { knowledgeSegments } = await import("@/lib/knowledge-segments");

    if (!knowledgeSegments || knowledgeSegments.length === 0) {
      return {
        name,
        status: "fail",
        latency_ms: Date.now() - start,
        error: "Knowledge segments not loaded",
      };
    }

    return {
      name,
      status: "pass",
      latency_ms: Date.now() - start,
    };
  } catch (error) {
    return {
      name,
      status: "fail",
      latency_ms: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  const checks = await Promise.all([
    checkOpenAIKey(),
    checkRealtimeSession(),
    checkKnowledgeSegments(),
    checkKnowledgeSearch(),
  ]);

  const passed = checks.filter((c) => c.status === "pass").length;
  const failed = checks.filter((c) => c.status === "fail").length;

  let status: DeepHealthResponse["status"] = "healthy";
  if (failed > 0 && passed > 0) {
    status = "degraded";
  } else if (failed === checks.length) {
    status = "unhealthy";
  }

  const response: DeepHealthResponse = {
    status,
    timestamp: new Date().toISOString(),
    checks,
    summary: {
      total: checks.length,
      passed,
      failed,
    },
  };

  // Return 503 if unhealthy, 200 otherwise
  const httpStatus = status === "unhealthy" ? 503 : 200;

  return NextResponse.json(response, { status: httpStatus });
}

