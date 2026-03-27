import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Badge } from "./badge"

export interface TagInputProps {
  value?: string[]
  defaultValue?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  allowDuplicates?: boolean
  disabled?: boolean
  className?: string
  required?: boolean
  error?: string
}

export function TagInput({
  value: controlled,
  defaultValue = [],
  onChange,
  placeholder = "Add tag...",
  maxTags,
  allowDuplicates = false,
  disabled = false,
  className,
  required,
  error,
}: TagInputProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultValue)
  const [input, setInput] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const tags = controlled ?? internal

  function addTag(raw: string) {
    const tag = raw.trim()
    if (!tag) return
    if (!allowDuplicates && tags.includes(tag)) return
    if (maxTags && tags.length >= maxTags) return
    const next = [...tags, tag]
    if (!controlled) setInternal(next)
    onChange?.(next)
    setInput("")
  }

  function removeTag(idx: number) {
    const next = tags.filter((_, i) => i !== idx)
    if (!controlled) setInternal(next)
    onChange?.(next)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(input)
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex flex-wrap gap-1.5 min-h-10 w-full rounded-xl border-2 border-border bg-background px-3 py-2 text-sm transition-colors dark:bg-gray-400/5 dark:focus:bg-gray-100/40",
          "focus-within:ring-2 focus-within:ring-ring focus-within:border-primary",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          error && "border-destructive focus-within:ring-destructive",
          className
        )}
        onClick={() => inputRef.current?.focus()}
        aria-required={required}
        aria-invalid={!!error}
      >
        {tags.map((tag, i) => (
          <Badge key={i} variant="default" size="sm" removable onRemove={() => removeTag(i)}>
            {tag}
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(input)}
          placeholder={tags.length === 0 ? placeholder : ""}
          disabled={disabled || (!!maxTags && tags.length >= maxTags)}
          className="flex-1 min-w-20 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
        />
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
