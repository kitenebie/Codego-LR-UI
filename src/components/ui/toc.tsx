import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface TocItem {
  id: string
  label: string
}

// ─── Context ─────────────────────────────────────────────────────────────────

const TocContext = React.createContext<{
  items: TocItem[]
  setItems: (items: TocItem[]) => void
}>({ items: [], setItems: () => {} })

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<TocItem[]>([])
  return (
    <TocContext.Provider value={{ items, setItems }}>
      {children}
    </TocContext.Provider>
  )
}

export function useToc() {
  return React.useContext(TocContext)
}

// ─── TableOfContents ─────────────────────────────────────────────────────────

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = React.useState(items[0]?.id ?? "")

  React.useEffect(() => {
    const observers: IntersectionObserver[] = []
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: "-20% 0px -70% 0px" }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [items])

  if (!items.length) return null

  return (
    <div className="space-y-1 px-3 py-2 h-full">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
        On this page
      </p>
      {items.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
            setActive(id)
          }}
          className={cn(
            "block rounded-md px-2 py-1 text-sm transition-colors",
            active === id
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </a>
      ))}
    </div>
  )
}

// ─── DocsLayout ───────────────────────────────────────────────────────────────

/**
 * Wraps a docs page. Registers TOC items into context (consumed by Layout's
 * right sidebar) and renders children full-width.
 */
export function DocsLayout({
  children,
  toc,
}: {
  children: React.ReactNode
  toc: TocItem[]
}) {
  const { setItems } = React.useContext(TocContext)

  React.useEffect(() => {
    setItems(toc)
    return () => setItems([])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-w-0 space-y-12">{children}</div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function Section({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24">
      {children}
    </div>
  )
}
