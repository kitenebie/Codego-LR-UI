import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "rows" | "cols" | "readOnly" | "minLength" | "maxLength"> {
  rows?: number
  cols?: number
  autosize?: boolean
  readOnly?: boolean
  disableGrammarly?: boolean
  trim?: boolean
  minLength?: number
  maxLength?: number
  length?: number
  label?: string
  required?: boolean
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      rows = 3,
      cols,
      autosize = false,
      readOnly = false,
      disableGrammarly = false,
      trim = false,
      minLength,
      maxLength,
      length,
      label,
      required,
      error,
      onChange,
      onBlur,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? innerRef

    const effectiveMaxLength = length ?? maxLength

    const resize = React.useCallback(() => {
      const el = resolvedRef.current
      if (!el || !autosize) return
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }, [autosize, resolvedRef])

    React.useEffect(() => {
      resize()
    }, [value, resize])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (effectiveMaxLength !== undefined && e.target.value.length > effectiveMaxLength) return
      resize()
      onChange?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (trim) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        )?.set
        nativeInputValueSetter?.call(e.target, e.target.value.trim())
        e.target.dispatchEvent(new Event("input", { bubbles: true }))
      }
      onBlur?.(e)
    }

    const grammarly = disableGrammarly
      ? { "data-gramm": "false", "data-gramm_editor": "false", "data-enable-grammarly": "false" }
      : {}

    return (
      <div className="relative  w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}{required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={resolvedRef}
          rows={rows}
          cols={cols}
          readOnly={readOnly}
          minLength={minLength}
          maxLength={effectiveMaxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          className={cn(
            "w-full rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-background/80   dark:bg-gray-400/5 dark:hover:bg-gray-400/25 dark:focus:bg-gray-400/20",
            readOnly && "cursor-default bg-muted/40 focus-visible:ring-0",
            autosize && "resize-none overflow-hidden",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...grammarly}
          {...props}
        />
        {effectiveMaxLength !== undefined && (
          <span className="absolute bottom-2 right-3 text-xs text-muted-foreground pointer-events-none">
            {String(value ?? "").length}/{effectiveMaxLength}
          </span>
        )}
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
