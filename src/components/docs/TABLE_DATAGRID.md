# DataGrid Component Documentation

Enhanced Table component with AI-agent friendly capabilities for advanced data management.

## Quick Start

### Basic Table
```tsx
import { Table } from "@juv/codego-react-ui"

<Table
  data={users}
  columns={[
    { key: "name", title: "Name", sortable: true },
    { key: "email", title: "Email" },
    { key: "status", title: "Status", type: "badge" },
  ]}
/>
```

### Server-Side Pagination
```tsx
import { Table, useServerTable } from "@juv/codego-react-ui"

const { data, columns, loading, serverPagination, reload } = useServerTable({
  url: "/api/users",
  debounce: 300,
  transform: (res) => res.data,
  onSuccess: (data) => console.log("Loaded", data),
})

<Table
  data={data}
  columns={columns}
  loading={loading}
  serverPagination={serverPagination}
  defaultActions={{
    baseUrl: "/api/users",
    editForm: [{ key: "name", label: "Name", required: true }],
    onSuccess: () => reload(),
  }}
/>
```

---

## Core Features

### 1. Loading, Empty State & Error Handling

```tsx
<Table
  data={items}
  columns={columns}
  loading={isLoading}
  error={errorMessage}
  emptyState={<div>No data available</div>}
/>
```

**Props:**
- `loading: boolean` - Show loading skeleton
- `error: string | null` - Display error message
- `emptyState: React.ReactNode` - Custom empty state UI

---

### 2. Controlled State (AI-Agent Friendly)

```tsx
const [searchValue, setSearchValue] = useState("")
const [page, setPage] = useState(1)
const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" }[]>([])

<Table
  data={data}
  columns={columns}
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  page={page}
  onPageChange={setPage}
  sort={sort}
  onSortChange={setSort}
/>
```

**Props:**
- `searchValue: string` - Controlled search input
- `onSearchChange: (value: string) => void` - Search callback
- `page: number` - Current page (1-indexed)
- `onPageChange: (page: number) => void` - Page change callback
- `sort: { key: string; direction: "asc" | "desc" }[]` - Multi-column sort
- `onSortChange: (sort) => void` - Sort change callback

---

### 3. Row Events & Interactions

```tsx
<Table
  data={data}
  columns={columns}
  onRowClick={(item) => console.log("Clicked:", item)}
  onRowDoubleClick={(item) => openEditModal(item)}
  rowClassName={(item) => item.status === "active" ? "bg-success/5" : ""}
/>
```

**Props:**
- `onRowClick: (item: T) => void` - Single click handler
- `onRowDoubleClick: (item: T) => void` - Double click handler
- `rowClassName: (item: T) => string` - Dynamic row styling

---

### 4. Expandable Rows

```tsx
<Table
  data={data}
  columns={columns}
  expandable
  renderExpanded={(item) => (
    <div className="p-4 bg-muted/50">
      <p>Details for {item.name}</p>
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </div>
  )}
/>
```

**Props:**
- `expandable: boolean` - Enable row expansion
- `renderExpanded: (item: T) => React.ReactNode` - Expanded content

---

### 5. Column Visibility Toggle

```tsx
const [visibility, setVisibility] = useState({
  email: true,
  phone: false,
  address: true,
})

<Table
  data={data}
  columns={columns}
  columnVisibility={visibility}
  onColumnVisibilityChange={setVisibility}
/>
```

**Props:**
- `columnVisibility: Record<string, boolean>` - Column visibility state
- `onColumnVisibilityChange: (visibility) => void` - Visibility change callback

---

### 6. Export Features

```tsx
<Table
  data={data}
  columns={columns}
  exportable
  onExport={(type) => {
    if (type === "csv") exportToCSV(data)
    if (type === "excel") exportToExcel(data)
    if (type === "pdf") exportToPDF(data)
  }}
/>
```

**Props:**
- `exportable: boolean` - Show export button
- `onExport: (type: "csv" | "excel" | "pdf") => void` - Export handler

---

### 7. Advanced Features

#### Virtualization (for large datasets)
```tsx
<Table data={largeDataset} columns={columns} virtualized />
```

#### Drag & Drop Row Reordering
```tsx
<Table
  data={data}
  columns={columns}
  draggable
  onRowReorder={(reorderedData) => setData(reorderedData)}
/>
```

