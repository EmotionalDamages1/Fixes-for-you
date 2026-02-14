export type ContextType = "output_name" | "schedule_name" | "block_name" | "agent_name";

export interface GenerateDefaultTextRequest {
  context_type: ContextType;
  context: Record<string, unknown>;
}

export interface GenerateDefaultTextResponse {
  generated_text: string;
}

export interface LLMClient {
  complete(input: { model: string; prompt: string }): Promise<string>;
}

const PROMPT_TEMPLATES: Record<ContextType, string> = {
  output_name:
    "Generate a short descriptive output name from this graph context. Return only the name.",
  schedule_name:
    "Generate a concise schedule name from this schedule context (time and frequency). Return only the name.",
  block_name:
    "Generate a concise block label from this block/graph context. Return only the label.",
  agent_name:
    "Generate a concise agent name from this agent description/context. Return only the name.",
};

export function buildPrompt(request: GenerateDefaultTextRequest): string {
  const template = PROMPT_TEMPLATES[request.context_type];
  if (!template) {
    throw new Error(`Unsupported context type: ${request.context_type}`);
  }

  return [template, "", "Context:", JSON.stringify(request.context, null, 2)].join("\n");
}

export async function generateDefaultText(
  request: GenerateDefaultTextRequest,
  llmClient: LLMClient,
): Promise<GenerateDefaultTextResponse> {
  const prompt = buildPrompt(request);
  const generatedText = await llmClient.complete({
    model: "gpt-4o-mini",
    prompt,
  });

  return {
    generated_text: sanitizeGeneratedText(generatedText),
  };
}

export function sanitizeGeneratedText(value: string): string {
  return value.replace(/^"|"$/g, "").trim().slice(0, 120);
}
