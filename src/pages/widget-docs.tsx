import * as React from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Widget } from "../components/ui/widget"
import { StatsWidget, ChartWidget, TableWidget, ComposableWidget, MetricRow } from "../components/ui/dashboard-widget"
import { Table } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Select } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { PropsTable } from "../components/ui/props-table"
import {
  Users, DollarSign, Activity, Zap, ShoppingCart,
  TrendingUp, Download, RefreshCw, Plus, Filter, Search,
} from "lucide-react"

// ── sample data ──────────────────────────────
const revenueBar = [
  { label: "Jan", value: 4200 },
  { label: "Feb", value: 5800 },
  { label: "Mar", value: 4900 },
  { label: "Apr", value: 7200 },
  { label: "May", value: 6100 },
  { label: "Jun", value: 8400 },
  { label: "Jul", value: 9100 },
]

const visitLine = [
  { label: "Mon", value: 320 },
  { label: "Tue", value: 480 },
  { label: "Wed", value: 390 },
  { label: "Thu", value: 620 },
  { label: "Fri", value: 540 },
  { label: "Sat", value: 710 },
  { label: "Sun", value: 430 },
]

const trafficDonut = [
  { label: "Organic",  value: 4200, color: "primary"  as const },
  { label: "Referral", value: 2100, color: "info"     as const },
  { label: "Social",   value: 1800, color: "success"  as const },
  { label: "Direct",   value: 900,  color: "warning"  as const },
]

const tableData = [
  { id: "1", name: "Alice Johnson",  role: "Engineer",  status: "active",  revenue: "$12,400" },
  { id: "2", name: "Bob Martinez",   role: "Designer",  status: "pending", revenue: "$8,200"  },
  { id: "3", name: "Carol White",    role: "Manager",   status: "active",  revenue: "$21,000" },
  { id: "4", name: "David Kim",      role: "Engineer",  status: "inactive",revenue: "$9,800"  },
  { id: "5", name: "Eva Chen",       role: "Analyst",   status: "active",  revenue: "$15,600" },
]

const tableColumns = [
  { key: "name",    title: "Name",    sortable: true },
  { key: "role",    title: "Role",    sortable: true },
  { key: "status",  title: "Status",  type: "badge" as const },
  { key: "revenue", title: "Revenue", sortable: true },
]

