import * as React from "react"
import { createPortal } from "react-dom"
import { decryptLaravelPayload } from "../tools/decryptPayload"
import axios from "axios"
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search, Settings2, Check, Eye, Pencil, Trash, Loader2, X } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Pagination } from "./pagination"
import { ToggleSwitch } from "./toggle-switch"
import { Select } from "./select"
import { RadioGroup } from "./radio-group"
import { Slider } from "./slider"
import { TagInput } from "./tag-input"
import { OtpInput } from "./otp-input"
import { Combobox } from "./combobox"
import { ColorPicker } from "./color-picker"
import { DateRangePicker } from "./date-range-picker"
import { RichTextEditor } from "./rich-text-editor"
import { FileUpload } from "./file-upload"
import { Repeater } from "./repeater"
import { Textarea } from "./textarea"
import { Input } from "./input"
import { useToast, NotificationBanner } from "./notification"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import type { ActionField, ActionSuccessNotif, ActionButtonConfig, ExtraActionConfig, DefaultActionsConfig, ServerPagination, ServerTableResponse } from "./table"
import { validateField, MODAL_WIDTH } from "./table"
import type { ModalWidth } from "./table"

/**
 * Props for server-side pagination in DataGrid.
 * Used when DataGrid is controlled by server-side data fetching.
 */
export interface ServerDataGridProp {
  /** Server pagination metadata from Laravel/API */
  pagination: ServerPagination
  /** Current active page number (1-based) */
  currentPage: number
  /** Function to navigate to a specific page */
  goToPage: (page: number) => void
}

/**
 * Options for the useServerDataGrid hook.
 * Provides server-side data fetching with optional Laravel payload decryption.
 */
export interface UseServerDataGridOptions {
  /** API endpoint URL to fetch data from */
  url: string
  /** Query parameters to include in the request */
  params?: Record<string, string | number>
  /** If true, the response is expected to be a Laravel-encrypted payload */
  encrypt?: boolean
  /** Laravel APP_KEY used for decryption. Pass import.meta.env["VITE_LARAVEL_KEY"] */
  key?: string
  /** If true, logs the decrypted payload to the console */
  decryptPayloadLog?: boolean
  /**
   * Override auto-derived column definitions per key.
   * Supports all DataGridColumn<T> props: render, sortable, filterable, width, align, etc.
   * Example: { status: { render: (row) => <Badge>{row.status}</Badge> }, score: { sortable: true } }
   */
  columnOverrides?: Record<string, Partial<DataGridColumn<any>>>
}

/**
 * Return type for the useServerDataGrid hook.
 * Contains all data and state needed to render a server-side DataGrid.
 * @template T - The data item type
 */
export interface UseServerDataGridReturn<T> {
  /** Array of data items for the current page */
  data: T[]
  /** Auto-derived column definitions from first data row */
  columns: DataGridColumn<T>[]
  /** Current active page number */
  currentPage: number
  /** Server pagination metadata or null if not available */
  pagination: ServerPagination | null
  /** Formatted pagination prop for DataGrid component */
  serverPagination: ServerDataGridProp | null | undefined
  /** Whether data is currently being fetched */
  loading: boolean
  /** Error message if request failed, null otherwise */
  error: string | null
  /** Function to navigate to a specific page */
  goToPage: (page: number) => void
  /** Function to force reload current page data */
  reload: () => void
}

/**
 * Custom hook for server-side data fetching with DataGrid.
 * Handles pagination, sorting, filtering, and optional Laravel payload decryption.
 * 
 * @param options - Configuration options for the server data grid
 * @returns Object containing data, columns, pagination state, and control functions
 * 
 * @example
 * ```tsx
 * const { data, columns, loading, pagination, goToPage, reload } = useServerDataGrid<User>({
 *   url: "/api/users",
 *   params: { status: "active" },
 *   encrypt: true,
 *   key: import.meta.env["VITE_LARAVEL_KEY"],
 * });
 * ```
 */
