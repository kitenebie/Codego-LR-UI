import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Panel, PanelSidebarItem, PanelSidebarGroup } from "../components/ui/panel"
import { Badge } from "../components/ui/badge"
import { PropsTable } from "../components/ui/props-table"
import { PanelSettings } from "../components/ui/PanelSettings"
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Bell,
  Search,
  Plus,
  Boxes,
  UserCircle,
  BarChart2,
  CreditCard,
} from "lucide-react"

const TOC = [
  { id: "basic", label: "Basic" },
  { id: "collapsible", label: "Collapsible Sidebar" },
  { id: "groups", label: "Sidebar Groups" },
  { id: "header-footer", label: "Header & Footer" },
  { id: "brand-profile", label: "Brand & Profile" },
  { id: "topbar", label: "Custom Topbar" },
  { id: "nosidebar", label: "No Sidebar" },
  { id: "themetoggle", label: "Theme Toggle" },
  { id: "settingspage", label: "Settings Page" },
  { id: "mobile-bottom-tabs", label: "Mobile — Bottom Tabs" },
  { id: "mobile-bottom-tabs-groups", label: "Mobile — Bottom Tabs + Groups" },
  { id: "mobile-drawer", label: "Mobile — Drawer" },
  { id: "tablet", label: "Tablet Panel" },
  { id: "props", label: "Props" },
  { id: "dataformat", label: "Sub-components" },
]

const PAGE_CONTENT: Record<string, { title: string; body: string }> = {
  dashboard: { title: "Dashboard", body: "Welcome back! Here's an overview of your workspace activity and key metrics." },
  users: { title: "Users", body: "Manage team members, roles, and permissions from this panel." },
  files: { title: "Files", body: "Browse, upload, and organise your project files and assets here." },
  settings: { title: "Settings", body: "Configure your account preferences, integrations, and notification settings." },
  analytics: { title: "Analytics", body: "View detailed reports, charts, and usage statistics for your workspace." },
  notifications: { title: "Notifications", body: "Review and manage your alerts, mentions, and system notifications." },
  billing: { title: "Billing", body: "Manage your subscription plan, invoices, and payment methods." },
}

function PageContent({ active }: { active: string }) {
  const page = PAGE_CONTENT[active] ?? { title: active, body: "" }
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{page.title}</p>
      <p className="text-sm text-muted-foreground">{page.body}</p>
    </div>
  )
}

function NavItems({ active, setActive }: { active: string; setActive: (v: string) => void }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "users", label: "Users", icon: Users },
    { key: "files", label: "Files", icon: FileText },
    { key: "settings", label: "Settings", icon: Settings },
  ]
  return (
    <>
      {items.map((item) => (
        <PanelSidebarItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          active={active === item.key}
          onClick={() => setActive(item.key)}
        />
      ))}
    </>
  )
}

const MOBILE_TABS = [
  { key: "dashboard", label: "Home", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users },
  { key: "files", label: "Files", icon: FileText },
  { key: "settings", label: "Settings", icon: Settings },
]

