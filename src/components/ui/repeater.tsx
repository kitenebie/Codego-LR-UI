import * as React from "react"
import { Plus, Trash2, GripVertical, Paperclip } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "./button"
import { Input } from "./input"

export interface RepeaterField {
  type: "input" | "image" | "attachment"
  key: string
  label?: string
  placeholder?: string
}

export interface RepeaterPayloadItem {
  type: "input" | "image" | "attachment"
  key: string
  value: any
}

export interface RepeaterProps<T> {
  items: T[]
  onAdd: () => void
  onRemove: (index: number) => void
  renderItem?: (item: T, index: number) => React.ReactNode
  /** Structured field definitions — when provided, renders fields automatically */
  fields?: RepeaterField[]
  /** Called when a field value changes: (rowIndex, key, value) */
  onFieldChange?: (index: number, key: string, value: any) => void
  addButtonText?: string
  className?: string
}

function RepeaterFieldRenderer({
  field,
  value,
  onChange,
}: {
  field: RepeaterField
  value: any
  onChange: (v: any) => void
}) {
  if (field.type === "image") {
    return (
      <div className="flex flex-col gap-1.5">
        {field.label && <span className="text-xs font-medium text-muted-foreground">{field.label}</span>}
        <div className="flex items-center gap-3">
          {value && (
            <img src={value} alt={field.key} className="h-10 w-10 rounded-lg object-cover ring-1 ring-border shrink-0" />
          )}
          <Input
            inputType="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "Image URL"}
          />
        </div>
      </div>
    )
  }

  if (field.type === "attachment") {
    return (
      <div className="flex flex-col gap-1.5">
        {field.label && <span className="text-xs font-medium text-muted-foreground">{field.label}</span>}
        <div className="flex items-center gap-2">
          {value && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors shrink-0"
            >
              <Paperclip className="h-3 w-3" />
              {String(value).split("/").pop()}
            </a>
          )}
          <Input
            inputType="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "Attachment URL"}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      {field.label && <span className="text-xs font-medium text-muted-foreground">{field.label}</span>}
      <Input
        inputType="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? field.key}
      />
    </div>
  )
}

export function Repeater<T extends Record<string, any>>({
  items,
  onAdd,
  onRemove,
  renderItem,
  fields,
  onFieldChange,
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
          <div className="flex-1 min-w-0">
            {fields ? (
              <div className="grid gap-3" style={{ gridTemplateColumns: fields.length > 1 ? `repeat(${Math.min(fields.length, 3)}, minmax(0, 1fr))` : "1fr" }}>
                {fields.map((f) => (
                  <RepeaterFieldRenderer
                    key={f.key}
                    field={f}
                    value={(item as any)[f.key]}
                    onChange={(v) => onFieldChange?.(index, f.key, v)}
                  />
                ))}
              </div>
            ) : renderItem ? renderItem(item, index) : null}
          </div>

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
