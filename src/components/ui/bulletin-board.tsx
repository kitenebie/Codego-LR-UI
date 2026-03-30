import * as React from "react"
import { createPortal } from "react-dom"
import axios from "axios"
import { api } from "@/src/lib/codego"
import { Search, Pin, Tag, MoreHorizontal, AlertCircle, AlertTriangle, Info, X, ChevronLeft, ChevronRight, Eye, Pencil, Trash, Loader2 } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Badge } from "./badge"
import { decryptLaravelPayload } from "../tools/decryptPayload"
import type { ServerPagination, ServerTableResponse } from "./table"

// ── Types ─────────────────────────────────────────────────────────────────────

export type BulletinPriority = "low" | "medium" | "high" | "urgent"
export type BulletinLayout   = "grid" | "list" | "masonry"
export type BulletinVariant  = "card" | "minimal" | "bordered"
export type BulletinColumns  = 1 | 2 | 3 | 4

export interface BulletinAction {
  label: string
  icon?: React.ReactNode
  onClick: (item: BulletinItem) => void
  variant?: "default" | "danger"
}

export interface BulletinItem {
  id: string | number
  title: string
  body?: React.ReactNode
  author?: string
  /** Author avatar URL */
  authorImage?: string
  /** Author avatar fallback icon */
  authorIcon?: React.ReactNode
  date?: string | Date
  category?: string
  /** Cover image URL */
  image?: string
  pinned?: boolean
  priority?: BulletinPriority
  tags?: string[]
  /** Per-item action menu items */
  actions?: BulletinAction[]
  className?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<BulletinPriority, { label: string; icon: React.ReactNode; badge: "error" | "warning" | "info" | "ghost" }> = {
  urgent: { label: "Urgent",  icon: <AlertCircle   className="h-3 w-3" />, badge: "error"   },
  high:   { label: "High",    icon: <AlertTriangle className="h-3 w-3" />, badge: "warning" },
  medium: { label: "Medium",  icon: <Info          className="h-3 w-3" />, badge: "info"    },
  low:    { label: "Low",     icon: null,                                   badge: "ghost"   },
}

const COLS_CLASS: Record<BulletinColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

function formatDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function AuthorAvatar({ item }: { item: BulletinItem }) {
  if (item.authorImage) {
    return <img src={item.authorImage} alt={item.author ?? "author"} className="h-6 w-6 rounded-full object-cover shrink-0" />
  }
  if (item.authorIcon) {
    return <span className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">{item.authorIcon}</span>
  }
  if (item.author) {
    return (
      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
        {item.author.charAt(0).toUpperCase()}
      </span>
    )
  }
  return null
}

// ── Server Bulletin types ─────────────────────────────────────────────────────

export interface BulletinServerPaginationProp {
  pagination: ServerPagination
  currentPage: number
  goToPage: (page: number) => void
}

// ── BulletinPreview modal ─────────────────────────────────────────────────────

export interface BulletinPreviewProps {
  item: BulletinItem
  onClose: () => void
  onEdit?: (item: BulletinItem) => void
  onDelete?: (item: BulletinItem) => void
  onView?: (item: BulletinItem) => void
  /** Custom actions to add to the preview header */
  customActions?: BulletinAction[]
  /** Extra React elements rendered in the preview modal header's left area */
  headerAction?: React.ReactNode
  /** Extra React elements rendered in the preview modal footer's action area */
  footerAction?: React.ReactNode
}

export function BulletinPreview({ item, onClose, onEdit, onDelete, onView, customActions, headerAction, footerAction }: BulletinPreviewProps) {
  const priority = item.priority ? PRIORITY_CONFIG[item.priority] : null
  
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex glass items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-border shrink-0 bg-muted/30">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.pinned && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            )}
            {priority && (
              <Badge variant={priority.badge} size="sm" icon={priority.icon ?? undefined}>{priority.label}</Badge>
            )}
            {item.category && <Badge variant="outline" size="sm">{item.category}</Badge>}
            {headerAction}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button
                type="button"
                onClick={() => { onEdit(item); onClose() }}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(item); onClose() }}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-danger/30 text-danger/70 hover:bg-danger/10 hover:text-danger transition-colors"
                title="Delete"
              >
                <Trash className="h-3.5 w-3.5" />
              </button>
            )}
            {customActions && customActions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { action.onClick(item); onClose() }}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg border border-border transition-colors",
                  action.variant === "danger"
                    ? "text-danger/70 hover:bg-danger/10 hover:text-danger border-danger/30"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title={action.label}
              >
                {action.icon || <MoreHorizontal className="h-3.5 w-3.5" />}
              </button>
            ))}
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {item.image && (
            <div className="relative overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full max-h-72 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
          )}
          <div className="px-8 py-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold leading-tight text-foreground">{item.title}</h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {item.author && (
                  <span className="flex items-center gap-1.5">
                    <AuthorAvatar item={item} />
                    {item.author}
                  </span>
                )}
                {item.date && (
                  <>
                    <span className="text-border">•</span>
                    <span>{formatDate(item.date)}</span>
                  </>
                )}
              </div>
            </div>
            
            {item.body && (
              <div className="prose prose-sm max-w-none">
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.body}</div>
              </div>
            )}
            
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {item.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary rounded-full px-3 py-1.5 hover:bg-secondary/80 transition-colors cursor-default"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border shrink-0 bg-muted/20">
          <div className="flex items-center gap-2">
            {item.author && (
              <div className="flex items-center gap-2">
                <AuthorAvatar item={item} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">{item.author}</span>
                  {item.date && <span className="text-[10px] text-muted-foreground">{formatDate(item.date)}</span>}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {footerAction}
            {onEdit && (
              <button
                type="button"
                onClick={() => { onEdit(item); onClose() }}
                className="px-4 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(item); onClose() }}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-danger text-danger-foreground hover:bg-danger-hover transition-colors flex items-center gap-1.5"
              >
                <Trash className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── BulletinDeleteConfirm modal ───────────────────────────────────────────────

function BulletinDeleteConfirm({
  item, baseUrl, idKey, onClose, onSuccess,
}: {
  item: BulletinItem
  baseUrl: string
  idKey?: string
  onClose: () => void
  onSuccess?: (item: BulletinItem) => void
}) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError]     = React.useState<string | null>(null)
  const id = (item as any)[(idKey ?? "id")]

  const handleDelete = async () => {
    setLoading(true); setError(null)
    try {
      await axios.delete(`${baseUrl}/${id}/delete`)
      onSuccess?.(item); onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? "Delete failed")
    } finally { setLoading(false) }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold">Delete Post</h2>
        <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{item.title}</strong>? This cannot be undone.</p>
        {error && <p className="text-xs text-danger">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} disabled={loading} className="px-4 py-1.5 text-sm rounded-xl border border-border hover:bg-accent transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={loading} className="px-4 py-1.5 text-sm rounded-xl bg-danger text-danger-foreground hover:bg-danger-hover transition-colors flex items-center gap-1.5">
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}{loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── BulletinEditModal modal ─────────────────────────────────────────────────────

export interface BulletinEditField {
  key: keyof BulletinItem | string
  label: string
  type: "text" | "textarea" | "select" | "checkbox" | "date"
  options?: string[]
  placeholder?: string
}

function BulletinEditModal({
  item, baseUrl, idKey, method, fields, onClose, onSuccess,
}: {
  item: BulletinItem
  baseUrl: string
  idKey?: string
  method?: "PUT" | "PATCH" | "POST"
  fields: BulletinEditField[]
  onClose: () => void
  onSuccess?: (item: BulletinItem) => void
}) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError]     = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    fields.forEach((f) => {
      initial[f.key] = (item as any)[f.key] ?? ""
    })
    return initial
  })
  const id = (item as any)[(idKey ?? "id")]

  const handleChange = (key: string, value: any) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const response = await axios({
        method: method ?? "PUT",
        url: `${baseUrl}/${id}`,
        data: formData,
      })
      onSuccess?.(response.data as BulletinItem); onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? "Update failed")
    } finally { setLoading(false) }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Edit Post</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={formData[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background outline-none focus:ring-1 focus:ring-ring resize-none"
                  rows={4}
                />
              ) : field.type === "select" ? (
                <select
                  value={formData[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData[field.key] ?? false}
                    onChange={(e) => handleChange(field.key, e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">{field.placeholder}</span>
                </div>
              ) : field.type === "date" ? (
                <input
                  type="date"
                  value={formData[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background outline-none focus:ring-1 focus:ring-ring"
                />
              ) : (
                <input
                  type="text"
                  value={formData[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background outline-none focus:ring-1 focus:ring-ring"
                />
              )}
            </div>
          ))}
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-1.5 text-sm rounded-xl border border-border hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-sm rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export interface BulletinBoardProps {
  // ── Data & Display ─────────────────────────────────────────────────────────────
  /** Array of bulletin post items. */
  items: BulletinItem[]
  /** Board layout mode. */
  layout?: "grid" | "list" | "masonry"
  /** Number of grid columns (responsive). */
  columns?: 1 | 2 | 3 | 4
  /** Visual style of each post card. */
  variant?: "card" | "minimal" | "bordered"
  /** Show a search input above the board. */
  searchable?: boolean
  /** Show category filter chips above the board. */
  filterable?: boolean
  /** Explicit category list for filter chips. Auto-derived from items if omitted. */
  categories?: string[]
  /** Board header title. */
  title?: React.ReactNode
  /** Trailing element in the board header (e.g. a New Post button). */
  headerAction?: React.ReactNode
  /** Show or hide the board header bar. */
  showHeader?: boolean
  /** Content shown when the filtered list is empty. */
  emptyMessage?: React.ReactNode

  // ── Loading State ─────────────────────────────────────────────────────────────
  /** Show skeleton cards instead of real content. */
  loading?: boolean
  /** Number of skeleton cards to render while loading. */
  loadingCount?: number

  // ── Preview Modal ─────────────────────────────────────────────────────────────
  /** Open a BulletinPreview modal when a card is clicked. */
  preview?: boolean
  /** Called when the Edit button is clicked inside the preview. */
  onEdit?: (item: BulletinItem) => void
  /** Called when the Delete button is clicked inside the preview. */
  onDelete?: (item: BulletinItem) => void
  /** Called when the View button is clicked inside the preview. */
  onView?: (item: BulletinItem) => void
  /** Base URL for built-in PUT {baseUrl}/{id} request. */
  editBaseUrl?: string
  /** HTTP method for edit request (default: PUT). */
  editMethod?: "PUT" | "PATCH" | "POST"
  /** Item key used as the id segment in the edit URL. */
  editIdKey?: string
  /** Edit form fields configuration. */
  editFields?: BulletinEditField[]
  /** Base URL for built-in DELETE {baseUrl}/{id}/delete request. */
  deleteBaseUrl?: string
  /** Item key used as the id segment in the delete URL. */
  deleteIdKey?: string

  // ── Server Pagination ─────────────────────────────────────────────────────────
  /** Pass the serverPagination from useServerBulletin to enable server-driven pagination. */
  serverPagination?: BulletinServerPaginationProp | null

  // ── Actions ───────────────────────────────────────────────────────────────────
  /** Fired when a post card is clicked (ignored when preview=true). */
  onItemClick?: (item: BulletinItem) => void
  /** Extra React elements rendered below the board content (above pagination). */
  footerAction?: React.ReactNode
  /** Extra React elements rendered in the preview modal header's left area. */
  headerPreviewAction?: React.ReactNode
  /** Extra React elements rendered in the preview modal footer's action area. */
  footerPreviewAction?: (item: BulletinItem) => React.ReactNode
  /** Additional CSS classes on the outer wrapper. */
  className?: string
}

function ActionMenu({ item, actions }: { item: BulletinItem; actions: BulletinAction[] }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-50 min-w-[140px] rounded-xl border border-border bg-popover shadow-xl p-1">
          {actions.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpen(false); a.onClick(item) }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors",
                a.variant === "danger"
                  ? "text-danger hover:bg-danger/10"
                  : "text-foreground hover:bg-accent"
              )}
            >
              {a.icon && <span className="shrink-0">{a.icon}</span>}
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Single bulletin card ──────────────────────────────────────────────────────

function BulletinCard({
  item,
  variant,
  layout,
  onClick,
}: {
  item: BulletinItem
  variant: BulletinVariant
  layout: BulletinLayout
  onClick?: (item: BulletinItem) => void
}) {
  const priority = item.priority ? PRIORITY_CONFIG[item.priority] : null
  const isList   = layout === "list"

  return (
    <div
      onClick={() => onClick?.(item)}
      className={cn(
        "group relative flex transition-all duration-200",
        isList ? "flex-row gap-4" : "flex-col",
        onClick && "cursor-pointer",
        variant === "card"     && "rounded-xl glass shadow-sm hover:shadow-md",
        variant === "minimal"  && "rounded-xl hover:bg-accent/40",
        variant === "bordered" && "rounded-xl border border-border hover:border-primary/40 bg-card",
        item.className
      )}
    >
      {/* Cover image */}
      {item.image && !isList && (
        <div className="overflow-hidden rounded-t-xl shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      {item.image && isList && (
        <img
          src={item.image}
          alt={item.title}
          className="w-24 h-full min-h-[80px] object-cover rounded-l-xl shrink-0"
        />
      )}

      <div className={cn("flex flex-col flex-1 gap-2", variant !== "minimal" ? "p-4" : "p-3")}>
        {/* Top row: pin + priority + actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.pinned && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            )}
            {priority && (
              <Badge variant={priority.badge} size="sm" icon={priority.icon ?? undefined}>
                {priority.label}
              </Badge>
            )}
            {item.category && (
              <Badge variant="outline" size="sm">{item.category}</Badge>
            )}
          </div>
          {item.actions && item.actions.length > 0 && (
            <ActionMenu item={item} actions={item.actions} />
          )}
        </div>

        {/* Title */}
        <p className={cn("font-semibold leading-snug", isList ? "text-sm" : "text-sm")}>{item.title}</p>

        {/* Body */}
        {item.body && (
          <div className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{item.body}</div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {item.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                <Tag className="h-2.5 w-2.5" />{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: author + date */}
        {(item.author || item.date) && (
          <div className="flex items-center gap-2 mt-auto pt-1 border-t border-border/50">
            <AuthorAvatar item={item} />
            {item.author && <span className="text-xs text-muted-foreground truncate">{item.author}</span>}
            {item.date && (
              <span className="text-xs text-muted-foreground ml-auto shrink-0">{formatDate(item.date)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function BulletinSkeleton({ variant }: { variant: BulletinVariant }) {
  return (
    <div className={cn(
      "animate-pulse flex flex-col gap-3 p-4",
      variant === "card"     && "rounded-xl glass",
      variant === "minimal"  && "rounded-xl",
      variant === "bordered" && "rounded-xl border border-border bg-card",
    )}>
      <div className="h-28 rounded-lg bg-muted" />
      <div className="h-3 w-1/3 rounded bg-muted" />
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-3 w-full rounded bg-muted" />
      <div className="h-3 w-2/3 rounded bg-muted" />
      <div className="flex items-center gap-2 pt-1 border-t border-border/50">
        <div className="h-6 w-6 rounded-full bg-muted" />
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-3 w-16 rounded bg-muted ml-auto" />
      </div>
    </div>
  )
}

// ── BulletinBoard ─────────────────────────────────────────────────────────────

export function BulletinBoard({
  items,
  layout = "grid",
  columns = 3,
  variant = "card",
  searchable = false,
  filterable = false,
  categories: categoriesProp,
  title = "Bulletin Board",
  headerAction,
  showHeader = true,
  emptyMessage = "No posts found.",
  loading = false,
  loadingCount = 6,
  onItemClick,
  onView,
  onEdit,
  onDelete,
  preview = false,
  editBaseUrl,
  editMethod,
  editIdKey,
  editFields,
  deleteBaseUrl,
  deleteIdKey = "id",
  serverPagination,
  footerAction,
  headerPreviewAction,
  footerPreviewAction,
  className,
}: BulletinBoardProps) {
  const [previewItem, setPreviewItem]   = React.useState<BulletinItem | null>(null)
  const [editItem,   setEditItem]      = React.useState<BulletinItem | null>(null)
  const [deleteItem,  setDeleteItem]    = React.useState<BulletinItem | null>(null)
  const [search,   setSearch]   = React.useState("")
  const [category, setCategory] = React.useState<string | null>(null)

  function handleCardClick(item: BulletinItem) {
    if (preview) { setPreviewItem(item); return }
    onItemClick?.(item)
  }

  // Derive categories from items if not provided
  const categories = React.useMemo(() => {
    if (categoriesProp) return categoriesProp
    const set = new Set<string>()
    ;(items ?? []).forEach((i) => { if (i.category) set.add(i.category) })
    return Array.from(set)
  }, [items, categoriesProp])

  // Filter + sort (pinned first)
  const filtered = React.useMemo(() => {
    let list = items ?? []
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((i) =>
        i.title.toLowerCase().includes(q) ||
        (typeof i.body === "string" && i.body.toLowerCase().includes(q)) ||
        (i.author ?? "").toLowerCase().includes(q) ||
        (i.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
    }
    if (category) list = list.filter((i) => i.category === category)
    return [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
  }, [items ?? [], search, category])

  const showToolbar = searchable || (filterable && categories.length > 0)

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">{title}</p>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Toolbar */}
      {showToolbar && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
          {searchable && (
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts…"
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}
          {filterable && categories.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setCategory(null)}
                className={cn(
                  "px-3 py-1 text-xs rounded-full border transition-colors",
                  category === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat === category ? null : cat)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full border transition-colors",
                    category === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:bg-accent"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Board */}
      {loading ? (
        <div className={cn("grid gap-4", COLS_CLASS[columns])}>
          {Array.from({ length: loadingCount }).map((_, i) => (
            <BulletinSkeleton key={i} variant={variant} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-sm text-muted-foreground gap-2">
          <Pin className="h-8 w-8 opacity-20" />
          {emptyMessage}
        </div>
      ) : layout === "list" ? (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => (
            <BulletinCard key={item.id} item={item} variant={variant} layout="list" onClick={handleCardClick} />
          ))}
        </div>
      ) : layout === "masonry" ? (
        <div className={cn("gap-4", COLS_CLASS[columns])} style={{ display: "grid", gridTemplateRows: "masonry" }}>
          {filtered.map((item) => (
            <BulletinCard key={item.id} item={item} variant={variant} layout="masonry" onClick={handleCardClick} />
          ))}
        </div>
      ) : (
        <div className={cn("grid gap-4", COLS_CLASS[columns])}>
          {filtered.map((item) => (
            <BulletinCard key={item.id} item={item} variant={variant} layout="grid" onClick={handleCardClick} />
          ))}
        </div>
      )}

      {/* Footer action */}
      {footerAction && <div>{footerAction}</div>}

      {/* Server-side pagination */}
      {serverPagination && (() => {
        const { pagination, currentPage: cp, goToPage } = serverPagination
        const totalPages = pagination.last_page ?? Math.ceil(pagination.total / pagination.per_page)
        const pills: number[] = []
        if (totalPages <= 7) {
          for (let i = 1; i <= totalPages; i++) pills.push(i)
        } else if (cp <= 4) {
          pills.push(1, 2, 3, 4, 5, -1, totalPages)
        } else if (cp >= totalPages - 3) {
          pills.push(1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
        } else {
          pills.push(1, -1, cp - 1, cp, cp + 1, -2, totalPages)
        }
        return (
          <div className="flex items-center justify-between gap-2 flex-wrap pt-2">
            <span className="text-xs text-muted-foreground">
              {pagination.total} total · page {cp} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(cp - 1)}
                disabled={!pagination.prev_page_url}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {pills.map((p, i) =>
                p < 0 ? (
                  <span key={p - i} className="px-1 text-muted-foreground text-xs">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                      p === cp
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => goToPage(cp + 1)}
                disabled={!pagination.next_page_url}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })()}

      {/* Preview modal */}
      {previewItem && (
        <BulletinPreview
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onView={onView ? (item) => { onView(item) } : undefined}
          onEdit={editBaseUrl && editFields
            ? (item) => { setPreviewItem(null); setEditItem(item) }
            : onEdit
              ? (item) => { onEdit(item) }
              : undefined
          }
          onDelete={deleteBaseUrl
            ? (item) => { setPreviewItem(null); setDeleteItem(item) }
            : onDelete
              ? (item) => { onDelete(item) }
              : undefined
          }
          footerAction={footerPreviewAction ? footerPreviewAction(previewItem) : undefined}
          headerAction={headerPreviewAction}
        />
      )}

      {/* Edit modal */}
      {editItem && editBaseUrl && editFields && (
        <BulletinEditModal
          item={editItem}
          baseUrl={editBaseUrl}
          idKey={editIdKey}
          method={editMethod}
          fields={editFields}
          onClose={() => setEditItem(null)}
          onSuccess={(updated) => {
            onEdit?.(updated)
          }}
        />
      )}

      {/* Delete confirmation */}
      {deleteItem && deleteBaseUrl && (
        <BulletinDeleteConfirm
          item={deleteItem}
          baseUrl={deleteBaseUrl}
          idKey={deleteIdKey}
          onClose={() => setDeleteItem(null)}
          onSuccess={(deleted) => {
            onDelete?.(deleted)
          }}
        />
      )}
    </div>
  )
}