export function useServerDataGrid<T extends Record<string, any>>(
  { url, params, encrypt, key, decryptPayloadLog, columnOverrides }: UseServerDataGridOptions
): UseServerDataGridReturn<T> {
  const [data, setData]               = React.useState<T[]>([])
  const [columns, setColumns]         = React.useState<DataGridColumn<T>[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pagination, setPagination]   = React.useState<ServerPagination | null>(null)
  const [loading, setLoading]         = React.useState(false)
  const [error, setError]             = React.useState<string | null>(null)
  const [tick, setTick]               = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    axios
      .get<ServerTableResponse<T>>(url, { params: { ...params, page: currentPage } })
      .then(({ data: res }) => {
        if (cancelled) return
        const payload = encrypt ? decryptLaravelPayload<ServerTableResponse<T>>(res as unknown as string, key) : res
        if (encrypt && decryptPayloadLog) console.log("[useServerDataGrid] decrypted payload:", payload)
        setData(payload.data)
        // Support both flat Laravel response and nested { pagination: {...} }
        const rawTotal    = (payload as any).total     as number
        const rawPerPage  = (payload as any).per_page   as number
        const rawLastPage = (payload as any).last_page  as number | undefined
        const lastPage    = rawLastPage ?? Math.ceil(rawTotal / rawPerPage)
        const pg: ServerPagination = payload.pagination ?? {
          first_page_url: (payload as any).first_page_url ?? `${url}?page=1`,
          last_page_url:  (payload as any).last_page_url  ?? `${url}?page=${lastPage}`,
          last_page:      lastPage,
          next_page_url:  (payload as any).next_page_url  !== undefined
            ? (payload as any).next_page_url
            : currentPage < lastPage ? `${url}?page=${currentPage + 1}` : null,
          prev_page_url:  (payload as any).prev_page_url  !== undefined
            ? (payload as any).prev_page_url
            : currentPage > 1 ? `${url}?page=${currentPage - 1}` : null,
          per_page: rawPerPage,
          total:    rawTotal,
          links:    (payload as any).links ?? [],
        }
        setPagination(pg)
        if (payload.data.length > 0) {
          const firstRow = payload.data[0] as Record<string, any>
          setColumns(
            Object.keys(firstRow).map((k) => {
              const columnKey = k as string
              return {
                key: columnKey,
                header: columnKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                ...(columnOverrides?.[columnKey] ?? {}),
              } as DataGridColumn<T>
            })
          )
        }
      })
      .catch((err) => {
        if (cancelled) return
        setError(err?.response?.data?.message ?? err.message ?? "Request failed")
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, currentPage, tick, JSON.stringify(params), encrypt, decryptPayloadLog, JSON.stringify(columnOverrides)])

  return {
    data,
    columns,
    currentPage,
    pagination,
    serverPagination: pagination
      ? { pagination, currentPage, goToPage: (page: number) => setCurrentPage(page) }
      : null,
    loading,
    error,
    goToPage: (page) => setCurrentPage(page),
    reload: () => setTick((t) => t + 1),
  }
}

/**
 * Sort direction for DataGrid columns.
 * - "asc" - Ascending order
 * - "desc" - Descending order
 * - null - No sorting applied
 */
export type SortDir = "asc" | "desc" | null

/**
 * Column definition for DataGrid component.
 * @template T - The data item type
 */
export interface DataGridColumn<T> {
  /** Unique key identifying this column (must match a property in T) */
  key: keyof T | string
  /** Column header display text or React node */
  header: React.ReactNode
  /** Custom render function for cell content */
  render?: (row: T, idx: number) => React.ReactNode
  /** Whether this column is sortable */
  sortable?: boolean
  /** Column width (e.g., "100px", "20%") */
  width?: string
  /** Text alignment within the column */
  align?: "left" | "center" | "right"
}

/**
 * Props for the DataGrid component.
 * @template T - The data item type
 */
