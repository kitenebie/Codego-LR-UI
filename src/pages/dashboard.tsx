import { useState } from "react"
import {
  Users, ShoppingCart, TrendingUp, DollarSign,
  Bell, Settings, LogOut, UserPlus, Edit, Trash2, Eye,
} from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Checkbox } from "@/src/components/ui/checkbox"
import { ToggleSwitch } from "@/src/components/ui/toggle-switch"
import { Select } from "@/src/components/ui/select"
import { Modal } from "@/src/components/ui/modal"
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from "@/src/components/ui/dropdown"
import { FileUpload } from "@/src/components/ui/file-upload"
import { Table } from "@/src/components/ui/table"
import { Widget } from "@/src/components/ui/widget"
import { AvatarStack } from "@/src/components/ui/avatar-stack"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Repeater } from "@/src/components/ui/repeater"
import { StatsWidget, ChartWidget, MetricRow } from "@/src/components/ui/dashboard-widget"

const AVATARS = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
  "https://i.pravatar.cc/40?img=4",
  "https://i.pravatar.cc/40?img=5",
]

const TABLE_DATA = [
  { id: "1", name: "Alice Johnson", role: "Admin", status: "active", joined: "Jan 2024" },
  { id: "2", name: "Bob Smith", role: "Editor", status: "pending", joined: "Feb 2024" },
  { id: "3", name: "Carol White", role: "Viewer", status: "inactive", joined: "Mar 2024" },
  { id: "4", name: "David Lee", role: "Editor", status: "active", joined: "Apr 2024" },
  { id: "5", name: "Eva Martinez", role: "Admin", status: "warning", joined: "May 2024" },
]

const TABLE_COLS = [
  { key: "name", title: "Name", sortable: true },
  { key: "role", title: "Role", sortable: true },
  { key: "status", title: "Status", type: "badge" as const },
  { key: "joined", title: "Joined" },
]

const CHART_DATA = [
  { label: "Jan", value: 42 },
  { label: "Feb", value: 68 },
  { label: "Mar", value: 55 },
  { label: "Apr", value: 90 },
  { label: "May", value: 73 },
  { label: "Jun", value: 110 },
]

const DONUT_DATA = [
  { label: "Direct", value: 40, color: "primary" as const },
  { label: "Organic", value: 30, color: "success" as const },
  { label: "Referral", value: 20, color: "info" as const },
  { label: "Social", value: 10, color: "warning" as const },
]

