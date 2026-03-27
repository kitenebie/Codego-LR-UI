import * as React from "react"
import { Plus, GripVertical, MoreHorizontal } from "lucide-react"
import { cn } from "@/src/lib/utils"

export interface KanbanCard {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  tags?: string[]
  assignee?: React.ReactNode
  priority?: "low" | "medium" | "high"
}

export interface KanbanColumn {
  id: string
  title: React.ReactNode
  color?: string
  cards: KanbanCard[]
}

export interface KanbanBoardProps {
  columns: KanbanColumn[]
  onChange?: (columns: KanbanColumn[]) => void
  onAddCard?: (columnId: string) => void
  className?: string
}

const PRIORITY_COLOR = {
  low:    "bg-success/15 text-success",
  medium: "bg-warning/15 text-warning",
  high:   "bg-danger/15 text-danger",
}

export function KanbanBoard({ columns: controlled, onChange, onAddCard, className }: KanbanBoardProps) {
  const [cols, setCols] = React.useState<KanbanColumn[]>(controlled)
  const [dragging, setDragging] = React.useState<{ cardId: string; fromCol: string } | null>(null)
  const [dragOver, setDragOver] = React.useState<string | null>(null)

  React.useEffect(() => { setCols(controlled) }, [controlled])

  function update(next: KanbanColumn[]) {
    setCols(next)
    onChange?.(next)
  }

  function onDragStart(cardId: string, fromCol: string) {
    setDragging({ cardId, fromCol })
  }

  function onDrop(toCol: string) {
    if (!dragging) return
    const { cardId, fromCol } = dragging
    if (fromCol === toCol) { setDragging(null); setDragOver(null); return }

    const next = cols.map((col) => {
      if (col.id === fromCol) return { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
      if (col.id === toCol) {
        const card = cols.find((c) => c.id === fromCol)?.cards.find((c) => c.id === cardId)
        return card ? { ...col, cards: [...col.cards, card] } : col
      }
      return col
    })
    update(next)
    setDragging(null)
    setDragOver(null)
  }

  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
      {cols.map((col) => (
        <div
          key={col.id}
          className={cn(
            "flex flex-col gap-2 min-w-64 w-64 shrink-0 rounded-xl border border-border bg-muted/30 p-3 transition-colors",
            dragOver === col.id && "border-primary/50 bg-primary/5"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(col.id) }}
          onDragLeave={() => setDragOver(null)}
          onDrop={() => onDrop(col.id)}
        >
          {/* Column header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              {col.color && <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: col.color }} />}
              <span className="text-sm font-semibold">{col.title}</span>
              <span className="text-xs text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 leading-none">{col.cards.length}</span>
            </div>
            {onAddCard && (
              <button
                type="button"
                onClick={() => onAddCard(col.id)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2 min-h-8">
            {col.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={() => onDragStart(card.id, col.id)}
                className={cn(
                  "group rounded-lg border border-border glass p-3 cursor-grab active:cursor-grabbing transition-all",
                  dragging?.cardId === card.id && "opacity-40 scale-95"
                )}
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-sm font-medium leading-tight">{card.title}</p>
                    {card.description && (
                      <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{card.description}</p>
                    )}
                    {(card.tags || card.priority || card.assignee) && (
                      <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
                        {card.priority && (
                          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", PRIORITY_COLOR[card.priority])}>
                            {card.priority}
                          </span>
                        )}
                        {card.tags?.map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-muted-foreground">{tag}</span>
                        ))}
                        {card.assignee && <span className="ml-auto">{card.assignee}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
