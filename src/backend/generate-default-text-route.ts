import type { Request, Response } from "express";
import {
  generateDefaultText,
  type GenerateDefaultTextRequest,
  type LLMClient,
} from "./generate-default-text";

export function createGenerateDefaultTextHandler(llmClient: LLMClient) {
  return async function generateDefaultTextHandler(req: Request, res: Response) {
    const body = req.body as GenerateDefaultTextRequest;

    if (!body?.context_type || !body?.context) {
      return res.status(400).json({ error: "context_type and context are required" });
    }

    try {
      const response = await generateDefaultText(body, llmClient);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to generate default text",
        details: error instanceof Error ? error.message : "unknown_error",
      });
    }
  };
}
