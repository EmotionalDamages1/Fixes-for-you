# AI-powered text input with context-aware defaults

This repository now contains a reusable AI text input component and backend generation primitives aligned with issue #12096.

## Backend

- `POST /api/generate-default-text`
- Request body: `{ context_type: string, context: object }`
- Response body: `{ generated_text: string }`
- Prompt templates are selected by `context_type`.
- Model is configured as `gpt-4o-mini`.

Implementation files:

- `src/backend/generate-default-text.ts`
- `src/backend/generate-default-text-route.ts`

## Frontend component

`AITextInput` props:

- `contextType`
- `context`
- `value`
- `onChange`
- `placeholder?`
- `debounceMs?`
- `showAISuggestedIndicator?`

Behavior included:

- Debounced generation (default 500ms)
- Per-context cache
- Loading feedback
- Fallback to normal input if generation fails
- Regenerate action

Implementation file:

- `src/frontend/components/AITextInput.tsx`