function MobilePanelGroupDemo() {
  const [active, setActive] = useState("dashboard")
  return (
    <Panel
      mobileTabs={MOBILE_TABS}
      mobileVariant="bottom-tabs"
      activeMobileTab={active}
      onMobileTabChange={setActive}
      topbar={<span className="font-semibold text-sm">My App</span>}
      topbarTrailing={<Bell className="h-4 w-4 text-muted-foreground" />}
      sidebarBrand={{ icon: <Boxes className="h-5 w-5 text-primary" />, title: "My App" }}
      sidebar={
        <>
          <PanelSidebarGroup title="Main">
            <PanelSidebarItem icon={LayoutDashboard} label="Dashboard" active={active === "dashboard"} onClick={() => setActive("dashboard")} />
            <PanelSidebarItem icon={Users} label="Users" active={active === "users"} onClick={() => setActive("users")} />
            <PanelSidebarItem icon={BarChart2} label="Analytics" active={active === "analytics"} onClick={() => setActive("analytics")} />
          </PanelSidebarGroup>
          <PanelSidebarGroup title="Manage">
            <PanelSidebarItem icon={FileText} label="Files" active={active === "files"} onClick={() => setActive("files")} />
            <PanelSidebarItem icon={Bell} label="Notifications" active={active === "notifications"} onClick={() => setActive("notifications")} />
          </PanelSidebarGroup>
          <PanelSidebarGroup title="Account">
            <PanelSidebarItem icon={CreditCard} label="Billing" active={active === "billing"} onClick={() => setActive("billing")} />
            <PanelSidebarItem icon={Settings} label="Settings" active={active === "settings"} onClick={() => setActive("settings")} />
          </PanelSidebarGroup>
        </>
      }
      height="h-[600px]"
      className="max-w-sm"
    >
      <PageContent active={active} />
    </Panel>
  )
}

function MobilePanelDemo({ variant }: { variant: "bottom-tabs" | "drawer" }) {
  const [active, setActive] = useState("dashboard")
  return (
    <Panel
      variant={variant as any}
      mobileTabs={MOBILE_TABS}
      mobileVariant={variant}
      activeMobileTab={active}
      onMobileTabChange={setActive}
      topbar={<span className="font-semibold text-sm">My App</span>}
      height="h-[600px]"
      className="max-w-sm"
    >
      <PageContent active={active} />
    </Panel>
  )
}
function TabletPanelDemo() {
  const [active, setActive] = useState("dashboard")
  return (
    <Panel
      collapsible
      defaultCollapsed
      topbar={<span className="font-semibold text-sm">Dashboard</span>}
      sidebarBrand={{ icon: <Boxes className="h-5 w-5 text-primary" />, title: "My Project" }}
      sidebar={<NavItems active={active} setActive={setActive} />}
      tabletBreakpoint={0}
    >
      <PageContent active={active} />
    </Panel>
  )
}

