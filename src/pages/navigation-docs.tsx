import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import {
  LeftSidebar,
  RightSidebar,
  Topbar,
  Navigation,
  GroupNavigation,
} from "../components/ui/navigation"
import {
  LayoutDashboard,
  Settings,
  Users,
  Bell,
  Search,
  Menu,
  Box,
  FileText,
  BarChart2,
  ShoppingCart,
  Lock,
  Star,
} from "lucide-react"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "left-sidebar",       label: "Left Sidebar" },
  { id: "left-collapsed",     label: "Left Sidebar Collapsed" },
  { id: "right-sidebar",      label: "Right Sidebar" },
  { id: "right-sidebar-sticky", label: "Right Sidebar Sticky" },
  { id: "topbar",             label: "Topbar" },
  { id: "topbar-sticky",      label: "Topbar Sticky" },
  { id: "navigation",         label: "Navigation" },
  { id: "navigation-horizontal", label: "Navigation Horizontal" },
  { id: "navigation-collapsed",  label: "Navigation Collapsed" },
  { id: "group-navigation",   label: "Group Navigation" },
  { id: "group-collapsible",  label: "Group Collapsible" },
  { id: "group-collapsed",    label: "Group Collapsed" },
  { id: "props-leftsidebar",  label: "LeftSidebar Props" },
  { id: "props-rightsidebar", label: "RightSidebar Props" },
  { id: "props-topbar",       label: "Topbar Props" },
  { id: "props-navigation",   label: "Navigation Props" },
  { id: "props-groupnav",     label: "GroupNavigation Props" },
  { id: "dataformat",         label: "Data Format" },
]

