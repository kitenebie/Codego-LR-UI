import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Table, Column, useServerTable } from "../components/ui/table"
import { PropsTable } from "../components/ui/props-table"
import { FileUpload } from "../components/ui/file-upload"
import { Input } from "../components/ui/input"
import { ShieldCheck, ShieldAlert, ShieldX, Star, Download, ChevronDown, ChevronUp, X, Mail, Phone, MapPin } from "lucide-react"
import * as React from "react"
import tableDocsData from "../components/docs/table.json"

function ProfileCell({ name, email, avatar }: { name: string; email: string; avatar: string }) {
  return (
    <div className="flex items-center gap-3">
      <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover ring-2 ring-border" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{email}</p>
      </div>
    </div>
  )
}

function CoinAvatar({ symbol, color, textColor = "#fff" }: { symbol: string; color: string; textColor?: string }) {
  const label = symbol.slice(0, 4)
  const fontSize = label.length <= 3 ? 11 : 9
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="8" fill={color} />
      <text x="18" y="18" dominantBaseline="central" textAnchor="middle"
        fill={textColor} fontFamily="monospace" fontWeight="700" fontSize={fontSize}>
        {label}
      </text>
    </svg>
  )
}

const COIN_DATA = [
  { id: "1",  name: "Ethereum",  symbol: "ETH",  color: "#627EEA", price: "$3,450.00",  change: "+2.4%", status: "Active",   icon: <ShieldCheck className="h-5 w-5 text-success" /> },
  { id: "2",  name: "Bitcoin",   symbol: "BTC",  color: "#F7931A", price: "$64,200.00", change: "+0.8%", status: "Active",   icon: <ShieldCheck className="h-5 w-5 text-success" /> },
  { id: "3",  name: "Solana",    symbol: "SOL",  color: "#9945FF", price: "$145.20",    change: "-1.2%", status: "Warning",  icon: <ShieldAlert className="h-5 w-5 text-warning" /> },
  { id: "4",  name: "Cardano",   symbol: "ADA",  color: "#0033AD", price: "$0.45",      change: "-3.1%", status: "Inactive", icon: <ShieldX     className="h-5 w-5 text-danger"  /> },
  { id: "5",  name: "Polkadot",  symbol: "DOT",  color: "#E6007A", price: "$7.80",      change: "+1.5%", status: "Active",   icon: <ShieldCheck className="h-5 w-5 text-success" /> },
  { id: "6",  name: "Avalanche", symbol: "AVAX", color: "#E84142", price: "$38.60",     change: "+4.2%", status: "Active",   icon: <ShieldCheck className="h-5 w-5 text-success" /> },
  { id: "7",  name: "Chainlink", symbol: "LINK", color: "#2A5ADA", price: "$14.90",     change: "-0.5%", status: "Warning",  icon: <ShieldAlert className="h-5 w-5 text-warning" /> },
  { id: "8",  name: "Uniswap",   symbol: "UNI",  color: "#FF007A", price: "$9.20",      change: "+0.3%", status: "Pending",  icon: <ShieldAlert className="h-5 w-5 text-info"    /> },
  { id: "9",  name: "Litecoin",  symbol: "LTC",  color: "#BFBBBB", price: "$82.10",     change: "-2.0%", status: "Inactive", icon: <ShieldX     className="h-5 w-5 text-danger"  /> },
  { id: "10", name: "Cosmos",    symbol: "ATOM", color: "#2E3148", price: "$10.40",     change: "+1.1%", status: "Active",   icon: <ShieldCheck className="h-5 w-5 text-success" /> },
  { id: "11", name: "Near",      symbol: "NEAR", color: "#00C08B", price: "$5.60",      change: "+3.3%", status: "Active",   icon: <ShieldCheck className="h-5 w-5 text-success" /> },
  { id: "12", name: "Aptos",     symbol: "APT",  color: "#2DD8A3", price: "$8.90",      change: "-1.8%", status: "Warning",  icon: <ShieldAlert className="h-5 w-5 text-warning" /> },
]

const COIN_COLUMNS: Column<typeof COIN_DATA[0]>[] = [
  { key: "symbol", title: "Logo",     render: (item) => <CoinAvatar symbol={item.symbol} color={item.color} /> },
  { key: "name",   title: "Name",     type: "text",  sortable: true },
  { key: "symbol", title: "Symbol",   type: "text",  sortable: true },
  { key: "price",  title: "Price",    type: "text",  sortable: true },
  { key: "change", title: "24h",      type: "text",  sortable: true },
  { key: "status", title: "Status",   type: "badge", sortable: true },
  { key: "icon",   title: "Security", type: "icon" },
]

const NAMES = [
  "Alice Johnson","Bob Martinez","Carol White","David Kim","Eva Chen",
  "Frank Lee","Grace Park","Henry Brown","Isla Scott","James Wilson",
  "Karen Davis","Liam Thompson","Mia Nguyen","Noah Patel","Olivia Reed",
  "Paul Adams","Quinn Baker","Rachel Clark","Sam Turner","Tina Hall",
]
const ROLES   = ["Engineer","Designer","Product Manager","DevOps","Data Analyst","Sales Lead","Support","Marketing","HR Manager","QA Engineer"]
const DEPTS   = ["Engineering","Product","Analytics","Sales","Operations","Marketing","HR","Design","Finance","Legal"]
const STATUSES = ["Active","Active","Active","Active","Active","Warning","Warning","Inactive","Pending","Active"]
const MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const YEARS   = ["2019","2020","2021","2022","2023","2024"]

const USER_DATA = NAMES.map((name, i) => ({
  id: String(i + 1),
  name,
  email: `${name.split(" ")[0].toLowerCase()}@acme.com`,
  avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  role: ROLES[i % ROLES.length],
  department: DEPTS[i % DEPTS.length],
  joined: `${MONTHS[i % 12]} ${YEARS[i % YEARS.length]}`,
  status: STATUSES[i % STATUSES.length],
}))