#### Keyboard Navigation
```tsx
<Table data={data} columns={columns} keyboardNavigation />
```

#### Theme Support
```tsx
<Table data={data} columns={columns} theme="dark" />
```

#### AI-Friendly Meta & Actions
```tsx
<Table
  data={data}
  columns={columns}
  meta={{ userId: 123, permissions: ["edit", "delete"] }}
  actions={{
    archive: (item) => archiveUser(item),
    duplicate: (item) => duplicateUser(item),
    export: (item) => exportUser(item),
  }}
/>
```

---

## Column Configuration

### Column Props

```tsx
interface Column<T> {
  key: keyof T | string
  title: string
  type?: "text" | "image" | "badge" | "icon" | "stack" | "select" | "toggle" | "color" | "checkbox"
  width?: number | string
  align?: "left" | "center" | "right"
  sortable?: boolean
  filterable?: boolean
  filterType?: "text" | "select" | "date" | "range"
  hidden?: boolean
  tooltip?: (item: T) => string
  copyable?: boolean
  render?: (item: T) => React.ReactNode
  onChange?: (item: T, value: any) => void
  selectOptions?: string[]
  stackProps?: { limit?: number; stacked?: boolean; shape?: "circle" | "square"; size?: number }
}
```

### Column Examples

```tsx
const columns: Column<User>[] = [
  {
    key: "id",
    title: "ID",
    width: 80,
    align: "center",
    sortable: true,
  },
  {
    key: "name",
    title: "Name",
    sortable: true,
    filterable: true,
    filterType: "text",
    copyable: true,
    tooltip: (item) => `Full name: ${item.name}`,
  },
  {
    key: "avatar",
    title: "Avatar",
    type: "image",
    width: 50,
    align: "center",
  },
  {
    key: "status",
    title: "Status",
    type: "badge",
    filterable: true,
    filterType: "select",
  },
  {
    key: "role",
    title: "Role",
    type: "select",
    selectOptions: ["Admin", "Editor", "Viewer"],
    onChange: (item, value) => updateUserRole(item.id, value),
  },
  {
    key: "active",
    title: "Active",
    type: "toggle",
    onChange: (item, value) => toggleUserStatus(item.id, value),
  },
  {
    key: "color",
    title: "Color",
    type: "color",
    onChange: (item, value) => updateUserColor(item.id, value),
  },
  {
    key: "tags",
    title: "Tags",
    type: "stack",
    stackProps: { limit: 3, shape: "circle" },
  },
]
```

---

## useServerTable Hook

### Enhanced Options

```tsx
interface UseServerTableOptions {
  url: string                                    // API endpoint
  params?: Record<string, string | number>      // Extra query params
  encrypt?: boolean                              // Laravel encryption
  key?: string                                   // APP_KEY for decryption
  decryptPayloadLog?: boolean                    // Debug logging
  columnOverrides?: Record<string, Partial<Column<any>>>
  debounce?: number                              // Search debounce (default 300ms)
  transform?: (response: any) => any[]           // Response transformer
  manual?: boolean                               // Manual fetch control
  onSuccess?: (data: any[]) => void              // Success callback
  onError?: (error: Error) => void               // Error callback
}
```

### Hook Return

```tsx
interface UseServerTableReturn<T> {
  data: T[]
  columns: Column<T>[]
  currentPage: number
  pagination: ServerPagination | null
  serverPagination: ServerPaginationProp | null
  loading: boolean
  error: string | null
  searchValue?: string
  onSearchChange?: (value: string) => void
  goToPage: (page: number) => void
  reload: () => void
}
```

### Examples

#### Basic Usage
```tsx
const { data, columns, serverPagination, loading } = useServerTable({
  url: "/api/users",
})
```

#### With Debounce & Transform
```tsx
const { data, columns, serverPagination, loading, onSearchChange } = useServerTable({
  url: "/api/users",
  debounce: 500,
  transform: (res) => res.data.map(u => ({ ...u, fullName: `${u.first} ${u.last}` })),
  onSuccess: (data) => console.log("Loaded", data.length, "users"),
  onError: (err) => console.error("Failed:", err.message),
})

<Table
  data={data}
  columns={columns}
  serverPagination={serverPagination}
  loading={loading}
  searchValue={onSearchChange ? "" : undefined}
  onSearchChange={onSearchChange}
/>
```

