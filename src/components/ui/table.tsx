/**
 * Table Component with Server/Client-side Pagination, Sorting, Filtering, and CRUD Actions
 * 
 * A comprehensive data table component for React that supports:
 * - Server-side and client-side pagination
 * - Search/filtering functionality
 * - Column sorting
 * - Row selection with checkboxes
 * - Bulk delete operations
 * - Built-in View/Edit/Delete actions with modal forms
 * - Multiple column types (text, image, badge, icon, stack, select, toggle, color, checkbox)
 * - Custom field types for edit forms
 * - Server-side data fetching with Laravel encryption support
 * 
 * @packageDocumentation
 * 
 * @example
 * ```tsx
 * import { Table, useServerTable } from "./components/ui/table"
 * 
 * // Server-side pagination example
 * const { data, columns, serverPagination, loading } = useServerTable<User>({
 *   url: "/api/users",
 *   params: { sort: "name" },
 * })
 * 
 * return (
 *   <Table
 *     data={data}
 *     columns={columns}
 *     serverPagination={serverPagination}
 *     searchable
 *     pagination
 *     defaultActions={{
 *       baseUrl: "/api/users",
 *       editForm: [{ key: "name", label: "Name", type: "input" }],
 *     }}
 *   />
 * )
 * ```
 */
import * as React from "react"
import { createPortal } from "react-dom"
import { decryptLaravelPayload } from "../tools/decryptPayload"
import axios from "axios"
import { ChevronLeft, ChevronRight, Search, Trash2, ChevronsUpDown, ChevronUp, ChevronDown, X, Eye, Pencil, Trash, Loader2 } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { AvatarStack } from "./avatar-stack"
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
import { useToast, NotificationBanner, ToastPosition, ToastVariant } from "./notification"
import { Input } from "./input"

// ═══════════════════════════════════════════════════════════════════════════════
// Server-Side Pagination Types
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Represents a single pagination link in server-side pagination
 * @interface ServerPaginationLink
 */
export interface ServerPaginationLink {
  page: number
  url: string
  active: boolean
}

/**
 * Server-side pagination metadata returned from the API
 * @interface ServerPagination
 */
export interface ServerPagination {
  first_page_url: string
  last_page_url: string
  last_page: number
  next_page_url: string | null
  prev_page_url: string | null
  per_page: number
  total: number
  links: ServerPaginationLink[]
}

/**
 * Response structure from server-side table API
 * @template T - The data type for table rows
 * @extends ServerPagination
 */
export interface ServerTableResponse<T> extends ServerPagination {
  current_page: number
  data: T[]
  pagination?: ServerPagination  // optional nested — some APIs wrap it
}

/**
 * Options for the useServerTable hook
 * @interface UseServerTableOptions
 */
export interface UseServerTableOptions {
  /** Base URL — page param appended automatically: `url?page=N` */
  url: string
  /** Extra query params merged on every request */
  params?: Record<string, string | number>
  /** If true, the response is expected to be a Laravel-encrypted payload */
  encrypt?: boolean
  /** Laravel APP_KEY used for decryption. Pass import.meta.env["VITE_LARAVEL_KEY"] */
  key?: string
  /** If true, logs the decrypted payload to the console */
  decryptPayloadLog?: boolean
  /**
   * Override auto-derived column definitions per key.
   * Supports all Column<T> props: type, render, selectOptions, stackProps, onChange, sortable, etc.
   * Example: { status: { type: "badge" }, enabled: { type: "toggle", onChange: (item, v) => patch(item.id, v) } }
   */
  columnOverrides?: Record<string, Partial<Column<any>>>
  /** Debounce delay for search in milliseconds. Default 300ms */
  debounce?: number
  /** Transform API response to T[]. Default: (res) => res.data */
  transform?: (response: any) => any[]
  /** If true, hook won't fetch automatically. Call reload() manually */
  manual?: boolean
  /** If true, refetch data whenever reload() is called (e.g. after edit/delete) */
  refresh?: boolean
  /** Auto-refresh interval in milliseconds. Omit or set 0 to disable */
  refreshInterval?: number
  /**
   * A ref that will be assigned the reload function.
   * Call `hardReloadRef.current()` from any external button or function to trigger a refetch.
   * @example
   * const hardReloadRef = React.useRef<() => void>(() => {})
   * useServerTable({ url, hardReload: hardReloadRef })
   * // then anywhere: hardReloadRef.current()
   */
  hardReload?: React.MutableRefObject<() => void>
  /** Called after successful data fetch */
  onSuccess?: (data: any[]) => void
  /** Called on fetch error */
  onError?: (error: Error) => void
}

/**
 * Return type from the useServerTable hook
 * @template T - The data type for table rows
 * @interface UseServerTableReturn
 */