export interface DataGridProps<T> {
  /** Column definitions for the grid */
  columns: DataGridColumn<T>[]
  /** Array of data items to display */
  data: T[]
  /** Property name or function to get unique row identifier */
  rowKey: keyof T | ((row: T) => string)
  /** Array of column keys that should have filter inputs */
  filterable?: string[]
  /** Whether rows can be selected via checkboxes */
  selectable?: boolean
  /** Controlled selected row keys (used with onSelectChange) */
  selected?: string[]
  /** Callback when selection changes */
  onSelectChange?: (keys: string[]) => void
  /** Number of items per page (default: 10) */
  pageSize?: number
  /** Whether to show pagination controls */
  showPagination?: boolean
  /** Whether to show column visibility toggle */
  showColumnToggle?: boolean
  /** Whether to show loading skeleton */
  loading?: boolean
  /** Message shown when no data is available */
  emptyMessage?: string
  /** Additional CSS classes for the container */
  className?: string
  /** Callback when a row is clicked */
  onRowClick?: (row: T) => void
  /** Configuration for default row actions (view/edit/delete) */
  defaultActions?: DefaultActionsConfig<T>
  /** Server-side pagination prop (for controlled/server-fetched pagination) */
  serverPagination?: ServerDataGridProp | null
}

/**
 * Internal button component for rendering action buttons in DataGrid.
 * Supports flexible configuration through ActionButtonConfig or ExtraActionConfig.
 */
function ActionBtn({
  cfg, defaultIcon, defaultLabel, defaultVariant, defaultSize, onClick,
}: {
  cfg?: ActionButtonConfig | ExtraActionConfig<any>
  defaultIcon?: React.ReactNode
  defaultLabel: string
  defaultVariant: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger" | "success" | "destructive"
  defaultSize?: "xs" | "sm" | "md" | "lg" | "xl"
  onClick: () => void
}) {
  const mode = cfg?.displayMode ?? "icon"
  const icon = cfg?.icon ?? defaultIcon
  const label = cfg?.label ?? defaultLabel
  const buttonSize = (cfg?.size ?? defaultSize ?? "xs") as "xs" | "sm" | "md" | "lg" | "xl"
  return (
    <Button
      type="button"
      title={label}
      size={buttonSize}
      variant={cfg?.variant ?? defaultVariant}
      rounded={cfg?.rounded ?? "lg"}
      gradientFrom={cfg?.gradientFrom}
      gradientTo={cfg?.gradientTo}
      gradientDirection={cfg?.gradientDirection}
      bgColor={cfg?.bgColor}
      textColor={cfg?.textColor}
      borderColor={cfg?.borderColor}
      borderWidth={cfg?.borderWidth}
      shadow={cfg?.shadow}
      iconOnly={mode === "icon"}
      leftIcon={mode !== "text" ? icon : undefined}
      className={cfg?.className}
      onClick={onClick}
    >
      {mode !== "icon" ? label : undefined}
    </Button>
  )
}

// ── DataGrid action modals (reuse same pattern as Table) ─────────────────────

/**
 * Shell component for DataGrid modals (View, Edit, Delete).
 * Creates a centered modal dialog with title, close button, and optional footer.
 */
