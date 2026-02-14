import { useEffect, useMemo, useState } from "react";
import { ContextCache } from "../../shared/context-cache";

type ContextType = "output_name" | "schedule_name" | "block_name" | "agent_name";

interface AITextInputProps {
  contextType: ContextType;
  context: Record<string, unknown>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  showAISuggestedIndicator?: boolean;
}

const suggestionCache = new ContextCache<string>();

export function AITextInput({
  contextType,
  context,
  value,
  onChange,
  placeholder = "Enter name or let AI suggest...",
  debounceMs = 500,
  showAISuggestedIndicator = true,
}: AITextInputProps) {
  const [loading, setLoading] = useState(false);
  const [suggestedValue, setSuggestedValue] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const contextKey = useMemo(() => ({ contextType, context }), [contextType, context]);

  useEffect(() => {
    const cached = suggestionCache.get(contextKey);
    if (cached) {
      setSuggestedValue(cached);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/generate-default-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context_type: contextType,
            context,
          }),
        });

        if (!response.ok) {
          throw new Error("generation_failed");
        }

        const json = (await response.json()) as { generated_text: string };
        suggestionCache.set(contextKey, json.generated_text);
        setSuggestedValue(json.generated_text);
      } catch {
        setSuggestedValue("");
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [contextKey, contextType, context, debounceMs, refreshKey]);

  const shownValue = value || suggestedValue;

  return (
    <label style={{ display: "grid", gap: 6 }}>
      <input
        value={shownValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#666" }}>
        {loading ? <span>Generating suggestion…</span> : null}
        {!loading && suggestedValue && showAISuggestedIndicator ? <span>AI suggested</span> : null}
        {suggestedValue ? (
          <button type="button" onClick={() => { suggestionCache.set(contextKey, ""); setSuggestedValue(""); setRefreshKey((value) => value + 1); }}>
            Regenerate
          </button>
        ) : null}
      </div>
    </label>
  );
}
