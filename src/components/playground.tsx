import * as React from "react";
import { cn } from "@/src/lib/utils";

// 🔥 Syntax highlighting function (FIXED)
function highlightCode(code: string): React.ReactNode {
  if (!code) return null;

  const tokens: { type: string; value: string }[] = [];
  let remaining = code;
  let insideTag = false; // ✅ track if inside < >

  while (remaining.length > 0) {
    let matched = false;

    // =========================
    // 🔹 OPEN TAG <
    // =========================
    if (!matched && remaining.startsWith("<")) {
      insideTag = true;
      tokens.push({ type: "punctuation", value: "<" });
      remaining = remaining.slice(1);
      matched = true;
    }

    // =========================
    // 🔹 CLOSE TAG >
    // =========================
    if (!matched && remaining.startsWith(">")) {
      insideTag = false;
      tokens.push({ type: "punctuation", value: ">" });
      remaining = remaining.slice(1);
      matched = true;
    }

    // =========================
    // 🔹 CLOSING SLASH </
    // =========================
    if (!matched && remaining.startsWith("/")) {
      tokens.push({ type: "punctuation", value: "/" });
      remaining = remaining.slice(1);
      matched = true;
    }

    // =========================
    // 🔵 PROP NAME
    // =========================
    if (!matched && insideTag) {
      const propMatch = remaining.match(/^[a-zA-Z][a-zA-Z0-9]*(?==)/);
      if (propMatch) {
        tokens.push({ type: "prop", value: propMatch[0] });
        remaining = remaining.slice(propMatch[0].length);
        matched = true;
      }
    }
    
    // =========================
    // 🟣 COMPONENT NAME (only inside tag)
    // =========================
    if (!matched && insideTag) {
      const componentMatch = remaining.match(/^[A-Za-z][A-Za-z0-9]*/);
      if (componentMatch) {
        tokens.push({ type: "component", value: componentMatch[0] });
        remaining = remaining.slice(componentMatch[0].length);
        matched = true;
      }
    }


    // =========================
    // ⚙️ EQUALS =
    // =========================
    if (!matched && remaining.startsWith("=")) {
      tokens.push({ type: "punctuation", value: "=" });
      remaining = remaining.slice(1);
      matched = true;
    }

    // =========================
    // 🟢 STRING
    // =========================
    if (!matched) {
      const stringMatch = remaining.match(/^"[^"]*"|^'[^']*'/);
      if (stringMatch) {
        tokens.push({ type: "string", value: stringMatch[0] });
        remaining = remaining.slice(stringMatch[0].length);
        matched = true;
      }
    }

    // =========================
    // 🟠 NUMBER
    // =========================
    if (!matched) {
      const numberMatch = remaining.match(/^[0-9]+(\.[0-9]+)?/);
      if (numberMatch) {
        tokens.push({ type: "number", value: numberMatch[0] });
        remaining = remaining.slice(numberMatch[0].length);
        matched = true;
      }
    }

    // =========================
    // 🔴 KEYWORDS
    // =========================
    if (!matched) {
      const keywordMatch = remaining.match(/^(true|false|null|undefined)/);
      if (keywordMatch) {
        tokens.push({ type: "keyword", value: keywordMatch[0] });
        remaining = remaining.slice(keywordMatch[0].length);
        matched = true;
      }
    }

    // =========================
    // 🟡 JSX EXPRESSION { }
    // =========================
    if (!matched) {
      const exprMatch = remaining.match(/^\{[^}]*\}/);
      if (exprMatch) {
        tokens.push({ type: "expression", value: exprMatch[0] });
        remaining = remaining.slice(exprMatch[0].length);
        matched = true;
      }
    }

    // =========================
    // ⚪ TEXT CONTENT (outside tag)
    // =========================
    if (!matched && !insideTag) {
      const textMatch = remaining.match(/^[^<>{}\n]+/);
      if (textMatch) {
        tokens.push({ type: "text", value: textMatch[0] });
        remaining = remaining.slice(textMatch[0].length);
        matched = true;
      }
    }

    // =========================
    // ⚙️ FALLBACK
    // =========================
    if (!matched) {
      tokens.push({ type: "punctuation", value: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  // =========================
  // 🎨 COLOR MAP
  // =========================
  const colorMap: Record<string, React.CSSProperties> = {
    component: { color: "#f97316", fontWeight: "bold" }, // orange
    prop: { color: "#3b82f6" }, // blue
    string: { color: "#22c55e" }, // green
    number: { color: "#f59e0b" }, // amber
    keyword: { color: "#ef4444", fontWeight: "bold" }, // red
    expression: { color: "#eab308" }, // yellow
    text: { color: "#e5e7eb" }, // light gray
    punctuation: { color: "#9ca3af" }, // gray
  };

  return tokens.map((token, index) => (
    <span key={index} style={colorMap[token.type] || colorMap.text}>
      {token.value}
    </span>
  ));
}

// =========================
// 🧩 PLAYGROUND COMPONENT
// =========================
export function Playground({
  title,
  description,
  children,
  code,
  fullBleed = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  code?: string;
  fullBleed?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gradient">
          {title}
        </h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <div className="rounded-xl glass text-card-foreground shadow-lg overflow-hidden">
        {/* Preview */}
        <div className={fullBleed
          ? "w-full bg-card/50"
          : "flex min-h-[350px] w-full items-center justify-center p-10 bg-card/50"
        }>
          {children}
        </div>

        {/* Code */}
        {code && (
          <div className="border-t border-white/5 p-4">
            <pre className="overflow-x-auto text-sm font-mono bg-neutral-900 p-4 rounded-lg leading-relaxed">
              <code>{highlightCode(code)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
