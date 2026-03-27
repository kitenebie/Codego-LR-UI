import * as React from "react"
import { Search, Command, ArrowUp, ArrowDown, CornerDownLeft, Clock } from "lucide-react"
import { cn } from "@/src/lib/utils"

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string
  group?: string
  onSelect: () => void
  keywords?: string[]
}

export interface CommandPaletteProps {
  items: CommandItem[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  maxRecent?: number
  className?: string
}

export function CommandPalette({
  items,
  open: controlled,
  onOpenChange,
  placeholder = "Search commands...",
  maxRecent = 5,
  className,
}: CommandPaletteProps) {
  const [internal, setInternal] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [cursor, setCursor] = React.useState(0)
  const [recent, setRecent] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const open = controlled ?? internal

  function setOpen(v: boolean) {
    if (controlled === undefined) setInternal(v)
    onOpenChange?.(v)
    if (!v) setQuery("")
  }

  // Cmd+K / Ctrl+K
  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(!open)
      }
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  function score(item: CommandItem, q: string): number {
    if (!q) return 1
    const haystack = [item.label, item.description, ...(item.keywords ?? [])].join(" ").toLowerCase()
    const needle = q.toLowerCase()
    if (haystack.startsWith(needle)) return 3
    if (haystack.includes(needle)) return 2
    const words = needle.split(" ")
    if (words.every((w) => haystack.includes(w))) return 1
    return 0
  }

  const filtered = items
    .map((item) => ({ item, s: score(item, query) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .map(({ item }) => item)

  const recentItems = !query
    ? recent.map((id) => items.find((i) => i.id === id)).filter(Boolean) as CommandItem[]
    : []

  const displayed = query ? filtered : [...recentItems, ...items.filter((i) => !recent.includes(i.id))]

  const groups = Array.from(new Set(displayed.map((i) => i.group ?? ""))).filter(Boolean)
  const ungrouped = displayed.filter((i) => !i.group)

  const flat = [
    ...recentItems,
    ...groups.flatMap((g) => displayed.filter((i) => i.group === g)),
    ...ungrouped.filter((i) => !recentItems.includes(i)),
  ]

  function select(item: CommandItem) {
    item.onSelect()
    setRecent((prev) => [item.id, ...prev.filter((id) => id !== item.id)].slice(0, maxRecent))
    setOpen(false)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, flat.length - 1)) }
    if (e.key === "ArrowUp")   { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
    if (e.key === "Enter" && flat[cursor]) select(flat[cursor])
  }

  if (!open) return null

  function renderItem(item: CommandItem, idx: number, isRecent = false) {
    const active = cursor === idx
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => select(item)}
        onMouseEnter={() => setCursor(idx)}
        className={cn(
          "flex w-full items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left",
          active ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground"
        )}
      >
        <span className={cn("shrink-0", active ? "text-primary" : "text-muted-foreground")}>
          {isRecent ? <Clock className="h-4 w-4" /> : item.icon ?? <Command className="h-4 w-4" />}
        </span>
        <span className="flex-1 min-w-0">
          <span className="font-medium">{item.label}</span>
          {item.description && <span className="ml-2 text-xs text-muted-foreground">{item.description}</span>}
        </span>
        {item.shortcut && (
          <span className="shrink-0 flex items-center gap-0.5">
            {item.shortcut.split("+").map((k, i) => (
              <kbd key={i} className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-muted">{k}</kbd>
            ))}
          </span>
        )}
      </button>
    )
  }

  let idx = 0

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className={cn("relative w-full max-w-lg rounded-2xl border border-border glass shadow-2xl overflow-hidden", className)}>
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCursor(0) }}
            onKeyDown={handleKey}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="shrink-0 px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-muted text-muted-foreground">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {recentItems.length > 0 && !query && (
            <div>
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</p>
              {recentItems.map((item) => renderItem(item, idx++, true))}
            </div>
          )}
          {groups.map((group) => {
            const groupItems = displayed.filter((i) => i.group === group && !recentItems.includes(i))
            if (!groupItems.length) return null
            return (
              <div key={group}>
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
                {groupItems.map((item) => renderItem(item, idx++))}
              </div>
            )
          })}
          {ungrouped.filter((i) => !recentItems.includes(i)).map((item) => renderItem(item, idx++))}
          {flat.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">No results for "{query}"</p>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" /><ArrowDown className="h-3 w-3" /> navigate</span>
          <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> select</span>
          <span className="flex items-center gap-1"><kbd className="font-mono">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
