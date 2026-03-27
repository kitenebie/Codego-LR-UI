import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { DataGrid, useServerDataGrid } from "../components/ui/data-grid"
import { PropsTable } from "../components/ui/props-table"
import { Badge } from "../components/ui/badge"
import { Star, Download } from "lucide-react"

const TOC = [
  { id: "basic", label: "Basic" },
  { id: "sortable", label: "Sortable" },
  { id: "filterable", label: "Filterable" },
  { id: "selectable", label: "Row Selection" },
  { id: "defaultactions", label: "Default Actions" },
  { id: "onsuccess", label: "onSuccess" },
  { id: "onsuccessnotif", label: "onSuccessNotif" },
  { id: "actionsposition", label: "Actions Column Position" },
  { id: "buttoncustomize", label: "Button Customization" },
  { id: "extraactions", label: "Extra Action Buttons" },
  { id: "servertable", label: "Server Data Grid (useServerDataGrid)" },
  { id: "servertablecolumns", label: "Server DataGrid Column Overrides" },
  { id: "loading", label: "Loading State" },
  { id: "props", label: "Props" },
  { id: "dataformat", label: "Column Format" },
]

type User = { id: number; name: string; email: string; role: string; status: string; joined: string }

const DATA: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "active", joined: "2023-01-15" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Developer", status: "active", joined: "2023-03-22" },
  { id: 3, name: "Carol White", email: "carol@example.com", role: "Designer", status: "inactive", joined: "2023-05-10" },
  { id: 4, name: "Dave Brown", email: "dave@example.com", role: "Developer", status: "active", joined: "2023-07-01" },
  { id: 5, name: "Eve Davis", email: "eve@example.com", role: "Manager", status: "active", joined: "2023-08-14" },
  { id: 6, name: "Frank Miller", email: "frank@example.com", role: "Developer", status: "inactive", joined: "2023-09-30" },
  { id: 7, name: "Grace Wilson", email: "grace@example.com", role: "Designer", status: "active", joined: "2023-11-05" },
  { id: 8, name: "Henry Moore", email: "henry@example.com", role: "Admin", status: "active", joined: "2024-01-20" },
  { id: 9, name: "Iris Taylor", email: "iris@example.com", role: "Developer", status: "active", joined: "2024-02-14" },
  { id: 10, name: "Jack Anderson", email: "jack@example.com", role: "Manager", status: "inactive", joined: "2024-03-01" },
  { id: 11, name: "Karen Thomas", email: "karen@example.com", role: "Developer", status: "active", joined: "2024-04-10" },
  { id: 12, name: "Leo Jackson", email: "leo@example.com", role: "Designer", status: "active", joined: "2024-05-22" },
]

const COLUMNS = [
  { key: "name",   header: "Name",   sortable: true },
  { key: "email",  header: "Email",  sortable: true },
  { key: "role",   header: "Role",   sortable: true },
  {
    key: "status", header: "Status", sortable: true,
    render: (row: User) => (
      <Badge variant={row.status === "active" ? "success" : "ghost"} dot size="sm">
        {row.status}
      </Badge>
    ),
  },
  { key: "joined", header: "Joined", sortable: true },
]