const NAV_ITEMS = [
  { value: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { value: "analytics",  label: "Analytics",  icon: <BarChart2 className="h-4 w-4" /> },
  { value: "users",      label: "Users",      icon: <Users className="h-4 w-4" /> },
  { value: "orders",     label: "Orders",     icon: <ShoppingCart className="h-4 w-4" /> },
  { value: "settings",   label: "Settings",   icon: <Settings className="h-4 w-4" />, badge: <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 leading-none">3</span> },
  { value: "locked",     label: "Locked",     icon: <Lock className="h-4 w-4" />, disabled: true },
]

const GROUPS = [
  {
    label: "Overview",
    items: [
      { value: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { value: "analytics",  label: "Analytics",  icon: <BarChart2 className="h-4 w-4" /> },
    ],
  },
  {
    label: "Management",
    items: [
      { value: "users",   label: "Users",   icon: <Users className="h-4 w-4" /> },
      { value: "orders",  label: "Orders",  icon: <ShoppingCart className="h-4 w-4" />, badge: <span className="rounded-full bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 leading-none">5</span> },
      { value: "reports", label: "Reports", icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    label: "Configuration",
    items: [
      { value: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
]

const COLLAPSIBLE_GROUPS = GROUPS.map((g, i) => ({ ...g, collapsible: true, defaultOpen: i === 0 }))

export function NavigationDocs() {
  const [navVal, setNavVal] = useState("dashboard")
  const [hNavVal, setHNavVal] = useState("dashboard")
  const [grpVal, setGrpVal] = useState("dashboard")
  const [colVal, setColVal] = useState("dashboard")

  return (
    <DocsLayout toc={TOC}>

      {/* ── Left Sidebar ── */}
      <Section id="left-sidebar">
        <Playground
          title="Left Sidebar"
          description="Vertical sidebar with header, scrollable nav area, and footer slots."
          code={`<LeftSidebar
  header={<><Box className="mr-2 h-5 w-5 text-primary" /><span className="font-bold">Codego UI</span></>}
  footer={<div className="flex items-center gap-2 text-sm"><div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div><div><p className="font-medium text-sm">John Doe</p><p className="text-xs text-muted-foreground">Admin</p></div></div>}
>
  <Navigation items={items} />
</LeftSidebar>`}
        >
          <div className="h-[420px] w-64 rounded-xl overflow-hidden border border-white/10">
            <LeftSidebar
              header={
                <div className="flex items-center">
                  <Box className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-bold text-gradient">Codego UI</span>
                </div>
              }
              footer={
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">JD</div>
                  <div>
                    <p className="font-medium text-sm">John Doe</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
              }
            >
              <Navigation items={NAV_ITEMS} value={navVal} onChange={setNavVal} />
            </LeftSidebar>
          </div>
        </Playground>
      </Section>

      {/* ── Left Sidebar Collapsed ── */}
      <Section id="left-collapsed">
        <Playground
          title="Left Sidebar Collapsed"
          description="Icon-only mode - set collapsed on both LeftSidebar and Navigation."
          code={`<LeftSidebar collapsed header={<Box className="h-5 w-5 text-primary" />}>
  <Navigation items={items} collapsed />
</LeftSidebar>`}
        >
          <div className="h-[420px] rounded-xl overflow-hidden border border-white/10">
            <LeftSidebar
              collapsed
              header={<Box className="h-5 w-5 text-primary" />}
              footer={
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">JD</div>
              }
            >
              <Navigation items={NAV_ITEMS} value={navVal} onChange={setNavVal} collapsed />
            </LeftSidebar>
          </div>
        </Playground>
      </Section>

      {/* ── Right Sidebar ── */}
      <Section id="right-sidebar">
        <Playground
          title="Right Sidebar"
          description="Contextual panel on the right - details, filters, activity feed."
          code={`<RightSidebar
  header={<h3 className="font-semibold text-sm">Activity</h3>}
  footer={<Button variant="outline" className="w-full">View all</Button>}
>
  {/* content */}
</RightSidebar>`}
        >
          <div className="h-[420px] w-72 rounded-xl overflow-hidden border border-white/10">
            <RightSidebar
              header={<h3 className="font-semibold text-sm">Activity Feed</h3>}
              footer={<button className="w-full rounded-md border border-white/10 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">View all activity</button>}
            >
              <div className="px-4 space-y-3">
                {[
                  { user: "Alice", action: "created a new report", time: "2m ago", color: "bg-success" },
                  { user: "Bob",   action: "updated user settings",  time: "15m ago", color: "bg-info" },
                  { user: "Carol", action: "deleted 3 records",      time: "1h ago",  color: "bg-danger" },
                  { user: "Dave",  action: "exported CSV file",      time: "3h ago",  color: "bg-warning" },
                ].map((item) => (
                  <div key={item.user} className="flex items-start gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${item.color}`} />
                    <div>
                      <p className="text-sm"><span className="font-medium">{item.user}</span> {item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RightSidebar>
          </div>
        </Playground>
      </Section>

      {/* ── Right Sidebar Sticky ── */}
      <Section id="right-sidebar-sticky">
        <Playground
          title="Right Sidebar Sticky"
          description="sticky pins the panel to the top of its scroll container. stickyMaxHeight controls overflow."
          code={`<RightSidebar
  sticky
  stickyMaxHeight="400px"
  header={<h3 className="font-semibold text-sm">Details</h3>}
>
  {/* content */}
</RightSidebar>`}
        >
          <div className="flex h-[340px] w-full gap-0 rounded-xl overflow-hidden border border-white/10">
            {/* scrollable content area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-background/40 p-3 text-sm text-muted-foreground">
                  Content row {i + 1} - scroll down to see the sidebar stay fixed.
                </div>
              ))}
            </div>
            {/* sticky right sidebar */}
            <RightSidebar
              sticky
              stickyMaxHeight="340px"
              width="w-56"
              header={<h3 className="font-semibold text-sm">Details</h3>}
              footer={<button className="w-full rounded-md border border-white/10 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Edit</button>}
            >
              <div className="px-4 space-y-2">
                {["Status", "Owner", "Priority", "Due date"].map((label) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">-</p>
                  </div>
                ))}
              </div>
            </RightSidebar>
          </div>
        </Playground>
      </Section>

      {/* ── Topbar ── */}
      <Section id="topbar">
        <Playground
          title="Topbar"
          description="Header bar with left, center, and right slots."
          code={`<Topbar
  left={<><Menu className="h-5 w-5" /><span className="font-bold">Dashboard</span></>}
  center={<div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground"><Search className="h-4 w-4" />Search...</div>}
  right={<><Bell className="h-5 w-5" /><div className="h-8 w-8 rounded-full bg-primary/20" /></>}
/>`}
        >
          <div className="w-full rounded-xl overflow-hidden border border-white/10">
            <Topbar
              left={
                <div className="flex items-center gap-3">
                  <Menu className="h-5 w-5 text-muted-foreground" />
                  <span className="font-bold text-gradient">Dashboard</span>
                </div>
              }
              center={
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-background/50 px-3 py-1.5 text-sm text-muted-foreground w-56">
                  <Search className="h-4 w-4" />
                  Search…
                </div>
              }
              right={
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-danger" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">JD</div>
                </div>
              }
            />
          </div>
        </Playground>
      </Section>

      {/* ── Topbar Sticky ── */}
      <Section id="topbar-sticky">
        <Playground
          title="Topbar Sticky"
          description="sticky prop pins the topbar to the top of the viewport."
          code={`<Topbar sticky left={...} right={...} />`}
        >
          <div className="w-full rounded-xl overflow-hidden border border-white/10">
            <Topbar
              sticky
              left={
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-warning" />
                  <span className="font-semibold">Sticky Topbar</span>
                </div>
              }
              right={
                <span className="rounded-full bg-success/20 text-success text-xs font-medium px-2.5 py-1">sticky</span>
              }
            />
          </div>
        </Playground>
      </Section>

      {/* ── Navigation ── */}
      <Section id="navigation">
        <Playground
          title="Navigation"
          description="Vertical nav list with icons, badges, and disabled items."
          code={`<Navigation
  items={[
    { value: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { value: "settings",  label: "Settings",  icon: <Settings className="h-4 w-4" />, badge: <span>3</span> },
    { value: "locked",    label: "Locked",    icon: <Lock className="h-4 w-4" />, disabled: true },
  ]}
  value={active}
  onChange={setActive}
/>`}
        >
          <div className="w-56 rounded-xl border border-white/10 py-2">
            <Navigation items={NAV_ITEMS} value={navVal} onChange={setNavVal} />
          </div>
        </Playground>
      </Section>

      {/* ── Navigation Horizontal ── */}
      <Section id="navigation-horizontal">
        <Playground
          title="Navigation Horizontal"
          description="orientation horizontal - renders a tab-bar style nav."
          code={`<Navigation orientation="horizontal" items={items} value={active} onChange={setActive} />`}
        >
          <div className="w-full rounded-xl border border-white/10 p-2">
            <Navigation
              orientation="horizontal"
              items={[
                { value: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
                { value: "analytics",  label: "Analytics",  icon: <BarChart2 className="h-4 w-4" /> },
                { value: "users",      label: "Users",      icon: <Users className="h-4 w-4" /> },
                { value: "settings",   label: "Settings",   icon: <Settings className="h-4 w-4" /> },
              ]}
              value={hNavVal}
              onChange={setHNavVal}
            />
          </div>
        </Playground>
      </Section>

      {/* ── Navigation Collapsed ── */}
      <Section id="navigation-collapsed">
        <Playground
          title="Navigation Collapsed"
          description="collapsed hides labels - icons only with title tooltips."
          code={`<Navigation items={items} collapsed value={active} onChange={setActive} />`}
        >
          <div className="w-16 rounded-xl border border-white/10 py-2">
            <Navigation items={NAV_ITEMS} value={navVal} onChange={setNavVal} collapsed />
          </div>
        </Playground>
      </Section>

      {/* ── Group Navigation ── */}
      <Section id="group-navigation">
        <Playground
          title="Group Navigation"
          description="Groups of nav items with section labels."
          code={`<GroupNavigation
  groups={[
    { label: "Overview",    items: [...] },
    { label: "Management",  items: [...] },
    { label: "Configuration", items: [...] },
  ]}
  value={active}
  onChange={setActive}
/>`}
        >
          <div className="w-56 rounded-xl border border-white/10 py-2">
            <GroupNavigation groups={GROUPS} value={grpVal} onChange={setGrpVal} />
          </div>
        </Playground>
      </Section>

      {/* ── Group Collapsible ── */}
      <Section id="group-collapsible">
        <Playground
          title="Group Collapsible"
          description="collapsible groups can be toggled open/closed."
          code={`<GroupNavigation
  groups={[
    { label: "Overview",    items: [...], collapsible: true, defaultOpen: true },
    { label: "Management",  items: [...], collapsible: true, defaultOpen: false },
  ]}
/>`}
        >
          <div className="w-56 rounded-xl border border-white/10 py-2">
            <GroupNavigation groups={COLLAPSIBLE_GROUPS} value={grpVal} onChange={setGrpVal} />
          </div>
        </Playground>
      </Section>

      {/* ── Group Collapsed ── */}
      <Section id="group-collapsed">
        <Playground
          title="Group Collapsed"
          description="collapsed on GroupNavigation shows icon-only items."
          code={`<GroupNavigation groups={groups} collapsed value={active} onChange={setActive} />`}
        >
          <div className="w-16 rounded-xl border border-white/10 py-2">
            <GroupNavigation groups={GROUPS} value={colVal} onChange={setColVal} collapsed />
          </div>
        </Playground>
      </Section>

      <Section id="props-leftsidebar"><PropsTable rows={[
        { prop: "header",    type: "ReactNode",  description: "Logo / brand slot at the top." },
        { prop: "footer",    type: "ReactNode",  description: "User profile / logout slot at the bottom." },
        { prop: "children",  type: "ReactNode",  description: "Main scrollable nav area." },
        { prop: "width",     type: "string",     default: '"w-64"',  description: "Tailwind width class." },
        { prop: "collapsed", type: "boolean",    default: "false",   description: "Icon-only collapsed mode." },
        { prop: "className", type: "string",                         description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="props-rightsidebar"><PropsTable rows={[
        { prop: "header",          type: "ReactNode", description: "Header slot." },
        { prop: "footer",          type: "ReactNode", description: "Footer slot." },
        { prop: "children",        type: "ReactNode", description: "Scrollable content area." },
        { prop: "width",           type: "string",    default: '"w-72"',   description: "Tailwind width class." },
        { prop: "sticky",          type: "boolean",   default: "false",    description: "Stick the sidebar to the viewport top." },
        { prop: "stickyMaxHeight", type: "string",    default: '"100vh"',  description: "Max height when sticky." },
        { prop: "className",       type: "string",                         description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="props-topbar"><PropsTable rows={[
        { prop: "left",      type: "ReactNode", description: "Left slot — logo, hamburger, breadcrumb." },
        { prop: "center",    type: "ReactNode", description: "Center slot — search, title." },
        { prop: "right",     type: "ReactNode", description: "Right slot — actions, avatar, notifications." },
        { prop: "height",    type: "string",    default: '"h-16"', description: "Height class." },
        { prop: "sticky",    type: "boolean",   default: "false",  description: "Pin the topbar to the top of the viewport." },
        { prop: "className", type: "string",                       description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="props-navigation"><PropsTable rows={[
        { prop: "items",       type: "NavItem[]",                    required: true, description: "Array of nav items." },
        { prop: "value",       type: "string",                                      description: "Controlled active item value." },
        { prop: "onChange",    type: "(value: string) => void",                     description: "Fired when an item is clicked." },
        { prop: "orientation", type: '"vertical" | "horizontal"',   default: '"vertical"', description: "Layout direction." },
        { prop: "collapsed",   type: "boolean",                     default: "false",      description: "Icon-only mode." },
        { prop: "className",   type: "string",                                      description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="props-groupnav"><PropsTable rows={[
        { prop: "groups",    type: "NavGroup[]",              required: true, description: "Array of nav groups." },
        { prop: "value",     type: "string",                                  description: "Controlled active item value." },
        { prop: "onChange",  type: "(value: string) => void",                 description: "Fired when an item is clicked." },
        { prop: "collapsed", type: "boolean",                 default: "false", description: "Icon-only mode." },
        { prop: "className", type: "string",                                  description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "NavItem.value",    type: "string",    required: true, description: "Unique item identifier." },
        { prop: "NavItem.label",    type: "string",    required: true, description: "Display label." },
        { prop: "NavItem.icon",     type: "ReactNode",                 description: "Leading icon." },
        { prop: "NavItem.badge",    type: "ReactNode",                 description: "Trailing badge element." },
        { prop: "NavItem.disabled", type: "boolean",                  description: "Disable the item." },
        { prop: "NavItem.href",     type: "string",                   description: "Optional href (unused by default, available for custom rendering)." },
        { prop: "NavGroup.label",       type: "string",    required: true, description: "Group section heading." },
        { prop: "NavGroup.items",       type: "NavItem[]", required: true, description: "Items in this group." },
        { prop: "NavGroup.collapsible", type: "boolean",               description: "Allow the group to be toggled open/closed." },
        { prop: "NavGroup.defaultOpen", type: "boolean",               description: "Initial open state for collapsible groups." },
      ]} /></Section>

    </DocsLayout>
  )
}