interface Tag { label: string }

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [ordersChartType, setOrdersChartType] = useState<"bar" | "line" | "donut">("bar")
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [role, setRole] = useState("editor")
  const [search, setSearch] = useState("")
  const [note, setNote] = useState("")
  const [tags, setTags] = useState<Tag[]>([{ label: "Design" }, { label: "Dev" }])
  const [tableData, setTableData] = useState(TABLE_DATA)

  return (
    <div className="space-y-8 w-full">

      {/* ── Header row ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-3">
          <AvatarStack images={AVATARS} limit={4} shape="circle" size={36} />
          <Dropdown
            trigger={
              <Button variant="outline" size="sm" rightIcon={<Bell className="h-4 w-4" />}>
                Actions
              </Button>
            }
          >
            <DropdownLabel>Account</DropdownLabel>
            <DropdownItem icon={<UserPlus className="h-4 w-4" />}>Invite member</DropdownItem>
            <DropdownItem icon={<Settings className="h-4 w-4" />}>Settings</DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon={<LogOut className="h-4 w-4" />} variant="danger">Sign out</DropdownItem>
          </Dropdown>
          <Button onClick={() => setModalOpen(true)} size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
            Add User
          </Button>
        </div>
      </div>

      {/* ── Metric row ── */}
      <MetricRow items={[
        { label: "Revenue", value: "$48,295", trend: "up", trendValue: "+12%", color: "success" },
        { label: "Orders", value: "1,284", trend: "up", trendValue: "+8%", color: "primary" },
        { label: "Refunds", value: "34", trend: "down", trendValue: "-3%", color: "danger" },
        { label: "Avg. Order", value: "$37.60", trend: "neutral", trendValue: "0%", color: "muted" },
      ]} />

      {/* ── Stats widgets ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsWidget
          title="Total Users"
          value={8420}
          icon={<Users className="h-5 w-5" />}
          iconColor="primary"
          trend="up"
          trendValue="+5.2%"
          sparkline={[30, 45, 38, 60, 55, 72, 80]}
          sparklineColor="primary"
          animate
        />
        <StatsWidget
          title="Monthly Sales"
          value={3210}
          icon={<ShoppingCart className="h-5 w-5" />}
          iconColor="success"
          trend="up"
          trendValue="+18%"
          progress={72}
          progressColor="success"
          animate
        />
        <StatsWidget
          title="Revenue"
          value="$48.2k"
          icon={<DollarSign className="h-5 w-5" />}
          iconColor="warning"
          trend="up"
          trendValue="+9.1%"
          sparkline={[20, 35, 50, 40, 65, 80, 75]}
          sparklineColor="warning"
        />
        <Widget
          title="Growth Rate"
          value="24.5%"
          icon={<TrendingUp className="h-5 w-5" />}
          iconColor="info"
          trend="up"
          trendValue="+2.3%"
          progress={65}
          progressColor="info"
          pulse
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartWidget
            title="Monthly Revenue"
            description="Revenue trend over the last 6 months"
            data={CHART_DATA}
            type="line"
            color="primary"
            height={180}
            showGrid
            showValues
            unit="k"
          />
        </div>
        <ChartWidget
          title="Traffic Sources"
          data={DONUT_DATA}
          type="donut"
          height={180}
          showValues
        />
      </div>

      {/* ── Orders by Month (switchable chart) ── */}
      <ChartWidget
        title="Orders by Month"
        description="Order volume over the last 6 months"
        data={CHART_DATA}
        type={ordersChartType}
        color="success"
        height={160}
        showGrid
        showValues
        action={
          <div className="flex gap-1">
            {(["bar", "line", "donut"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setOrdersChartType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  ordersChartType === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        }
      />

      {/* ── Table ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team and their roles</CardDescription>
            </div>
            <Button size="sm" variant="outline" leftIcon={<Edit className="h-4 w-4" />}>
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table
            data={tableData}
            columns={TABLE_COLS}
            searchable
            clientPagination
            itemsPerPage={4}
            selectable
            onBulkDelete={(ids) => setTableData((d) => d.filter((r) => !ids.includes(r.id)))}
          />
        </CardContent>
      </Card>

      {/* ── Forms section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: inputs + toggles */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Settings</CardTitle>
            <CardDescription>Update your preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Search users"
              placeholder="Type a name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              label="Default role"
              options={[
                { value: "admin", label: "Admin" },
                { value: "editor", label: "Editor" },
                { value: "viewer", label: "Viewer" },
              ]}
              value={role}
              onChange={(v) => setRole(v as string)}
              searchable
            />
            <Textarea
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              rows={3}
            />
            <div className="flex flex-col gap-3">
              <ToggleSwitch
                inline
                label="Email notifications"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <ToggleSwitch
                inline
                label="Dark mode"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <Checkbox inline label="Accept terms & conditions" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="primary" size="sm">Save changes</Button>
              <Button variant="outline" size="sm">Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: file upload + repeater */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Avatar</CardTitle>
              <CardDescription>PNG, JPG up to 2 MB</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                accept="image/*"
                maxSize={2048}
                allowedFileTypes={[".png", ".jpg", ".jpeg"]}
                imageEditor
                imagePreviewHeight={140}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Tags</CardTitle>
              <CardDescription>Add or remove tags</CardDescription>
            </CardHeader>
            <CardContent>
              <Repeater<Tag>
                items={tags}
                onAdd={() => setTags((t) => [...t, { label: "" }])}
                onRemove={(i) => setTags((t) => t.filter((_, idx) => idx !== i))}
                renderItem={(item, i) => (
                  <Input
                    placeholder="Tag name"
                    value={item.label}
                    onChange={(e) =>
                      setTags((t) => t.map((tag, idx) => idx === i ? { label: e.target.value } : tag))
                    }
                  />
                )}
                addButtonText="Add Tag"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Skeleton loading preview ── */}
      <Card>
        <CardHeader>
          <CardTitle>Loading State Preview</CardTitle>
          <CardDescription>Skeleton placeholders while content loads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </CardContent>
      </Card>

      {/* ── Add User Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New User"
        description="Fill in the details to invite a new team member."
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Send Invite</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full name" placeholder="Jane Doe" />
          <Input label="Email" inputType="email" placeholder="jane@example.com" />
          <Select
            label="Role"
            options={[
              { value: "admin", label: "Admin" },
              { value: "editor", label: "Editor" },
              { value: "viewer", label: "Viewer" },
            ]}
            placeholder="Select a role"
          />
        </div>
      </Modal>

    </div>
  )
}