export function DataGridDocs() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <DocsLayout toc={TOC}>

      <Section id="basic">
        <Playground title="Data Grid" description="Paginated table with sortable columns."
          code={`<DataGrid columns={columns} data={data} rowKey="id" />`}>
          <DataGrid columns={COLUMNS} data={DATA} rowKey="id" pageSize={5} />
        </Playground>
      </Section>

      <Section id="sortable">
        <Playground title="Sortable Columns" description="Click column headers to sort. Click again to reverse."
          code={`{ key: "name", header: "Name", sortable: true }`}>
          <DataGrid columns={COLUMNS} data={DATA} rowKey="id" pageSize={5} showColumnToggle />
        </Playground>
      </Section>

      <Section id="filterable">
        <Playground title="Filterable Columns" description="Pass filterable={[...keys]} to DataGrid to show per-column search inputs for the specified keys."
          code={`<DataGrid
  columns={columns}
  data={data}
  rowKey="id"
  filterable={["name", "email", "role"]}
/>`}>
          <DataGrid columns={COLUMNS} data={DATA} rowKey="id" pageSize={5} filterable={["name", "email", "role"]} />
        </Playground>
      </Section>

      <Section id="selectable">
        <Playground title="Row Selection" description="Set selectable to enable checkbox row selection."
          code={`<DataGrid selectable selected={selected} onSelectChange={setSelected} ... />`}>
          <div className="space-y-2">
            <DataGrid columns={COLUMNS} data={DATA} rowKey="id" pageSize={5}
              selectable selected={selected} onSelectChange={setSelected} />
            <p className="text-xs text-muted-foreground">
              {selected.length} row(s) selected: {selected.join(", ") || "none"}
            </p>
          </div>
        </Playground>
      </Section>

      <Section id="defaultactions">
        <Playground title="Default Actions"
          description="Pass defaultActions with a baseUrl to append View / Edit / Delete buttons. Edit sends PUT /{id}/update to the server. Delete sends DELETE /{id}/delete. Fields support all UI components: Input, Textarea, Checkbox, Toggle, Select, Radio, Slider, Tag Input, OTP, Combobox, Color Picker, Date Range, Rich Text, File Upload, Repeater. Fields are auto-derived from row keys or customised via editForm / viewForm."
          code={`<DataGrid
  columns={columns}
  data={data}
  rowKey="id"
  defaultActions={{
    baseUrl: "http://localhost:8000/users",
    // Edit sends PUT /{id}/update  |  Delete sends DELETE /{id}/delete
    editForm: [
      { key: "name",   label: "Name" },
      { key: "email",  label: "Email",  inputType: "email" },
      { key: "role",   label: "Role",   type: "select", options: ["Admin","Developer","Designer","Manager"] },
      { key: "status", label: "Status", type: "toggle" },
      { key: "bio",    label: "Bio",    type: "textarea" },
      { key: "skills", label: "Skills", type: "tag-input" },
      { key: "score",  label: "Score",  type: "slider", min: 0, max: 100 },
      { key: "color",  label: "Color",  type: "color-picker" },
      { key: "avatar", label: "Avatar", type: "file-upload" },
    ],
    onSuccess: (action, item) => console.log(action, item),
  }}
/>`}>
          <DataGrid
            columns={COLUMNS}
            data={DATA}
            rowKey="id"
            pageSize={5}
            defaultActions={{
              baseUrl: "http://localhost:8000/users",
              editForm: [
                { key: "name", label: "Name" },
                { key: "email", label: "Email", inputType: "email" },
                { key: "role", label: "Role", type: "select", options: ["Admin", "Developer", "Designer", "Manager"] },
                { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
                { key: "joined", label: "Joined", inputType: "date" },
              ],
              onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
            }}
          />
        </Playground>
      </Section>

      <Section id="onsuccess">
        <Playground title="onSuccess"
          description="onSuccess is called after a successful edit or delete. Receives the action ('edit' | 'delete') and the affected row item."
          code={`<DataGrid
  columns={columns}
  data={data}
  rowKey="id"
  defaultActions={{
    baseUrl: "http://localhost:8000/users",
    editForm: [...],
    onSuccess: (action, item) => {
      if (action === "edit") {
        console.log("Updated:", item)
      } else {
        console.log("Deleted:", item)
      }
    },
  }}
/>`}>
          <DataGrid
            columns={COLUMNS}
            data={DATA}
            rowKey="id"
            pageSize={5}
            defaultActions={{
              baseUrl: "http://localhost:8000/users",
              editForm: [
                { key: "name", label: "Name" },
                { key: "role", label: "Role", type: "select", options: ["Admin", "Developer", "Designer", "Manager"] },
                { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
              ],
              onSuccess: (action, item) => alert(`onSuccess → action: "${action}", name: "${(item as any).name}"`),
            }}
          />
        </Playground>
      </Section>

      <Section id="onsuccessnotif">
        <Playground title="onSuccessNotif"
          description="onSuccessNotif shows a toast or inline notification banner after a successful edit or delete. Use type: 'toast' (requires ToastProvider) or type: 'notification' for an inline banner inside the modal."
          code={`import { ToastProvider } from "@juv/codego-react-ui"

// Wrap your app (or page) with ToastProvider
<ToastProvider>
  <DataGrid
    columns={columns}
    data={data}
    rowKey="id"
    defaultActions={{
      baseUrl: "http://localhost:8000/users",
      editForm: [...],
      onSuccessNotif: {
        type: "toast",
        toastPosition: "bottom-right",
        editTitle: "Record Updated",
        editBody: "The record was saved successfully.",
        deleteTitle: "Record Deleted",
        deleteBody: "The record has been removed.",
      },
    }}
  />
</ToastProvider>

// Inline notification inside the modal (no ToastProvider needed)
<DataGrid
  columns={columns}
  data={data}
  rowKey="id"
  defaultActions={{
    baseUrl: "http://localhost:8000/users",
    editForm: [...],
    onSuccessNotif: {
      type: "notification",
      editVariant: "success",
      editTitle: "Saved!",
      editBody: "Changes have been applied.",
      deleteVariant: "danger",
      deleteTitle: "Deleted",
      deleteBody: "The record was removed.",
    },
  }}
/>`}>
          <DataGrid
            columns={COLUMNS}
            data={DATA}
            rowKey="id"
            pageSize={5}
            defaultActions={{
              baseUrl: "http://localhost:8000/users",
              editForm: [
                { key: "name", label: "Name" },
                { key: "role", label: "Role", type: "select", options: ["Admin", "Developer", "Designer", "Manager"] },
                { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
              ],
              onSuccessNotif: {
                type: "notification",
                editVariant: "success",
                editTitle: "Record Updated",
                editBody: "Changes have been saved successfully.",
                deleteVariant: "danger",
                deleteTitle: "Record Deleted",
                deleteBody: "The record has been removed.",
              },
            }}
          />
        </Playground>
      </Section>

      <Section id="editform">
        <Playground title="editForm / viewForm"
          description="Customize the Edit and View modal fields. Supports all field types, validation (regex or built-in presets), colSpan/rowSpan for grid layout, and editFormGrid to set the number of columns."
          code={`<DataGrid
  columns={columns}
  data={data}
  rowKey="id"
  defaultActions={{
    baseUrl: "http://localhost:8000/users",
    editFormGrid: 2,  // 2-column grid layout
    editForm: [
      // Full-width field
      { key: "name",   label: "Full Name", colSpan: 2, required: true },

      // Side-by-side with validation
      { key: "email",  label: "Email",  validation: "email",   validationMessage: "Enter a valid email" },
      { key: "phone",  label: "Phone",  validation: /^\\d{7,15}$/, validationMessage: "Enter a valid phone" },

      // Select + toggle
      { key: "role",   label: "Role",   type: "select", options: ["Admin","Developer","Designer"] },
      { key: "active", label: "Active", type: "toggle" },

      // Full-width textarea
      { key: "bio",    label: "Bio",    type: "textarea", colSpan: 2 },
    ],
  }}
/>`}>
          <DataGrid
            columns={COLUMNS}
            data={DATA}
            rowKey="id"
            pageSize={5}
            defaultActions={{
              baseUrl: "http://localhost:8000/users",
              editFormGrid: 2,
              editForm: [
                { key: "name",   label: "Full Name",  colSpan: 2, required: true },
                { key: "email",  label: "Email",      validation: "email" as const, validationMessage: "Enter a valid email" },
                { key: "role",   label: "Role",       type: "select", options: ["Admin","Developer","Designer","Manager"] },
                { key: "status", label: "Status",     type: "select", options: ["active","inactive"] },
                { key: "joined", label: "Joined",     inputType: "date" },
                { key: "notes",  label: "Notes",      type: "textarea", colSpan: 2 },
              ],
              onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
            }}
          />
        </Playground>
      </Section>

      <Section id="actionsposition">
        <Playground title="Actions Column Position"
          description="Use position: 'first' on defaultActions to place the Actions column before all data columns. Defaults to 'last'."
          code={`<DataGrid
  columns={columns}
  data={data}
  rowKey="id"
  defaultActions={{
    baseUrl: "http://localhost:8000/users",
    position: "first",  // "first" | "last" (default)
    editForm: [...],
  }}
/>`}>
          <DataGrid
            columns={COLUMNS}
            data={DATA}
            rowKey="id"
            pageSize={5}
            defaultActions={{
              baseUrl: "http://localhost:8000/users",
              position: "first",
              editForm: [
                { key: "name", label: "Name" },
                { key: "email", label: "Email", inputType: "email" },
                { key: "role", label: "Role", type: "select", options: ["Admin", "Developer", "Designer", "Manager"] },
                { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
              ],
              onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
            }}
          />
        </Playground>
      </Section>

      <Section id="buttoncustomize">
        <Playground title="Button Customization"
          description="Customize the View, Edit, and Delete buttons via viewButton, editButton, and deleteButton on defaultActions. Each accepts variant, size, rounded, gradientFrom/To, bgColor, textColor, borderColor, icon, label, and displayMode ('icon' | 'text' | 'icon-text')."
          code={`<DataGrid
  columns={columns}
  data={data}
  rowKey="id"
  defaultActions={{
    baseUrl: "http://localhost:8000/users",
    viewButton: {
      variant: "outline",
      displayMode: "icon-text",
      label: "View",
      rounded: "full",
    },
    editButton: {
      gradientFrom: "primary",
      gradientTo: "info",
      displayMode: "icon-text",
      label: "Edit",
      rounded: "full",
    },
    deleteButton: {
      variant: "danger",
      displayMode: "text",
      label: "Remove",
      rounded: "full",
    },
  }}
/>`}>
          <DataGrid
            columns={COLUMNS}
            data={DATA}
            rowKey="id"
            pageSize={5}
            defaultActions={{
              baseUrl: "http://localhost:8000/users",
              editForm: [{ key: "name", label: "Name" }, { key: "role", label: "Role", type: "select", options: ["Admin", "Developer", "Designer", "Manager"] }],
              viewButton: { variant: "outline", displayMode: "icon-text", label: "View", rounded: "full" },
              editButton: { gradientFrom: "primary", gradientTo: "info", displayMode: "icon-text", label: "Edit", rounded: "full" },
              deleteButton: { variant: "danger", displayMode: "text", label: "Remove", rounded: "full" },
              onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
            }}
          />
        </Playground>
      </Section>

      <Section id="extraactions">
        <Playground title="Extra Action Buttons"
          description="Add custom action buttons alongside View / Edit / Delete using extraActions. Each entry requires a key and onClick handler, and supports the same button styling props as viewButton/editButton/deleteButton plus displayMode."
          code={`<DataGrid
  columns={columns}
  data={data}
  rowKey="id"
  defaultActions={{
    baseUrl: "http://localhost:8000/users",
    extraActions: [
      {
        key: "star",
        label: "Star",
        icon: <Star className="h-3.5 w-3.5" />,
        displayMode: "icon",
        variant: "outline",
        onClick: (item) => console.log("starred", item),
      },
      {
        key: "export",
        label: "Export",
        icon: <Download className="h-3.5 w-3.5" />,
        displayMode: "icon-text",
        gradientFrom: "success",
        gradientTo: "info",
        rounded: "full",
        onClick: (item) => console.log("export", item),
      },
    ],
  }}
/>`}>
          <DataGrid
            columns={COLUMNS}
            data={DATA}
            rowKey="id"
            pageSize={5}
            defaultActions={{
              baseUrl: "http://localhost:8000/users",
              editForm: [{ key: "name", label: "Name" }],
              extraActions: [
                {
                  key: "star",
                  label: "Star",
                  icon: <Star className="h-3.5 w-3.5" />,
                  displayMode: "icon",
                  variant: "outline",
                  onClick: (item) => alert(`Starred: ${(item as any).name}`),
                },
                {
                  key: "export",
                  label: "Export",
                  icon: <Download className="h-3.5 w-3.5" />,
                  displayMode: "icon-text",
                  gradientFrom: "success",
                  gradientTo: "info",
                  rounded: "full",
                  onClick: (item) => alert(`Export: ${(item as any).name}`),
                },
              ],
              onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
            }}
          />
        </Playground>
      </Section>

      <Section id="servertable">
        <Playground title="Server Data Grid (useServerDataGrid)"
          description="useServerDataGrid fetches paginated data from a server endpoint. Pass serverPagination directly to DataGrid — no separate pagination JSX needed. Columns are auto-derived from response data keys (snake_case → Title Case)."
          code={`const { data, columns, serverPagination, loading, error, reload } = useServerDataGrid({
  url: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
  encrypt: true, // optional — decrypts Laravel-encrypted response using VITE_LARAVEL_KEY
})

<DataGrid
  data={data}
  columns={columns}
  rowKey="id"
  loading={loading}
  serverPagination={serverPagination}
/>`}>
          {(() => {
            const { data, columns, serverPagination, loading, error, reload } = useServerDataGrid({ url: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git" })
            return (
              <div className="space-y-2">
                <div className="rounded-xl border border-info/30 bg-info/5 px-4 py-3 text-xs text-info space-y-2">
                  <p className="font-semibold">Using encrypt: true — Setup</p>
                  <p>The server returns a Laravel-encrypted string (AES-256-CBC). Pass your <code className="font-mono bg-info/10 px-1 rounded">APP_KEY</code> via the <code className="font-mono bg-info/10 px-1 rounded">key</code> option.</p>
                  <p className="font-semibold mt-1">1. Add to your Laravel .env:</p>
                  <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`VITE_LARAVEL_KEY="\${APP_KEY}"`}</pre>
                  <p className="font-semibold">2. Use the hook with encrypt + key:</p>
                  <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`const { data, columns, serverPagination } = useServerDataGrid({
  url: "/api/users",
  encrypt: true,
  key: import.meta.env["VITE_LARAVEL_KEY"],
})`}</pre>
                  <p className="font-semibold">3. Encrypt the response in your Laravel controller:</p>
                  <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`return response()->json(encrypt($users));`}</pre>
                  <p className="font-semibold">4. Expected response format (JSON, before encrypt):</p>
                  <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`{
  "current_page": 1,
  "data": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50,
    "links": [
      { "url": null, "label": "&laquo; Previous", "active": false },
      { "url": "/api/users?page=1", "label": "1", "active": true },
      { "url": "/api/users?page=2", "label": "2", "active": false },
      { "url": "/api/users?page=2", "label": "Next &raquo;", "active": false }
    ]
  }
}`}</pre>

<p className="text-lg font-semibold text-purple-500">Laravel Controller</p>
<pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`
  use App/Models/User;
  use Illuminate/Support/Facades/Crypt;

  $users = User::latest()->paginate(10);
  $users->getCollection()->transform(function ($item) {
      $item->filterable = true;
      return $item;
  });

  return response()->json(Crypt::encryptString(json_encode($record)), 200);
`}</pre>
                </div>
                {error && (
                  <div className="flex items-center justify-between rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-xs text-danger">
                    {error}
                    <button onClick={reload} className="underline hover:no-underline">Retry</button>
                  </div>
                )}
                <DataGrid
                  data={data}
                  columns={columns}
                  rowKey="id"
                  loading={loading}
                  serverPagination={serverPagination}
                />
              </div>
            )
          })()}
        </Playground>
      </Section>

      <Section id="servertablecolumns">
        <Playground title="Server DataGrid Column Overrides"
          description="Use columnOverrides in useServerDataGrid to customize any auto-derived column. Supports all DataGridColumn props: render, sortable, filterable, width, align. The key matches the response field name exactly."
          code={`const { data, columns, serverPagination } = useServerDataGrid({
  url: "/api/users",
  columnOverrides: {
    // Custom badge render for status
    status: {
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "ghost"} dot size="sm">
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
    // Progress bar render for score
    score: {
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: row.score + "%" }} />
          </div>
          <span className="text-xs text-muted-foreground">{row.score}%</span>
        </div>
      ),
    },
    // Fix column width and enable filter
    email: { width: "220px", filterable: true },
  },
})

<DataGrid data={data} columns={columns} rowKey="id" serverPagination={serverPagination} />`}>
          <DataGrid
            columns={[
              { key: "name", header: "Name", sortable: true, filterable: true },
              { key: "email", header: "Email", width: "220px", filterable: true },
              { key: "role", header: "Role", sortable: true },
              {
                key: "status", header: "Status", sortable: true,
                render: (row: User) => (
                  <Badge variant={row.status === "active" ? "success" : "ghost"} dot size="sm">{row.status}</Badge>
                ),
              },
              { key: "joined", header: "Joined", sortable: true },
            ]}
            data={DATA}
            rowKey="id"
            pageSize={5}
          />
        </Playground>
      </Section>

      <Section id="loading">
        <Playground title="Loading State" description="Set loading to show skeleton rows."
          code={`<DataGrid loading columns={columns} data={[]} rowKey="id" />`}>
          <DataGrid loading columns={COLUMNS} data={[]} rowKey="id" pageSize={5} />
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "columns", type: "DataGridColumn[]", required: true, description: "Column definitions." },
          { prop: "data", type: "T[]", required: true, description: "Array of row data objects." },
          { prop: "rowKey", type: "keyof T", required: true, description: "Key used to uniquely identify each row." },
          { prop: "pageSize", type: "number", default: "10", description: "Number of rows per page." },
          { prop: "selectable", type: "boolean", default: "false", description: "Enable checkbox row selection." },
          { prop: "selected", type: "string[]", description: "Controlled array of selected row keys." },
          { prop: "onSelectChange", type: "(keys: string[]) => void", description: "Fired when selection changes." },
          { prop: "filterable", type: "string[]", description: "Keys of columns that should show a per-column filter input." },
          { prop: "showColumnToggle", type: "boolean", default: "false", description: "Show a column visibility toggle button." },
          { prop: "loading", type: "boolean", default: "false", description: "Show skeleton rows while data loads." },
          { prop: "defaultActions", type: "DefaultActionsConfig<T>", description: "Appends View / Edit / Delete buttons. Edit → PUT /{id}/update, Delete → DELETE /{id}/delete." },
          { prop: "serverPagination", type: "ServerDataGridProp | null", description: "Pass the serverPagination object from useServerDataGrid to enable server-driven pagination inside the DataGrid." },
          { prop: "className", type: "string", description: "Additional CSS classes." },
        ]} />

        <PropsTable title="useServerDataGrid Options" rows={[
          { prop: "url", type: "string", required: true, description: "Endpoint URL. Page param is appended automatically." },
          { prop: "params", type: "Record<string, string | number>", description: "Extra query params merged on every request." },
          { prop: "encrypt", type: "boolean", default: "false", description: "Set true when the server returns a Laravel-encrypted payload." },
          { prop: "key", type: "string", description: 'Laravel APP_KEY for decryption. Pass import.meta.env["VITE_LARAVEL_KEY"].' },
          { prop: "decryptPayloadLog", type: "boolean", default: "false", description: "If true, logs the decrypted payload to the console. Useful for debugging." },
          { prop: "columnOverrides", type: "Record<string, Partial<DataGridColumn<T>>>", description: "Override auto-derived column definitions per response key. Supports render, sortable, filterable, width, align, etc." },
        ]} />
      </Section>

      <Section id="dataformat">
        <PropsTable rows={[
          { prop: "key", type: "string", required: true, description: "Data key to read from each row object." },
          { prop: "header", type: "string", required: true, description: "Column header label." },
          { prop: "sortable", type: "boolean", description: "Enable click-to-sort on this column." },
          { prop: "filterable", type: "boolean", description: "Show a per-column search input." },
          { prop: "render", type: "(row: T) => ReactNode", description: "Custom cell renderer. Overrides default text display." },
          { prop: "width", type: "string | number", description: 'Column width (e.g. "120px").' },
        ]} />

        <PropsTable title="DefaultActionsConfig" rows={[
          { prop: "baseUrl", type: "string", required: true, description: "Base URL. PUT → {baseUrl}/{id}/update, DELETE → {baseUrl}/{id}/delete." },
          { prop: "idKey", type: "keyof T", description: "Row key used as the URL id segment. Defaults to rowKey." },
          { prop: "position", type: '"first" | "last"', default: '"last"', description: "Place the Actions column before or after all data columns." },
          { prop: "editForm", type: "ActionField[]", description: "Fields rendered in the Edit modal. Auto-derived from row keys when omitted." },
          { prop: "viewForm", type: "ActionField[]", description: "Fields rendered in the View modal. Auto-derived from row keys when omitted." },
          { prop: "editFormGrid", type: "number", description: "Number of columns for the edit form grid layout. Default single column." },
          { prop: "modalWidth", type: '"sm"|"md"|"lg"|"xl"|"2xl"|"3xl"|"4xl"|"5xl"|"6xl"|"7xl"|"screen"|"full"', default: '"lg"', description: "Width of the Edit, View, and Delete modals." },
          { prop: "actionsSize", type: '"xs"|"sm"|"md"|"lg"|"xl"|"2xl"', default: '"xs"', description: "Size of all action buttons (View / Edit / Delete / extra). Overridden per-button via viewButton.size etc." },
          { prop: "onSuccess", type: '(action: "edit" | "delete", item: T) => void', description: "Called after a successful edit or delete." },
          { prop: "onSuccessNotif", type: "ActionSuccessNotif", description: "Show a toast or inline notification banner on successful edit/delete." },
          { prop: "viewButton", type: "ActionButtonConfig", description: "Customize the View button appearance (variant, icon, displayMode, gradient, etc.)." },
          { prop: "editButton", type: "ActionButtonConfig", description: "Customize the Edit button appearance." },
          { prop: "deleteButton", type: "ActionButtonConfig", description: "Customize the Delete button appearance." },
          { prop: "extraActions", type: "ExtraActionConfig<T>[]", description: "Additional action buttons rendered alongside View / Edit / Delete." },
        ]} />

        <PropsTable title="ActionButtonConfig" rows={[
          { prop: "variant", type: '"primary"|"secondary"|"outline"|"ghost"|"link"|"danger"|"success"|"destructive"', description: "Button variant. Defaults: view/edit → \"outline\", delete → \"danger\"." },
          { prop: "size", type: '"xs"|"sm"|"md"|"lg"|"xl"', default: '"xs"', description: "Button size." },
          { prop: "rounded", type: '"none"|"sm"|"md"|"lg"|"xl"|"full"', default: '"lg"', description: "Border radius." },
          { prop: "displayMode", type: '"icon"|"text"|"icon-text"', default: '"icon"', description: "\"icon\" = icon only, \"text\" = label only, \"icon-text\" = icon + label." },
          { prop: "icon", type: "React.ReactNode", description: "Override the default icon." },
          { prop: "label", type: "string", description: "Override the default label text (used in tooltip and when displayMode includes text)." },
          { prop: "gradientFrom", type: "string", description: "Gradient start color — CSS color or token (e.g. \"primary\", \"#6366f1\")." },
          { prop: "gradientTo", type: "string", description: "Gradient end color." },
          { prop: "gradientDirection", type: '"to-r"|"to-l"|"to-t"|"to-b"|"to-tr"|"to-tl"|"to-br"|"to-bl"', default: '"to-r"', description: "Gradient direction." },
          { prop: "bgColor", type: "string", description: "Custom background color (overrides variant bg)." },
          { prop: "textColor", type: "string", description: "Custom text color." },
          { prop: "borderColor", type: "string", description: "Custom border color." },
          { prop: "borderWidth", type: "number", description: "Border width in px." },
          { prop: "shadow", type: "boolean", description: "Apply a drop shadow." },
          { prop: "className", type: "string", description: "Additional CSS classes." },
        ]} />

        <PropsTable title="ExtraActionConfig" rows={[
          { prop: "key", type: "string", required: true, description: "Unique key for the button." },
          { prop: "onClick", type: "(item: T) => void", required: true, description: "Handler called with the row item when the button is clicked." },
          { prop: "label", type: "string", description: "Button label (used in tooltip and when displayMode includes text)." },
          { prop: "icon", type: "React.ReactNode", description: "Icon rendered in the button." },
          { prop: "displayMode", type: '"icon"|"text"|"icon-text"', default: '"icon-text"', description: "Controls what is shown in the button." },
          { prop: "variant", type: '"primary"|"secondary"|"outline"|"ghost"|"link"|"danger"|"success"|"destructive"', default: '"outline"', description: "Button variant." },
          { prop: "size", type: '"xs"|"sm"|"md"|"lg"|"xl"', default: '"xs"', description: "Button size." },
          { prop: "rounded", type: '"none"|"sm"|"md"|"lg"|"xl"|"full"', default: '"lg"', description: "Border radius." },
          { prop: "gradientFrom", type: "string", description: "Gradient start color." },
          { prop: "gradientTo", type: "string", description: "Gradient end color." },
          { prop: "gradientDirection", type: "string", default: '"to-r"', description: "Gradient direction." },
          { prop: "bgColor", type: "string", description: "Custom background color." },
          { prop: "textColor", type: "string", description: "Custom text color." },
          { prop: "borderColor", type: "string", description: "Custom border color." },
          { prop: "borderWidth", type: "number", description: "Border width in px." },
          { prop: "shadow", type: "boolean", description: "Apply a drop shadow." },
          { prop: "className", type: "string", description: "Additional CSS classes." },
        ]} />

        <PropsTable title="ActionSuccessNotif" rows={[
          { prop: "type", type: '"toast" | "notification"', default: '"toast"', description: "\"toast\" uses ToastProvider. \"notification\" renders an inline banner inside the Edit modal." },
          { prop: "toastPosition", type: "ToastPosition", default: '"bottom-right"', description: "Toast position. Only used when type=\"toast\"." },
          { prop: "editVariant", type: "ToastVariant", default: '"success"', description: "Variant for edit success notification." },
          { prop: "deleteVariant", type: "ToastVariant", default: '"success"', description: "Variant for delete success notification." },
          { prop: "editTitle", type: "React.ReactNode", description: "Title shown on edit success." },
          { prop: "editBody", type: "React.ReactNode", description: "Description shown on edit success." },
          { prop: "deleteTitle", type: "React.ReactNode", description: "Title shown on delete success." },
          { prop: "deleteBody", type: "React.ReactNode", description: "Description shown on delete success." },
          { prop: "action", type: "React.ReactNode", description: "Extra element rendered below the notification banner (notification mode only)." },
        ]} />

        <PropsTable rows={[
          { prop: "key", type: "string", required: true, description: "Row data key this field maps to." },
          { prop: "label", type: "string", required: true, description: "Field label shown above the input." },
          { prop: "type", type: '"input"|"textarea"|"checkbox"|"toggle"|"select"|"radio"|"slider"|"tag-input"|"otp"|"combobox"|"color-picker"|"date-range"|"rich-text"|"file-upload"|"repeater"|"button"|"password"', default: '"input"', description: "Field renderer type. Use 'password' for a revealable password input. Use 'button' to render a Button inside the form." },
          { prop: "inputType", type: "string", description: 'HTML input type for type="input" (e.g. "email", "number"). Use type="password" for password fields.' },
          { prop: "options", type: "string[] | { label, value }[]", description: 'Options for type="select", "radio", "combobox".' },
          { prop: "placeholder", type: "string", description: "Placeholder text." },
          { prop: "required", type: "boolean", description: "Marks the field as required (shows * indicator)." },
          { prop: "min", type: "number", description: 'Min value for type="slider".' },
          { prop: "max", type: "number", description: 'Max value for type="slider".' },
          { prop: "step", type: "number", description: 'Step for type="slider".' },
          { prop: "digits", type: "number", description: 'Number of OTP digits for type="otp". Default 6.' },
          { prop: "render", type: "(value, onChange) => ReactNode", description: "Custom field renderer. Overrides built-in type." },
        ]} />
      </Section>

    </DocsLayout>
  )
}

