import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface GlobalSearchInputProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  placeholder?: string
  className?: string
  showClearButton?: boolean
  onClear?: () => void
}

export const GlobalSearchInput = React.forwardRef<HTMLInputElement, GlobalSearchInputProps>(({
  value,
  onChange,
  onFocus,
  placeholder = "Search pages…",
  className,
  showClearButton = true,
  onClear,
}, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Handle both internal ref and forwarded ref
  React.useImperativeHandle(ref, () => inputRef.current!, [])

  const handleClear = () => {
    onChange("")
    onClear?.()
    inputRef.current?.focus()
  }

  return (
    <div className={cn("flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm", className)}>
      <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-foreground text-xs min-w-0"
      />
      {showClearButton && value && (
        <button
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <Search className="h-3 w-3 rotate-45" />
        </button>
      )}
    </div>
  )
})

GlobalSearchInput.displayName = "GlobalSearchInput"