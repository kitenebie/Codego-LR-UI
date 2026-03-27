import * as React from "react"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "./button"

export interface RepeaterProps<T> {
  items: T[]
  onAdd: () => void
  onRemove: (index: number) => void
  renderItem: (item: T, index: number) => React.ReactNode
  addButtonText?: string
  className?: string
}

export function Repeater<T>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addButtonText = "Add Item",
  className,
}: RepeaterProps<T>) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="group relative flex items-start gap-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
          style={{ animation: "fadeSlideIn 0.2s ease-out" }}
        >
          {/* Drag handle */}
          <div className="mt-1 cursor-grab text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors shrink-0">
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Index badge */}
          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
            {index + 1}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">{renderItem(item, index)}</div>

          {/* Remove button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-0.5 h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all duration-150 p-0"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      ))}

      {/* Add button */}
      <button
        type="button"
        onClick={onAdd}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
          <Plus className="h-3 w-3" />
        </span>
        {addButtonText}
      </button>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