function DGModalShell({ title, onClose, children, footer, width = "lg" }: {
  title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; width?: ModalWidth
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`relative w-full ${MODAL_WIDTH[width]} rounded-2xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto px-6 py-4 flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

/**
 * Renderer for dynamic form fields in DataGrid modals.
 * Maps ActionField types to their corresponding UI components.
 */
function DGFieldRenderer({ field, value, onChange }: { field: ActionField; value: any; onChange: (v: any) => void }) {
  if (field.render) return <>{field.render(value, onChange)}</>

  // Helper to convert any option format to { label, value }
  const toLabelValue = (o: string | { label: string; value: string } | [string, string]): { label: string; value: string } => {
    if (typeof o === "string") return { label: o, value: o }
    if (Array.isArray(o)) return { label: o[0], value: o[1] }
    return o
  }

  const strOptions = (field.options ?? []).map((o) =>
    typeof o === "string" ? o : Array.isArray(o) ? o[1] : o.value
  )
  const comboOptions = (field.options ?? []).map(toLabelValue)
  const radioOptions = (field.options ?? []).map(toLabelValue)

  switch (field.type) {
    case "textarea":
      return <Textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} rows={3} />
    case "checkbox":
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span className="text-sm">{field.label}</span>
        </label>
      )
    case "toggle":
      return <ToggleSwitch checked={!!value} onChange={(v) => onChange(v)} label={field.label} />
    case "select":
      return (
        <Select
          value={value ?? ""}
          onChange={(v) => onChange(v)}
          options={strOptions.map((o) => ({ label: o, value: o }))}
          placeholder={field.placeholder ?? "Select…"}
        />
      )
    case "radio":
      return <RadioGroup value={value ?? ""} onChange={(v) => onChange(v)} options={radioOptions} />
    case "slider":
      return <Slider value={value ?? field.min ?? 0} onChange={(v) => onChange(v)} min={field.min ?? 0} max={field.max ?? 100} step={field.step ?? 1} />
    case "tag-input":
      return <TagInput value={Array.isArray(value) ? value : []} onChange={(v) => onChange(v)} placeholder={field.placeholder} />
    case "otp":
      return <OtpInput length={field.digits ?? 6} value={value ?? ""} onChange={(v) => onChange(v)} />
    case "combobox":
      return <Combobox value={value ?? ""} onChange={(v) => onChange(v)} options={comboOptions} placeholder={field.placeholder ?? "Search…"} />
    case "color-picker":
      return <ColorPicker value={value ?? "#6366f1"} onChange={(v) => onChange(v)} />
    case "date-range":
      return <DateRangePicker value={value ?? null} onChange={(v) => onChange(v)} />
    case "rich-text":
      return <RichTextEditor value={value ?? ""} onChange={(v) => onChange(v)} />
    case "file-upload":
      return <FileUpload onChange={(files) => onChange(files)} />
    case "repeater": {
      const items = Array.isArray(value) ? value : []
      return (
        <Repeater
          items={items}
          onAdd={() => onChange([...items, {}])}
          onRemove={(i) => onChange(items.filter((_, idx) => idx !== i))}
          renderItem={(_, i) => <span className="text-sm text-muted-foreground">Item {i + 1}</span>}
        />
      )
    }
    case "password":
      return <Input inputType="password" revealable value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? field.label} />
    default:
      return <Input inputType={field.inputType as any ?? "text"} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? field.label} />
  }
}

/**
 * View modal component for displaying record details.
 * Shows read-only field values in a modal dialog.
 */
function DGViewModal<T extends Record<string, any>>({ item, fields, onClose, width }: { item: T; fields: ActionField[]; onClose: () => void; width?: ModalWidth }) {
  return (
    <DGModalShell title="View Details" onClose={onClose} width={width}
      footer={<button onClick={onClose} className="px-4 py-1.5 text-sm rounded-xl border border-border hover:bg-accent transition-colors">Close</button>}>
      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <p className="text-xs font-semibold text-muted-foreground mb-1">{f.label}</p>
            {f.render ? <>{f.render(item[f.key], () => {})}</> : (
              <p className="text-sm text-foreground break-words">
                {item[f.key] == null || item[f.key] === "" ? <span className="text-muted-foreground italic">—</span> : String(item[f.key])}
              </p>
            )}
          </div>
        ))}
      </div>
    </DGModalShell>
  )
}

/**
 * Edit modal component for updating record data.
 * Renders a form with dynamic fields and handles PUT requests to update records.
 */
function DGEditModal<T extends Record<string, any>>({
  item, fields, baseUrl, itemId, onClose, onSuccess, notif, grid, width,
}: { item: T; fields: ActionField[]; baseUrl: string; itemId: string | number; onClose: () => void; onSuccess?: (item: T) => void; notif?: ActionSuccessNotif; grid?: number; width?: ModalWidth }) {
  const [form, setForm] = React.useState<Record<string, any>>(() => {
    const init: Record<string, any> = {}
    fields.forEach((f) => { init[f.key] = item[f.key] ?? '' })
    return init
  })
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError]     = React.useState<string | null>(null)
  const [banner, setBanner]   = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    fields.forEach((f) => { const msg = validateField(f, form[f.key]); if (msg) errs[f.key] = msg })
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setFieldErrors({})
    setLoading(true); setError(null)
    try {
      await axios.put(`${baseUrl}/${itemId}/update`, form)
      const updated = { ...item, ...form } as T
      if (notif && (notif.type ?? 'toast') === 'notification') {
        setBanner(true); onSuccess?.(updated)
      } else {
        onSuccess?.(updated); onClose()
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? 'Update failed')
    } finally { setLoading(false) }
  }

  return (
    <DGModalShell title="Edit Record" onClose={onClose} width={width}
      footer={
        <>
          <button onClick={onClose} disabled={loading} className="px-4 py-1.5 text-sm rounded-xl border border-border hover:bg-accent transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-1.5 text-sm rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors flex items-center gap-1.5">
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}{loading ? 'Saving…' : 'Save Changes'}
          </button>
        </>
      }>
      <form onSubmit={handleSubmit} className={grid ? 'grid gap-4' : 'space-y-4'} style={grid ? { gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` } : undefined}>
        {banner && notif && (
          <div className="space-y-2" style={grid ? { gridColumn: '1 / -1' } : undefined}>
            <NotificationBanner variant={notif.editVariant ?? 'success'} title={notif.editTitle ?? 'Record updated'} description={notif.editBody} onClose={() => setBanner(false)} />
            {notif.action && <div>{notif.action}</div>}
          </div>
        )}
        {fields.map((f) => (
          <div key={f.key} style={{ ...(f.colSpan ? { gridColumn: `span ${f.colSpan}` } : {}), ...(f.rowSpan ? { gridRow: `span ${f.rowSpan}` } : {}) }}>
            {f.type !== 'checkbox' && <label className="block text-xs font-semibold text-muted-foreground mb-1">{f.label}{f.required && <span className="text-danger ml-0.5">*</span>}</label>}
            <DGFieldRenderer field={f} value={form[f.key]} onChange={(v) => {
              setForm((p) => ({ ...p, [f.key]: v }))
              if (fieldErrors[f.key]) { const msg = validateField(f, v); setFieldErrors((p) => ({ ...p, [f.key]: msg ?? '' })) }
            }} />
            {fieldErrors[f.key] && <p className="text-xs text-danger mt-1">{fieldErrors[f.key]}</p>}
          </div>
        ))}
        {error && <p className="text-xs text-danger" style={grid ? { gridColumn: '1 / -1' } : undefined}>{error}</p>}
      </form>
    </DGModalShell>
  )
}