export function WidgetDocs() {
  const [period, setPeriod] = React.useState("monthly")
  const [search, setSearch] = React.useState("")
  const [chartType, setChartType] = React.useState<"bar" | "line">("bar")

  return (
    <DocsLayout toc={[
      { id: "widget",      label: "Stats Widget" },
      { id: "statswidget", label: "StatsWidget" },
      { id: "metricrow",   label: "MetricRow" },
      { id: "chartbar",    label: "Chart — Bar" },
      { id: "chartline",   label: "Chart — Line" },
      { id: "chartdonut",  label: "Chart — Donut" },
      { id: "tablewidget", label: "TableWidget" },
      { id: "composable",  label: "ComposableWidget" },
      { id: "dashboard",   label: "Dashboard Panel" },
      { id: "loading",     label: "Loading States" },
      { id: "props-widget",    label: "Widget Props" },
      { id: "props-stats",     label: "StatsWidget Props" },
      { id: "props-chart",     label: "ChartWidget Props" },
      { id: "props-table",     label: "TableWidget Props" },
      { id: "props-composable",label: "ComposableWidget Props" },
    ]}>

      {/* ── 1. Original Widget ── */}
      <Section id="widget"><Playground
        title="Stats Widget (original)"
        description="Core stat card with icon, trend, badge, progress, animation."
        code={`<Widget title="Total Revenue" value="$45,231" icon={<DollarSign />} trend="up" trendValue="20.1%" />`}
      >
        <div className="grid w-full gap-4 md:grid-cols-3">
          <Widget
            title="Total Revenue" value="$45,231"
            icon={<DollarSign className="h-6 w-6" />} iconColor="primary"
            trend="up" trendValue="20.1%" trendLabel="from last month"
            badge={<span className="rounded-full bg-success/10 text-success text-xs px-2 py-0.5 font-medium">Live</span>}
          />
          <Widget
            title="Active Users" value={2350} animate
            icon={<Users className="h-6 w-6" />} iconColor="info"
            trend="down" trendValue="4.5%" previousValue={2460}
            progress={68} progressColor="info"
          />
          <Widget
            title="Conversion" value="3.6%" pulse
            icon={<TrendingUp className="h-6 w-6" />} iconColor="success"
            trend="up" trendValue="0.8%" description="Goal: 5%"
            progress={72} progressColor="success"
          />
        </div>
      </Playground></Section>

      {/* ── 2. StatsWidget ── */}
      <Section id="statswidget"><Playground
        title="StatsWidget"
        description="Enhanced stat card with sparkline, delta, and rich trend display."
        code={`<StatsWidget title="Revenue" value={98432} animate sparkline={[40,55,48,70,62,80,91]} trend="up" trendValue="12%" />`}
      >
        <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsWidget
            title="Total Revenue" value={98432} animate
            icon={<DollarSign className="h-5 w-5" />} iconColor="primary"
            sparkline={[40, 55, 48, 70, 62, 80, 91]} sparklineColor="primary"
            trend="up" trendValue="12.4%" delta="+$10,821"
          />
          <StatsWidget
            title="Active Users" value={3842} animate
            icon={<Users className="h-5 w-5" />} iconColor="info"
            sparkline={[200, 310, 280, 390, 420, 380, 460]} sparklineColor="info"
            trend="up" trendValue="8.1%"
            badge={<span className="rounded-full bg-success/10 text-success text-xs px-2 py-0.5">Live</span>}
          />
          <StatsWidget
            title="Bounce Rate" value="42.3%" loading={false}
            icon={<Activity className="h-5 w-5" />} iconColor="warning"
            sparkline={[60, 52, 58, 44, 48, 42, 43]} sparklineColor="warning"
            trend="down" trendValue="3.2%" subtitle="Lower is better"
          />
          <StatsWidget
            title="Avg. Session" value="4m 12s"
            icon={<Zap className="h-5 w-5" />} iconColor="success"
            sparkline={[180, 210, 195, 240, 230, 260, 252]} sparklineColor="success"
            trend="up" trendValue="0.5 min"
            progress={84} progressColor="success"
          />
        </div>
      </Playground></Section>

      {/* ── 3. MetricRow ── */}
      <Section id="metricrow"><Playground
        title="MetricRow"
        description="Horizontal strip of mini metrics — great for dashboard summaries."
        code={`<MetricRow items={[{ label: 'Revenue', value: '$98K', trend: 'up', trendValue: '12%' }, ...]} />`}
      >
        <div className="w-full">
          <MetricRow items={[
            { label: "Revenue",    value: "$98,432", trend: "up",      trendValue: "12.4%", color: "primary" },
            { label: "Orders",     value: "1,284",   trend: "up",      trendValue: "5.2%"  },
            { label: "Refunds",    value: "38",       trend: "down",    trendValue: "2.1%", color: "danger"  },
            { label: "Avg. Order", value: "$76.70",  trend: "neutral", trendValue: "0.0%"  },
          ]} />
        </div>
      </Playground></Section>

      {/* ── 4. ChartWidget — Bar ── */}
      <Section id="chartbar"><Playground
        title="ChartWidget — Bar"
        description="SVG bar chart with grid, values, and an action slot for controls."
        code={`<ChartWidget title="Monthly Revenue" type="bar" data={revenueBar} showGrid showValues unit="$" />`}
      >
        <div className="w-full">
          <ChartWidget
            title="Monthly Revenue"
            description="Jan – Jul 2024"
            type="bar"
            data={revenueBar}
            color="primary"
            height={180}
            showGrid
            showValues
            unit="$"
            action={
              <div className="flex gap-2">
                <Button size="xs" variant="outline" leftIcon={<Download className="h-3 w-3" />} label="Export" />
              </div>
            }
            footer="Revenue in USD · updated daily"
          />
        </div>
      </Playground></Section>

      {/* ── 5. ChartWidget — Line ── */}
      <Section id="chartline"><Playground
        title="ChartWidget — Line"
        description="SVG line chart with area fill and interactive type switcher."
        code={`<ChartWidget title="Weekly Visits" type="line" data={visitLine} color="info" showGrid />`}
      >
        <div className="w-full">
          <ChartWidget
            title="Weekly Visits"
            description="This week vs last week"
            type="line"
            data={visitLine}
            color="info"
            height={180}
            showGrid
            showValues
            action={
              <div className="flex gap-1">
                <Button size="xs" variant={chartType === "bar" ? "primary" : "outline"} label="Bar" onClick={() => setChartType("bar")} />
                <Button size="xs" variant={chartType === "line" ? "primary" : "outline"} label="Line" onClick={() => setChartType("line")} />
              </div>
            }
          />
        </div>
      </Playground></Section>

      {/* ── 6. ChartWidget — Donut ── */}
      <Section id="chartdonut"><Playground
        title="ChartWidget — Donut"
        description="SVG donut chart with auto legend and percentage breakdown."
        code={`<ChartWidget title="Traffic Sources" type="donut" data={trafficDonut} />`}
      >
        <div className="w-full max-w-sm">
          <ChartWidget
            title="Traffic Sources"
            description="Last 30 days"
            type="donut"
            data={trafficDonut}
            height={140}
            showValues
            footer="Data from analytics · refreshed hourly"
          />
        </div>
      </Playground></Section>

      {/* ── 7. TableWidget ── */}
      <Section id="tablewidget"><Playground
        title="TableWidget"
        description="Card-wrapped Table with header controls — searchable, sortable, paginated."
        code={`<TableWidget title="Team Members" action={<Button label="Add" />}><Table data={...} columns={...} searchable /></TableWidget>`}
      >
        <div className="w-full">
          <TableWidget
            title="Team Members"
            description="All active accounts"
            action={
              <>
                <Button size="sm" variant="outline" leftIcon={<Filter className="h-3.5 w-3.5" />} label="Filter" />
                <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} label="Add Member" />
              </>
            }
            footer="Showing 5 of 128 members"
          >
            <Table
              data={tableData}
              columns={tableColumns}
              searchable
              pagination
              itemsPerPage={5}
              selectable
            />
          </TableWidget>
        </div>
      </Playground></Section>

      {/* ── 8. ComposableWidget — with Select + Input ── */}
      <Section id="composable"><Playground
        title="ComposableWidget — Filter Panel"
        description="Slot-based widget: drop any components into header, toolbar, and body."
        code={`<ComposableWidget title="Filter Data" toolbar={<Select ... />} footer="...">
  <Input ... />
</ComposableWidget>`}
      >
        <div className="w-full max-w-lg">
          <ComposableWidget
            title="Filter & Search"
            description="Narrow down your dataset"
            headerRight={
              <Button size="sm" variant="outline" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} label="Reset" />
            }
            toolbar={
              <>
                <Select
                  options={[
                    { value: "monthly", label: "Monthly" },
                    { value: "weekly",  label: "Weekly"  },
                    { value: "daily",   label: "Daily"   },
                  ]}
                  value={period}
                  onChange={(v) => setPeriod(v as string)}
                  placeholder="Period"
                />
                <Select
                  options={[
                    { value: "all",      label: "All Roles"  },
                    { value: "engineer", label: "Engineer"   },
                    { value: "designer", label: "Designer"   },
                  ]}
                  placeholder="Role"
                />
              </>
            }
            footer={`Period: ${period} · ${tableData.length} results`}
          >
            <div className="space-y-3">
              <Input
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                suffixIcon={<Search className="h-4 w-4" />}
              />
              <div className="rounded-lg border border-border divide-y divide-border/60">
                {tableData
                  .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()))
                  .map(row => (
                    <div key={row.id} className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="font-medium">{row.name}</p>
                        <p className="text-xs text-muted-foreground">{row.role}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">{row.revenue}</span>
                        <span className={cn(
                          "rounded-full border px-2 py-0.5 text-xs font-medium",
                          row.status === "active"   && "bg-success/10 text-success border-success/20",
                          row.status === "pending"  && "bg-info/10 text-info border-info/20",
                          row.status === "inactive" && "bg-muted text-muted-foreground border-border",
                        )}>{row.status}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </ComposableWidget>
        </div>
      </Playground></Section>

      {/* ── 9. ComposableWidget — Chart + Stats combo ── */}
      <Section id="dashboard"><Playground
        title="ComposableWidget — Dashboard Panel"
        description="Combine StatsWidget grid + ChartWidget inside one ComposableWidget."
        code={`<ComposableWidget title="Overview">
  <div className="grid grid-cols-3 gap-3 mb-4">
    <StatsWidget ... />
  </div>
  <ChartWidget ... />
</ComposableWidget>`}
      >
        <div className="w-full">
          <ComposableWidget
            title="Overview Dashboard"
            description="Real-time metrics"
            headerRight={
              <Button size="sm" variant="outline" leftIcon={<Download className="h-3.5 w-3.5" />} label="Export" />
            }
            padding="sm"
          >
            <div className="grid grid-cols-3 gap-3 mb-4">
              <StatsWidget title="Revenue"  value="$98K"  trend="up"   trendValue="12%" icon={<DollarSign className="h-4 w-4" />} iconColor="primary" />
              <StatsWidget title="Users"    value="3,842" trend="up"   trendValue="8%"  icon={<Users className="h-4 w-4" />}      iconColor="info"    />
              <StatsWidget title="Sessions" value="12.4K" trend="down" trendValue="2%"  icon={<Activity className="h-4 w-4" />}   iconColor="warning" />
            </div>
            <ChartWidget
              title="Revenue Trend"
              type="bar"
              data={revenueBar}
              color="primary"
              height={150}
              showGrid
              className="border-0 shadow-none bg-transparent"
            />
          </ComposableWidget>
        </div>
      </Playground></Section>

      {/* ── 10. Loading states ── */}
      <Section id="loading"><Playground
        title="Loading States"
        description="All widgets support a loading prop that renders skeleton placeholders."
        code={`<StatsWidget title="Revenue" value={0} loading />
<ChartWidget title="Chart" data={[]} loading />`}
      >
        <div className="grid w-full gap-4 md:grid-cols-3">
          <StatsWidget title="Revenue"  value={0} loading icon={<DollarSign className="h-5 w-5" />} />
          <StatsWidget title="Users"    value={0} loading icon={<Users className="h-5 w-5" />} iconColor="info" />
          <ChartWidget  title="Monthly Revenue" data={[]} loading height={120} />
        </div>
      </Playground></Section>

      <Section id="props-widget"><PropsTable rows={[
        { prop: "title",         type: "string",                                    required: true, description: "Stat label." },
        { prop: "value",         type: "string | number",                           required: true, description: "Primary metric value." },
        { prop: "icon",          type: "ReactNode",                                               description: "Icon shown in the top-right." },
        { prop: "iconColor",     type: '"primary" | "info" | "success" | "warning" | "danger" | "muted"', default: '"primary"', description: "Icon background color." },
        { prop: "trend",         type: '"up" | "down" | "neutral"',                               description: "Trend direction." },
        { prop: "trendValue",    type: "string",                                                  description: "Trend percentage or value label." },
        { prop: "trendLabel",    type: "string",                                    default: '"from last period"', description: "Trend context label." },
        { prop: "progress",      type: "number",                                                  description: "Progress bar value 0–100." },
        { prop: "progressColor", type: '"primary" | "info" | "success" | "warning" | "danger"',  description: "Progress bar color." },
        { prop: "badge",         type: "ReactNode",                                               description: "Badge shown next to the title." },
        { prop: "animate",       type: "boolean",                                   default: "false", description: "Count-up animation on the value." },
        { prop: "pulse",         type: "boolean",                                   default: "false", description: "Pulse ring animation on the icon." },
        { prop: "loading",       type: "boolean",                                   default: "false", description: "Show skeleton placeholder." },
        { prop: "variant",       type: '"default" | "glass" | "filled" | "outline"', default: '"default"', description: "Card visual style." },
        { prop: "size",          type: '"sm" | "md" | "lg"',                        default: '"md"',     description: "Card size." },
        { prop: "onClick",       type: "() => void",                                              description: "Make the card clickable." },
      ]} /></Section>

      <Section id="props-stats"><PropsTable rows={[
        { prop: "title",         type: "string",                                    required: true, description: "Stat label." },
        { prop: "value",         type: "string | number",                           required: true, description: "Primary metric value." },
        { prop: "icon",          type: "ReactNode",                                               description: "Icon shown in the header." },
        { prop: "iconColor",     type: '"primary" | "info" | "success" | "warning" | "danger"',  description: "Icon color." },
        { prop: "sparkline",     type: "number[]",                                               description: "Data points for the mini sparkline chart." },
        { prop: "sparklineColor",type: '"primary" | "info" | "success" | "warning" | "danger"',  description: "Sparkline color." },
        { prop: "trend",         type: '"up" | "down" | "neutral"',                               description: "Trend direction." },
        { prop: "trendValue",    type: "string",                                                  description: "Trend label." },
        { prop: "delta",         type: "string",                                                  description: "Absolute change label e.g. \"+$10,821\"." },
        { prop: "subtitle",      type: "string",                                                  description: "Secondary label below the value." },
        { prop: "badge",         type: "ReactNode",                                               description: "Badge shown next to the title." },
        { prop: "progress",      type: "number",                                                  description: "Progress bar value 0–100." },
        { prop: "progressColor", type: '"primary" | "info" | "success" | "warning" | "danger"',  description: "Progress bar color." },
        { prop: "animate",       type: "boolean",                                   default: "false", description: "Count-up animation." },
        { prop: "loading",       type: "boolean",                                   default: "false", description: "Show skeleton placeholder." },
      ]} /></Section>

      <Section id="props-chart"><PropsTable rows={[
        { prop: "title",       type: "string",                                    required: true, description: "Chart card heading." },
        { prop: "data",        type: "{ label: string; value: number; color?: string }[]", required: true, description: "Chart data points." },
        { prop: "type",        type: '"bar" | "line" | "donut"',                 required: true, description: "Chart type." },
        { prop: "description", type: "string",                                                  description: "Subtitle below the title." },
        { prop: "color",       type: '"primary" | "info" | "success" | "warning" | "danger"', default: '"primary"', description: "Bar/line color." },
        { prop: "height",      type: "number",                                    default: "160",  description: "Chart SVG height in pixels." },
        { prop: "showGrid",    type: "boolean",                                   default: "false", description: "Show horizontal grid lines." },
        { prop: "showValues",  type: "boolean",                                   default: "false", description: "Show value labels on bars/points." },
        { prop: "unit",        type: "string",                                                   description: "Unit prefix for value labels e.g. \"$\"." },
        { prop: "action",      type: "ReactNode",                                               description: "Action slot in the card header." },
        { prop: "footer",      type: "string",                                                   description: "Footer text below the chart." },
        { prop: "loading",     type: "boolean",                                   default: "false", description: "Show skeleton placeholder." },
      ]} /></Section>

      <Section id="props-table"><PropsTable rows={[
        { prop: "title",       type: "string",    required: true, description: "Widget card heading." },
        { prop: "description", type: "string",                    description: "Subtitle below the title." },
        { prop: "action",      type: "ReactNode",                 description: "Action slot in the card header." },
        { prop: "footer",      type: "string",                    description: "Footer text below the table." },
        { prop: "children",    type: "ReactNode", required: true, description: "Table or any content to render inside the card." },
      ]} /></Section>

      <Section id="props-composable"><PropsTable rows={[
        { prop: "title",       type: "string",    required: true, description: "Widget card heading." },
        { prop: "description", type: "string",                    description: "Subtitle below the title." },
        { prop: "headerRight", type: "ReactNode",                 description: "Right slot in the card header." },
        { prop: "toolbar",     type: "ReactNode",                 description: "Toolbar slot rendered below the header." },
        { prop: "footer",      type: "string",                    description: "Footer text below the body." },
        { prop: "padding",     type: '"sm" | "md" | "lg"',        default: '"md"', description: "Body padding size." },
        { prop: "children",    type: "ReactNode", required: true, description: "Widget body content." },
      ]} /></Section>

    </DocsLayout>
  )
}

// tiny helper used inline
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}