#### Manual Fetch Control
```tsx
const { data, columns, reload } = useServerTable({
  url: "/api/users",
  manual: true,
})

// Fetch manually
<button onClick={() => reload()}>Refresh</button>
```

---

## Default Actions (CRUD)

### Configuration

```tsx
interface DefaultActionsConfig<T> {
  baseUrl: string                                // API base URL
  idKey?: keyof T                                // ID field (default "id")
  position?: "first" | "last"                    // Actions column position
  editForm?: ActionField[]                       // Edit form fields
  viewForm?: ActionField[]                       // View form fields
  editFormGrid?: number                          // Grid columns (e.g., 2)
  actionsSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  modalWidth?: ModalWidth                        // Modal width
  onSuccess?: (action: "edit" | "delete", item: T) => void
  onSuccessNotif?: ActionSuccessNotif            // Success notification
  deleteConfirm?: { title: string; message: string }
  permissions?: (item: T) => { view?: boolean; edit?: boolean; delete?: boolean }
  beforeEdit?: (item: T) => Promise<boolean>
  beforeDelete?: (item: T) => Promise<boolean>
  viewButton?: ActionButtonConfig
  editButton?: ActionButtonConfig
  deleteButton?: ActionButtonConfig
  extraActions?: ExtraActionConfig<T>[]
}
```

### Example with Permissions & Hooks

```tsx
<Table
  data={users}
  columns={columns}
  defaultActions={{
    baseUrl: "/api/users",
    editForm: [
      { key: "name", label: "Name", required: true },
      { key: "email", label: "Email", validation: "email", required: true },
      { key: "role", label: "Role", type: "select", options: ["Admin", "User"] },
    ],
    editFormGrid: 2,
    deleteConfirm: {
      title: "Delete User",
      message: "Are you sure? This cannot be undone.",
    },
    permissions: (item) => ({
      view: true,
      edit: item.role === "admin" || currentUser.role === "admin",
      delete: currentUser.role === "admin",
    }),
    beforeEdit: async (item) => {
      const confirmed = await confirm(`Edit ${item.name}?`)
      return confirmed
    },
    beforeDelete: async (item) => {
      const confirmed = await confirm(`Delete ${item.name}?`)
      return confirmed
    },
    onSuccess: (action, item) => {
      console.log(`${action} successful for`, item)
      reload()
    },
    onSuccessNotif: {
      type: "toast",
      editTitle: "User Updated",
      editBody: "Changes saved successfully",
      deleteTitle: "User Deleted",
      deleteBody: "User removed from system",
    },
  }}
/>
```

---

## Action Fields

### Field Types

```tsx
type ActionFieldType =
  | "input" | "password" | "textarea" | "checkbox" | "toggle"
  | "select" | "radio" | "slider" | "tag-input"
  | "otp" | "combobox" | "color-picker" | "date-range"
  | "rich-text" | "file-upload" | "repeater"
```

### Field Configuration

```tsx
interface ActionField {
  key: string
  label: string
  type?: ActionFieldType
  inputType?: string                             // For type="input"
  options?: string[] | { label: string; value: string }[]
  placeholder?: string
  required?: boolean
  min?: number                                   // For type="slider"
  max?: number
  step?: number
  digits?: number                                // For type="otp"
  validation?: RegExp | "email" | "url" | "numeric" | "alpha" | "alphanumeric"
  validationMessage?: string
  colSpan?: number                               // Grid layout
  rowSpan?: number
  hidden?: boolean
  render?: (value: any, onChange: (v: any) => void) => React.ReactNode
}
```

### Field Examples

