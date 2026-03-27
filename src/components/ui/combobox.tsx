import * as React from "react"
import { Check, ChevronDown, X, Search, Plus } from "lucide-react"
import { cn, getPortalPosition, FloatingPortal } from "@/src/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
  group?: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string | string[]
  defaultValue?: string | string[]
  onChange?: (value: string | string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  multiple?: boolean
  creatable?: boolean
  clearable?: boolean
  disabled?: boolean
  maxHeight?: string
  className?: string
  required?: boolean
  error?: string
}

export function Combobox({
  options,
  value: controlled,
  defaultValue,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  multiple = false,
  creatable = false,
  clearable = true,
  disabled = false,
  maxHeight = "240px",
  className,
  required,
  error,
}: ComboboxProps) {
  const init = defaultValue ?? (multiple ? [] : "")
  const [internal, setInternal] = React.useState<string | string[]>(init)
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const ref = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dropStyle, setDropStyle] = React.useState<React.CSSProperties>({})

  const selected = controlled ?? internal

  function update(val: string | string[]) {
    if (!controlled) setInternal(val)
    onChange?.(val)
  }

  function toggle(val: string) {
    if (multiple) {
      const arr = selected as string[]
      const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
      update(next)
    } else {
      update(val)
      setOpen(false)
      setQuery("")
    }
  }

  function isSelected(val: string) {
    return multiple ? (selected as string[]).includes(val) : selected === val
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    update(multiple ? [] : "")
  }

  const openDropdown = () => {
    if (triggerRef.current) {
      const pos = getPortalPosition(triggerRef.current, 300)
      setDropStyle({
        position: "fixed",
        top: pos.placement === "bottom" ? pos.top : undefined,
        bottom: pos.placement === "top" ? window.innerHeight - pos.top : undefined,
        left: pos.left,
        width: pos.width,
        zIndex: 9999,
      })
    }
    setOpen(true)
  }

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
  const groups = Array.from(new Set(filtered.map((o) => o.group ?? ""))).filter(Boolean)
  const ungrouped = filtered.filter((o) => !o.group)
  const showCreate = creatable && query && !options.find((o) => o.label.toLowerCase() === query.toLowerCase())
  const hasValue = multiple ? (selected as string[]).length > 0 : !!selected

  function renderOptions(opts: ComboboxOption[]) {
    return opts.map((opt) => (
      <button
        key={opt.value}
        type="button"
        disabled={opt.disabled}
        onClick={() => toggle(opt.value)}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left",
          opt.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
          isSelected(opt.value) ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground"
        )}
      >
        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
        <span className="flex-1 truncate">{opt.label}</span>
        {opt.description && <span className="text-xs text-muted-foreground truncate">{opt.description}</span>}
        {isSelected(opt.value) && <Check className="h-3.5 w-3.5 shrink-0" />}
      </button>
    ))
  }

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => open ? setOpen(false) : openDropdown()}
        aria-required={required}
        aria-invalid={!!error}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border-2 border-border bg-background px-3 py-2 text-sm transition-colors dark:bg-gray-400/5 dark:hover:bg-gray-400/25 dark:focus:bg-gray-400/20",
          "hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring",
          open && "border-primary ring-2 ring-ring",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          error && "border-destructive focus:ring-destructive"
        )}
      >
        <span className={cn("flex-1 truncate text-left", !hasValue && "text-muted-foreground")}>
          {multiple
            ? (selected as string[]).length > 0 ? `${(selected as string[]).length} selected` : placeholder
            : options.find((o) => o.value === selected)?.label || placeholder}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {clearable && hasValue && (
            <span onClick={clear} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </span>
      </button>

      {open && (
        <FloatingPortal>
          <div
            className="rounded-xl border border-border glass shadow-2xl overflow-hidden"
            style={dropStyle}
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="overflow-y-auto p-1" style={{ maxHeight }}>
              {showCreate && (
                <button type="button" onClick={() => { toggle(query); setQuery("") }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent text-primary">
                  <Plus className="h-3.5 w-3.5" />
                  Create "{query}"
                </button>
              )}
              {groups.map((group) => (
                <div key={group}>
                  <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
                  {renderOptions(filtered.filter((o) => o.group === group))}
                </div>
              ))}
              {renderOptions(ungrouped)}
              {filtered.length === 0 && !showCreate && (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">No results</p>
              )}
            </div>
            {multiple && (selected as string[]).length > 0 && (
              <div className="border-t border-border px-3 py-2 flex flex-wrap gap-1">
                {(selected as string[]).map((v) => (
                  <span key={v} className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary text-xs px-2 py-0.5">
                    {options.find((o) => o.value === v)?.label ?? v}
                    <button type="button" onClick={() => toggle(v)} className="opacity-60 hover:opacity-100">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </FloatingPortal>
      )}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