export function PanelDocs() {
  const [active1, setActive1] = useState("dashboard")
  const [active2, setActive2] = useState("dashboard")
  const [active3, setActive3] = useState("dashboard")
  const [active4, setActive4] = useState("dashboard")
  const [active5, setActive5] = useState("dashboard")
  const [active6, setActive6] = useState("settings")
  const [active7, setActive7] = useState("dashboard")

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground
          title="Basic Panel"
          description="A panel with a left sidebar and top bar."
          code={`<Panel
  topbar={<span className="font-semibold">Dashboard</span>}
  sidebar={
    <>
      <PanelSidebarItem icon={LayoutDashboard} label="Dashboard" active />
      <PanelSidebarItem icon={Users} label="Users" />
      <PanelSidebarItem icon={Settings} label="Settings" />
    </>
  }
>
  <p>Main content area</p>
</Panel>`}
        >
          <div className="w-full max-w-2xl">
            <Panel
              topbar={<span className="font-semibold text-sm">Dashboard</span>}
              sidebar={<NavItems active={active1} setActive={setActive1} />}
            >
              <PageContent active={active1} />
            </Panel>
          </div>
        </Playground>
      </Section>

      <Section id="collapsible">
        <Playground
          title="Collapsible Sidebar"
          description="Toggle the sidebar open/closed via the topbar button."
          code={`<Panel
  collapsible
  topbar={<span>My App</span>}
  sidebar={<PanelSidebarItem icon={LayoutDashboard} label="Dashboard" active />}
  sidebarBrand={{
    image: "https://tse2.mm.bing.net/th/id/OIP.eBnSJTFfIBedYR4lU_x16gHaGl?pid=Api&P=0&h=180",          // or use icon fallback
    icon: <Boxes className="h-5 w-5 text-primary" />,
    title: "My Project",
    trailing: <Badge>v2</Badge>,
  }}
  sidebarProfile={{
    image: "https://tse1.mm.bing.net/th/id/OIP.gZPQKkDgLYGPW_-h2-r5MAHaHa?pid=Api&P=0&h=180",        // or use icon fallback
    icon: <UserCircle className="h-6 w-6" />,
    content: (                   // full element when expanded
      <div className="flex items-center gap-2">
        <img src="https://tse1.mm.bing.net/th/id/OIP.gZPQKkDgLYGPW_-h2-r5MAHaHa?pid=Api&P=0&h=180" className="h-7 w-7 rounded-full" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">John Doe</p>
          <p className="text-xs text-muted-foreground truncate">john@example.com</p>
        </div>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
  }}
>
  <p>Content</p>
</Panel>`}
        >
          <div className="w-full max-w-2xl">
            <Panel
              collapsible
              topbar={<span className="font-semibold text-sm">My App</span>}
              sidebar={<NavItems active={active2} setActive={setActive2} />}

              sidebarBrand={{
                image: "https://tse2.mm.bing.net/th/id/OIP.eBnSJTFfIBedYR4lU_x16gHaGl?pid=Api&P=0&h=180",          // or use icon fallback
                icon: <Boxes className="h-5 w-5 text-primary" />,
                title: "My Project",
                trailing: <Badge>v2</Badge>,
              }}
              sidebarProfile={{
                image: "https://tse1.mm.bing.net/th/id/OIP.gZPQKkDgLYGPW_-h2-r5MAHaHa?pid=Api&P=0&h=180",        // or use icon fallback
                icon: <UserCircle className="h-6 w-6" />,
                content: (                   // full element when expanded
                  <div className="flex items-center gap-2">
                    <img src="https://tse1.mm.bing.net/th/id/OIP.gZPQKkDgLYGPW_-h2-r5MAHaHa?pid=Api&P=0&h=180" className="h-7 w-7 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">John Doe</p>
                      <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                    </div>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </div>
                ),
              }}
            >
              <PageContent active={active2} />
            </Panel>
          </div>
        </Playground>
      </Section>

      <Section id="groups">
        <Playground
          title="Sidebar Groups"
          description="Organise sidebar items into labelled groups using PanelSidebarGroup."
          code={`<Panel
  sidebar={
    <>
      <PanelSidebarGroup title="Main">
        <PanelSidebarItem icon={LayoutDashboard} label="Dashboard" active />
        <PanelSidebarItem icon={Users} label="Users" />
      </PanelSidebarGroup>
      <PanelSidebarGroup title="System">
        <PanelSidebarItem icon={Settings} label="Settings" />
      </PanelSidebarGroup>
    </>
  }
>
  <p>Content</p>
</Panel>`}
        >
          <div className="w-full max-w-2xl">
            <Panel
              collapsible
              topbar={<span className="font-semibold text-sm">App</span>}
              sidebar={
                <>
                  <PanelSidebarGroup title="Main">
                    {[
                      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                      { key: "users", label: "Users", icon: Users },
                      { key: "files", label: "Files", icon: FileText },
                    ].map((item) => (
                      <PanelSidebarItem
                        key={item.key}
                        icon={item.icon}
                        label={item.label}
                        active={active3 === item.key}
                        onClick={() => setActive3(item.key)}
                      />
                    ))}
                  </PanelSidebarGroup>
                  <PanelSidebarGroup title="System">
                    <PanelSidebarItem
                      icon={Settings}
                      label="Settings"
                      active={active3 === "settings"}
                      onClick={() => setActive3("settings")}
                    />
                  </PanelSidebarGroup>
                </>
              }
            >
              <PageContent active={active3} />
            </Panel>
          </div>
        </Playground>
      </Section>

      <Section id="header-footer">
        <Playground
          title="Sidebar Header & Footer"
          description="Add a branded header and action footer to the sidebar."
          code={`<Panel
  sidebarHeader={<span>Codego UI</span>}
  sidebarFooter={<span className="text-xs text-muted-foreground">v1.0.0</span>}
  sidebar={<PanelSidebarItem icon={LayoutDashboard} label="Dashboard" active />}
>
  <p>Content</p>
</Panel>`}
        >
          <div className="w-full max-w-2xl">
            <Panel
              topbar={<span className="font-semibold text-sm">Workspace</span>}
              sidebarHeader={
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-primary" />
                  <span className="text-sm font-bold text-gradient">Codego UI</span>
                </div>
              }
              sidebarFooter={
                <span className="text-xs text-muted-foreground">v1.0.0</span>
              }
              sidebar={<NavItems active={active4} setActive={setActive4} />}
            >
              <PageContent active={active4} />
            </Panel>
          </div>
        </Playground>
      </Section>

      <Section id="brand-profile">
        <Playground
          title="Brand & Profile"
          description="Use sidebarBrand for a logo+title header and sidebarProfile for a user footer. When collapsed, only the image or icon is shown."
          code={`<Panel
  collapsible
  sidebarBrand={{
    icon: <Boxes className="h-5 w-5 text-primary" />,
    title: "My Project",
    trailing: <Badge size="xs" variant="outline">v2</Badge>,
  }}
  sidebarProfile={{
    icon: <UserCircle className="h-6 w-6 text-muted-foreground" />,
    content: (
      <div className="flex items-center gap-2">
        <UserCircle className="h-7 w-7 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">John Doe</p>
          <p className="text-xs text-muted-foreground truncate">john@example.com</p>
        </div>
        <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    ),
  }}
  sidebar={<NavItems active={active} setActive={setActive} />}
>
  <PageContent active={active} />
</Panel>`}
        >
          <div className="w-full max-w-2xl">
            <Panel
              collapsible
              sidebarBrand={{
                icon: <Boxes className="h-5 w-5 text-primary" />,
                title: "My Project",
                trailing: <Badge variant="outline">v2</Badge>,
              }}
              sidebarProfile={{
                icon: <UserCircle className="h-6 w-6 text-muted-foreground" />,
                content: (
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-7 w-7 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">John Doe</p>
                      <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                    </div>
                    <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                ),
              }}
              topbar={<span className="font-semibold text-sm">Workspace</span>}
              sidebar={<NavItems active={active7} setActive={setActive7} />}
            >
              <PageContent active={active7} />
            </Panel>
          </div>
        </Playground>
      </Section>

      <Section id="topbar">
        <Playground
          title="Custom Topbar"
          description="Use topbar and topbarTrailing to place content on both sides of the top bar."
          code={`<Panel
  topbar={<><Search className="h-4 w-4" /><span>Search...</span></>}
  topbarTrailing={<><Bell className="h-4 w-4" /><Badge>3</Badge></>}
  sidebar={<PanelSidebarItem icon={LayoutDashboard} label="Dashboard" active />}
>
  <p>Content</p>
</Panel>`}
        >
          <div className="w-full max-w-2xl">
            <Panel
              topbar={
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Search className="h-4 w-4" />
                  <span>Search...</span>
                </div>
              }
              topbarTrailing={
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="destructive">3</Badge>
                  <button type="button" className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    <Plus className="h-3 w-3" /> New
                  </button>
                </div>
              }
              collapsible
              sidebar={<NavItems active={active5} setActive={setActive5} />}
            >
              <PageContent active={active5} />
            </Panel>
          </div>
        </Playground>
      </Section>

      <Section id="nosidebar">
        <Playground
          title="No Sidebar"
          description="Panel without a sidebar — just a top bar and content area."
          code={`<Panel
  topbar={<span className="font-semibold">Editor</span>}
  topbarTrailing={<Badge>Saved</Badge>}
>
  <p>Content</p>
</Panel>`}
        >
          <div className="w-full max-w-2xl">
            <Panel
              topbar={<span className="font-semibold text-sm">Editor</span>}
              topbarTrailing={<Badge variant="success">Saved</Badge>}
            >
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">A panel with only a topbar and no sidebar.</p>
              </div>
            </Panel>
          </div>
        </Playground>
      </Section>

      <Section id="themetoggle">
        <Playground
          title="Theme Toggle"
          description="Add showThemeToggle to render a light/dark toggle in the topbar trailing area. Use defaultPage to set the initially active sidebar item."
          code={`<Panel
  showThemeToggle
  defaultPage="settings"
  collapsible
  topbar={<span className="font-semibold">My App</span>}
  sidebar={<NavItems active={active} setActive={setActive} />}
>
  <PageContent active={active} />
</Panel>`}
        >
          <div className="w-full max-w-2xl">
            <Panel
              showThemeToggle
              collapsible
              topbar={<span className="font-semibold text-sm">My App</span>}
              sidebar={<NavItems active={active5} setActive={setActive5} />}
            >
              <PageContent active={active5} />
            </Panel>
          </div>
        </Playground>
      </Section>

      <Section id="settingspage">
        <Playground
          title="Settings Page"
          description="Use the Settings component as a dedicated page inside a Panel. Navigate to it via a sidebar item."
          code={`import { PanelSettings } from "@juv/codego-react-ui"

const [active, setActive] = useState("settings")

<Panel
  showThemeToggle
  collapsible
  defaultPage="settings"
  topbar={<span className="font-semibold">My App</span>}
  sidebar={
    <>
      <PanelSidebarGroup title="Main">
        <PanelSidebarItem icon={LayoutDashboard} label="Dashboard" active={active === "dashboard"} onClick={() => setActive("dashboard")} />
        <PanelSidebarItem icon={Users}           label="Users"     active={active === "users"}     onClick={() => setActive("users")} />
      </PanelSidebarGroup>
      <PanelSidebarGroup title="Config">
        <PanelSidebarItem icon={SettingsIcon}    label="Settings"  active={active === "settings"}  onClick={() => setActive("settings")} />
      </PanelSidebarGroup>
    </>
  }
>
  {active === "settings" ? <PanelSettings /> : <p>{active}</p>}
</Panel>`}
        >
          <div className="w-full">
            <Panel
              showThemeToggle
              collapsible
              defaultPage="settings"
              height="h-[560px]"
              topbar={<span className="font-semibold text-sm">My App</span>}
              sidebar={
                <>
                  <PanelSidebarGroup title="Main">
                    {[
                      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                      { key: "users", label: "Users", icon: Users },
                      { key: "files", label: "Files", icon: FileText },
                    ].map((item) => (
                      <PanelSidebarItem
                        key={item.key}
                        icon={item.icon}
                        label={item.label}
                        active={active6 === item.key}
                        onClick={() => setActive6(item.key)}
                      />
                    ))}
                  </PanelSidebarGroup>
                  <PanelSidebarGroup title="Config">
                    <PanelSidebarItem
                      icon={Settings}
                      label="Settings"
                      active={active6 === "settings"}
                      onClick={() => setActive6("settings")}
                    />
                  </PanelSidebarGroup>
                </>
              }
            >
              {active6 === "settings"
                ? <PanelSettings />
                : <PageContent active={active6} />}
            </Panel>
          </div>
        </Playground>
      </Section>
      <Section id="mobile-bottom-tabs">
        <Playground
          title="Mobile Panel — Bottom Tabs"
          description="A mobile-first panel with a persistent bottom tab bar. Renders at max-w-sm to simulate a phone viewport."
          code={`import { MobilePanel } from "@juv/codego-react-ui"

<MobilePanel
  variant="bottom-tabs"
  title="My App"
  tabs={[
    { key: "dashboard", label: "Home", icon: LayoutDashboard },
    { key: "users",     label: "Users", icon: Users },
    { key: "files",     label: "Files", icon: FileText },
    { key: "settings", label: "Settings", icon: Settings },
  ]}
  activeTab={active}
  onTabChange={setActive}
>
  <PageContent active={active} />
</MobilePanel>`}
        >
          <div className="flex justify-center w-full">
            <MobilePanelDemo variant="bottom-tabs" />
          </div>
        </Playground>
      </Section>

      <Section id="mobile-bottom-tabs-groups">
        <Playground
          title="Mobile Panel — Bottom Tabs + Groups"
          description="Bottom tab bar for primary navigation combined with grouped sidebar items accessible via the drawer. Tap a bottom tab to switch pages; the drawer exposes the full grouped nav."
          code={`const TABS = [
  { key: "dashboard", label: "Home",     icon: LayoutDashboard },
  { key: "users",     label: "Users",    icon: Users },
  { key: "files",     label: "Files",    icon: FileText },
  { key: "settings", label: "Settings", icon: Settings },
]

<Panel
  mobileTabs={TABS}
  mobileVariant="bottom-tabs"
  activeMobileTab={active}
  onMobileTabChange={setActive}
  topbar={<span className="font-semibold text-sm">My App</span>}
  topbarTrailing={<Bell className="h-4 w-4 text-muted-foreground" />}
  sidebarBrand={{ icon: <Boxes className="h-5 w-5 text-primary" />, title: "My App" }}
  sidebar={
    <>
      <PanelSidebarGroup title="Main">
        <PanelSidebarItem icon={LayoutDashboard} label="Dashboard" active={active === "dashboard"} onClick={() => setActive("dashboard")} />
        <PanelSidebarItem icon={Users}           label="Users"     active={active === "users"}     onClick={() => setActive("users")} />
        <PanelSidebarItem icon={BarChart2}       label="Analytics" active={active === "analytics"} onClick={() => setActive("analytics")} />
      </PanelSidebarGroup>
      <PanelSidebarGroup title="Manage">
        <PanelSidebarItem icon={FileText} label="Files"         active={active === "files"}         onClick={() => setActive("files")} />
        <PanelSidebarItem icon={Bell}     label="Notifications" active={active === "notifications"} onClick={() => setActive("notifications")} />
      </PanelSidebarGroup>
      <PanelSidebarGroup title="Account">
        <PanelSidebarItem icon={CreditCard} label="Billing"  active={active === "billing"}  onClick={() => setActive("billing")} />
        <PanelSidebarItem icon={Settings}   label="Settings" active={active === "settings"} onClick={() => setActive("settings")} />
      </PanelSidebarGroup>
    </>
  }
>
  <PageContent active={active} />
</Panel>`}
        >
          <div className="flex justify-center w-full">
            <MobilePanelGroupDemo />
          </div>
        </Playground>
      </Section>

      <Section id="mobile-drawer">
        <Playground
          title="Mobile Panel — Drawer"
          description="A mobile panel with a hamburger button that slides up a drawer for navigation."
          code={`import { MobilePanel } from "@juv/codego-react-ui"

<MobilePanel
  variant="drawer"
  title="My App"
  tabs={[
    { key: "dashboard", label: "Home", icon: LayoutDashboard },
    { key: "users",     label: "Users", icon: Users },
    { key: "files",     label: "Files", icon: FileText },
    { key: "settings", label: "Settings", icon: Settings },
  ]}
  activeTab={active}
  onTabChange={setActive}
>
  <PageContent active={active} />
</MobilePanel>`}
        >
          <div className="flex justify-center w-full">
            <MobilePanelDemo variant="drawer" />
          </div>
        </Playground>
      </Section>

      <Section id="tablet">
        <Playground
          title="Tablet Panel"
          description="A tablet-optimised panel that defaults to an icon-only collapsed sidebar. Renders at max-w-2xl to simulate a tablet viewport."
          code={`import { TabletPanel, PanelSidebarItem } from "@juv/codego-react-ui"

<TabletPanel
  collapsible
  defaultCollapsed
  title="My App"
  topbar={<span className="font-semibold text-sm">Dashboard</span>}
  sidebarBrand={{ icon: <Boxes className="h-5 w-5 text-primary" />, title: "My Project" }}
  sidebar={<NavItems active={active} setActive={setActive} />}
>
  <PageContent active={active} />
</TabletPanel>`}
        >
          <div className="w-full">
            <TabletPanelDemo />
          </div>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "sidebar", type: "ReactNode", description: "Sidebar content — typically PanelSidebarItem / PanelSidebarGroup elements." },
        { prop: "sidebarBrand", type: "PanelBrand", description: "Structured brand header. Shows image+title when expanded, image/icon only when collapsed." },
        { prop: "sidebarProfile", type: "PanelProfile", description: "Structured profile footer. Shows full content when expanded, image/icon only when collapsed." },
        { prop: "sidebarHeader", type: "ReactNode", description: "(Deprecated) Raw slot at the top of the sidebar. Use sidebarBrand instead." },
        { prop: "sidebarFooter", type: "ReactNode", description: "(Deprecated) Raw slot at the bottom of the sidebar. Use sidebarProfile instead." },
        { prop: "sidebarWidth", type: "string", default: '"w-56"', description: "Tailwind width class for the expanded sidebar." },
        { prop: "topbar", type: "ReactNode", description: "Leading content in the top bar (left side)." },
        { prop: "topbarTrailing", type: "ReactNode", description: "Trailing content in the top bar (right side)." },
        { prop: "collapsible", type: "boolean", default: "false", description: "Show a toggle button to collapse/expand the sidebar." },
        { prop: "defaultCollapsed", type: "boolean", default: "false", description: "Initial collapsed state." },
        { prop: "showThemeToggle", type: "boolean", default: "false", description: "Render a light/dark theme toggle button in the topbar trailing area." },
        { prop: "defaultPage", type: "string", description: "Key of the sidebar item that should be active by default." },
        { prop: "height", type: "string", default: '"h-[520px]"', description: "Tailwind height class for the panel container." },
        { prop: "children", type: "ReactNode", description: "Main content area." },
        { prop: "className", type: "string", description: "Additional CSS classes on the outer wrapper." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "PanelBrand — image", type: "string", description: "Image URL for the project logo." },
        { prop: "PanelBrand — icon", type: "ReactNode", description: "Fallback icon shown when no image is provided." },
        { prop: "PanelBrand — title", type: "ReactNode", description: "Project/app title shown when the sidebar is expanded." },
        { prop: "PanelBrand — trailing", type: "ReactNode", description: "Extra element rendered to the right of the title (e.g. version badge)." },
        { prop: "PanelProfile — image", type: "string", description: "Avatar image URL." },
        { prop: "PanelProfile — icon", type: "ReactNode", description: "Fallback icon shown when no image is provided." },
        { prop: "PanelProfile — content", type: "ReactNode", description: "Full profile element rendered when expanded (e.g. name, email, settings button)." },
        { prop: "PanelSidebarItem — icon", type: "React.ElementType", description: "Lucide icon component shown in the sidebar item." },
        { prop: "PanelSidebarItem — label", type: "string", required: true, description: "Display label (hidden when collapsed, shown in tooltip)." },
        { prop: "PanelSidebarItem — active", type: "boolean", description: "Highlight the item as the active page." },
        { prop: "PanelSidebarItem — onClick", type: "() => void", description: "Click handler for navigation." },
        { prop: "PanelSidebarGroup — title", type: "string", description: "Section heading shown above the group items." },
        { prop: "PanelSidebarGroup — children", type: "ReactNode", required: true, description: "PanelSidebarItem elements inside the group." },
      ]} /></Section>
    </DocsLayout>
  )
}
