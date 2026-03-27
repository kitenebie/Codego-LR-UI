import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/src/lib/utils"

export interface ContextMenuItem {
  label?: React.ReactNode
  icon?: React.ReactNode
  shortcut?: string
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
  separator?: boolean
  children?: ContextMenuItem[]
}

export interface ContextMenuProps {
  items: ContextMenuItem[]
  children: React.ReactNode
  className?: string
}

interface MenuListProps {
  items: ContextMenuItem[]
  onClose: () => void
}

function MenuList({ items, onClose }: MenuListProps) {
  const [subOpen, setSubOpen] = React.useState<number | null>(null)

  return (
    <div className="py-1">
      {items.map((item, i) => {
        if (item.separator) return <div key={i} className="my-1 h-px bg-border" />
        return (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => item.children && setSubOpen(i)}
            onMouseLeave={() => item.children && setSubOpen(null)}
          >
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => { if (!item.children) { item.onClick?.(); onClose() } }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                item.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
                item.danger
                  ? "text-danger hover:bg-danger/10"
                  : "text-foreground hover:bg-accent"
              )}
            >
              {item.icon && <span className="shrink-0 text-muted-foreground">{item.icon}</span>}
              <span className="flex-1 text-left">{item.label}</span>
              {item.shortcut && <span className="text-xs text-muted-foreground">{item.shortcut}</span>}
              {item.children && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>
            {item.children && subOpen === i && (
              <div className="absolute left-full top-0 ml-1 min-w-40 rounded-xl border border-border glass shadow-2xl z-50 p-1">
                <MenuList items={item.children} onClose={onClose} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null)
  const ref = React.useRef<HTMLDivElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault()
    setPos({ x: e.clientX, y: e.clientY })
  }

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setPos(null)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} onContextMenu={handleContextMenu} className={cn("relative", className)}>
      {children}
      {pos && (
        <div
          ref={menuRef}
          className="fixed z-[200] min-w-44 rounded-xl border border-border glass shadow-2xl p-1"
          style={{ left: pos.x, top: pos.y }}
        >
          <MenuList items={items} onClose={() => setPos(null)} />
        </div>
      )}
    </div>
  )
}
