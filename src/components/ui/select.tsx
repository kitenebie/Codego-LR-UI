import * as React from "react"
import { Check, ChevronDown, Search, X, GripVertical } from "lucide-react"
import { cn, getPortalPosition, FloatingPortal } from "@/src/lib/utils"

export type SelectOption = Record<string | number, string>

const SEMANTIC_COLORS: Record<string, string> = {
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SelectOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  placeholder?: string
  searchable?: boolean
  native?: boolean
  label?: string
  loadingMessage?: string
  noSearchResultsMessage?: string
  searchingMessage?: string
  multiple?: boolean
  reorderable?: boolean
  disabled?: boolean
  createOptionForm?: React.ReactNode
  suffixIcon?: React.ReactNode
  suffixIconColor?: "success" | "error" | "warning" | "info" | (string & {})
  required?: boolean
  error?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  native = false,
  label,
  loadingMessage = "Loading...",
  noSearchResultsMessage = "No results found.",
  searchingMessage = "Searching...",
  multiple = false,
  reorderable = false,
  disabled = false,
  createOptionForm,
  suffixIcon,
  suffixIconColor,
  required,
  error,
  className,
  ...props
}: SelectProps) {
  const iconColor = suffixIconColor
    ? (SEMANTIC_COLORS[suffixIconColor] ?? suffixIconColor)
    : undefined
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const triggerRef   = React.useRef<HTMLButtonElement>(null)
  const portalRef    = React.useRef<HTMLDivElement>(null)
  const [dropStyle, setDropStyle] = React.useState<React.CSSProperties>({})

  const getKey   = React.useCallback((opt: SelectOption) => String(Object.keys(opt)[0]), [])
  const getLabel = React.useCallback((opt: SelectOption) => Object.values(opt)[0], [])

  const selectedValues = React.useMemo(() => {
    if (multiple && Array.isArray(value)) return value
    if (typeof value === "string") return [value]
    return []
  }, [value, multiple])

  const selectedOptions = React.useMemo(
    () => options.filter((opt) => selectedValues.includes(getKey(opt))),
    [options, selectedValues, getKey]
  )

  const filteredOptions = searchable
    ? options.filter((opt) => getLabel(opt).toLowerCase().includes(search.toLowerCase()))
    : options

  const openDropdown = () => {
    if (disabled) return
    if (triggerRef.current) {
      const pos = getPortalPosition(triggerRef.current, 260)
      setDropStyle({
        position: "fixed",
        top: pos.placement === "bottom" ? pos.top : undefined,
        bottom: pos.placement === "top" ? window.innerHeight - pos.top : undefined,
        left: pos.left,
        width: pos.width,
        zIndex: 9999,
      })
    }
    setIsOpen(true)
  }

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        containerRef.current?.contains(target) ||
        portalRef.current?.contains(target)
      ) return
      setIsOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue]
      onChange?.(newValues)
    } else {
      onChange?.(optionValue)
      setIsOpen(false)
      setSearch("")
    }
  }

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple) onChange?.(selectedValues.filter((v) => v !== optionValue))
  }

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (!multiple || !reorderable || !Array.isArray(value)) return
    const newValues = [...value]
    const [removed] = newValues.splice(fromIndex, 1)
    newValues.splice(toIndex, 0, removed)
    onChange?.(newValues)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!reorderable) return
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => { if (reorderable) e.preventDefault() }

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    if (!reorderable) return
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"))
    if (fromIndex !== toIndex) handleReorder(fromIndex, toIndex)
  }

  // Native select
  if (native) {
    if (multiple) {
      return (
        <div className={cn("w-full", className)} {...props}>
          {label && <label className="block text-sm font-medium mb-2">{label}{required && <span className="text-destructive ml-1">*</span>}</label>}
          <div className={cn(
            "w-full rounded-xl border border-slate-900/30 bg-background/50 backdrop-blur-sm overflow-hidden ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ",
            disabled && "opacity-50 pointer-events-none",
            error && "border-destructive"
          )}>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1 px-3 pt-2 pb-1 border-b border-slate-900/10">
                {selectedOptions.map((opt) => (
                  <span key={getKey(opt)} className="inline-flex items-center gap-1 rounded-sm bg-primary/15 text-primary px-2 py-0.5 text-xs">
                    {getLabel(opt)}
                    <button type="button" disabled={disabled} onClick={() => onChange?.(selectedValues.filter((v) => v !== getKey(opt)))} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="max-h-48 overflow-y-auto p-1">
              {options.map((option) => {
                const checked = selectedValues.includes(getKey(option))
                return (
                  <label key={getKey(option)} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-primary", checked && "bg-primary/8 text-primary")}>
                    <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors", checked ? "bg-primary border-primary text-primary-foreground" : "border-slate-900/30 bg-background/50")}>
                      {checked && <Check className="h-3 w-3" />}
                    </span>
                    <input type="checkbox" className="sr-only" checked={checked} disabled={disabled}
                      onChange={() => {
                        const newValues = checked ? selectedValues.filter((v) => v !== getKey(option)) : [...selectedValues, getKey(option)]
                        onChange?.(newValues)
                      }}
                    />
                    {getLabel(option)}
                  </label>
                )
              })}
            </div>
          </div>
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
      )
    }
    return (
      <div className={cn("w-full", className)} {...props}>
        {label && <label className="block text-sm font-medium mb-2">{label}{required && <span className="text-destructive ml-1">*</span>}</label>}
        <div className="relative">
          <select value={(value as string) || ""} onChange={(e) => onChange?.(e.target.value)} disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            className={cn("w-full appearance-none rounded-xl border border-slate-900/30 bg-background/50 backdrop-blur-sm px-4 py-2 pr-10 h-10 text-sm text-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus:ring-destructive"
            )}>
            <option value="" disabled>{placeholder}</option>
            {options.map((option) => <option key={getKey(option)} value={getKey(option)}>{getLabel(option)}</option>)}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <ChevronDown className="h-4 w-4 opacity-50" />
          </span>
        </div>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    )
  }

  // Custom select
  return (
    <div className={cn("w-full", className)} {...props}>
      {label && <label className="block text-sm font-medium mb-2">{label}{required && <span className="text-destructive ml-1">*</span>}</label>}
      <div className="relative" ref={containerRef}>
        <button
          ref={triggerRef}
          type="button"
          aria-required={required}
          aria-invalid={!!error}
          className={cn(
            "relative flex w-full items-center min-h-[2.5rem] rounded-xl border border-slate-900/30 bg-background/50 backdrop-blur-sm px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-background/80   dark:border-white/30 dark:bg-gray-400/5 dark:hover:bg-gray-400/50 dark:focus:bg-gray-400/20",
            multiple && selectedValues.length > 0 && "flex-wrap gap-1",
            "pr-10",
            disabled && "cursor-not-allowed opacity-50",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          onClick={() => isOpen ? setIsOpen(false) : openDropdown()}
          disabled={disabled}
        >
          {multiple && selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {selectedOptions.map((option, index) => (
                <span
                  key={getKey(option)}
                  draggable={reorderable}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={cn("inline-flex items-center gap-1 rounded-sm bg-primary/15 text-primary px-2 py-1 text-xs", reorderable && "cursor-move")}
                >
                  {reorderable && <GripVertical className="h-3 w-3 opacity-50" />}
                  {getLabel(option)}
                  <button type="button" onClick={(e) => handleRemove(getKey(option), e)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className={cn("truncate flex-1 text-left", !selectedOptions.length && "text-muted-foreground")}>
              {selectedOptions.length > 0 ? selectedOptions.map((opt) => getLabel(opt)).join(", ") : placeholder}
            </span>
          )}
        </button>

        {!suffixIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <ChevronDown className="h-4 w-4 opacity-50" />
          </span>
        )}
        {suffixIcon && (
          <button type="button" disabled={disabled}
            onClick={() => isOpen ? setIsOpen(false) : openDropdown()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10 disabled:opacity-50"
            style={iconColor ? { color: iconColor } : undefined}>
            {suffixIcon}
          </button>
        )}

        {isOpen && (
          <FloatingPortal>
            <div
              ref={portalRef}
              className="max-h-60 overflow-auto rounded-md border border-white/10 bg-background/80 backdrop-blur-xl text-popover-foreground shadow-lg animate-in fade-in-80"
              style={dropStyle}
            >
              {searchable && (
                <div className="sticky top-0 z-10 flex items-center border-b border-white/10 bg-background/90 px-3 py-2">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                    placeholder={searchingMessage}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setIsSearching(true); setTimeout(() => setIsSearching(false), 300) }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <div className="p-1">
                {isSearching ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">{loadingMessage}</div>
                ) : filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">{search ? noSearchResultsMessage : "No options available."}</div>
                ) : (
                  <>
                    {filteredOptions.map((option) => (
                      <div
                        key={getKey(option)}
                        className={cn(
                          "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-primary/10 hover:text-primary",
                          (multiple ? selectedValues.includes(getKey(option)) : value === getKey(option)) && "bg-primary/80 text-primary-foreground"
                        )}
                        onClick={() => handleSelect(getKey(option))}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          {(multiple ? selectedValues.includes(getKey(option)) : value === getKey(option)) && <Check className="h-4 w-4" />}
                        </span>
                        <span className="truncate">{getLabel(option)}</span>
                      </div>
                    ))}
                    {createOptionForm && (
                      <div className="border-t border-white/10 mt-1 pt-1">{createOptionForm}</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </FloatingPortal>
        )}
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