/**
 * Delete confirmation modal component.
 * Shows a confirmation dialog and handles DELETE requests to remove records.
 */
function DGDeleteModal<T extends Record<string, any>>({
  item, baseUrl, itemId, onClose, onSuccess, notif,
}: { item: T; baseUrl: string; itemId: string | number; onClose: () => void; onSuccess?: (item: T) => void; notif?: ActionSuccessNotif }) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError]     = React.useState<string | null>(null)

  const handleDelete = async () => {
    setLoading(true); setError(null)
    try {
      await axios.delete(`${baseUrl}/${itemId}/delete`)
      onSuccess?.(item); onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? "Delete failed")
    } finally { setLoading(false) }
  }

  return (
    <DGModalShell title="Confirm Delete" onClose={onClose} width="lg"
      footer={
        <>
          <button onClick={onClose} disabled={loading} className="px-4 py-1.5 text-sm rounded-xl border border-border hover:bg-accent transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={loading} className="px-4 py-1.5 text-sm rounded-xl bg-danger text-danger-foreground hover:bg-danger-hover transition-colors flex items-center gap-1.5">
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}{loading ? "Deleting…" : "Delete"}
          </button>
        </>
      }>
      <p className="text-sm text-muted-foreground">Are you sure you want to delete this record? This action cannot be undone.</p>
      {error && <p className="text-xs text-danger mt-2">{error}</p>}
    </DGModalShell>
  )
}