export interface UseServerTableReturn<T> {
  data: T[]
  columns: Column<T>[]
  currentPage: number
  pagination: ServerPagination | null
  serverPagination: ServerPaginationProp | null   // pass directly as <Table serverPagination={...} />
  loading: boolean
  error: string | null
  goToPage: (page: number) => void
  reload: () => void
  /** Manually trigger a data refresh (alias for reload, respects refresh option) */
  refresh: () => void
  searchValue?: string
  onSearchChange?: (value: string) => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// Server Pagination Prop (passed to <Table serverPagination={...} />)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Server-side pagination prop passed to the Table component
 * @interface ServerPaginationProp
 */
export interface ServerPaginationProp {
  pagination: ServerPagination
  currentPage: number
  goToPage: (page: number) => void
}

// ── useServerTable hook ───────────────────────────────────────────────────────

/**
 * Custom hook for fetching and managing server-side paginated table data.
 * Supports Laravel encryption, auto-column derivation, and flexible pagination.
 * 
 * @template T - The data type for table rows
 * @param options - Configuration options for the server table
 * @returns Object with data, columns, pagination state, loading, error, and control functions
 * 
 * @example
 * ```tsx
 * const { data, columns, serverPagination, loading } = useServerTable({
 *   url: "/api/users",
 *   params: { sort: "name" },
 * })
 * ```
 */
export function useServerTable<T extends Record<string, any>>(
  { url, params, encrypt, key, decryptPayloadLog, columnOverrides, debounce = 300, transform, manual = false, refresh: refreshEnabled = false, refreshInterval = 0, hardReload, onSuccess, onError }: UseServerTableOptions
): UseServerTableReturn<T> {
  const [data, setData]           = React.useState<T[]>([])
  const [columns, setColumns]     = React.useState<Column<T>[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pagination, setPagination]   = React.useState<ServerPagination | null>(null)
  const [loading, setLoading]     = React.useState(false)
  const [error, setError]         = React.useState<string | null>(null)
  const [tick, setTick]           = React.useState(0)
  const [searchValue, setSearchValue] = React.useState("")
  const debounceTimer = React.useRef<NodeJS.Timeout | undefined>(undefined)

  // Assign reload to hardReload ref so external callers can trigger it
  React.useEffect(() => {
    if (hardReload) hardReload.current = () => setTick((t) => t + 1)
  }, [hardReload])

  // Auto-refresh interval
  React.useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return
    const id = setInterval(() => setTick((t) => t + 1), refreshInterval)
    return () => clearInterval(id)
  }, [refreshInterval])

  React.useEffect(() => {
    if (manual && tick === 0) return
    let cancelled = false
    setLoading(true)
    setError(null)

    axios
      .get<ServerTableResponse<T>>(url, {
        params: { ...params, page: currentPage, search: searchValue },
      })
      .then(({ data: res }) => {
        if (cancelled) return
        const payload = encrypt ? decryptLaravelPayload<ServerTableResponse<T>>(res as unknown as string, key) : res
        if (encrypt && decryptPayloadLog) console.log("[useServerTable] decrypted payload:", payload)
        const transformed = transform ? transform(payload) : payload.data
        setData(transformed)
        onSuccess?.(transformed)
        // Support both flat Laravel response and nested { pagination: {...} }
        const rawTotal   = (payload as any).total     as number
        const rawPerPage = (payload as any).per_page   as number
        const rawLastPage = (payload as any).last_page as number | undefined
        const lastPage   = rawLastPage ?? Math.ceil(rawTotal / rawPerPage)
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
        // Auto-derive columns from first row keys
        if (transformed.length > 0) {
          setColumns(
            Object.keys(transformed[0]).map((k) => {
              const columnKey = k as string
              return {
                key: columnKey,
                title: columnKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                ...(columnOverrides?.[columnKey] ?? {}),
              } as Column<T>
            })
          )
        }
      })
      .catch((err) => {
        if (cancelled) return
        const errorMsg = err?.response?.data?.message ?? err.message ?? "Request failed"
        setError(errorMsg)
        onError?.(new Error(errorMsg))
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, currentPage, tick, JSON.stringify(params), encrypt, decryptPayloadLog, JSON.stringify(columnOverrides), searchValue])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
    if (debounceTimer.current) clearTimeout(debounceTimer.current as NodeJS.Timeout)
    debounceTimer.current = setTimeout(() => {
      setTick((t) => t + 1)
    }, debounce)
  }

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
    reload:   () => setTick((t) => t + 1),
    refresh:  () => setTick((t) => t + 1),
    searchValue,
    onSearchChange: handleSearchChange,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Default Actions Types (for View/Edit/Delete modals)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Available field types for action forms (edit/view modals)
 * @type {ActionFieldType}
 */
export type ActionFieldType =
  | "input" | "password" | "textarea" | "checkbox" | "toggle"
  | "select" | "radio" | "slider" | "tag-input"
  | "otp" | "combobox" | "color-picker" | "date-range"
  | "rich-text" | "file-upload" | "repeater"

/**
 * Display type for viewForm fields — controls how the value is rendered in the View modal
 * @type {ViewFieldType}
 */
export type ViewFieldType =
  | "text"
  | "image"
  | "checkbox"
  | "toggle"
  | "attachment"
  | "text-url"
  | "text-url-open-other-tabs"
  | "image-url"
  | "image-url-open-other-tabs"

/**
 * Configuration for a single field in action forms (edit/view modals)
 * @interface ActionField
 */
export interface ActionField {
  key: string
  label: string
  type?: ActionFieldType
  /** HTML input type for type="input" (e.g. "email", "number", "password") */
  inputType?: string
  /** Options for type="select", "radio", "combobox" — string[], { label, value }[], or [label, value][] */
  options?: string[] | { label: string; value: string }[] | [string, string][]
  placeholder?: string
  required?: boolean
  /** Min value for type="slider" */
  min?: number
  /** Max value for type="slider" */
  max?: number
  /** Step for type="slider" */
  step?: number
  /** Number of OTP digits for type="otp" */
  digits?: number
  /** Validation: regex or built-in preset ("email" | "url" | "numeric" | "alpha" | "alphanumeric") */
  validation?: RegExp | "email" | "url" | "numeric" | "alpha" | "alphanumeric"
  /** Custom message shown when validation fails */
  validationMessage?: string
  /** Column span in grid layout (requires editFormGrid on DefaultActionsConfig) */
  colSpan?: number
  /** Row span in grid layout */
  rowSpan?: number
  /** Custom render — overrides built-in field renderer */
  render?: (value: any, onChange: (v: any) => void) => React.ReactNode
  /** Drop-in React component — rendered as-is, bypasses label and built-in renderer. Use for fully custom fields. */
  component?: React.ReactNode
  /** Hide this field from view/edit forms */
  hidden?: boolean
  /**
   * Display type for viewForm — controls how the value is rendered in the View modal.
   * Overrides type for view-only rendering.
   * "text" | "image" | "checkbox" | "toggle" | "attachment" |
   * "text-url" | "text-url-open-other-tabs" | "image-url" | "image-url-open-other-tabs"
   */
  viewType?: ViewFieldType
  /** Width applied to the field value in the View modal (e.g. 120, "100%", "8rem") */
  width?: number | string
  /** Height applied to the field value in the View modal (e.g. 80, "5rem") */
  height?: number | string
}

/**
 * Configuration for customizing the appearance of action buttons (View/Edit/Delete)
 * @interface ActionButtonConfig
 */
export interface ActionButtonConfig {
  /** Button variant. Defaults: view→"outline", edit→"outline", delete→"danger" */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger" | "success" | "destructive"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full"
  gradientFrom?: string
  gradientTo?: string
  gradientDirection?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl"
  bgColor?: string
  textColor?: string
  borderColor?: string
  borderWidth?: number
  shadow?: boolean
  /** Override the default icon */
  icon?: React.ReactNode
  /** Override the default label text */
  label?: string
  /** "icon" = icon only, "text" = label only, "icon-text" = icon + label. Default "icon" */
  displayMode?: "icon" | "text" | "icon-text"
  className?: string
}

/**
 * Configuration for extra custom action buttons added alongside default actions
 * @template T - The data type for table rows
 * @interface ExtraActionConfig
 */
export interface ExtraActionConfig<T> {
  /** Unique key */
  key: string
  /** Button label */
  label?: string
  /** Icon rendered in the button */
  icon?: React.ReactNode
  /** "icon" | "text" | "icon-text". Default "icon-text" */
  displayMode?: "icon" | "text" | "icon-text"
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger" | "success" | "destructive"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full"
  gradientFrom?: string
  gradientTo?: string
  gradientDirection?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl"
  bgColor?: string
  textColor?: string
  borderColor?: string
  borderWidth?: number
  shadow?: boolean
  className?: string
  onClick: (item: T) => void
}

/**
 * Configuration for default View/Edit/Delete actions on table rows
 * @template T - The data type for table rows
 * @interface DefaultActionsConfig
 */
export interface DefaultActionsConfig<T> {
  /**
   * Base URL used to build PUT and DELETE requests.
   * PUT  → `{baseUrl}/{id}/update`
   * DELETE → `{baseUrl}/{id}/delete`
   */
  baseUrl: string
  /** Row key used as the URL id segment. Defaults to "id". */
  idKey?: keyof T
  /** Position of the Actions column. Default "last". */
  position?: "first" | "last"
  /** Fields rendered in the Edit modal form. Auto-derived from row keys when omitted. */
  editForm?: ActionField[]
  /** Fields rendered in the View modal. Auto-derived from row keys when omitted. */
  viewForm?: ActionField[]
  /** Grid columns for the view form layout (e.g. 2 = two-column grid). Default single column. */
  viewFormGrid?: number
  /** Grid columns for the edit form layout (e.g. 2 = two-column grid). Default single column. */
  editFormGrid?: number
  /** Size of the View / Edit / Delete / extra action buttons. Default "xs". */
  actionsSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  /** Width of the Edit/View/Delete modal. Default "lg". */
  modalWidth?: ModalWidth
  /** Called after a successful edit or delete so the parent can refresh data. */
  onSuccess?: (action: "edit" | "delete", item: T) => void
  /** Show a toast or notification banner on successful edit/delete */
  onSuccessNotif?: ActionSuccessNotif
  /** Delete confirmation dialog config */
  deleteConfirm?: { title: string; message: string }
  /** Role/permission-based visibility for actions */
  permissions?: (item: T) => { view?: boolean; edit?: boolean; delete?: boolean }
  /** Hook called before edit — return false to cancel */
  beforeEdit?: (item: T) => Promise<boolean>
  /** Hook called before delete — return false to cancel */
  beforeDelete?: (item: T) => Promise<boolean>
  /** Customize the View button appearance */
  viewButton?: ActionButtonConfig
  /** Customize the Edit button appearance */
  editButton?: ActionButtonConfig
  /** Customize the Delete button appearance */
  deleteButton?: ActionButtonConfig
  /** Extra action buttons rendered alongside view/edit/delete */
  extraActions?: ExtraActionConfig<T>[]
  /** Called after a successful edit or delete to trigger a server-side reload (e.g. pass reload from useServerTable) */
  onReload?: () => void
}

/**
 * Configuration for success notifications after edit/delete operations
 * @interface ActionSuccessNotif
 */
export interface ActionSuccessNotif {
  /** "toast" uses the ToastProvider. "notification" renders an inline banner. Default "toast". */
  type?: "toast" | "notification"
  /** Toast position. Only used when type="toast". Default "bottom-right". */
  toastPosition?: ToastPosition
  /** Variant for edit success. Default "success". */
  editVariant?: ToastVariant
  /** Variant for delete success. Default "success". */
  deleteVariant?: ToastVariant
  /** Title for edit success notification */
  editTitle?: React.ReactNode
  /** Body/description for edit success notification */
  editBody?: React.ReactNode
  /** Title for delete success notification */
  deleteTitle?: React.ReactNode
  /** Body/description for delete success notification */
  deleteBody?: React.ReactNode
  /** Extra action element rendered inside the notification */
  action?: React.ReactNode
}

// ═══════════════════════════════════════════════════════════════════════════════
// Action Modals & Constants
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Predefined modal width options for View/Edit/Delete modals
 * @constant {Object} MODAL_WIDTH
 * @property {string} sm - Small: max-w-sm (384px)
 * @property {string} md - Medium: max-w-md (448px)
 * @property {string} lg - Large: max-w-lg (512px)
 * @property {string} xl - Extra Large: max-w-xl (576px)
 * @property {string} 2xl - 2X Large: max-w-2xl (672px)
 * @property {string} 3xl - 3X Large: max-w-3xl (768px)
 * @property {string} 4xl - 4X Large: max-w-4xl (896px)
 * @property {string} 5xl - 5X Large: max-w-5xl (1024px)
 * @property {string} 6xl - 6X Large: max-w-6xl (1152px)
 * @property {string} 7xl - 7X Large: max-w-7xl (1280px)
 * @property {string} screen - Screen width: max-w-screen-xl (1280px)
 * @property {string} full - Full width: max-w-full
 */
export const MODAL_WIDTH = {
  sm:     'max-w-sm',
  md:     'max-w-md',
  lg:     'max-w-lg',
  xl:     'max-w-xl',
  '2xl':  'max-w-2xl',
  '3xl':  'max-w-3xl',
  '4xl':  'max-w-4xl',
  '5xl':  'max-w-5xl',
  '6xl':  'max-w-6xl',
  '7xl':  'max-w-7xl',
  screen: 'max-w-screen-xl',
  full:   'max-w-full',
} as const
export type ModalWidth = keyof typeof MODAL_WIDTH

/**
 * Reusable modal shell component with consistent styling
 * 
 * @internal
 * @param props - Modal configuration
 * @returns Portal-rendered modal component
 */
function ModalShell({ title, onClose, children, footer, width = "lg" }: {
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  width?: ModalWidth
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`relative w-full ${MODAL_WIDTH[width]} rounded-2xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4 flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

const BUILT_IN_PATTERNS: Record<string, RegExp> = {
  email:        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url:          /^https?:\/\/.+/,
  numeric:      /^\d+(\.\d+)?$/,
  alpha:        /^[a-zA-Z]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
}

/**
 * Validates a field value against its validation rules
 * 
 * @param field - The field configuration to validate against
 * @param value - The value to validate
 * @returns Error message string if validation fails, null if valid
 * 
 * @example
 * ```tsx
 * const error = validateField({ label: "Email", required: true, validation: "email" }, "invalid")
 * // Returns: "Email is invalid"
 * ```
 */
export function validateField(field: ActionField, value: any): string | null {
  if (field.required && (value === "" || value === null || value === undefined))
    return `${field.label} is required`
  if (field.validation && value !== "" && value !== null && value !== undefined) {
    const pattern = field.validation instanceof RegExp
      ? field.validation
      : BUILT_IN_PATTERNS[field.validation]
    if (pattern && !pattern.test(String(value)))
      return field.validationMessage ?? `${field.label} is invalid`
  }
  return null
}

/**
 * Renders the appropriate input component based on field type
 * 
 * @internal
 * @param props - Field rendering configuration
 * @returns React node containing the rendered field
 */
function FieldRenderer({ field, value, onChange }: {
  field: ActionField
  value: any
  onChange: (v: any) => void
}) {
  if (field.component) return <>{field.component}</>
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
      return (
        <RadioGroup
          value={value ?? ""}
          onChange={(v) => onChange(v)}
          options={radioOptions}
        />
      )

    case "slider":
      return (
        <Slider
          value={value ?? field.min ?? 0}
          onChange={(v) => onChange(v)}
          min={field.min ?? 0}
          max={field.max ?? 100}
          step={field.step ?? 1}
        />
      )

    case "tag-input":
      return (
        <TagInput
          value={Array.isArray(value) ? value : []}
          onChange={(v) => onChange(v)}
          placeholder={field.placeholder}
        />
      )

    case "otp":
      return (
        <OtpInput
          length={field.digits ?? 6}
          value={value ?? ""}
          onChange={(v) => onChange(v)}
        />
      )

    case "combobox":
      return (
        <Combobox
          value={value ?? ""}
          onChange={(v) => onChange(v)}
          options={comboOptions}
          placeholder={field.placeholder ?? "Search…"}
        />
      )

    case "color-picker":
      return <ColorPicker value={value ?? "#6366f1"} onChange={(v) => onChange(v)} />

    case "date-range":
      return (
        <DateRangePicker
          value={value ?? null}
          onChange={(v) => onChange(v)}
        />
      )

    case "rich-text":
      return <RichTextEditor value={value ?? ""} onChange={(v) => onChange(v)} />

    case "file-upload":
      return <FileUpload onFileSelect={(file) => onChange(file)} onFilesChange={(files) => { if (files.length > 1) onChange(files) }} />

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
      return (
        <Input
          inputType="password"
          revealable
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? field.label}
        />
      )

    default:
      return (
        <Input
          inputType={field.inputType as any ?? "text"}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? field.label}
        />
      )
  }
}

/**
 * Modal component for viewing record details in read-only mode
 * 
 * @internal
 * @template T - The data type for the record
 * @param props - View modal configuration
 */
function ViewModal<T extends Record<string, any>>({
  item, fields, onClose, width, grid,
}: { item: T; fields: ActionField[]; onClose: () => void; width?: ModalWidth; grid?: number }) {
  const renderViewValue = (f: ActionField, value: any) => {
    const sizeStyle: React.CSSProperties = {
      ...(f.width  ? { width:  typeof f.width  === "number" ? `${f.width}px`  : f.width  } : {}),
      ...(f.height ? { height: typeof f.height === "number" ? `${f.height}px` : f.height } : {}),
    }
    const vt = f.viewType ?? (f.type as ViewFieldType | undefined)
    const empty = value === null || value === undefined || value === ""
    const dash = <span className="text-muted-foreground italic text-sm">—</span>

    if (f.component) return <>{f.component}</>
    if (f.render)    return <>{f.render(value, () => {})}</>

    switch (vt) {
      case "image":
        return empty ? dash : (
          <img src={value} alt={f.label}
            className="rounded-xl object-cover ring-1 ring-border"
            style={{ width: sizeStyle.width ?? 128, height: sizeStyle.height ?? 128 }}
          />
        )

      case "image-url":
        return empty ? dash : (
          <a href={value} onClick={(e) => e.preventDefault()}
            className="inline-block rounded-xl overflow-hidden ring-1 ring-border hover:ring-primary transition-all"
            style={{ width: sizeStyle.width ?? 128, height: sizeStyle.height ?? 128 }}
          >
            <img src={value} alt={f.label} className="w-full h-full object-cover" />
          </a>
        )

      case "image-url-open-other-tabs":
        return empty ? dash : (
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="inline-block rounded-xl overflow-hidden ring-1 ring-border hover:ring-primary transition-all"
            style={{ width: sizeStyle.width ?? 128, height: sizeStyle.height ?? 128 }}
          >
            <img src={value} alt={f.label} className="w-full h-full object-cover" />
          </a>
        )

      case "text-url":
        return empty ? dash : (
          <a href={value} onClick={(e) => e.preventDefault()}
            className="text-sm text-primary underline underline-offset-2 hover:text-primary/80 break-all"
            style={sizeStyle}
          >
            {value}
          </a>
        )

      case "text-url-open-other-tabs":
        return empty ? dash : (
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="text-sm text-primary underline underline-offset-2 hover:text-primary/80 break-all"
            style={sizeStyle}
          >
            {value}
          </a>
        )

      case "attachment":
        return empty ? dash : (
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            style={sizeStyle}
          >
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {String(value).split("/").pop() ?? "Download"}
          </a>
        )

      case "checkbox":
        return (
          <input type="checkbox" checked={!!value} readOnly
            className="h-4 w-4 rounded border-border accent-primary cursor-default"
            style={sizeStyle}
          />
        )

      case "toggle":
        return (
          <div
            className={cn(
              "relative inline-flex shrink-0 rounded-full border-2 border-transparent transition-colors",
              value ? "bg-primary" : "bg-muted"
            )}
            style={{ width: sizeStyle.width ?? 36, height: sizeStyle.height ?? 20 }}
          >
            <span
              className={cn(
                "pointer-events-none inline-block rounded-full bg-white shadow-sm transition-transform",
              )}
              style={{
                width:  typeof (sizeStyle.height ?? 20) === "number" ? (sizeStyle.height as number) - 4 : 16,
                height: typeof (sizeStyle.height ?? 20) === "number" ? (sizeStyle.height as number) - 4 : 16,
                transform: value ? `translateX(${typeof (sizeStyle.width ?? 36) === "number" ? (sizeStyle.width as number) - (sizeStyle.height as number ?? 20) : 16}px)` : "translateX(0)",
              }}
            />
          </div>
        )

      default:
        return empty ? dash : (
          <p className="text-sm text-foreground break-words" style={sizeStyle}>
            {String(value)}
          </p>
        )
    }
  }

  return (
    <ModalShell title="View Details" onClose={onClose} width={width}
      footer={<Button variant="outline" size="sm" onClick={onClose}>Close</Button>}>
      <div
        className={grid ? "grid gap-4" : "space-y-3"}
        style={grid ? { gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` } : undefined}
      >
        {fields.map((f) => (
          <div
            key={f.key}
            style={{
              ...(f.colSpan ? { gridColumn: `span ${f.colSpan}` } : {}),
              ...(f.rowSpan ? { gridRow:    `span ${f.rowSpan}` } : {}),
            }}
          >
            <p className="text-xs font-semibold text-muted-foreground mb-1">{f.label}</p>
            {renderViewValue(f, item[f.key])}
          </div>
        ))}
      </div>
    </ModalShell>
  )
}

