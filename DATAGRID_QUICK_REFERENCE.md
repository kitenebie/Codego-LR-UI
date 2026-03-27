# DataGrid Quick Reference

## Import
```tsx
import { Table, useServerTable, ActionBtn } from "@juv/codego-react-ui"
import type { Column, DefaultActionsConfig, ActionField } from "@juv/codego-react-ui"
```

## Basic Table
```tsx
<Table data={data} columns={columns} />
```

## With Search & Pagination
```tsx
<Table
  data={data}
  columns={columns}
  searchable
  pagination
  itemsPerPage={10}
/>
```

## With Row Selection
```tsx
<Table
  data={data}
  columns={columns}
  selectable
  onBulkDelete={(ids) => deleteMultiple(ids)}
/>
```

## With CRUD Actions
```tsx
<Table
  data={data}
  columns={columns}
  defaultActions={{
    baseUrl: "/api/users",
    editForm: [
      { key: "name", label: "Name", required: true },
      { key: "email", label: "Email", validation: "email" },
    ],
    onSuccess: () => reload(),
  }}
/>
```

## Server-Side Pagination
```tsx
const { data, columns, serverPagination, loading } = useServerTable({
  url: "/api/users",
})

<Table
  data={data}
  columns={columns}
  loading={loading}
  serverPagination={serverPagination}
/>
```

## Controlled State (AI-Agent)
```tsx
const [search, setSearch] = useState("")
const [page, setPage] = useState(1)
const [sort, setSort] = useState([])

<Table
  data={data}
  columns={columns}
  searchValue={search}
  onSearchChange={setSearch}
  page={page}
  onPageChange={setPage}
  sort={sort}
  onSortChange={setSort}
/>
```

## Expandable Rows
```tsx
<Table
  data={data}
  columns={columns}
  expandable
  renderExpanded={(item) => <Details item={item} />}
/>
```

## Column Visibility
```tsx
const [visibility, setVisibility] = useState({ email: true, phone: false })

<Table
  data={data}
  columns={columns}
  columnVisibility={visibility}
  onColumnVisibilityChange={setVisibility}
/>
```

## Row Events
```tsx
<Table
  data={data}
  columns={columns}
  onRowClick={(item) => console.log("Clicked", item)}
  onRowDoubleClick={(item) => openEdit(item)}
  rowClassName={(item) => item.active ? "bg-success/5" : ""}
/>
```

## Export
```tsx
<Table
  data={data}
  columns={columns}
  exportable
  onExport={(type) => {
    if (type === "csv") exportCSV(data)
    if (type === "excel") exportExcel(data)
    if (type === "pdf") exportPDF(data)
  }}
/>
```

## Advanced Features
```tsx
<Table
  data={data}
  columns={columns}
  virtualized                    // Large datasets
  draggable                      // Drag-drop reordering
  onRowReorder={(data) => setData(data)}
  keyboardNavigation             // Arrow keys, Enter, etc.
  theme="dark"                   // light | dark | auto
  meta={{ userId: 123 }}         // AI metadata
  actions={{                     // Custom actions
    archive: (item) => archive(item),
    export: (item) => export(item),
  }}
/>
```

## Column Types
```tsx
const columns: Column<T>[] = [
  { key: "name", title: "Name", type: "text" },           // Default
  { key: "avatar", title: "Avatar", type: "image" },      // Image
  { key: "status", title: "Status", type: "badge" },      // Badge
  { key: "icon", title: "Icon", type: "icon" },           // Icon
  { key: "tags", title: "Tags", type: "stack" },          // Avatar stack
  { key: "role", title: "Role", type: "select", selectOptions: ["Admin", "User"] },
  { key: "active", title: "Active", type: "toggle" },     // Toggle switch
  { key: "color", title: "Color", type: "color" },        // Color picker
  { key: "checked", title: "Checked", type: "checkbox" }, // Checkbox
]
```

## Column Props
```tsx
{
  key: "email",
  title: "Email",
  width: 200,                    // Column width
  align: "left",                 // left | center | right
  sortable: true,                // Enable sorting
  filterable: true,              // Enable filtering
  filterType: "text",            // text | select | date | range
  hidden: false,                 // Hide column
  copyable: true,                // Allow copying
  tooltip: (item) => item.email, // Tooltip text
  render: (item) => <span>{item.email}</span>, // Custom render
  onChange: (item, value) => updateEmail(item, value), // Cell change
}
```

## Form Fields
```tsx
const editForm: ActionField[] = [
  { key: "name", label: "Name", type: "input", required: true },
  { key: "email", label: "Email", type: "input", inputType: "email", validation: "email" },
  { key: "bio", label: "Bio", type: "textarea" },
  { key: "role", label: "Role", type: "select", options: ["Admin", "User"] },
  { key: "active", label: "Active", type: "toggle" },
  { key: "priority", label: "Priority", type: "slider", min: 1, max: 10 },
  { key: "tags", label: "Tags", type: "tag-input" },
  { key: "code", label: "Code", type: "otp", digits: 6 },
  { key: "color", label: "Color", type: "color-picker" },
  { key: "dates", label: "Dates", type: "date-range" },
  { key: "content", label: "Content", type: "rich-text" },
  { key: "files", label: "Files", type: "file-upload" },
]
```