/**
 * DataGrid component - A powerful data table with sorting, filtering, pagination, and built-in actions.
 * 
 * Supports both client-side and server-side pagination, column visibility toggling,
 * row selection, and default CRUD actions (view/edit/delete) with modal forms.
 * 
 * @param props - DataGridProps<T> containing columns, data, and configuration options
 * @returns A fully-featured data grid React component
 * 
 * @example
 * ```tsx
 * <DataGrid
 *   columns={[
 *     { key: "id", header: "ID", sortable: true },
 *     { key: "name", header: "Name", sortable: true },
 *     { key: "email", header: "Email" },
 *   ]}
 *   data={users}
 *   rowKey="id"
 *   filterable={["name", "email"]}
 *   selectable
 *   pageSize={25}
 *   onRowClick={(row) => console.log(row)}
 *   defaultActions={{
 *     baseUrl: "/api/users",
 *     viewForm: [{ key: "name", label: "Name" }, { key: "email", label: "Email" }],
 *   }}
 * />
 * ```
 */
export function DataGrid<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  filterable,
  selectable = false,
  selected: controlledSelected,
  onSelectChange,
  pageSize = 10,
  showPagination = true,
  showColumnToggle = false,
  loading = false,
  emptyMessage = "No data",
  className,
  onRowClick,
  defaultActions,
  serverPagination,
}: DataGridProps<T>) {
  const { toast } = useToast()
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<SortDir>(null)
  const [filters, setFilters] = React.useState<Record<string, string>>({})
  const [page, setPage] = React.useState(1)
  const [internalSelected, setInternalSelected] = React.useState<string[]>([])
  const [hiddenCols, setHiddenCols] = React.useState<string[]>([])
  const [colMenuOpen, setColMenuOpen] = React.useState(false)
  const colMenuRef = React.useRef<HTMLDivElement>(null)

  // Default actions modal state
  const [viewItem,   setViewItem]   = React.useState<T | null>(null)
  const [editItem,   setEditItem]   = React.useState<T | null>(null)
  const [deleteItem, setDeleteItem] = React.useState<T | null>(null)
  const [tableData,  setTableData]  = React.useState<T[]>(data ?? [])
  React.useEffect(() => { setTableData(data ?? []) }, [data])

  const actionIdKey = (defaultActions?.idKey ?? (typeof rowKey === "string" ? rowKey : "id")) as keyof T

  const autoFields = React.useMemo((): ActionField[] => {
    if (!tableData.length) return []
    return Object.keys(tableData[0] as object).map((k) => ({
      key: k,
      label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    }))
  }, [tableData])

  const editFields = defaultActions?.editForm ?? autoFields
  const viewFields = defaultActions?.viewForm ?? autoFields

  const selectedKeys = controlledSelected ?? internalSelected

  function getKey(row: T): string {
    return typeof rowKey === "function" ? rowKey(row) : String(row[rowKey])
  }

  function toggleSort(key: string) {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc") }
    else if (sortDir === "asc") setSortDir("desc")
    else { setSortKey(null); setSortDir(null) }
    setPage(1)
  }

  function toggleSelect(key: string) {
    const next = selectedKeys.includes(key) ? selectedKeys.filter((k) => k !== key) : [...selectedKeys, key]
    if (!controlledSelected) setInternalSelected(next)
    onSelectChange?.(next)
  }

  function toggleAll(keys: string[]) {
    const allSelected = keys.every((k) => selectedKeys.includes(k))
    const next = allSelected ? selectedKeys.filter((k) => !keys.includes(k)) : [...new Set([...selectedKeys, ...keys])]
    if (!controlledSelected) setInternalSelected(next)
    onSelectChange?.(next)
  }

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) setColMenuOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Filter
  let processed = (data ?? []).filter((row) =>
    Object.entries(filters).every(([k, v]) => {
      if (!v) return true
      const cell = String(row[k] ?? "").toLowerCase()
      return cell.includes(v.toLowerCase())
    })
  )

  // Sort
  if (sortKey && sortDir) {
    processed = [...processed].sort((a, b) => {
      const av = a[sortKey] ?? ""
      const bv = b[sortKey] ?? ""
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sortDir === "asc" ? cmp : -cmp
    })
  }

  const total = processed.length
  const pageData = showPagination ? processed.slice((page - 1) * pageSize, page * pageSize) : processed
  const pageKeys = pageData.map(getKey)

  // Append actions column
  const actionsCol: DataGridColumn<T> | null = defaultActions ? {
    key: "__actions__" as keyof T,
    header: "Actions",
    render: (row) => (
      <div className="flex items-center gap-1">
        <ActionBtn
          cfg={defaultActions.viewButton}
          defaultIcon={<Eye className="h-3.5 w-3.5" />}
          defaultLabel="View"
          defaultVariant="outline"
          defaultSize={defaultActions.actionsSize as "xs" | "sm" | "md" | "lg" | "xl"}
          onClick={() => setViewItem(row)}
        />
        <ActionBtn
          cfg={defaultActions.editButton}
          defaultIcon={<Pencil className="h-3.5 w-3.5" />}
          defaultLabel="Edit"
          defaultVariant="outline"
          defaultSize={defaultActions.actionsSize as "xs" | "sm" | "md" | "lg" | "xl"}
          onClick={() => setEditItem(row)}
        />
        <ActionBtn
          cfg={defaultActions.deleteButton}
          defaultIcon={<Trash className="h-3.5 w-3.5" />}
          defaultLabel="Delete"
          defaultVariant="danger"
          defaultSize={defaultActions.actionsSize as "xs" | "sm" | "md" | "lg" | "xl"}
          onClick={() => setDeleteItem(row)}
        />
        {defaultActions.extraActions?.map((extra) => (
          <ActionBtn
            key={extra.key}
            cfg={extra}
            defaultIcon={extra.icon}
            defaultLabel={extra.label ?? extra.key}
            defaultVariant={extra.variant ?? "outline"}
            defaultSize={defaultActions.actionsSize as "xs" | "sm" | "md" | "lg" | "xl"}
            onClick={() => extra.onClick(row)}
          />
        ))}
      </div>
    ),
  } : null

  const visibleCols = defaultActions?.position === "first"
    ? [
        ...(actionsCol ? [actionsCol] : []),
        ...columns.filter((c) => !hiddenCols.includes(String(c.key))),
      ]
    : [
        ...columns.filter((c) => !hiddenCols.includes(String(c.key))),
        ...(actionsCol ? [actionsCol] : []),
      ]

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Toolbar */}
      {(showColumnToggle || Object.keys(filters).length > 0) && (
        <div className="flex items-center justify-end gap-2">
          {showColumnToggle && (
            <div ref={colMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setColMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs text-muted-foreground hover:bg-accent transition-colors"
              >
                <Settings2 className="h-3.5 w-3.5" /> Columns
              </button>
              {colMenuOpen && (
                <div className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-border glass shadow-xl p-1">
                  {columns.map((col) => {
                    const k = String(col.key)
                    const hidden = hiddenCols.includes(k)
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setHiddenCols((prev) => hidden ? prev.filter((c) => c !== k) : [...prev, k])}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors"
                      >
                        <span className={cn("h-3.5 w-3.5 rounded border border-border flex items-center justify-center", !hidden && "bg-primary border-primary")}>
                          {!hidden && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                        </span>
                        {col.header}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {selectable && (
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={pageKeys.length > 0 && pageKeys.every((k) => selectedKeys.includes(k))}
                    onChange={() => toggleAll(pageKeys)}
                    className="rounded border-border accent-primary"
                  />
                </th>
              )}
              {visibleCols.map((col, ci) => (
                <th
                  key={`${String(col.key)}-${ci}`}
                  className={cn(
                    "px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    col.sortable && "cursor-pointer select-none hover:text-foreground transition-colors"
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && toggleSort(String(col.key))}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === String(col.key)
                        ? sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                        : <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
            {/* Filter row */}
            {filterable && filterable.length > 0 && (
              <tr className="border-b border-border bg-muted/10">
                {selectable && <th />}
                {visibleCols.map((col, ci) => (
                  <th key={`${String(col.key)}-${ci}`} className="px-3 py-1.5">
                    {filterable.includes(String(col.key)) && (
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <input
                          value={filters[String(col.key)] ?? ""}
                          onChange={(e) => { setFilters((f) => ({ ...f, [String(col.key)]: e.target.value })); setPage(1) }}
                          placeholder="Filter..."
                          className="w-full pl-6 pr-2 py-1 text-xs rounded-md border border-border bg-background outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  {selectable && <td className="px-3 py-3"><div className="h-4 w-4 rounded bg-muted" /></td>}
                  {visibleCols.map((col, ci) => (
                    <td key={String(i) + `-` + ci} className="px-4 py-3">
                      <div className="h-4 rounded bg-muted" style={{ width: `${60 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageData.map((row, ri) => {
                const key = getKey(row)
                const isSel = selectedKeys.includes(key)
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-border last:border-0 transition-colors",
                      onRowClick && "cursor-pointer hover:bg-accent/40",
                      isSel && "bg-primary/5"
                    )}
                  >
                    {selectable && (
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleSelect(key)}
                          className="rounded border-border accent-primary"
                        />
                      </td>
                    )}
                    {visibleCols.map((col, ci) => (
                      <td
                        key={`${String(col.key)}-${ci}`}
                        className={cn(
                          "px-4 py-3 text-sm",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right"
                        )}
                      >
                        {col.render ? col.render(row, ri) : String(row[String(col.key)] ?? "")}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Client-side pagination */}
      {showPagination && !serverPagination && (
        <Pagination
          page={page}
          total={total}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}

      {/* Server-side pagination */}
      {serverPagination && (() => {
        const { pagination, currentPage: cp, goToPage } = serverPagination
        const totalServerPages = pagination.last_page ?? Math.ceil(pagination.total / pagination.per_page)
        const pills: number[] = []
        if (totalServerPages <= 7) {
          for (let i = 1; i <= totalServerPages; i++) pills.push(i)
        } else if (cp <= 4) {
          pills.push(1, 2, 3, 4, 5, -1, totalServerPages)
        } else if (cp >= totalServerPages - 3) {
          pills.push(1, -1, totalServerPages - 4, totalServerPages - 3, totalServerPages - 2, totalServerPages - 1, totalServerPages)
        } else {
          pills.push(1, -1, cp - 1, cp, cp + 1, -2, totalServerPages)
        }
        return (
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">
              {pagination.total} total rows · page {cp} of {totalServerPages}
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

      {/* Default action modals */}
      {defaultActions && viewItem && (
        <DGViewModal item={viewItem} fields={viewFields} width={defaultActions.modalWidth} onClose={() => setViewItem(null)} />
      )}
      {defaultActions && editItem && (
        <DGEditModal
          item={editItem} fields={editFields}
          baseUrl={defaultActions.baseUrl}
          itemId={String(editItem[actionIdKey] ?? "")}
          notif={defaultActions.onSuccessNotif}
          grid={defaultActions.editFormGrid}
          width={defaultActions.modalWidth}
          onClose={() => setEditItem(null)}
          onSuccess={(updated) => {
            setTableData((prev) => prev.map((r) => String(r[actionIdKey]) === String(updated[actionIdKey]) ? updated : r))
            defaultActions.onSuccess?.("edit", updated)
            const notif = defaultActions.onSuccessNotif
            if (notif && (notif.type ?? "toast") === "toast") {
              toast({ variant: notif.editVariant ?? "success", title: notif.editTitle ?? "Record updated", description: notif.editBody, position: notif.toastPosition })
            }
          }}
        />
      )}
      {defaultActions && deleteItem && (
        <DGDeleteModal
          item={deleteItem}
          baseUrl={defaultActions.baseUrl}
          itemId={String(deleteItem[actionIdKey] ?? "")}
          notif={defaultActions.onSuccessNotif}
          onClose={() => setDeleteItem(null)}
          onSuccess={(deleted) => {
            setTableData((prev) => prev.filter((r) => String(r[actionIdKey]) !== String(deleted[actionIdKey])))
            defaultActions.onSuccess?.("delete", deleted)
            const notif = defaultActions.onSuccessNotif
            if (notif && (notif.type ?? "toast") === "toast") {
              toast({ variant: notif.deleteVariant ?? "success", title: notif.deleteTitle ?? "Record deleted", description: notif.deleteBody, position: notif.toastPosition })
            }
          }}
        />
      )}
    </div>
  )
}