export function TableDocs() {
  // Get component data from table.json
  const tableComponent = tableDocsData?.components?.find?.((c: any) => c.name === "Table")
  const columnComponent = tableDocsData?.components?.find?.((c: any) => c.name === "Column")
  const serverTableComponent = tableDocsData?.components?.find?.((c: any) => c.name === "useServerTable")
  const defaultActionsComponent = tableDocsData?.components?.find?.((c: any) => c.name === "DefaultActionsConfig")
  const actionFieldComponent = tableDocsData?.components?.find?.((c: any) => c.name === "ActionField")

  return (
    <DocsLayout toc={[
      { id: "datatable",        label: "Data Table" },
      { id: "usertable",        label: "User Table" },
      { id: "loading",          label: "Loading & Error States" },
      { id: "expandable",       label: "Expandable Rows" },
      { id: "rowevents",        label: "Row Events" },
      { id: "columnvisibility", label: "Column Visibility" },
      { id: "exportable",       label: "Export" },
      { id: "draggable",        label: "Drag & Drop Reorder" },
      { id: "keyboard",         label: "Keyboard Navigation" },
      { id: "virtualized",      label: "Virtualized" },
      { id: "defaultactions",   label: "Default Actions" },
      { id: "editform",          label: "editForm / viewForm" },
      { id: "viewformgrid",       label: "viewForm / viewFormGrid" },
      { id: "componentprop",      label: "component prop (Custom Fields)" },
      { id: "onsuccess",         label: "onSuccess" },
      { id: "onsuccessnotif",    label: "onSuccessNotif" },
      { id: "actionsposition",  label: "Actions Column Position" },
      { id: "buttoncustomize",  label: "Button Customization" },
      { id: "extraactions",     label: "Extra Action Buttons" },
      { id: "servertable",      label: "Server Table (useServerTable)" },
      { id: "refreshinterval",   label: "Auto-Refresh & onReload" },
      { id: "hardreload",         label: "hardReload (External Trigger)" },
      { id: "servertablecolumns", label: "Server Table Column Overrides" },
      { id: "servertablefilter",   label: "filter & sort (useServerTable)" },
      { id: "toolbaricons",         label: "columnVisibilityIcon & filterableIcon" },
      { id: "avatarstack",      label: "Avatar Stack Column" },
      { id: "celltypes",        label: "Select / Toggle / Color / Checkbox" },
      { id: "bulkactions",       label: "Bulk Actions & bulkDeleteBaseUrl" },
      { id: "fileuploadform",    label: "File Upload in editForm" },
      { id: "repeaterfields",     label: "Repeater Fields" },
      { id: "autoderive",         label: "Auto-Derive Fields" },
      { id: "variant-zebra",     label: "Variant: Zebra" },
      { id: "variant-card",      label: "Variant: Card" },
      { id: "variant-glass",     label: "Variant: Glass" },
      { id: "variant-soft",      label: "Variant: Soft UI" },
      { id: "props",            label: "Props" },
    ]}>

      {/* ── Data Table ── */}
      <Section id="datatable"><Playground
        title="Data Table"
        description="A table with sortable columns, colored badges, search, pagination, and bulk actions."
        code={`<Table
  data={data}
  columns={columns}
  searchable
  clientPagination
  itemsPerPage={5}
  selectable
  onBulkDelete={(ids) => console.log(ids)}
/>`}
      >
        <Table
          data={COIN_DATA}
          columns={COIN_COLUMNS}
          searchable
          clientPagination
          itemsPerPage={5}
          selectable
          onBulkDelete={(ids) => alert(`Deleting IDs: ${ids.join(", ")}`)}
        />
      </Playground></Section>

      {/* ── User Table ── */}
      <Section id="usertable"><Playground
        title="User Table"
        description="A user directory table with profile avatars, roles, departments, and status badges."
        code={`const columns = [
  { key: "name", title: "User", render: (item) => <ProfileCell {...item} /> },
  { key: "role",       title: "Role",       type: "text",  sortable: true },
  { key: "department", title: "Department", type: "text",  sortable: true },
  { key: "status",     title: "Status",     type: "badge", sortable: true },
]

<Table data={users} columns={columns} searchable clientPagination itemsPerPage={5} selectable />`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",       title: "User",       render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",       title: "Role",       type: "text",  sortable: true },
            { key: "department", title: "Department", type: "text",  sortable: true },
            { key: "joined",     title: "Joined",     type: "text",  sortable: true },
            { key: "status",     title: "Status",     type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA}
              columns={userColumns}
              searchable
              searchPlaceholder="Search users…"
              clientPagination
              itemsPerPage={5}
              selectable
              onBulkDelete={(ids) => alert(`Removing: ${ids.join(", ")}`)}
            />
          )
        })()}
      </Playground></Section>

      {/* ── Loading & Error ── */}
      <Section id="loading"><Playground
        title="Loading & Error States"
        description="Pass loading to show a spinner while data is fetching. Pass error to display a red banner above the toolbar. Pass emptyState to replace the default 'No results found' UI."
        code={`// Loading spinner
<Table data={[]} columns={columns} loading />

// Error banner
<Table data={[]} columns={columns} error="Failed to load users. Please try again." />

// Custom empty state
<Table
  data={[]}
  columns={columns}
  emptyState={
    <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
      <span className="text-4xl">🗂️</span>
      <p className="text-sm font-medium">No records yet</p>
      <button className="text-xs text-primary hover:underline">Add your first record</button>
    </div>
  }
/>`}
      >
        {(() => {
          const [mode, setMode] = React.useState<"loading" | "error" | "empty" | "data">("loading")
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {(["loading", "error", "empty", "data"] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      mode === m ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
              <Table
                data={mode === "data" ? USER_DATA.slice(0, 5) : []}
                columns={userColumns}
                loading={mode === "loading"}
                error={mode === "error" ? "Failed to load users. Please try again." : undefined}
                emptyState={mode === "empty" ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                    <span className="text-4xl">🗂️</span>
                    <p className="text-sm font-medium">No records yet</p>
                  </div>
                ) : undefined}
              />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Expandable Rows ── */}
      <Section id="expandable"><Playground
        title="Expandable Rows"
        description="Enable expandable to add a chevron column. Click any row to toggle its expanded content. Use renderExpanded to return any React node for the expanded panel."
        code={`<Table
  data={users}
  columns={columns}
  expandable
  renderExpanded={(item) => (
    <div className="flex gap-6 text-sm">
      <span><Mail className="inline h-3.5 w-3.5 mr-1" />{item.email}</span>
      <span><Phone className="inline h-3.5 w-3.5 mr-1" />{item.phone}</span>
      <span><MapPin className="inline h-3.5 w-3.5 mr-1" />{item.location}</span>
    </div>
  )}
/>`}
      >
        {(() => {
          const expandData = USER_DATA.slice(0, 6).map((u, i) => ({
            ...u,
            phone: `+1 555-${String(1000 + i * 137).slice(0, 4)}`,
            location: ["New York", "San Francisco", "Austin", "Seattle", "Chicago", "Boston"][i % 6],
          }))
          const expandColumns: Column<typeof expandData[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <Table
              data={expandData}
              columns={expandColumns}
              expandable
              renderExpanded={(item) => (
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground py-1">
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{item.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{item.phone}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{item.location}</span>
                  <span className="flex items-center gap-1.5">Dept: <strong className="text-foreground">{item.department}</strong></span>
                  <span className="flex items-center gap-1.5">Joined: <strong className="text-foreground">{item.joined}</strong></span>
                </div>
              )}
            />
          )
        })()}
      </Playground></Section>

      {/* ── Row Events ── */}
      <Section id="rowevents"><Playground
        title="Row Events"
        description="onRowClick fires on single click, onRowDoubleClick on double click. rowClassName lets you apply dynamic CSS classes per row based on its data."
        code={`<Table
  data={users}
  columns={columns}
  onRowClick={(item) => console.log("clicked", item)}
  onRowDoubleClick={(item) => openDetail(item)}
  rowClassName={(item) =>
    item.status === "Inactive" ? "opacity-50" : ""
  }
/>`}
      >
        {(() => {
          const [lastClick, setLastClick] = React.useState<string>("")
          const [lastDbl, setLastDbl]     = React.useState<string>("")
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <div className="space-y-3">
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Last click: <strong className="text-foreground">{lastClick || "—"}</strong></span>
                <span>Last double-click: <strong className="text-foreground">{lastDbl || "—"}</strong></span>
              </div>
              <Table
                data={USER_DATA.slice(0, 6)}
                columns={userColumns}
                onRowClick={(item) => setLastClick(item.name)}
                onRowDoubleClick={(item) => setLastDbl(item.name)}
                rowClassName={(item) => item.status === "Inactive" ? "opacity-50" : ""}
              />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Column Visibility ── */}
      <Section id="columnvisibility"><Playground
        title="Column Visibility"
        description="Pass columnVisibility (a Record of column key → boolean) and onColumnVisibilityChange to show a Columns dropdown in the toolbar. Users can toggle individual columns on or off."
        code={`const [visibility, setVisibility] = React.useState({
  name: true, role: true, department: true, joined: false, status: true,
})

<Table
  data={users}
  columns={columns}
  columnVisibility={visibility}
  onColumnVisibilityChange={setVisibility}
/>`}
      >
        {(() => {
          const [visibility, setVisibility] = React.useState<Record<string, boolean>>({
            name: true, role: true, department: true, joined: false, status: true,
          })
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",       title: "User",       render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",       title: "Role",       type: "text",  sortable: true },
            { key: "department", title: "Department", type: "text",  sortable: true },
            { key: "joined",     title: "Joined",     type: "text",  sortable: true },
            { key: "status",     title: "Status",     type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA.slice(0, 6)}
              columns={userColumns}
              columnVisibility={visibility}
              onColumnVisibilityChange={setVisibility}
            />
          )
        })()}
      </Playground></Section>

      {/* ── Export ── */}
      <Section id="exportable"><Playground
        title="Export"
        description="Set exportable to show an Export dropdown in the toolbar with CSV, EXCEL, and PDF options. Wire up onExport to handle each format."
        code={`<Table
  data={users}
  columns={columns}
  exportable
  onExport={(type) => {
    if (type === "csv")   exportToCsv(data)
    if (type === "excel") exportToExcel(data)
    if (type === "pdf")   exportToPdf(data)
  }}
/>`}
      >
        {(() => {
          const [lastExport, setLastExport] = React.useState<string>("")
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <div className="space-y-3">
              {lastExport && (
                <div className="rounded-lg border border-success/30 bg-success/5 px-3 py-2 text-xs text-success">
                  onExport called with: <strong>{lastExport}</strong>
                </div>
              )}
              <Table
                data={USER_DATA.slice(0, 5)}
                columns={userColumns}
                exportable
                onExport={(type) => setLastExport(type)}
              />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Drag & Drop ── */}
      <Section id="draggable"><Playground
        title="Drag & Drop Row Reorder"
        description="Set draggable to enable native HTML5 drag-and-drop row reordering. onRowReorder is called with the new data array after a drop. A ring highlight shows the drop target."
        code={`const [rows, setRows] = React.useState(data)

<Table
  data={rows}
  columns={columns}
  draggable
  onRowReorder={(reordered) => setRows(reordered)}
/>`}
      >
        {(() => {
          const [rows, setRows] = React.useState(COIN_DATA.slice(0, 6))
          return (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Drag rows to reorder. Current order: {rows.map(r => r.symbol).join(" → ")}</p>
              <Table
                data={rows}
                columns={COIN_COLUMNS}
                draggable
                onRowReorder={(reordered) => setRows(reordered as typeof rows)}
              />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Keyboard Navigation ── */}
      <Section id="keyboard"><Playground
        title="Keyboard Navigation"
        description="Set keyboardNavigation to enable Arrow Up / Arrow Down key navigation between rows. The focused row gets a ring highlight. Click a row or press arrow keys to move focus."
        code={`<Table
  data={users}
  columns={columns}
  keyboardNavigation
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Click a row then use ↑ ↓ arrow keys to navigate.</p>
              <Table
                data={USER_DATA.slice(0, 6)}
                columns={userColumns}
                keyboardNavigation
              />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Virtualized ── */}
      <Section id="virtualized"><Playground
        title="Virtualized"
        description="Set virtualized to cap the table container height at 520px with overflow-y scroll. Useful for large datasets where you want a fixed-height scrollable table without pagination."
        code={`<Table
  data={largeDataset}
  columns={columns}
  virtualized
/>`}
      >
        {(() => {
          const bigData = Array.from({ length: 50 }, (_, i) => ({
            ...USER_DATA[i % USER_DATA.length],
            id: String(i + 1),
            name: `${USER_DATA[i % USER_DATA.length].name} #${i + 1}`,
          }))
          const userColumns: Column<typeof bigData[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">50 rows — container is capped at 520px and scrollable.</p>
              <Table data={bigData} columns={userColumns} virtualized />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Default Actions ── */}
      <Section id="defaultactions"><Playground
        title="Default Actions"
        description="Pass defaultActions with a baseUrl to auto-append View / Edit / Delete buttons. Edit sends PUT /{id}/update to the server. Delete sends DELETE /{id}/delete. Fields support all UI components: Input, Textarea, Checkbox, Toggle, Select, Radio, Slider, Tag Input, OTP, Combobox, Color Picker, Date Range, Rich Text, File Upload, Repeater. Fields are auto-derived from row keys or customised via editForm / viewForm."
        code={`<Table
  data={users}
  columns={columns}
  defaultActions={{
    baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
    // Edit sends PUT /{id}/update  |  Delete sends DELETE /{id}/delete
    editForm: [
      { key: "name",       label: "Name" },
      { key: "email",      label: "Email",      inputType: "email" },
      { key: "role",       label: "Role",       type: "select",  options: ["Engineer","Designer","Product Manager"] },
      { key: "department", label: "Department", type: "radio",   options: ["Engineering","Product","Analytics"] },
      { key: "status",     label: "Status",     type: "toggle" },
      { key: "bio",        label: "Bio",        type: "textarea" },
      { key: "skills",     label: "Skills",     type: "tag-input" },
      { key: "score",      label: "Score",      type: "slider",  min: 0, max: 100 },
      { key: "color",      label: "Color",      type: "color-picker" },
      { key: "avatar",     label: "Avatar",     type: "file-upload" },
    ],
    onSuccess: (action, item) => console.log(action, item),
  }}
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",       title: "User",       render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",       title: "Role",       type: "text",  sortable: true },
            { key: "department", title: "Department", type: "text",  sortable: true },
            { key: "status",     title: "Status",     type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA.slice(0, 6)}
              columns={userColumns}
              clientPagination
              itemsPerPage={5}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                editForm: [
                  { key: "name",       label: "Name" },
                  { key: "email",      label: "Email",      inputType: "email" },
                  { key: "role",       label: "Role",       type: "select", options: ["Engineer","Designer","Product Manager","DevOps","Data Analyst"] },
                  { key: "department", label: "Department", type: "select", options: ["Engineering","Product","Analytics","Sales","Operations"] },
                  { key: "status",     label: "Status",     type: "select", options: ["Active","Warning","Inactive","Pending"] },
                ],
                onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
              }}
            />
          )
        })()}
      </Playground></Section>

      {/* ── onSuccess ── */}
      <Section id="onsuccess"><Playground
        title="onSuccess"
        description="onSuccess is called after a successful edit or delete. Receives the action ('edit' | 'delete') and the affected row item."
        code={`<Table
  data={users}
  columns={columns}
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
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA.slice(0, 5)}
              columns={userColumns}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                editForm: [
                  { key: "name",   label: "Name" },
                  { key: "role",   label: "Role",   type: "select", options: ["Engineer","Designer","Product Manager","DevOps"] },
                  { key: "status", label: "Status", type: "select", options: ["Active","Warning","Inactive","Pending"] },
                ],
                onSuccess: (action, item) => alert(`onSuccess → action: "${action}", name: "${(item as any).name}"`),
              }}
            />
          )
        })()}
      </Playground></Section>

      {/* ── onSuccessNotif ── */}
      <Section id="onsuccessnotif"><Playground
        title="onSuccessNotif"
        description="onSuccessNotif shows a toast or inline notification banner after a successful edit or delete. Use type: 'toast' (requires ToastProvider) or type: 'notification' for an inline banner inside the modal."
        code={`import { ToastProvider } from "@juv/codego-react-ui"

// Wrap your app (or page) with ToastProvider
<ToastProvider>
  <Table
    data={users}
    columns={columns}
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
<Table
  data={users}
  columns={columns}
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
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA.slice(0, 5)}
              columns={userColumns}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                editForm: [
                  { key: "name",   label: "Name" },
                  { key: "role",   label: "Role",   type: "select", options: ["Engineer","Designer","Product Manager","DevOps"] },
                  { key: "status", label: "Status", type: "select", options: ["Active","Warning","Inactive","Pending"] },
                ],
                onSuccessNotif: {
                  type: "notification",
                  editVariant: "success",
                  editTitle: "Record Updated",
                  editBody: "Changes have been saved successfully.",
                  deleteVariant: "warning",
                  deleteTitle: "Record Deleted",
                  deleteBody: "The record has been removed.",
                },
              }}
            />
          )
        })()}
      </Playground></Section>

      {/* ── editForm / viewForm ── */}
      <Section id="editform"><Playground
        title="editForm / viewForm"
        description="Customize the Edit and View modal fields. Supports all field types, validation (regex or built-in presets), colSpan/rowSpan for grid layout, and editFormGrid to set the number of columns."
        code={`<Table
  data={users}
  columns={columns}
  defaultActions={{
    baseUrl: "http://localhost:8000/users",
    editFormGrid: 2,  // 2-column grid layout
    editForm: [
      // Full-width header row
      { key: "name",       label: "Full Name",   colSpan: 2, required: true },

      // Side-by-side fields
      { key: "email",      label: "Email",       validation: "email",   validationMessage: "Enter a valid email" },
      { key: "phone",      label: "Phone",       validation: /^\d{7,15}$/, validationMessage: "Enter a valid phone number" },

      // Select + toggle side by side
      { key: "role",       label: "Role",        type: "select", options: ["Admin","Developer","Designer"] },
      { key: "active",     label: "Active",      type: "toggle" },

      // Full-width textarea
      { key: "bio",        label: "Bio",         type: "textarea", colSpan: 2 },

      // Slider + color side by side
      { key: "score",      label: "Score",       type: "slider", min: 0, max: 100 },
      { key: "color",      label: "Color",       type: "color-picker" },

      // Full-width file upload
      { key: "avatar",     label: "Avatar",      type: "file-upload", colSpan: 2 },
    ],
  }}
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA.slice(0, 5)}
              columns={userColumns}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                editFormGrid: 2,
                editForm: [
                  { key: "name",       label: "Full Name",  colSpan: 2, required: true },
                  { key: "email",      label: "Email",      validation: "email" as const, validationMessage: "Enter a valid email" },
                  { key: "role",       label: "Role",       type: "select", options: ["Engineer","Designer","Product Manager","DevOps"] },
                  { key: "department", label: "Department", type: "select", options: ["Engineering","Product","Analytics","Sales"] },
                  { key: "status",     label: "Status",     type: "select", options: ["Active","Warning","Inactive","Pending"] },
                  { key: "joined",     label: "Joined",     inputType: "date" },
                ],
                onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
              }}
            />
          )
        })()}
      </Playground></Section>

      {/* ── component prop ── */}
      {/* ── viewForm / viewFormGrid ── */}
      <Section id="viewformgrid"><Playground
        title="viewForm / viewFormGrid"
        description="Customize the View modal with viewForm fields. Use viewType to control how each value is displayed. Supports: text, image, checkbox, toggle, attachment, text-url, text-url-open-other-tabs, image-url, image-url-open-other-tabs. Use width and height to size any field. Use viewFormGrid for multi-column layout with colSpan/rowSpan."
        code={`<Table
  data={certificates}
  columns={columns}
  defaultActions={{
    baseUrl: "/api/certificate",
    viewFormGrid: 2,
    viewForm: [
      // Image preview — full width, custom size
      { key: "image",       label: "Image",       viewType: "image",                      colSpan: 2, width: 160, height: 160 },

      // Plain text
      { key: "name",        label: "Name",        viewType: "text" },
      { key: "price",       label: "Price (Php)", viewType: "text" },

      // Clickable URL (same tab)
      { key: "website",     label: "Website",     viewType: "text-url" },

      // Clickable URL (new tab)
      { key: "docs",        label: "Docs",        viewType: "text-url-open-other-tabs" },

      // Image that links to itself (same tab)
      { key: "thumbnail",   label: "Thumbnail",   viewType: "image-url",                  width: 80, height: 80 },

      // Image that links to itself (new tab)
      { key: "banner",      label: "Banner",      viewType: "image-url-open-other-tabs",  width: 80, height: 80 },

      // File attachment link
      { key: "file",        label: "Attachment",  viewType: "attachment" },

      // Checkbox (read-only)
      { key: "active",      label: "Active",      viewType: "checkbox" },

      // Toggle (read-only)
      { key: "featured",    label: "Featured",    viewType: "toggle" },

      // Full-width description
      { key: "description", label: "Description", viewType: "text",                       colSpan: 2 },
    ],
  }}
/>`}
      >
        {(() => {
          const certData = [
            { id: "1", name: "Web Development",  price: "5,000",  description: "Full stack web development certificate.",  image: "https://i.pravatar.cc/150?img=1", thumbnail: "https://i.pravatar.cc/150?img=1", banner: "https://i.pravatar.cc/150?img=1", website: "https://example.com", docs: "https://docs.example.com", file: "https://example.com/cert.pdf", active: true,  featured: false, status: "Active"  },
            { id: "2", name: "Data Science",      price: "7,500",  description: "Data science and machine learning cert.",  image: "https://i.pravatar.cc/150?img=2", thumbnail: "https://i.pravatar.cc/150?img=2", banner: "https://i.pravatar.cc/150?img=2", website: "https://example.com", docs: "https://docs.example.com", file: "https://example.com/cert.pdf", active: true,  featured: true,  status: "Active"  },
            { id: "3", name: "UI/UX Design",      price: "4,500",  description: "User interface and experience design.",     image: "https://i.pravatar.cc/150?img=3", thumbnail: "https://i.pravatar.cc/150?img=3", banner: "https://i.pravatar.cc/150?img=3", website: "https://example.com", docs: "https://docs.example.com", file: "https://example.com/cert.pdf", active: false, featured: false, status: "Pending" },
          ]
          const certColumns: Column<typeof certData[0]>[] = [
            { key: "image",  title: "Image",       type: "image" },
            { key: "name",   title: "Name",        type: "text",  sortable: true },
            { key: "price",  title: "Price (Php)", type: "text",  sortable: true },
            { key: "active", title: "Active",      type: "checkbox" },
            { key: "status", title: "Status",      type: "badge", sortable: true },
          ]
          return (
            <Table
              data={certData}
              columns={certColumns}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                modalWidth: "2xl",
                viewFormGrid: 2,
                viewForm: [
                  { key: "image",       label: "Image",       viewType: "image",                     colSpan: 2, width: 160, height: 160 },
                  { key: "name",        label: "Name",        viewType: "text" },
                  { key: "price",       label: "Price (Php)", viewType: "text" },
                  { key: "website",     label: "Website",     viewType: "text-url" },
                  { key: "docs",        label: "Docs",        viewType: "text-url-open-other-tabs" },
                  { key: "thumbnail",   label: "Thumbnail",   viewType: "image-url",                 width: 80, height: 80 },
                  { key: "banner",      label: "Banner",      viewType: "image-url-open-other-tabs", width: 80, height: 80 },
                  { key: "file",        label: "Attachment",  viewType: "attachment" },
                  { key: "active",      label: "Active",      viewType: "checkbox" },
                  { key: "featured",    label: "Featured",    viewType: "toggle" },
                  { key: "description", label: "Description", viewType: "text",                      colSpan: 2 },
                ],
                editForm: [
                  { key: "name",        label: "Name",        required: true },
                  { key: "price",       label: "Price (Php)", required: true, validation: "numeric" as const },
                  { key: "status",      label: "Status",      type: "select", options: ["Active","Warning","Pending"] },
                  { key: "description", label: "Description", type: "textarea", colSpan: 2 },
                ],
                onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
              }}
            />
          )
        })()}
      </Playground></Section>

      {/* ── component prop ── */}
      <Section id="componentprop"><Playground
        title="component prop (Custom Fields)"
        description="Use component on any editForm or viewForm field to drop in a fully custom React component. It renders as-is — bypassing the label, built-in renderer, and validation. Perfect for FileUpload, custom inputs, or any controlled component you manage yourself."
        code={`import { FileUpload, Input } from '@juv/codego-react-ui'
import * as React from 'react'

function CertificateForm() {
  const [name, setName] = React.useState('')
  const [files, setFiles] = React.useState<File[]>([])

  return (
    <Table
      data={data}
      columns={columns}
      defaultActions={{
        baseUrl: '/api/certificate',
        editForm: [
          // Built-in field
          { key: 'name', label: 'Name', required: true },

          // Custom component — fully controlled by you
          {
            key: 'avatar',
            label: 'Avatar',
            component: (
              <FileUpload
                label="Upload Avatar"
                accept="image/*"
                onChange={(f) => setFiles(f)}
              />
            ),
          },

          // Another example — custom Input with its own state
          {
            key: 'custom_name',
            label: 'Custom Name',
            component: (
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />
            ),
          },
        ],
      }}
    />
  )
}`}
      >
        {(() => {
          const [files, setFiles] = React.useState<File[]>([])
          const [customName, setCustomName] = React.useState("")
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text", sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA.slice(0, 5)}
              columns={userColumns}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                editForm: [
                  { key: "name", label: "Name", required: true },
                  {
                    key: "avatar",
                    label: "Avatar",
                    component: (
                      <FileUpload
                        label="Upload Avatar"
                        accept="image/*"
                        onChange={(f) => setFiles(f)}
                      />
                    ),
                  },
                  {
                    key: "role",
                    label: "Role",
                    component: (
                      <Input
                        label="Custom Role"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Enter role"
                      />
                    ),
                  },
                ],
                onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
              }}
            />
          )
        })()}
      </Playground></Section>

      {/* ── Actions Position ── */}
      <Section id="actionsposition"><Playground
        title="Actions Column Position"
        description="Use position: 'first' on defaultActions to place the Actions column before all data columns. Defaults to 'last'."
        code={`<Table
  data={users}
  columns={columns}
  defaultActions={{
    baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
    position: "first",  // "first" | "last" (default)
    editForm: [...],
  }}
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",       title: "User",       render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",       title: "Role",       type: "text",  sortable: true },
            { key: "department", title: "Department", type: "text",  sortable: true },
            { key: "status",     title: "Status",     type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA.slice(0, 5)}
              columns={userColumns}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                position: "first",
                editForm: [
                  { key: "name",   label: "Name" },
                  { key: "role",   label: "Role",   type: "select", options: ["Engineer","Designer","Product Manager","DevOps"] },
                  { key: "status", label: "Status", type: "select", options: ["Active","Warning","Inactive","Pending"] },
                ],
                onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
              }}
            />
          )
        })()}
      </Playground></Section>

      {/* ── Button Customization ── */}
      <Section id="buttoncustomize"><Playground
        title="Button Customization"
        description="Customize the View, Edit, and Delete buttons via viewButton, editButton, and deleteButton on defaultActions. Each accepts variant, size, rounded, gradientFrom/To, bgColor, textColor, borderColor, icon, label, and displayMode ('icon' | 'text' | 'icon-text')."
        code={`<Table
  data={users}
  columns={columns}
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
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",       title: "User",       render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",       title: "Role",       type: "text",  sortable: true },
            { key: "status",     title: "Status",     type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA.slice(0, 5)}
              columns={userColumns}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                editForm: [{ key: "name", label: "Name" }, { key: "role", label: "Role", type: "select", options: ["Engineer","Designer","Product Manager"] }],
                viewButton:   { variant: "outline",  displayMode: "icon-text", label: "View",   rounded: "full" },
                editButton:   { gradientFrom: "primary", gradientTo: "info", displayMode: "icon-text", label: "Edit", rounded: "full" },
                deleteButton: { variant: "danger",   displayMode: "text",      label: "Remove", rounded: "full" },
                onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
              }}
            />
          )
        })()}
      </Playground></Section>

      {/* ── Extra Actions ── */}
      <Section id="extraactions"><Playground
        title="Extra Action Buttons"
        description="Add custom action buttons alongside View / Edit / Delete using extraActions. Each entry requires a key and onClick handler, and supports the same button styling props as viewButton/editButton/deleteButton plus displayMode."
        code={`<Table
  data={users}
  columns={columns}
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
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA.slice(0, 5)}
              columns={userColumns}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
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
          )
        })()}
      </Playground></Section>

      {/* ── Server Table ── */}
      <Section id="servertable"><Playground
        title="Server Table (useServerTable)"
        description="useServerTable fetches paginated data from a server endpoint. Pass serverPagination directly to Table — no separate pagination JSX needed. Columns are auto-derived from response data keys (snake_case → Title Case)."
        code={`const { data, columns, serverPagination, loading, error, reload } = useServerTable({
  url: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
  encrypt: true, // optional — decrypts Laravel-encrypted response using VITE_LARAVEL_KEY
})

<Table data={data} columns={columns} serverPagination={serverPagination} loading={loading} />`}
      >
        {(() => {
          const { data, columns, serverPagination, loading, error, reload } = useServerTable({ url: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git", encrypt: true, key: "base64:o8Wo8vIm/+eaRnmsKvYGz7b2QO9cSpYkXbUxL56B5Yg=" })
          return (
            <div className="space-y-2">
              <div className="rounded-xl border border-info/30 bg-info/5 px-4 py-3 text-xs text-info space-y-2">
                <p className="font-semibold">Using encrypt: true — Setup</p>
                <p>The server returns a Laravel-encrypted string (AES-256-CBC). Pass your <code className="font-mono bg-info/10 px-1 rounded">APP_KEY</code> via the <code className="font-mono bg-info/10 px-1 rounded">key</code> option.</p>
                <p className="font-semibold mt-1">1. Add to your Laravel .env:</p>
                <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`VITE_LARAVEL_KEY="\${APP_KEY}"`}</pre>
                <p className="font-semibold">2. Use the hook with encrypt + key:</p>
                <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`const { data, columns, serverPagination } = useServerTable({
  url: "/api/users",
  encrypt: true,
  key: import.meta.env["VITE_LARAVEL_KEY"],
})`}</pre>
                <p className="font-semibold">3. Encrypt the response in your Laravel controller:</p>
                <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`return response()->json(encrypt($users->toArray()));`}</pre>
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
              </div>
              {error && (
                <div className="flex items-center justify-between rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-xs text-danger">
                  {error}
                  <button onClick={reload} className="underline hover:no-underline">Retry</button>
                </div>
              )}
              <Table data={data} columns={columns} serverPagination={serverPagination} />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Auto-Refresh & onReload ── */}
      <Section id="refreshinterval"><Playground
        title="Auto-Refresh & onReload"
        description="Use refreshInterval to auto-refetch data on a timer. Use onReload on defaultActions to re-fetch from the server after a successful edit or delete — keeping the table in sync without a manual page reload."
        code={`// Auto-refresh every 30 seconds
const { data, columns, serverPagination, loading, reload } = useServerTable({
  url: "/api/users",
  refreshInterval: 30000, // ms — omit or set 0 to disable
})

// Manual refresh only (no interval)
const { data, columns, serverPagination, loading, reload, refresh } = useServerTable({
  url: "/api/users",
  refresh: true, // semantic flag — reload() and refresh() both work
})

// Pass reload to defaultActions so the table refetches after edit/delete
<Table
  data={data}
  columns={columns}
  serverPagination={serverPagination}
  loading={loading}
  defaultActions={{
    baseUrl: "/api/users",
    onReload: reload, // called automatically after edit or delete
    editForm: [
      { key: "name",   label: "Name" },
      { key: "status", label: "Status", type: "select", options: ["Active","Inactive"] },
    ],
  }}
/>`}
      >
        <div className="rounded-xl border border-info/30 bg-info/5 px-4 py-3 text-xs text-info space-y-3">
          <p className="font-semibold">refreshInterval</p>
          <p>Automatically re-fetches data every N milliseconds using <code className="font-mono bg-info/10 px-1 rounded">setInterval</code>. The interval is cleared on unmount. Set to <code className="font-mono bg-info/10 px-1 rounded">0</code> or omit to disable.</p>
          <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`const { data, columns, serverPagination } = useServerTable({
  url: "/api/users",
  refreshInterval: 15000, // refetch every 15s
})`}</pre>
          <p className="font-semibold">onReload</p>
          <p>Pass <code className="font-mono bg-info/10 px-1 rounded">reload</code> from <code className="font-mono bg-info/10 px-1 rounded">useServerTable</code> as <code className="font-mono bg-info/10 px-1 rounded">onReload</code> on <code className="font-mono bg-info/10 px-1 rounded">defaultActions</code>. It is called automatically after a successful edit or delete, triggering a fresh server fetch so the table reflects the latest data.</p>
          <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`const { data, columns, serverPagination, reload } = useServerTable({
  url: "/api/users",
})

<Table
  data={data}
  columns={columns}
  serverPagination={serverPagination}
  defaultActions={{
    baseUrl: "/api/users",
    onReload: reload,
  }}
/>`}</pre>
        </div>
      </Playground></Section>

      {/* ── Server Table Column Overrides ── */}
      <Section id="hardreload"><Playground
        title="hardReload (External Trigger)"
        description="Pass a ref via hardReload to useServerTable. The hook assigns its reload function to the ref, so any external button, form submit, or side effect can call hardReloadRef.current() to trigger a fresh server fetch — without needing to pass reload as a prop through your component tree."
        code={`import * as React from "react"
import { useServerTable, Table } from "@juv/codego-react-ui"

function UsersPage() {
  const hardReloadRef = React.useRef<() => void>(() => {})

  const { data, columns, serverPagination, loading } = useServerTable({
    url: "/api/users",
    hardReload: hardReloadRef,
  })

  const handleImport = async () => {
    await importUsers(file)
    hardReloadRef.current() // refetch table after import
  }

  return (
    <div>
      <button onClick={handleImport}>Import CSV</button>
      <button onClick={() => hardReloadRef.current()}>Refresh</button>

      <Table
        data={data}
        columns={columns}
        serverPagination={serverPagination}
        loading={loading}
      />
    </div>
  )
}`}
      >
        {(() => {
          const hardReloadRef = React.useRef<() => void>(() => {})
          const [reloadCount, setReloadCount] = React.useState(0)
          // Simulate: assign a fake reload to the ref for demo
          React.useEffect(() => {
            hardReloadRef.current = () => setReloadCount((c) => c + 1)
          }, [])
          return (
            <div className="space-y-3">
              <div className="rounded-xl border border-info/30 bg-info/5 px-4 py-3 text-xs text-info space-y-2">
                <p className="font-semibold">How it works</p>
                <p>Create a ref with <code className="font-mono bg-info/10 px-1 rounded">React.useRef&lt;() =&gt; void&gt;(() =&gt; {'{}'})</code> and pass it as <code className="font-mono bg-info/10 px-1 rounded">hardReload</code> to <code className="font-mono bg-info/10 px-1 rounded">useServerTable</code>. The hook assigns its internal reload function to the ref. You can then call <code className="font-mono bg-info/10 px-1 rounded">hardReloadRef.current()</code> from any button, callback, or effect — no prop drilling needed.</p>
                <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`const hardReloadRef = React.useRef<() => void>(() => {})

useServerTable({ url: "/api/users", hardReload: hardReloadRef })

// Call from anywhere:
hardReloadRef.current()`}</pre>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => hardReloadRef.current()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  Trigger hardReload
                </button>
                <span className="text-xs text-muted-foreground">Triggered {reloadCount} time{reloadCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Server Table Column Overrides ── */}
      <Section id="servertablecolumns"><Playground
        title="Server Table Column Overrides"
        description="Use columnOverrides in useServerTable to customize any auto-derived column. Supports all Column props including the new text-url type with redirect, openNewTab, and underlineColor. The key matches the response field name exactly."
        code={`const { data, columns, serverPagination } = useServerTable({
  url: "/api/users",
  columnOverrides: {
    // Render status as a colored badge
    status: { type: "badge", sortable: true },

    // Render enabled as an interactive toggle
    enabled: {
      type: "toggle",
      onChange: (item, value) => patchUser(item.id, { enabled: value }),
    },

    // Render role as an inline select dropdown
    role: {
      type: "select",
      selectOptions: ["Admin", "Editor", "Viewer"],
      onChange: (item, value) => patchUser(item.id, { role: value }),
    },

    // Render verified as a checkbox
    verified: {
      type: "checkbox",
      onChange: (item, value) => patchUser(item.id, { verified: value }),
    },

    // Render avatar as an image
    avatar: { type: "image" },

    // Clickable URL — uses cell value as href, same tab
    website: {
      type: "text-url",
      underlineColor: "primary",
    },

    // Clickable URL — static redirect, new tab, custom color
    product_id: {
      type: "text-url",
      redirect: (item) => "https://example.com/products/" + item.product_id,
      openNewTab: true,
      underlineColor: "#196EBF",
    },

    // Fully custom render
    score: {
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: item.score + "%" }} />
          </div>
          <span className="text-xs text-muted-foreground">{item.score}%</span>
        </div>
      ),
    },
  },
})