## Permissions & Hooks
```tsx
defaultActions={{
  baseUrl: "/api/users",
  permissions: (item) => ({
    view: true,
    edit: item.role === "admin",
    delete: currentUser.role === "admin",
  }),
  beforeEdit: async (item) => {
    const ok = await confirm(`Edit ${item.name}?`)
    return ok
  },
  beforeDelete: async (item) => {
    const ok = await confirm(`Delete ${item.name}?`)
    return ok
  },
  deleteConfirm: {
    title: "Delete User",
    message: "This action cannot be undone.",
  },
}}
```

## useServerTable Options
```tsx
const { data, columns, loading, serverPagination, reload, onSearchChange } = useServerTable({
  url: "/api/users",
  params: { sort: "name" },
  encrypt: true,
  key: import.meta.env.VITE_LARAVEL_KEY,
  decryptPayloadLog: false,
  columnOverrides: {
    status: { type: "badge" },
    active: { type: "toggle", onChange: (item, v) => patch(item.id, v) },
  },
  debounce: 300,                           // Search debounce
  transform: (res) => res.data,            // Response transformer
  manual: false,                           // Manual fetch
  onSuccess: (data) => console.log(data),  // Success callback
  onError: (err) => console.error(err),    // Error callback
})
```

## Reducer Pattern (AI-Agent)
```tsx
const tableReducer = (state, action) => {
  switch (action.type) {
    case "SEARCH":
      return { ...state, search: action.payload, page: 1 }
    case "SORT":
      return { ...state, sort: action.payload }
    case "PAGE":
      return { ...state, page: action.payload }
    case "VISIBILITY":
      return { ...state, columnVisibility: action.payload }
    case "ROW_SELECT":
      return { ...state, selectedRow: action.payload }
    default:
      return state
  }
}

const [state, dispatch] = useReducer(tableReducer, initialState)

<Table
  searchValue={state.search}
  onSearchChange={(v) => dispatch({ type: "SEARCH", payload: v })}
  sort={state.sort}
  onSortChange={(s) => dispatch({ type: "SORT", payload: s })}
  page={state.page}
  onPageChange={(p) => dispatch({ type: "PAGE", payload: p })}
  columnVisibility={state.columnVisibility}
  onColumnVisibilityChange={(v) => dispatch({ type: "VISIBILITY", payload: v })}
  onRowClick={(item) => dispatch({ type: "ROW_SELECT", payload: item })}
/>
```

## Complete Example
```tsx
import { Table, useServerTable } from "@juv/codego-react-ui"
import { useState, useReducer } from "react"

interface User {
  id: number
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "inactive"
}

export function UsersPage() {
  const [state, dispatch] = useReducer(tableReducer, {
    search: "",
    page: 1,
    sort: [],
    columnVisibility: { email: true },
  })

  const { data, columns, loading, serverPagination, reload } = useServerTable<User>({
    url: "/api/users",
    debounce: 300,
    onSuccess: (data) => console.log("Loaded", data.length, "users"),
  })

  return (
    <Table<User>
      data={data}
      columns={columns}
      loading={loading}
      serverPagination={serverPagination}
      searchValue={state.search}
      onSearchChange={(v) => dispatch({ type: "SEARCH", payload: v })}
      sort={state.sort}
      onSortChange={(s) => dispatch({ type: "SORT", payload: s })}
      page={state.page}
      onPageChange={(p) => dispatch({ type: "PAGE", payload: p })}
      columnVisibility={state.columnVisibility}
      onColumnVisibilityChange={(v) => dispatch({ type: "VISIBILITY", payload: v })}
      expandable
      renderExpanded={(item) => <UserDetails user={item} />}
      defaultActions={{
        baseUrl: "/api/users",
        editForm: [
          { key: "name", label: "Name", required: true },
          { key: "email", label: "Email", validation: "email", required: true },
          { key: "role", label: "Role", type: "select", options: ["admin", "editor", "viewer"] },
        ],
        editFormGrid: 2,
        permissions: (item) => ({
          edit: item.role !== "admin",
          delete: true,
        }),
        onSuccess: () => reload(),
      }}
      meta={{ userId: 123 }}
      actions={{
        archive: (item) => console.log("Archive", item),
        export: (item) => console.log("Export", item),
      }}
    />
  )
}
```

## Validation Presets
```tsx
validation: "email"        // Email format
validation: "url"          // URL format
validation: "numeric"      // Numbers only
validation: "alpha"        // Letters only
validation: "alphanumeric" // Letters and numbers
validation: /^[A-Z]+$/     // Custom regex
```

## Modal Widths
```tsx
modalWidth: "sm"     // 384px
modalWidth: "md"     // 448px
modalWidth: "lg"     // 512px (default)
modalWidth: "xl"     // 576px
modalWidth: "2xl"    // 672px
modalWidth: "3xl"    // 768px
modalWidth: "4xl"    // 896px
modalWidth: "5xl"    // 1024px
modalWidth: "6xl"    // 1152px
modalWidth: "7xl"    // 1280px
modalWidth: "screen" // 1280px
modalWidth: "full"   // 100%
```

## Button Sizes
```tsx
actionsSize: "xs"   // Extra small
actionsSize: "sm"   // Small
actionsSize: "md"   // Medium
actionsSize: "lg"   // Large
actionsSize: "xl"   // Extra large
actionsSize: "2xl"  // 2X large
```

## Themes
```tsx
theme: "light"  // Light mode
theme: "dark"   // Dark mode
theme: "auto"   // System preference
```

---

**For detailed documentation, see TABLE_DATAGRID.md**