```tsx
const editForm: ActionField[] = [
  {
    key: "name",
    label: "Full Name",
    type: "input",
    required: true,
    validationMessage: "Name is required",
    colSpan: 2,
  },
  {
    key: "email",
    label: "Email Address",
    type: "input",
    inputType: "email",
    validation: "email",
    required: true,
  },
  {
    key: "bio",
    label: "Biography",
    type: "textarea",
    colSpan: 2,
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    options: ["Admin", "Editor", "Viewer"],
    required: true,
  },
  {
    key: "active",
    label: "Account Active",
    type: "toggle",
  },
  {
    key: "priority",
    label: "Priority",
    type: "slider",
    min: 1,
    max: 10,
    step: 1,
  },
  {
    key: "tags",
    label: "Tags",
    type: "tag-input",
  },
  {
    key: "color",
    label: "Favorite Color",
    type: "color-picker",
  },
  {
    key: "schedule",
    label: "Schedule",
    type: "date-range",
  },
  {
    key: "content",
    label: "Content",
    type: "rich-text",
    colSpan: 2,
  },
]
```

---

## AI-Agent Integration

### Controlled State Pattern

```tsx
// Reducer for AI-friendly state management
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
  data={state.data}
  columns={state.columns}
  loading={state.loading}
  error={state.error}
  searchValue={state.search}
  onSearchChange={(v) => dispatch({ type: "SEARCH", payload: v })}
  sort={state.sort}
  onSortChange={(s) => dispatch({ type: "SORT", payload: s })}
  page={state.page}
  onPageChange={(p) => dispatch({ type: "PAGE", payload: p })}
  columnVisibility={state.columnVisibility}
  onColumnVisibilityChange={(v) => dispatch({ type: "VISIBILITY", payload: v })}
  onRowClick={(item) => dispatch({ type: "ROW_SELECT", payload: item })}
  meta={state.meta}
  actions={state.actions}
/>
```

### Meta & Actions Registry

```tsx
<Table
  data={data}
  columns={columns}
  meta={{
    userId: currentUser.id,
    permissions: ["edit", "delete", "export"],
    filters: { status: "active" },
    sortBy: "name",
  }}
  actions={{
    archive: (item) => archiveItem(item),
    duplicate: (item) => duplicateItem(item),
    export: (item) => exportItem(item),
    share: (item) => shareItem(item),
  }}
/>
```

---

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
  avatar: string
}

export function UsersPage() {
  const [state, dispatch] = useReducer(tableReducer, {
    search: "",
    page: 1,
    sort: [],
    columnVisibility: { email: true, role: true },
    selectedRow: null,
  })

  const { data, columns, loading, serverPagination, reload, onSearchChange } = useServerTable<User>({
    url: "/api/users",
    debounce: 300,
    transform: (res) => res.data,
    onSuccess: (data) => console.log("Loaded", data.length, "users"),
    onError: (err) => console.error("Error:", err),
  })

  return (
    <Table<User>
      data={data}
      columns={columns}
      loading={loading}
      serverPagination={serverPagination}
      searchValue={state.search}
      onSearchChange={(v) => {
        dispatch({ type: "SEARCH", payload: v })
        onSearchChange?.(v)
      }}
      sort={state.sort}
      onSortChange={(s) => dispatch({ type: "SORT", payload: s })}
      page={state.page}
      onPageChange={(p) => dispatch({ type: "PAGE", payload: p })}
      columnVisibility={state.columnVisibility}
      onColumnVisibilityChange={(v) => dispatch({ type: "VISIBILITY", payload: v })}
      onRowClick={(item) => dispatch({ type: "ROW_SELECT", payload: item })}
      expandable
      renderExpanded={(item) => (
        <div className="p-4 bg-muted/50">
          <p>Email: {item.email}</p>
          <p>Role: {item.role}</p>
        </div>
      )}
      defaultActions={{
        baseUrl: "/api/users",
        editForm: [
          { key: "name", label: "Name", required: true },
          { key: "email", label: "Email", validation: "email", required: true },
          { key: "role", label: "Role", type: "select", options: ["admin", "editor", "viewer"] },
        ],
        editFormGrid: 2,
        permissions: (item) => ({
          edit: item.role !== \"admin\",
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

---

## TypeScript Support

All components are fully typed with generics:

```tsx
<Table<User>
  data={users}
  columns={columns}
  onRowClick={(item: User) => {
    // item is typed as User
    console.log(item.name)
  }}
/>
```

---

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Semantic HTML structure
- Focus management in modals
- Screen reader friendly

---

## Performance

- Virtualization support for large datasets
- Debounced search (default 300ms)
- Memoized columns and data
- Efficient re-renders with React.memo
- Optional lazy loading

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)
