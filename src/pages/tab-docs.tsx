import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Tabs } from "../components/ui/tabs"
import { Home, Settings, Bell, User, Star, Lock } from "lucide-react"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "line",     label: "Line Variant" },
  { id: "pill",     label: "Pill Variant" },
  { id: "boxed",    label: "Boxed Variant" },
  { id: "lifted",   label: "Lifted Variant" },
  { id: "sizes",    label: "Sizes" },
  { id: "icons",    label: "With Icons" },
  { id: "badges",   label: "With Badges" },
  { id: "disabled", label: "Disabled Tabs" },
  { id: "fullwidth",label: "Full Width" },
  { id: "content",  label: "With Content Panel" },
  { id: "controlled", label: "Controlled" },
  { id: "props",    label: "Props" },
  { id: "dataformat", label: "Data Format" },
]

export function TabDocs() {
  const [active, setActive] = useState("profile")

  return (
    <DocsLayout toc={TOC}>

      <Section id="line">
        <Playground
          title="Line Variant"
          description="Classic underline tabs — the default style."
          code={`<Tabs variant="line" items={[
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "reports", label: "Reports" },
]} />`}
        >
          <div className="w-full">
            <Tabs variant="line" items={[
              { value: "overview",  label: "Overview" },
              { value: "analytics", label: "Analytics" },
              { value: "reports",   label: "Reports" },
              { value: "settings",  label: "Settings" },
            ]} />
          </div>
        </Playground>
      </Section>

      <Section id="pill">
        <Playground
          title="Pill Variant"
          description="Rounded pill tabs on a muted background track."
          code={`<Tabs variant="pill" items={[...]} />`}
        >
          <div className="w-full">
            <Tabs variant="pill" items={[
              { value: "all",      label: "All" },
              { value: "active",   label: "Active" },
              { value: "draft",    label: "Draft" },
              { value: "archived", label: "Archived" },
            ]} />
          </div>
        </Playground>
      </Section>

      <Section id="boxed">
        <Playground
          title="Boxed Variant"
          description="Tabs inside a bordered container."
          code={`<Tabs variant="boxed" items={[...]} />`}
        >
          <div className="w-full">
            <Tabs variant="boxed" items={[
              { value: "monthly",  label: "Monthly" },
              { value: "weekly",   label: "Weekly" },
              { value: "daily",    label: "Daily" },
            ]} />
          </div>
        </Playground>
      </Section>

      <Section id="lifted">
        <Playground
          title="Lifted Variant"
          description="Browser-tab style with lifted active tab."
          code={`<Tabs variant="lifted" items={[...]} />`}
        >
          <div className="w-full">
            <Tabs variant="lifted" items={[
              { value: "tab1", label: "Tab One" },
              { value: "tab2", label: "Tab Two" },
              { value: "tab3", label: "Tab Three" },
            ]} />
          </div>
        </Playground>
      </Section>

      <Section id="sizes">
        <Playground
          title="Sizes"
          description="sm, md (default), and lg sizes."
          code={`<Tabs size="sm" items={[...]} />
<Tabs size="md" items={[...]} />
<Tabs size="lg" items={[...]} />`}
        >
          <div className="w-full space-y-6">
            <Tabs size="sm" variant="pill" items={[{ value: "a", label: "Small" }, { value: "b", label: "Tabs" }, { value: "c", label: "Here" }]} />
            <Tabs size="md" variant="pill" items={[{ value: "a", label: "Medium" }, { value: "b", label: "Tabs" }, { value: "c", label: "Here" }]} />
            <Tabs size="lg" variant="pill" items={[{ value: "a", label: "Large" }, { value: "b", label: "Tabs" }, { value: "c", label: "Here" }]} />
          </div>
        </Playground>
      </Section>

      <Section id="icons">
        <Playground
          title="With Icons"
          description="Tabs with leading icons."
          code={`<Tabs variant="line" items={[
  { value: "home",     label: "Home",     icon: <Home /> },
  { value: "settings", label: "Settings", icon: <Settings /> },
  { value: "profile",  label: "Profile",  icon: <User /> },
]} />`}
        >
          <div className="w-full">
            <Tabs variant="line" items={[
              { value: "home",     label: "Home",     icon: <Home className="h-4 w-4" /> },
              { value: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
              { value: "profile",  label: "Profile",  icon: <User className="h-4 w-4" /> },
              { value: "notifs",   label: "Notifications", icon: <Bell className="h-4 w-4" /> },
            ]} />
          </div>
        </Playground>
      </Section>

      <Section id="badges">
        <Playground
          title="With Badges"
          description="Tabs with trailing badge counts."
          code={`<Tabs variant="pill" items={[
  { value: "inbox", label: "Inbox", badge: <span className="...">12</span> },
  { value: "sent",  label: "Sent" },
]} />`}
        >
          <div className="w-full">
            <Tabs variant="pill" items={[
              { value: "inbox",  label: "Inbox",  badge: <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 leading-none">12</span> },
              { value: "sent",   label: "Sent" },
              { value: "drafts", label: "Drafts", badge: <span className="rounded-full bg-warning text-white text-[10px] font-bold px-1.5 py-0.5 leading-none">3</span> },
              { value: "spam",   label: "Spam",   badge: <span className="rounded-full bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 leading-none">99+</span> },
            ]} />
          </div>
        </Playground>
      </Section>

      <Section id="disabled">
        <Playground
          title="Disabled Tabs"
          description="Individual tabs can be disabled."
          code={`<Tabs items={[
  { value: "active",   label: "Active" },
  { value: "disabled", label: "Disabled", disabled: true },
]} />`}
        >
          <div className="w-full">
            <Tabs variant="line" items={[
              { value: "available", label: "Available" },
              { value: "locked",    label: "Locked",  disabled: true, icon: <Lock className="h-3.5 w-3.5" /> },
              { value: "premium",   label: "Premium", disabled: true, icon: <Star className="h-3.5 w-3.5" /> },
              { value: "open",      label: "Open" },
            ]} />
          </div>
        </Playground>
      </Section>

      <Section id="fullwidth">
        <Playground
          title="Full Width"
          description="Tabs stretch to fill the container equally."
          code={`<Tabs fullWidth variant="boxed" items={[...]} />`}
        >
          <div className="w-full">
            <Tabs fullWidth variant="boxed" items={[
              { value: "overview",  label: "Overview" },
              { value: "details",   label: "Details" },
              { value: "history",   label: "History" },
            ]} />
          </div>
        </Playground>
      </Section>

      <Section id="content">
        <Playground
          title="With Content Panel"
          description="Each tab can carry a content node rendered below the tab bar."
          code={`<Tabs variant="line" items={[
  { value: "tab1", label: "Tab 1", content: <p>Content for tab 1</p> },
  { value: "tab2", label: "Tab 2", content: <p>Content for tab 2</p> },
]} />`}
        >
          <div className="w-full">
            <Tabs variant="line" items={[
              { value: "overview",  label: "Overview",  content: <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">📊 Overview content — charts, summaries, KPIs.</div> },
              { value: "analytics", label: "Analytics", content: <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">📈 Analytics content — detailed breakdowns and trends.</div> },
              { value: "settings",  label: "Settings",  content: <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">⚙️ Settings content — configuration options.</div> },
            ]} />
          </div>
        </Playground>
      </Section>

      <Section id="controlled">
        <Playground
          title="Controlled"
          description="Manage active tab externally with value + onChange."
          code={`const [active, setActive] = useState("profile")

<Tabs
  value={active}
  onChange={setActive}
  variant="pill"
  items={[...]}
/>`}
        >
          <div className="w-full space-y-4">
            <Tabs
              value={active}
              onChange={setActive}
              variant="pill"
              items={[
                { value: "profile",  label: "Profile" },
                { value: "security", label: "Security" },
                { value: "billing",  label: "Billing" },
              ]}
            />
            <p className="text-sm text-muted-foreground">Active tab: <span className="text-primary font-medium">{active}</span></p>
          </div>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "items",        type: "TabItem[]",                                    required: true, description: "Array of tab definitions." },
        { prop: "value",        type: "string",                                                      description: "Controlled active tab value." },
        { prop: "defaultValue", type: "string",                                                      description: "Initial active tab (uncontrolled)." },
        { prop: "onChange",     type: "(value: string) => void",                                     description: "Fired when the active tab changes." },
        { prop: "variant",      type: '"line" | "pill" | "boxed" | "lifted"',        default: '"line"', description: "Visual style of the tab bar." },
        { prop: "size",         type: '"sm" | "md" | "lg"',                          default: '"md"',   description: "Tab button size." },
        { prop: "fullWidth",    type: "boolean",                                     default: "false",  description: "Stretch tabs to fill the container equally." },
        { prop: "className",    type: "string",                                                      description: "Additional CSS classes on the wrapper." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "TabItem.value",    type: "string",    required: true, description: "Unique tab identifier." },
        { prop: "TabItem.label",    type: "ReactNode", required: true, description: "Tab button label." },
        { prop: "TabItem.icon",     type: "ReactNode",                 description: "Leading icon shown before the label." },
        { prop: "TabItem.badge",    type: "ReactNode",                 description: "Trailing badge element." },
        { prop: "TabItem.disabled", type: "boolean",                  description: "Disable this tab." },
        { prop: "TabItem.content",  type: "ReactNode",                 description: "Content panel rendered below the tab bar when this tab is active." },
      ]} /></Section>

    </DocsLayout>
  )
}