<Table data={data} columns={columns} serverPagination={serverPagination} />`}
      >
        {(() => {
          const [rows, setRows] = React.useState([
            { id: "1", name: "Alice Johnson",  status: "Active",   role: "Admin",   enabled: true,  verified: true,  score: 92, avatar: "https://i.pravatar.cc/150?img=1", website: "https://example.com", product_id: "1001" },
            { id: "2", name: "Bob Martinez",   status: "Warning",  role: "Editor",  enabled: false, verified: false, score: 54, avatar: "https://i.pravatar.cc/150?img=2", website: "https://example.com", product_id: "1002" },
            { id: "3", name: "Carol White",    status: "Inactive", role: "Viewer",  enabled: false, verified: true,  score: 30, avatar: "https://i.pravatar.cc/150?img=3", website: "https://example.com", product_id: "1003" },
            { id: "4", name: "David Kim",      status: "Active",   role: "Admin",   enabled: true,  verified: true,  score: 78, avatar: "https://i.pravatar.cc/150?img=4", website: "https://example.com", product_id: "1004" },
            { id: "5", name: "Eva Chen",       status: "Pending",  role: "Editor",  enabled: true,  verified: false, score: 65, avatar: "https://i.pravatar.cc/150?img=5", website: "https://example.com", product_id: "1005" },
          ])
          const patch = (id: string, key: string, value: any) =>
            setRows((prev) => prev.map((r) => r.id === id ? { ...r, [key]: value } : r))
          const cols: Column<typeof rows[0]>[] = [
            { key: "avatar",     title: "Avatar",     type: "image" },
            { key: "name",       title: "Name",       type: "text",     sortable: true },
            { key: "status",     title: "Status",     type: "badge",    sortable: true },
            { key: "role",       title: "Role",       type: "select",   selectOptions: ["Admin","Editor","Viewer"], onChange: (item, v) => patch(item.id, "role", v) },
            { key: "enabled",    title: "Enabled",    type: "toggle",   onChange: (item, v) => patch(item.id, "enabled", v) },
            { key: "verified",   title: "Verified",   type: "checkbox", onChange: (item, v) => patch(item.id, "verified", v) },
            { key: "website",    title: "Website",    type: "text-url", underlineColor: "primary" },
            { key: "product_id", title: "Product ID", type: "text-url", redirect: (item: any) => `https://example.com/products/${item.product_id}`, openNewTab: true, underlineColor: "#196EBF" },
            { key: "score",    title: "Score",    render: (item) => (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: item.score + "%" }} />
                </div>
                <span className="text-xs text-muted-foreground">{item.score}%</span>
              </div>
            )},
          ]
          return <Table data={rows} columns={cols} />
        })()}
      </Playground></Section>

      {/* ── filter & sort ── */}
      <Section id="servertablefilter"><Playground
        title="filter & sort (useServerTable)"
        description="Pass filter to render a filter bar above the table. Each field appends its value as a query param on every request. Pass sort with an array of column keys to render a sort dropdown. Render filterBar from the hook above your Table. Supported filter types: input, select, checkbox, toggle, date, date-time, date-range."
        code={`const { data, columns, serverPagination, loading, filterBar } = useServerTable({
  url: "/api/users",
  filter: [
    { key: "id",            type: "input",      label: "ID",           placeholder: "Search ID…" },
    { key: "gender",        type: "select",     label: "Gender",       options: ["Male", "Female", "Other"] },
    { key: "is_admin",      type: "checkbox",   label: "Admin only" },
    { key: "is_allowed",    type: "toggle",     label: "Allowed only" },
    { key: "created_at",    type: "date",       label: "Created date" },
    { key: "verified_date", type: "date-range", label: "Verified range" },
  ],
  sort: ["name", "age", "address"],
})

// Render filterBar above the table
return (
  <div className="space-y-3">
    {filterBar}
    <Table data={data} columns={columns} serverPagination={serverPagination} loading={loading} />
  </div>
)

// Laravel controller receives these query params:
// GET /api/users?id=1&gender=Male&is_admin=1&created_at=2024-01-01
//               &verified_date_from=2024-01-01&verified_date_to=2024-12-31
//               &sort=name&direction=asc&page=1`}
      >
        {(() => {
          const SAMPLE_USERS = [
            { id: "1",  name: "Alice Johnson",  gender: "Female", age: 28, address: "New York",     is_admin: true,  is_allowed: true,  created_at: "2024-01-15", verified_date: "2024-02-01", status: "Active"   },
            { id: "2",  name: "Bob Martinez",   gender: "Male",   age: 34, address: "Los Angeles",  is_admin: false, is_allowed: true,  created_at: "2024-02-20", verified_date: "2024-03-10", status: "Active"   },
            { id: "3",  name: "Carol White",    gender: "Female", age: 25, address: "Chicago",      is_admin: false, is_allowed: false, created_at: "2024-03-05", verified_date: "2024-04-15", status: "Pending"  },
            { id: "4",  name: "David Kim",      gender: "Male",   age: 41, address: "Houston",      is_admin: true,  is_allowed: true,  created_at: "2024-04-12", verified_date: "2024-05-20", status: "Active"   },
            { id: "5",  name: "Eva Chen",       gender: "Female", age: 30, address: "Phoenix",      is_admin: false, is_allowed: true,  created_at: "2024-05-18", verified_date: "2024-06-01", status: "Warning"  },
            { id: "6",  name: "Frank Lee",      gender: "Male",   age: 22, address: "Philadelphia", is_admin: false, is_allowed: false, created_at: "2024-06-22", verified_date: "2024-07-10", status: "Inactive" },
            { id: "7",  name: "Grace Park",     gender: "Female", age: 37, address: "San Antonio",  is_admin: true,  is_allowed: true,  created_at: "2024-07-08", verified_date: "2024-08-05", status: "Active"   },
            { id: "8",  name: "Henry Brown",    gender: "Male",   age: 29, address: "San Diego",    is_admin: false, is_allowed: true,  created_at: "2024-08-14", verified_date: "2024-09-12", status: "Active"   },
          ]

          // Simulate filter/sort locally for the demo
          const [filterVals, setFilterVals] = React.useState<Record<string, any>>({
            id: "", gender: "", is_admin: false, is_allowed: false,
            created_at: "", verified_date: { from: "", to: "" },
          })
          const [sortKey, setSortKey]   = React.useState("")
          const [sortDir, setSortDir]   = React.useState<"asc" | "desc">("asc")

          const filtered = React.useMemo(() => {
            let d = SAMPLE_USERS
            if (filterVals.id)        d = d.filter((r) => r.id.includes(filterVals.id))
            if (filterVals.gender)    d = d.filter((r) => r.gender === filterVals.gender)
            if (filterVals.is_admin)  d = d.filter((r) => r.is_admin)
            if (filterVals.is_allowed) d = d.filter((r) => r.is_allowed)
            if (filterVals.created_at) d = d.filter((r) => r.created_at >= filterVals.created_at)
            if (filterVals.verified_date?.from) d = d.filter((r) => r.verified_date >= filterVals.verified_date.from)
            if (filterVals.verified_date?.to)   d = d.filter((r) => r.verified_date <= filterVals.verified_date.to)
            if (sortKey) {
              d = [...d].sort((a, b) => {
                const av = (a as any)[sortKey] ?? ""
                const bv = (b as any)[sortKey] ?? ""
                const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
                return sortDir === "asc" ? cmp : -cmp
              })
            }
            return d
          }, [filterVals, sortKey, sortDir])

          const hasActive = filterVals.id || filterVals.gender || filterVals.is_admin ||
            filterVals.is_allowed || filterVals.created_at ||
            filterVals.verified_date?.from || filterVals.verified_date?.to || sortKey

          const clearAll = () => {
            setFilterVals({ id: "", gender: "", is_admin: false, is_allowed: false, created_at: "", verified_date: { from: "", to: "" } })
            setSortKey("")
            setSortDir("asc")
          }

          const cols: Column<typeof SAMPLE_USERS[0]>[] = [
            { key: "id",     title: "ID",      type: "text",  sortable: true },
            { key: "name",   title: "Name",    type: "text",  sortable: true },
            { key: "gender", title: "Gender",  type: "text",  sortable: true },
            { key: "age",    title: "Age",     type: "text",  sortable: true },
            { key: "address",title: "Address", type: "text",  sortable: true },
            { key: "is_admin",   title: "Admin",   type: "checkbox", onChange: () => {} },
            { key: "is_allowed", title: "Allowed", type: "toggle",   onChange: () => {} },
            { key: "status", title: "Status",  type: "badge", sortable: true },
          ]

          const inputCls = "h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          const labelCls = "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"

          return (
            <div className="space-y-3">
              {/* Filter bar */}
              <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                {/* input */}
                <div className="flex flex-col gap-1">
                  <span className={labelCls}>ID</span>
                  <input type="text" value={filterVals.id} placeholder="Search ID…"
                    onChange={(e) => setFilterVals((p) => ({ ...p, id: e.target.value }))}
                    className={`${inputCls} min-w-[100px]`} />
                </div>
                {/* select */}
                <div className="flex flex-col gap-1">
                  <span className={labelCls}>Gender</span>
                  <select value={filterVals.gender}
                    onChange={(e) => setFilterVals((p) => ({ ...p, gender: e.target.value }))}
                    className={`${inputCls} min-w-[110px]`}>
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                {/* checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={filterVals.is_admin}
                    onChange={(e) => setFilterVals((p) => ({ ...p, is_admin: e.target.checked }))}
                    className="h-4 w-4 rounded accent-primary" />
                  <span className="text-xs font-medium">Admin only</span>
                </label>
                {/* toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <button type="button" role="switch" aria-checked={filterVals.is_allowed}
                    onClick={() => setFilterVals((p) => ({ ...p, is_allowed: !p.is_allowed }))}
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${filterVals.is_allowed ? "bg-primary" : "bg-muted"}`}>
                    <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${filterVals.is_allowed ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                  <span className="text-xs font-medium">Allowed only</span>
                </label>
                {/* date */}
                <div className="flex flex-col gap-1">
                  <span className={labelCls}>Created date</span>
                  <input type="date" value={filterVals.created_at}
                    onChange={(e) => setFilterVals((p) => ({ ...p, created_at: e.target.value }))}
                    className={inputCls} />
                </div>
                {/* date-range */}
                <div className="flex flex-col gap-1">
                  <span className={labelCls}>Verified range</span>
                  <div className="flex items-center gap-1.5">
                    <input type="date" value={filterVals.verified_date?.from ?? ""}
                      onChange={(e) => setFilterVals((p) => ({ ...p, verified_date: { ...p.verified_date, from: e.target.value } }))}
                      className={inputCls} />
                    <span className="text-xs text-muted-foreground">–</span>
                    <input type="date" value={filterVals.verified_date?.to ?? ""}
                      onChange={(e) => setFilterVals((p) => ({ ...p, verified_date: { ...p.verified_date, to: e.target.value } }))}
                      className={inputCls} />
                  </div>
                </div>
                {/* sort */}
                <div className="flex flex-col gap-1">
                  <span className={labelCls}>Sort by</span>
                  <div className="flex items-center gap-1.5">
                    <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}
                      className={`${inputCls} min-w-[110px]`}>
                      <option value="">Default</option>
                      {["name", "age", "address"].map((k) => (
                        <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                      ))}
                    </select>
                    {sortKey && (
                      <button type="button"
                        onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        {sortDir === "asc"
                          ? <ChevronDown className="h-3.5 w-3.5" />
                          : <ChevronUp className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
                {/* clear */}
                {hasActive && (
                  <button type="button" onClick={clearAll}
                    className="flex h-8 items-center gap-1.5 self-end rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
              <Table data={filtered} columns={cols} />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Avatar Stack ── */}
      <Section id="avatarstack"><Playground
        title="Avatar Stack Column"
        description="Use type='stack' with stackProps to render an AvatarStack inside any table cell."
        code={`const columns = [
  { key: "project", title: "Project", type: "text" },
  { key: "members", title: "Members", type: "stack", stackProps: { limit: 3, stacked: true, shape: "circle", size: 32 } },
  { key: "status",  title: "Status",  type: "badge" },
]`}
      >
        {(() => {
          const projects = [
            { id: "1", project: "Design System",  members: Array.from({ length: 10 }, (_, i) => `https://i.pravatar.cc/150?img=${i + 1}`),  status: "Active"   },
            { id: "2", project: "Mobile App",     members: Array.from({ length: 5  }, (_, i) => `https://i.pravatar.cc/150?img=${i + 11}`), status: "Warning"  },
            { id: "3", project: "API Gateway",    members: Array.from({ length: 8  }, (_, i) => `https://i.pravatar.cc/150?img=${i + 16}`), status: "Active"   },
            { id: "4", project: "Data Pipeline",  members: Array.from({ length: 3  }, (_, i) => `https://i.pravatar.cc/150?img=${i + 24}`), status: "Pending"  },
            { id: "5", project: "Auth Service",   members: Array.from({ length: 7  }, (_, i) => `https://i.pravatar.cc/150?img=${i + 27}`), status: "Inactive" },
          ]
          const stackColumns: Column<typeof projects[0]>[] = [
            { key: "project", title: "Project", type: "text", sortable: true },
            { key: "members", title: "Members (stacked · circle)", type: "stack", stackProps: { limit: 3, stacked: true,  shape: "circle", size: 32 } },
            { key: "members", title: "Members (flat · square)",    type: "stack", stackProps: { limit: 4, stacked: false, shape: "square", size: 32 } },
            { key: "status",  title: "Status",  type: "badge", sortable: true },
          ]
          return <Table data={projects} columns={stackColumns} />
        })()}
      </Playground></Section>

      {/* ── Cell Types ── */}
      <Section id="celltypes"><Playground
        title="Select / Toggle / Color / Checkbox Columns"
        description="Interactive cell types: select renders a dropdown, toggle renders a switch, color renders a color picker, checkbox renders a checkbox. All fire onChange(item, newValue)."
        code={`const columns = [
  { key: "name",     title: "Name",     type: "text" },
  { key: "role",     title: "Role",     type: "select",   selectOptions: ["Validator","Miner","Observer","Staker"], onChange: (item, val) => patch(item.id, "role", val) },
  { key: "enabled",  title: "Enabled",  type: "toggle",   onChange: (item, val) => patch(item.id, "enabled", val) },
  { key: "color",    title: "Color",    type: "color",    onChange: (item, val) => patch(item.id, "color", val) },
  { key: "verified", title: "Verified", type: "checkbox", onChange: (item, val) => patch(item.id, "verified", val) },
]`}
      >
        {(() => {
          const [rows, setRows] = React.useState([
            { id: "1", name: "Ethereum",  role: "Validator", enabled: true,  color: "#627EEA", verified: true  },
            { id: "2", name: "Bitcoin",   role: "Miner",     enabled: false, color: "#F7931A", verified: true  },
            { id: "3", name: "Solana",    role: "Validator", enabled: true,  color: "#9945FF", verified: false },
            { id: "4", name: "Cardano",   role: "Observer",  enabled: false, color: "#0033AD", verified: false },
            { id: "5", name: "Polkadot",  role: "Staker",    enabled: true,  color: "#E6007A", verified: true  },
          ])
          const patch = (id: string, key: string, value: any) =>
            setRows((prev) => prev.map((r) => r.id === id ? { ...r, [key]: value } : r))
          const cols: Column<typeof rows[0]>[] = [
            { key: "name",     title: "Name",     type: "text", sortable: true },
            { key: "role",     title: "Role",     type: "select",   selectOptions: ["Validator","Miner","Observer","Staker"], onChange: (item, val) => patch(item.id, "role", val) },
            { key: "enabled",  title: "Enabled",  type: "toggle",   onChange: (item, val) => patch(item.id, "enabled", val) },
            { key: "color",    title: "Color",    type: "color",    onChange: (item, val) => patch(item.id, "color", val) },
            { key: "verified", title: "Verified", type: "checkbox", onChange: (item, val) => patch(item.id, "verified", val) },
          ]
          return <Table data={rows} columns={cols} />
        })()}
      </Playground></Section>

      {/* ── Bulk Actions ── */}
      <Section id="bulkactions"><Playground
        title="Bulk Actions & bulkDeleteBaseUrl"
        description="Enable selectable to show row checkboxes. Use bulkDeleteBaseUrl to wire up built-in bulk delete endpoints. The toolbar shows: Select all N (unselected), Unselect all N (selected), Delete N selected, and Delete all buttons automatically."
        code={`<Table
  data={data}
  columns={columns}
  selectable
  bulkDeleteBaseUrl="/api/certificate"
  defaultActions={{
    baseUrl: "/api/certificate",
    onReload: reload,
  }}
/>

// Laravel routes needed:
// DELETE /api/certificate/delete/{ids}/selected  → deleteSelected()
// DELETE /api/certificate/delete/all             → deleteAll()

// Laravel controller example:
public function deleteSelected(string $ids)
{
    $idArray = explode(',', $ids);
    Certificate::whereIn('id', $idArray)->delete();
    return response()->json(['message' => 'Deleted successfully']);
}

public function deleteAll()
{
    Certificate::query()->delete();
    return response()->json(['message' => 'All records deleted']);
}`}
      >
        {(() => {
          const [rows, setRows] = React.useState(USER_DATA.slice(0, 8))
          const userColumns: Column<typeof rows[0]>[] = [
            { key: "name",   title: "User",   render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <div className="space-y-2">
              <div className="rounded-xl border border-info/30 bg-info/5 px-4 py-3 text-xs text-info space-y-1">
                <p className="font-semibold">Toolbar buttons shown when selectable is enabled:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li><code className="font-mono bg-info/10 px-1 rounded">Select all N</code> — selects all unselected rows</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">Unselect all N</code> — clears selection (shown when rows are selected)</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">Delete N selected</code> — calls DELETE /{'{'}ids{'}'}/selected (shown when rows are selected)</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">Delete all</code> — calls DELETE /delete/all (shown when bulkDeleteBaseUrl is set)</li>
                </ul>
              </div>
              <Table
                data={rows}
                columns={userColumns}
                selectable
                onBulkDelete={(ids) => {
                  setRows((prev) => prev.filter((r) => !ids.includes(r.id)))
                  alert(`Deleted IDs: ${ids.join(", ")}`)
                }}
              />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── File Upload in editForm ── */}
      <Section id="fileuploadform"><Playground
        title="File Upload in editForm"
        description="Use type='file-upload' in editForm to add a file picker. When a new file is selected, the table sends multipart/form-data with _method=PUT. If no new file is chosen, the field is omitted so the server keeps the existing file. Use viewType='image' in viewForm to preview the stored image URL."
        code={`<Table
  data={certificates}
  columns={columns}
  defaultActions={{
    baseUrl: "/api/certificate",
    editFormGrid: 2,
    editForm: [
      { key: "image",       label: "Image",       type: "file-upload", colSpan: 2 },
      { key: "name",        label: "Name",        required: true },
      { key: "price",       label: "Price (Php)", required: true, validation: "numeric" },
      { key: "description", label: "Description", type: "textarea",   colSpan: 2 },
    ],
    viewFormGrid: 2,
    viewForm: [
      { key: "image",       label: "Image",       viewType: "image", colSpan: 2, width: 160, height: 160 },
      { key: "name",        label: "Name" },
      { key: "price",       label: "Price (Php)" },
      { key: "description", label: "Description", colSpan: 2 },
    ],
    onReload: reload,
  }}
/>

// Laravel controller — handles both file update and no-file update:
public function update(Request $request, $id)
{
    $cert = Certificate::findOrFail($id);
    $data = $request->except(['_method', 'image']);
    if ($request->hasFile('image')) {
        // Delete old file if exists
        if ($cert->image) Storage::delete($cert->image);
        $data['image'] = $request->file('image')->store('public/images');
    }
    $cert->update($data);
    return response()->json($cert);
}`}
      >
        {(() => {
          const certData = [
            { id: "1", name: "Web Development",  price: "5000", description: "Full stack web development.",  image: "https://i.pravatar.cc/150?img=10", status: "Active"  },
            { id: "2", name: "Data Science",      price: "7500", description: "Data science and ML cert.",    image: "https://i.pravatar.cc/150?img=11", status: "Active"  },
            { id: "3", name: "UI/UX Design",      price: "4500", description: "User interface design cert.",  image: "https://i.pravatar.cc/150?img=12", status: "Pending" },
          ]
          const certColumns: Column<typeof certData[0]>[] = [
            { key: "image",  title: "Image",  type: "image" },
            { key: "name",   title: "Name",   type: "text",  sortable: true },
            { key: "price",  title: "Price",  type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <Table
              data={certData}
              columns={certColumns}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                editFormGrid: 2,
                editForm: [
                  { key: "image",       label: "Image",       type: "file-upload", colSpan: 2 },
                  { key: "name",        label: "Name",        required: true },
                  { key: "price",       label: "Price (Php)", required: true, validation: "numeric" as const },
                  { key: "description", label: "Description", type: "textarea",   colSpan: 2 },
                ],
                viewFormGrid: 2,
                viewForm: [
                  { key: "image",       label: "Image",       viewType: "image" as const, colSpan: 2, width: 160, height: 160 },
                  { key: "name",        label: "Name" },
                  { key: "price",       label: "Price (Php)" },
                  { key: "description", label: "Description", colSpan: 2 },
                ],
                onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
              }}
            />
          )
        })()}
      </Playground></Section>

      {/* ── Repeater Fields ── */}
      <Section id="repeaterfields"><Playground
        title="Repeater Fields"
        description="Use type='repeater' with repeaterFields in editForm to let users add/remove structured rows. Each row renders fields based on type: 'input', 'image' (URL + preview), or 'attachment' (URL + link). In viewForm, use viewType='repeater' with the same repeaterFields to display each row read-only."
        code={`<Table
  data={employees}
  columns={columns}
  defaultActions={{
    baseUrl: "/api/employees",
    editFormGrid: 1,
    editForm: [
      { key: "name",        label: "Name",        required: true },
      {
        key: "documents",
        label: "Documents",
        type: "repeater",
        repeaterFields: [
          { type: "input",      key: "title",   label: "Title" },
          { type: "image",      key: "photo",   label: "Photo" },
          { type: "attachment", key: "file",    label: "File" },
        ],
      },
    ],
    viewFormGrid: 1,
    viewForm: [
      { key: "name",      label: "Name" },
      {
        key: "documents",
        label: "Documents",
        viewType: "repeater",
        repeaterFields: [
          { type: "input",      key: "title",   label: "Title" },
          { type: "image",      key: "photo",   label: "Photo" },
          { type: "attachment", key: "file",    label: "File" },
        ],
      },
    ],
  }}
/>`}
      >
        {(() => {
          const empData = [
            {
              id: "1",
              name: "Alice Johnson",
              role: "Engineer",
              status: "Active",
              documents: [
                { title: "Resume",      photo: "https://i.pravatar.cc/150?img=1", file: "https://example.com/resume.pdf" },
                { title: "Certificate", photo: "https://i.pravatar.cc/150?img=2", file: "https://example.com/cert.xlsx" },
              ],
            },
            {
              id: "2",
              name: "Bob Martinez",
              role: "Designer",
              status: "Pending",
              documents: [
                { title: "Portfolio", photo: "https://i.pravatar.cc/150?img=3", file: "https://example.com/portfolio.pdf" },
              ],
            },
            {
              id: "3",
              name: "Carol White",
              role: "Manager",
              status: "Active",
              documents: [],
            },
          ]
          const empColumns: Column<typeof empData[0]>[] = [
            { key: "name",   title: "Name",   render: (item) => <ProfileCell name={item.name} email={`${item.name.split(" ")[0].toLowerCase()}@acme.com`} avatar={`https://i.pravatar.cc/150?img=${item.id}`} /> },
            { key: "role",   title: "Role",   type: "text",  sortable: true },
            { key: "status", title: "Status", type: "badge", sortable: true },
          ]
          return (
            <Table
              data={empData}
              columns={empColumns}
              defaultActions={{
                baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                editFormGrid: 1,
                editForm: [
                  { key: "name", label: "Name", required: true },
                  { key: "role", label: "Role", type: "select", options: ["Engineer", "Designer", "Manager", "Analyst"] },
                  {
                    key: "documents",
                    label: "Documents",
                    type: "repeater",
                    repeaterFields: [
                      { type: "input",      key: "title", label: "Title" },
                      { type: "image",      key: "photo", label: "Photo URL" },
                      { type: "attachment", key: "file",  label: "File URL" },
                    ],
                  },
                ],
                viewFormGrid: 1,
                viewForm: [
                  { key: "name",   label: "Name" },
                  { key: "role",   label: "Role" },
                  { key: "status", label: "Status" },
                  {
                    key: "documents",
                    label: "Documents",
                    viewType: "repeater",
                    repeaterFields: [
                      { type: "input",      key: "title", label: "Title" },
                      { type: "image",      key: "photo", label: "Photo" },
                      { type: "attachment", key: "file",  label: "File" },
                    ],
                  },
                ],
                onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
              }}
            />
          )
        })()}
      </Playground></Section>

      {/* ── Auto-Derive Fields ── */}
      <Section id="autoderive"><Playground
        title="Auto-Derive Fields"
        description="When editForm and viewForm are omitted, the table inspects the first row's values and automatically picks the right field type. Booleans become toggles, numbers become number inputs, image/attachment/generic URLs get the correct viewType, long strings become textareas, and key name hints (email, password, color) are also detected."
        code={`// No editForm or viewForm needed — fields are auto-derived from row values
<Table
  data={products}
  columns={columns}
  defaultActions={{
    baseUrl: "/api/products",
    // editForm and viewForm intentionally omitted
  }}
/>

// Auto-derive rules:
// boolean          → type: "toggle",      viewType: "toggle"
// number           → inputType: "number"
// string[]         → type: "tag-input"
// URL ending .jpg/.png/etc → viewType: "image"
// URL ending .pdf/.xlsx/etc → viewType: "attachment"
// generic https:// URL → viewType: "text-url-open-other-tabs"
// string length > 120 or has \\n → type: "textarea"
// key contains "email" → inputType: "email"
// key contains "password/secret/token" → type: "password"
// key contains "color" + hex value → type: "color-picker"`}
      >
        {(() => {
          const productData = [
            {
              id: "1",
              name: "Wireless Headphones",
              price: 4999,
              email: "support@acme.com",
              in_stock: true,
              featured: false,
              brand_color: "#6366f1",
              thumbnail: "https://i.pravatar.cc/150?img=10",
              brochure: "https://example.com/brochure.pdf",
              website: "https://example.com",
              tags: ["audio", "wireless", "premium"],
              description: "High-quality wireless headphones with active noise cancellation and 30-hour battery life.",
              status: "Active",
            },
            {
              id: "2",
              name: "Mechanical Keyboard",
              price: 3500,
              email: "sales@acme.com",
              in_stock: false,
              featured: true,
              brand_color: "#f59e0b",
              thumbnail: "https://i.pravatar.cc/150?img=11",
              brochure: "https://example.com/keyboard.pdf",
              website: "https://example.com",
              tags: ["keyboard", "mechanical", "rgb"],
              description: "Tactile mechanical keyboard with RGB backlighting and hot-swappable switches.",
              status: "Active",
            },
            {
              id: "3",
              name: "USB-C Hub",
              price: 1200,
              email: "info@acme.com",
              in_stock: true,
              featured: false,
              brand_color: "#22c55e",
              thumbnail: "https://i.pravatar.cc/150?img=12",
              brochure: "https://example.com/hub.pdf",
              website: "https://example.com",
              tags: ["usb", "hub", "accessories"],
              description: "7-in-1 USB-C hub with HDMI, SD card reader, and 100W PD charging.",
              status: "Pending",
            },
          ]
          const productColumns: Column<typeof productData[0]>[] = [
            { key: "thumbnail",  title: "Image",    type: "image" },
            { key: "name",       title: "Name",     type: "text",  sortable: true },
            { key: "price",      title: "Price",    type: "text",  sortable: true },
            { key: "in_stock",   title: "In Stock", type: "toggle", onChange: (item, v) => alert(`${item.name}: in_stock = ${v}`) },
            { key: "status",     title: "Status",   type: "badge", sortable: true },
          ]
          return (
            <div className="space-y-3">
              <div className="rounded-xl border border-info/30 bg-info/5 px-4 py-3 text-xs text-info space-y-1">
                <p className="font-semibold">Click View or Edit — fields are auto-derived from row values:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li><code className="font-mono bg-info/10 px-1 rounded">price</code> → number input</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">email</code> → email input (key hint)</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">in_stock / featured</code> → toggle</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">brand_color</code> → color picker (key + hex hint)</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">thumbnail</code> → viewType: image</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">brochure</code> → viewType: attachment</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">website</code> → viewType: text-url-open-other-tabs</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">tags</code> → tag-input</li>
                  <li><code className="font-mono bg-info/10 px-1 rounded">description</code> → textarea (length &gt; 120)</li>
                </ul>
              </div>
              <Table
                data={productData}
                columns={productColumns}
                defaultActions={{
                  baseUrl: "https://gist.github.com/d51f2bd7582b7d5c24e3a1008d82f3cf.git",
                  modalWidth: "2xl",
                  editFormGrid: 2,
                  viewFormGrid: 2,
                  onSuccess: (action, item) => alert(`${action}: ${(item as any).name}`),
                }}
              />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Variant: Zebra ── */}
      <Section id="variant-zebra"><Playground
        title="Variant: Zebra (Striped)"
        description="Alternating row colors make long lists easier to scan. Even rows use bg-card, odd rows use bg-muted/40. Hover highlights with a subtle primary tint."
        code={`<Table
  data={data}
  columns={columns}
  variant="zebra"
  searchable
  clientPagination
  itemsPerPage={5}
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",       title: "User",       render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",       title: "Role",       type: "text",  sortable: true },
            { key: "department", title: "Department", type: "text",  sortable: true },
            { key: "joined",     title: "Joined",     type: "text",  sortable: true },
            { key: "status",     title: "Status",     type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA}
              columns={userColumns}
              variant="zebra"
              searchable
              searchPlaceholder="Search users…"
              clientPagination
              itemsPerPage={5}
            />
          )
        })()}
      </Playground></Section>

      {/* ── Variant: Card ── */}
      <Section id="variant-card"><Playground
        title="Variant: Card-Based"
        description="Each row becomes an individual card with rounded corners, a border, and a subtle shadow. Hovering lifts the card slightly. Great for mobile-friendly or modern dashboard layouts."
        code={`<Table
  data={data}
  columns={columns}
  variant="card"
  searchable
  clientPagination
  itemsPerPage={5}
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",       title: "User",       render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",       title: "Role",       type: "text",  sortable: true },
            { key: "department", title: "Department", type: "text",  sortable: true },
            { key: "joined",     title: "Joined",     type: "text",  sortable: true },
            { key: "status",     title: "Status",     type: "badge", sortable: true },
          ]
          return (
            <Table
              data={USER_DATA.slice(0, 6)}
              columns={userColumns}
              variant="card"
              searchable
              searchPlaceholder="Search users…"
              clientPagination
              itemsPerPage={5}
            />
          )
        })()}
      </Playground></Section>

      {/* ── Variant: Glass ── */}
      <Section id="variant-glass"><Playground
        title="Variant: Glassmorphism"
        description="Transparent background with backdrop blur, a subtle white/10 border, and a large shadow. Rows use white/5 hover tint. Pairs perfectly with gradient or image backgrounds — ideal for the Panel component."
        code={`<Table
  data={data}
  columns={columns}
  variant="glass"
  searchable
  clientPagination
  itemsPerPage={5}
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",       title: "User",       render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",       title: "Role",       type: "text",  sortable: true },
            { key: "department", title: "Department", type: "text",  sortable: true },
            { key: "joined",     title: "Joined",     type: "text",  sortable: true },
            { key: "status",     title: "Status",     type: "badge", sortable: true },
          ]
          return (
            <div
              className="rounded-2xl p-4"
              style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--info) 100%)" }}
            >
              <Table
                data={USER_DATA.slice(0, 6)}
                columns={userColumns}
                variant="glass"
                searchable
                searchPlaceholder="Search users…"
                clientPagination
                itemsPerPage={5}
              />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Variant: Soft UI ── */}
      <Section id="variant-soft"><Playground
        title="Variant: Soft UI (Neumorphism)"
        description="Outer neumorphic box-shadow replaces hard borders. Row dividers are very subtle. Selected rows get an inset shadow for a pressed effect. Smooth and tactile — best on light backgrounds."
        code={`<Table
  data={data}
  columns={columns}
  variant="soft"
  searchable
  clientPagination
  itemsPerPage={5}
/>`}
      >
        {(() => {
          const userColumns: Column<typeof USER_DATA[0]>[] = [
            { key: "name",       title: "User",       render: (item) => <ProfileCell name={item.name} email={item.email} avatar={item.avatar} /> },
            { key: "role",       title: "Role",       type: "text",  sortable: true },
            { key: "department", title: "Department", type: "text",  sortable: true },
            { key: "joined",     title: "Joined",     type: "text",  sortable: true },
            { key: "status",     title: "Status",     type: "badge", sortable: true },
          ]
          return (
            <div className="rounded-2xl bg-background p-4">
              <Table
                data={USER_DATA.slice(0, 6)}
                columns={userColumns}
                variant="soft"
                searchable
                searchPlaceholder="Search users…"
                clientPagination
                itemsPerPage={5}
              />
            </div>
          )
        })()}
      </Playground></Section>

      {/* ── Props ── */}
      <Section id="props">
        <h2 className="text-2xl font-bold tracking-tight text-gradient mb-4">Table Props</h2>
        <PropsTable rows={tableComponent?.props
          ? Object.values(tableComponent.props).flat().map((p: any) => ({
              prop: p.name,
              type: p.type,
              default: p.default,
              description: p.description,
              required: p.required,
            }))
          : []} />

        <h2 className="text-2xl font-bold tracking-tight text-gradient mt-8 mb-4">useServerTable Options</h2>
        <PropsTable rows={Array.isArray(serverTableComponent?.options)
          ? serverTableComponent.options.map((p: any) => ({
              prop: p.name,
              type: p.type,
              default: p.default,
              description: p.description,
              required: p.required,
            }))
          : []} />

        <h2 className="text-2xl font-bold tracking-tight text-gradient mt-8 mb-4">Column Props</h2>
        <PropsTable rows={Array.isArray(columnComponent?.props)
          ? columnComponent.props.map((p: any) => ({
              prop: p.name,
              type: p.type,
              default: p.default,
              description: p.description,
              required: p.required,
            }))
          : []} />

        <h2 className="text-2xl font-bold tracking-tight text-gradient mt-8 mb-4">DefaultActionsConfig Props</h2>
        <PropsTable rows={Array.isArray(defaultActionsComponent?.props)
          ? defaultActionsComponent.props.map((p: any) => ({
              prop: p.name,
              type: p.type,
              default: p.default,
              description: p.description,
              required: p.required,
            }))
          : []} />

        <h2 className="text-2xl font-bold tracking-tight text-gradient mt-8 mb-4">ActionField Props</h2>
        <PropsTable rows={Array.isArray(actionFieldComponent?.props)
          ? actionFieldComponent.props.map((p: any) => ({
              prop: p.name,
              type: p.type,
              default: p.default,
              description: p.description,
              required: p.required,
            }))
          : []} />
      </Section>

    </DocsLayout>
  )
}