/**
 * Modal component for editing record details with form fields
 * 
 * @internal
 * @template T - The data type for the record
 * @param props - Edit modal configuration
 */
function EditModal<T extends Record<string, any>>({
  item, fields, baseUrl, itemId, onClose, onSuccess, notif, grid, width,
}: {
  item: T
  fields: ActionField[]
  baseUrl: string
  itemId: string | number
  onClose: () => void
  onSuccess?: (item: T) => void
  notif?: ActionSuccessNotif
  grid?: number
  width?: ModalWidth
}) {
  const [form, setForm] = React.useState<Record<string, any>>(() => {
    const init: Record<string, any> = {}
    fields.forEach((f) => {
      // Initialize file-upload fields as null so we can detect if a new file was selected
      init[f.key] = f.type === "file-upload" ? null : (item[f.key] ?? "")
    })
    return init
  })
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError]     = React.useState<string | null>(null)
  const [banner, setBanner]   = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    fields.forEach((f) => {
      // For file-upload fields, skip required validation if the item already has an existing value
      if (f.type === "file-upload" && !form[f.key] && item[f.key]) return
      const msg = validateField(f, form[f.key])
      if (msg) errs[f.key] = msg
    })
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setFieldErrors({})
    setLoading(true)
    setError(null)
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
      if (!csrfToken) throw new Error("[Table] CSRF token not found.")

      // If any field contains File objects, send as multipart FormData instead of JSON
      const isFile = (v: any): v is File => v instanceof File
      const isFileArray = (v: any): v is File[] => Array.isArray(v) && v.length > 0 && v[0] instanceof File
      const hasFiles = Object.values(form).some((v) => isFile(v) || isFileArray(v))
      let body: FormData | Record<string, any>
      if (hasFiles) {
        const fd = new FormData()
        fd.append("_method", "PUT")
        Object.entries(form).forEach(([k, v]) => {
          if (isFileArray(v)) {
            v.forEach((f) => fd.append(k, f))
          } else if (isFile(v)) {
            fd.append(k, v)
          } else if (v === null || v === undefined) {
            // null = file-upload field with no new file selected — skip it
            // Laravel will keep the existing value on the server
          } else if (!Array.isArray(v)) {
            fd.append(k, String(v))
          }
        })
        body = fd
      } else {
        body = form
      }
      await axios.put(`${baseUrl}/${itemId}/update`, body, { headers: { "X-CSRF-Token": csrfToken } })
      const updated = { ...item, ...form } as T
      if (notif && (notif.type ?? "toast") === "notification") {
        setBanner(true)
        onSuccess?.(updated)
      } else {
        onSuccess?.(updated)
        onClose()
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? "Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell title="Edit Record" onClose={onClose} width={width}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </>
      }>
      <form onSubmit={handleSubmit} className={grid ? `grid gap-4` : "space-y-4"} style={grid ? { gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` } : undefined}>
        {banner && notif && (
          <div className="space-y-2" style={grid ? { gridColumn: `1 / -1` } : undefined}>
            <NotificationBanner
              variant={notif.editVariant ?? "success"}
              title={notif.editTitle ?? "Record updated"}
              description={notif.editBody}
              onClose={() => setBanner(false)}
            />
            {notif.action && <div>{notif.action}</div>}
          </div>
        )}
        {fields.map((f) => (
          <div
            key={f.key}
            style={{
              ...(f.colSpan ? { gridColumn: `span ${f.colSpan}` } : {}),
              ...(f.rowSpan ? { gridRow: `span ${f.rowSpan}` } : {}),
            }}
          >
            {f.component ? (
              <>{f.component}</>
            ) : (
              <>
                {f.type !== "checkbox" && (
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {f.label}{f.required && <span className="text-danger ml-0.5">*</span>}
                  </label>
                )}
                <FieldRenderer
                  field={f}
                  value={form[f.key]}
                  onChange={(v) => {
                    setForm((prev) => ({ ...prev, [f.key]: v }))
                    if (fieldErrors[f.key]) {
                      const msg = validateField(f, v)
                      setFieldErrors((prev) => ({ ...prev, [f.key]: msg ?? "" }))
                    }
                  }}
                />
                {fieldErrors[f.key] && <p className="text-xs text-danger mt-1">{fieldErrors[f.key]}</p>}
              </>
            )}
          </div>
        ))}
        {error && <p className="text-xs text-danger" style={grid ? { gridColumn: `1 / -1` } : undefined}>{error}</p>}
      </form>
    </ModalShell>
  )
}

/**
 * Modal component for confirming record deletion
 * 
 * @internal
 * @template T - The data type for the record
 * @param props - Delete modal configuration
 */
function DeleteModal<T extends Record<string, any>>({
  item, baseUrl, itemId, onClose, onSuccess, notif,
}: {
  item: T
  baseUrl: string
  itemId: string | number
  onClose: () => void
  onSuccess?: (item: T) => void
  notif?: ActionSuccessNotif
}) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError]     = React.useState<string | null>(null)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
      if (!csrfToken) throw new Error("[Table] CSRF token not found.")
      // Include CSRF token in both header and query param for defense-in-depth (CWE-352, CWE-1275)
      await axios.delete(`${baseUrl}/${itemId}/delete?csrfToken=${encodeURIComponent(csrfToken)}`, { headers: { "X-CSRF-Token": csrfToken } })
      onSuccess?.(item)
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? "Delete failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell title="Confirm Delete" onClose={onClose} width="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
            {loading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </>
      }>
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete this record? This action cannot be undone.
      </p>
      {error && <p className="text-xs text-danger mt-2">{error}</p>}
    </ModalShell>
  )
}

/**
 * Column definition for the Table component
 * @template T - The data type for table rows
 * @interface Column
 */
export interface Column<T> {
  key: keyof T | string
  title: string
  type?: "text" | "image" | "badge" | "icon" | "stack" | "select" | "toggle" | "color" | "checkbox" | "text-url"
  stackProps?: { limit?: number; stacked?: boolean; shape?: "circle" | "square"; size?: number }
  /** Options for type="select" */
  selectOptions?: string[]
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  /** Called when a cell value changes (select, toggle, color, checkbox) */
  onChange?: (item: T, value: any) => void
  /** Column width in px or CSS string */
  width?: number | string
  /** Text alignment: left, center, right */
  align?: "left" | "center" | "right"
  /** Enable column-level filtering */
  filterable?: boolean
  /** Filter type: text, select, date, range */
  filterType?: "text" | "select" | "date" | "range"
  /** Hide this column */
  hidden?: boolean
  /** Tooltip text generator */
  tooltip?: (item: T) => string
  /** Allow copying cell content */
  copyable?: boolean
  /**
   * For type="text-url": static URL to navigate to. If omitted, uses the cell value as the URL.
   * Supports dynamic URL via function: (item) => string
   */
  redirect?: string | ((item: T) => string)
  /** For type="text-url": open link in a new tab. Default false. */
  openNewTab?: boolean
  /**
   * For type="text-url": underline color.
   * Accepts: "primary" | "info" | "success" | "warning" | "danger" | any hex | rgb | rgba string.
   */
  underlineColor?: "primary" | "info" | "success" | "warning" | "danger" | string
}

/**
 * Props for the Table component
 * @template T - The data type for table rows
 * @interface TableProps
 */
export interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  // Loading & Error States
  loading?: boolean
  emptyState?: React.ReactNode
  error?: string | null
  // Controlled State (AI-agent friendly)
  searchValue?: string
  onSearchChange?: (value: string) => void
  page?: number
  onPageChange?: (page: number) => void
  sort?: { key: string; direction: "asc" | "desc" }[]
  onSortChange?: (sort: { key: string; direction: "asc" | "desc" }[]) => void
  // Row Events
  onRowClick?: (item: T) => void
  onRowDoubleClick?: (item: T) => void
  rowClassName?: (item: T) => string
  // Expandable Rows
  expandable?: boolean
  renderExpanded?: (item: T) => React.ReactNode
  // Column Visibility
  columnVisibility?: Record<string, boolean>
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void
  // Export
  exportable?: boolean
  onExport?: (type: "csv" | "excel" | "pdf") => void
  // Advanced Features
  virtualized?: boolean
  draggable?: boolean
  onRowReorder?: (data: T[]) => void
  keyboardNavigation?: boolean
  theme?: "light" | "dark" | "auto"
  meta?: Record<string, any>
  actions?: Record<string, (item: T) => void>
  // Legacy Props
  searchable?: boolean
  searchPlaceholder?: string
  pagination?: boolean
  itemsPerPage?: number
  selectable?: boolean
  onBulkDelete?: (selectedIds: string[]) => void
  idKey?: keyof T
  /**
   * Base URL for built-in bulk delete actions.
   * DELETE all   → `{bulkDeleteBaseUrl}/delete/all`
   * DELETE selected → `{bulkDeleteBaseUrl}/delete/{ids}/selected`
   */
  bulkDeleteBaseUrl?: string
  /** When provided, appends an Actions column with View / Edit / Delete buttons */
  defaultActions?: DefaultActionsConfig<T>
  /** Pass the serverPagination object from useServerTable to enable server-side pagination */
  serverPagination?: ServerPaginationProp | null
  className?: string
}

// ── ActionBtn helper ────────────────────────────────────────────────────────

/**
 * Reusable action button component with customizable appearance
 * 
 * @param props - Button configuration including custom config, defaults, and click handler
 * @returns Rendered button element
 */
export function ActionBtn({
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

const BADGE_COLORS: Record<string, string> = {
  active:   "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  warning:  "bg-warning/10 text-warning border-warning/20",
  error:    "bg-danger/10 text-danger border-danger/20",
  pending:  "bg-info/10 text-info border-info/20",
}

/**
 * Returns the appropriate CSS class for badge styling based on value
 * 
 * @internal
 * @param value - The badge value to get styles for
 * @returns CSS class string for the badge
 */
function badgeClass(value: string) {
  return BADGE_COLORS[value.toLowerCase()] ?? "bg-primary/10 text-primary border-primary/20"
}

/**
 * Sort direction type for table column sorting
 * @type {SortDir}
 */
type SortDir = "asc" | "desc" | null

/**
 * Data table component with sorting, filtering, pagination, and CRUD actions
 * 
 * @template T - The data type for table rows (must be a record with string keys)
 * @param props - Table configuration including data, columns, and options
 * @returns Rendered table with toolbar, pagination, and optional action modals
 * 
 * @example
 * ```tsx
 * <Table
 *   data={users}
 *   columns={[
 *     { key: "name", title: "Name", sortable: true },
 *     { key: "status", type: "badge" },
 *     { key: "active", type: "toggle", onChange: handleToggle },
 *   ]}
 *   searchable
 *   pagination
 *   selectable
 *   onBulkDelete={handleBulkDelete}
 *   defaultActions={{
 *     baseUrl: "/api/users",
 *     editForm: [{ key: "name", label: "Name", required: true }],
 *   }}
 * />
 * ```
 */
export function Table<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = "Search...",
  pagination = false,
  itemsPerPage = 10,
  selectable = false,
  onBulkDelete,
  idKey = "id" as keyof T,
  bulkDeleteBaseUrl,
  defaultActions,
  serverPagination,
  className,
}: TableProps<T>) {
  const { toast } = useToast()
  const [search, setSearch] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<SortDir>(null)
  const [bulkLoading, setBulkLoading] = React.useState(false)

  // ── Default actions modal state ───────────────────────────────────────────────
  const [viewItem,   setViewItem]   = React.useState<T | null>(null)
  const [editItem,   setEditItem]   = React.useState<T | null>(null)
  const [deleteItem, setDeleteItem] = React.useState<T | null>(null)
  const [tableData,  setTableData]  = React.useState<T[]>(data ?? [])

  // Keep tableData in sync when data prop changes
  React.useEffect(() => { setTableData(data ?? []) }, [data])

  const actionIdKey = (defaultActions?.idKey ?? idKey) as keyof T

  // Sanitize baseUrl — strip trailing slash to prevent double // in built URLs
  const safeBaseUrl = defaultActions?.baseUrl.replace(/\/+$/, "") ?? ""

  // Auto-derive fields from first row keys when editForm/viewForm not provided
  const autoFields = React.useMemo((): ActionField[] => {
    if (!tableData.length) return []
    return Object.keys(tableData[0]).map((k) => ({
      key: k,
      label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    }))
  }, [tableData])

  const editFields  = defaultActions?.editForm  ?? autoFields
  const viewFields  = defaultActions?.viewForm  ?? autoFields

  // Append actions column when defaultActions is set
  const allColumns: Column<T>[] = React.useMemo(() => {
    if (!defaultActions) return columns
    const actionsCol: Column<T> = {
      key: "__actions__" as keyof T,
      title: "Actions",
      render: (item) => (
        <div className="flex items-center gap-1">
          <ActionBtn
            cfg={defaultActions.viewButton}
            defaultIcon={<Eye className="h-3.5 w-3.5" />}
            defaultLabel="View"
            defaultVariant="outline"
            onClick={() => setViewItem(item)}
          />
          <ActionBtn
            cfg={defaultActions.editButton}
            defaultIcon={<Pencil className="h-3.5 w-3.5" />}
            defaultLabel="Edit"
            defaultVariant="outline"
            onClick={() => setEditItem(item)}
          />
          <ActionBtn
            cfg={defaultActions.deleteButton}
            defaultIcon={<Trash className="h-3.5 w-3.5" />}
            defaultLabel="Delete"
            defaultVariant="danger"
            onClick={() => setDeleteItem(item)}
          />
          {defaultActions.extraActions?.map((extra) => (
            <ActionBtn
              key={extra.key}
              cfg={extra}
              defaultIcon={extra.icon}
              defaultLabel={extra.label ?? extra.key}
              defaultVariant={extra.variant ?? "outline"}
              defaultSize={defaultActions.actionsSize as "xs" | "sm" | "md" | "lg" | "xl"}
              onClick={() => extra.onClick(item)}
            />
          ))}
        </div>
      ),
    }
    return defaultActions.position === "first"
      ? [actionsCol, ...columns]
      : [...columns, actionsCol]
  }, [columns, defaultActions])

  const handleSort = (key: string) => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); return }
    if (sortDir === "asc") { setSortDir("desc"); return }
    setSortKey(null); setSortDir(null)
  }

  const filteredData = React.useMemo(() => {
    let d = search
      ? tableData.filter((item) =>
          Object.values(item).some(
            (val) => val && typeof val === "string" && val.toLowerCase().includes(search.toLowerCase())
          )
        )
      : tableData

    if (sortKey && sortDir) {
      d = [...d].sort((a, b) => {
        const av = a[sortKey] ?? ""
        const bv = b[sortKey] ?? ""
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
        return sortDir === "asc" ? cmp : -cmp
      })
    }
    return d
  }, [tableData, search, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))

  const safePage = Math.min(currentPage, totalPages)

  const paginatedData = React.useMemo(() => {
    if (!pagination) return filteredData
    const start = (safePage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, pagination, safePage, itemsPerPage])

  // Reset to page 1 on search
  React.useEffect(() => { setCurrentPage(1) }, [search])

  const handleSelectAll = (checked: boolean) =>
    setSelectedIds(checked ? paginatedData.map((item) => String(item[idKey])) : [])

  const handleSelect = (id: string, checked: boolean) =>
    setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((i) => i !== id))

  const allSelected = paginatedData.length > 0 && selectedIds.length === paginatedData.length

  const totalRows = serverPagination ? serverPagination.pagination.total : filteredData.length
  const unselectedCount = totalRows - selectedIds.length

  const handleSelectAllRecords = () =>
    setSelectedIds(filteredData.map((item) => String(item[idKey])))

  const handleUnselectAll = () => setSelectedIds([])

  const handleBulkDeleteSelected = async () => {
    if (!bulkDeleteBaseUrl || selectedIds.length === 0) {
      onBulkDelete?.(selectedIds)
      setSelectedIds([])
      return
    }
    setBulkLoading(true)
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
      if (!csrfToken) throw new Error("[Table] CSRF token not found.")
      const safeUrl = bulkDeleteBaseUrl.replace(/\/+$/, "")
      await axios.delete(`${safeUrl}/delete/${selectedIds.join(",")}/selected`, { headers: { "X-CSRF-Token": csrfToken } })
      setTableData((prev) => prev.filter((r) => !selectedIds.includes(String(r[idKey]))))
      onBulkDelete?.(selectedIds)
      setSelectedIds([])
      defaultActions?.onReload?.()
    } catch (err: any) {
      console.error("[Table] Bulk delete selected failed:", err?.response?.data?.message ?? err.message)
    } finally {
      setBulkLoading(false)
    }
  }

  const handleDeleteAll = async () => {
    if (!bulkDeleteBaseUrl) return
    setBulkLoading(true)
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
      if (!csrfToken) throw new Error("[Table] CSRF token not found.")
      const safeUrl = bulkDeleteBaseUrl.replace(/\/+$/, "")
      await axios.delete(`${safeUrl}/delete/all`, { headers: { "X-CSRF-Token": csrfToken } })
      setTableData([])
      setSelectedIds([])
      defaultActions?.onReload?.()
    } catch (err: any) {
      console.error("[Table] Delete all failed:", err?.response?.data?.message ?? err.message)
    } finally {
      setBulkLoading(false)
    }
  }

  // Page pills — show at most 5
  const pagePills = React.useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (safePage <= 3) return [1, 2, 3, 4, 5]
    if (safePage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2]
  }, [totalPages, safePage])

  const SortIcon = ({ col }: { col: Column<T> }) => {
    if (!col.sortable) return null
    if (sortKey !== String(col.key)) return <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />
    return sortDir === "asc"
      ? <ChevronUp className="ml-1.5 h-3.5 w-3.5 text-primary" />
      : <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-primary" />
  }

  return (
    <>
    <div className={cn("w-full space-y-3", className)}>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {searchable && (
          <div className="relative w-72">
            <Search className="absolute text-primary left-3 top-1/2 -translate-y-1/2 h-4 w-4 z-10" />
            <input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-background/50 backdrop-blur-sm pl-9 pr-8 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors hover:bg-background/80"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {selectable && selectedIds.length > 0 && (
            <>
              {/* Unselect all */}
              <button
                onClick={handleUnselectAll}
                disabled={bulkLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40"
              >
                <X className="h-3.5 w-3.5" />
                Unselect all {selectedIds.length}
              </button>

              {/* Delete selected */}
              <button
                onClick={handleBulkDeleteSelected}
                disabled={bulkLoading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-danger/10 border border-danger/20 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/20 transition-colors disabled:opacity-40"
              >
                {bulkLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Delete {selectedIds.length} selected
              </button>
            </>
          )}

          {selectable && unselectedCount > 0 && (
            <button
              onClick={handleSelectAllRecords}
              disabled={bulkLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40"
            >
              Select all {unselectedCount}
            </button>
          )}

          {selectable && bulkDeleteBaseUrl && (
            <button
              onClick={handleDeleteAll}
              disabled={bulkLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-danger/10 border border-danger/20 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/20 transition-colors disabled:opacity-40"
            >
              {bulkLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Delete all
            </button>
          )}

          <span className="text-xs text-muted-foreground">
            {totalRows} {totalRows === 1 ? "row" : "rows"}
            {search && ` · filtered from ${tableData.length}`}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">

            <thead>
              <tr className="border-b border-border bg-muted/40">
                {selectable && (
                  <th className="h-11 w-[46px] px-4 text-left align-middle">
                    <Checkbox
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                )}
                {allColumns.map((col, ci) => (
                  <th
                    key={`${String(col.key)}-${ci}`}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                    className={cn(
                      "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none whitespace-nowrap",
                      col.sortable && "cursor-pointer hover:text-foreground transition-colors"
                    )}
                  >
                    <span className="inline-flex items-center">
                      {col.title}
                      <SortIcon col={col} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={allColumns.length + (selectable ? 1 : 0)}
                    className="h-32 text-center align-middle"
                  >
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Search className="h-8 w-8 opacity-20" />
                      <span className="text-sm">No results found</span>
                      {search && (
                        <button onClick={() => setSearch("")} className="text-xs text-primary hover:underline">
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, i) => {
                  const id = String(item[idKey] || i)
                  const isSelected = selectedIds.includes(id)
                  return (
                    <tr
                      key={id}
                      className={cn(
                        "border-b border-border/60 transition-colors last:border-0",
                        isSelected
                          ? "bg-primary/5 hover:bg-primary/8"
                          : "hover:bg-muted/30"
                      )}
                    >
                      {selectable && (
                        <td className="px-4 py-3 align-middle">
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => handleSelect(id, e.target.checked)}
                          />
                        </td>
                      )}
                      {allColumns.map((col, ci) => (
                        <td key={`${String(col.key)}-${ci}`} className="px-4 py-3 align-middle">
                          {col.render ? (
                            col.render(item)
                          ) : col.type === "image" ? (
                            <img
                              src={item[col.key]}
                              alt={item[col.key]}
                              className="h-9 w-9 rounded-lg object-cover ring-1 ring-border"
                            />
                          ) : col.type === "badge" ? (
                            <span className={cn(
                              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                              badgeClass(String(item[col.key]))
                            )}>
                              <span className={cn(
                                "mr-1.5 h-1.5 w-1.5 rounded-full",
                                badgeClass(String(item[col.key])).includes("success") ? "bg-success" :
                                badgeClass(String(item[col.key])).includes("warning") ? "bg-warning" :
                                badgeClass(String(item[col.key])).includes("danger")  ? "bg-danger"  :
                                badgeClass(String(item[col.key])).includes("info")    ? "bg-info"    : "bg-primary"
                              )} />
                              {item[col.key]}
                            </span>
                          ) : col.type === "stack" ? (
                            <AvatarStack images={Array.isArray(item[col.key]) ? item[col.key] : []} {...(col.stackProps ?? {})} />
                          ) : col.type === "icon" ? (
                            <span className="flex items-center">{item[col.key]}</span>
                          ) : col.type === "select" ? (
                            <select
                              value={item[col.key]}
                              onChange={(e) => col.onChange?.(item, e.target.value)}
                              className="h-8 rounded-lg border border-border bg-background/50 px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                            >
                              {(col.selectOptions ?? []).map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : col.type === "toggle" ? (
                            <button
                              role="switch"
                              aria-checked={!!item[col.key]}
                              onClick={() => col.onChange?.(item, !item[col.key])}
                              className={cn(
                                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                item[col.key] ? "bg-primary" : "bg-muted"
                              )}
                            >
                              <span className={cn(
                                "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                                item[col.key] ? "translate-x-4" : "translate-x-0"
                              )} />
                            </button>
                          ) : col.type === "color" ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={item[col.key] || "#000000"}
                                onChange={(e) => col.onChange?.(item, e.target.value)}
                                className="h-7 w-7 cursor-pointer rounded border border-border bg-transparent p-0.5"
                              />
                              <span className="text-xs text-muted-foreground font-mono">{item[col.key]}</span>
                            </div>
                          ) : col.type === "checkbox" ? (
                            <Checkbox
                              checked={!!item[col.key]}
                              onChange={(e) => col.onChange?.(item, e.target.checked)}
                            />
                          ) : col.type === "text-url" ? (() => {
                            const href = col.redirect
                              ? (typeof col.redirect === "function" ? col.redirect(item) : col.redirect)
                              : String(item[col.key] ?? "")
                            const colorMap: Record<string, string> = {
                              primary: "var(--primary)", info: "var(--info)",
                              success: "var(--success)", warning: "var(--warning)", danger: "var(--danger)",
                            }
                            const underline = col.underlineColor
                              ? colorMap[col.underlineColor] ?? col.underlineColor
                              : "var(--primary)"
                            return (
                              <a
                                href={href}
                                target={col.openNewTab ? "_blank" : undefined}
                                rel={col.openNewTab ? "noopener noreferrer" : undefined}
                                style={{ textDecorationColor: underline }}
                                className="text-sm underline underline-offset-2 hover:opacity-75 transition-opacity break-all"
                                onClick={col.openNewTab ? undefined : (e) => e.preventDefault()}
                              >
                                {item[col.key]}
                              </a>
                            )
                          })() : (
                            <span className="text-foreground/90">{item[col.key]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client-side pagination */}
      {pagination && !serverPagination && totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">
            Showing {(safePage - 1) * itemsPerPage + 1}–{Math.min(safePage * itemsPerPage, filteredData.length)} of {filteredData.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pagePills[0] > 1 && (
              <>
                <button onClick={() => setCurrentPage(1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted transition-colors">1</button>
                {pagePills[0] > 2 && <span className="px-1 text-muted-foreground text-xs">…</span>}
              </>
            )}
            {pagePills.map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                  p === safePage ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>{p}</button>
            ))}
            {pagePills[pagePills.length - 1] < totalPages && (
              <>
                {pagePills[pagePills.length - 1] < totalPages - 1 && <span className="px-1 text-muted-foreground text-xs">…</span>}
                <button onClick={() => setCurrentPage(totalPages)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted transition-colors">{totalPages}</button>
              </>
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
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
    </div>

      {/* Default action modals */}
      {defaultActions && viewItem && (
        <ViewModal
          item={viewItem}
          fields={viewFields}
          width={defaultActions.modalWidth}
          grid={defaultActions.viewFormGrid}
          onClose={() => setViewItem(null)}
        />
      )}
      {defaultActions && editItem && (
        <EditModal
          item={editItem}
          fields={editFields}
          baseUrl={safeBaseUrl}
          itemId={String(editItem[actionIdKey] ?? "")}
          notif={defaultActions.onSuccessNotif}
          grid={defaultActions.editFormGrid}
          width={defaultActions.modalWidth}
          onClose={() => setEditItem(null)}
          onSuccess={(updated) => {
            setTableData((prev) =>
              prev.map((r) => String(r[actionIdKey]) === String(updated[actionIdKey]) ? updated : r)
            )
            defaultActions.onSuccess?.("edit", updated)
            defaultActions.onReload?.()
            const notif = defaultActions.onSuccessNotif
            if (notif && (notif.type ?? "toast") === "toast") {
              toast({
                variant: notif.editVariant ?? "success",
                title: notif.editTitle ?? "Record updated",
                description: notif.editBody,
                position: notif.toastPosition,
              })
            }
          }}
        />
      )}
      {defaultActions && deleteItem && (
        <DeleteModal
          item={deleteItem}
          baseUrl={safeBaseUrl}
          itemId={String(deleteItem[actionIdKey] ?? "")}
          notif={defaultActions.onSuccessNotif}
          onClose={() => setDeleteItem(null)}
          onSuccess={(deleted) => {
            setTableData((prev) =>
              prev.filter((r) => String(r[actionIdKey]) !== String(deleted[actionIdKey]))
            )
            defaultActions.onSuccess?.("delete", deleted)
            defaultActions.onReload?.()
            const notif = defaultActions.onSuccessNotif
            if (notif && (notif.type ?? "toast") === "toast") {
              toast({
                variant: notif.deleteVariant ?? "success",
                title: notif.deleteTitle ?? "Record deleted",
                description: notif.deleteBody,
                position: notif.toastPosition,
              })
            }
          }}
        />
      )}
    </>
  )
}
