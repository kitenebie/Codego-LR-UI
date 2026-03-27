import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { CommandPalette } from "../components/ui/command-palette"
import { PropsTable } from "../components/ui/props-table"
import { Button } from "../components/ui/button"
import { LayoutDashboard, Settings, Users, FileText, Search, Zap, Moon, Sun, Bell } from "lucide-react"
import { useToast } from "../components/ui/notification"

const TOC = [
  { id: "basic",      label: "Basic" },
  { id: "grouped",    label: "Grouped" },
  { id: "props",      label: "Props" },
  { id: "dataformat", label: "Item Format" },
]

export function CommandPaletteDocs() {
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const { toast } = useToast()

  const BASIC_ITEMS = [
    { id: "dashboard", label: "Dashboard",    icon: <LayoutDashboard className="h-4 w-4" />, shortcut: "G+D", onSelect: () => toast({ title: "Navigate to Dashboard", variant: "default", duration: 2000 }) },
    { id: "settings",  label: "Settings",     icon: <Settings className="h-4 w-4" />,        shortcut: "G+S", onSelect: () => toast({ title: "Navigate to Settings", variant: "default", duration: 2000 }) },
    { id: "users",     label: "Users",        icon: <Users className="h-4 w-4" />,            shortcut: "G+U", onSelect: () => toast({ title: "Navigate to Users", variant: "default", duration: 2000 }) },
    { id: "docs",      label: "Documentation",icon: <FileText className="h-4 w-4" />,         onSelect: () => toast({ title: "Open Docs", variant: "info", duration: 2000 }) },
    { id: "search",    label: "Search",       icon: <Search className="h-4 w-4" />,           shortcut: "Ctrl+F", onSelect: () => {} },
  ]

  const GROUPED_ITEMS = [
    { id: "dashboard", label: "Dashboard",    icon: <LayoutDashboard className="h-4 w-4" />, group: "Navigation", onSelect: () => {} },
    { id: "settings",  label: "Settings",     icon: <Settings className="h-4 w-4" />,        group: "Navigation", onSelect: () => {} },
    { id: "users",     label: "Users",        icon: <Users className="h-4 w-4" />,            group: "Navigation", onSelect: () => {} },
    { id: "dark",      label: "Dark Mode",    icon: <Moon className="h-4 w-4" />,             group: "Appearance", onSelect: () => toast({ title: "Dark mode enabled", variant: "default", duration: 2000 }) },
    { id: "light",     label: "Light Mode",   icon: <Sun className="h-4 w-4" />,              group: "Appearance", onSelect: () => toast({ title: "Light mode enabled", variant: "default", duration: 2000 }) },
    { id: "notif",     label: "Notifications",icon: <Bell className="h-4 w-4" />,             group: "Actions",    onSelect: () => {} },
    { id: "quick",     label: "Quick action", icon: <Zap className="h-4 w-4" />,              group: "Actions",    shortcut: "Ctrl+K", onSelect: () => {} },
  ]

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Command Palette" description="Press Cmd+K / Ctrl+K to open globally, or click the button. Supports keyboard navigation and recent items."
          code={`<CommandPalette items={items} open={open} onOpenChange={setOpen} />`}>
          <div className="space-y-3">
            <Button onClick={() => setOpen1(true)} leftIcon={<Search className="h-4 w-4" />}>
              Open Command Palette
            </Button>
            <p className="text-xs text-muted-foreground">Or press <kbd className="px-1.5 py-0.5 text-xs font-mono rounded border border-border bg-muted">Ctrl+K</kbd></p>
            <CommandPalette items={BASIC_ITEMS} open={open1} onOpenChange={setOpen1} />
          </div>
        </Playground>
      </Section>
      <Section id="grouped">
        <Playground title="Grouped Commands" description="Organize commands by group for better discoverability."
          code={`{ id: "dashboard", label: "Dashboard", group: "Navigation", onSelect: () => {} }`}>
          <div className="space-y-3">
            <Button onClick={() => setOpen2(true)} leftIcon={<Zap className="h-4 w-4" />}>
              Open Grouped Palette
            </Button>
            <CommandPalette items={GROUPED_ITEMS} open={open2} onOpenChange={setOpen2} placeholder="Search commands and actions..." />
          </div>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "items",        type: "CommandItem[]",           required: true, description: "Array of command items to display and search." },
        { prop: "open",         type: "boolean",                                 description: "Controlled open state." },
        { prop: "onOpenChange", type: "(open: boolean) => void",                 description: "Callback fired when open state changes." },
        { prop: "placeholder",  type: "string",                  default: '"Search commands..."', description: "Placeholder text in the search input." },
        { prop: "maxRecent",    type: "number",                   default: "5",   description: "Max number of recently selected items to remember." },
        { prop: "className",    type: "string",                                  description: "Additional CSS classes on the palette panel." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "id",          type: "string",       required: true, description: "Unique identifier for the command item." },
        { prop: "label",       type: "string",       required: true, description: "Display name shown in the list." },
        { prop: "onSelect",    type: "() => void",   required: true, description: "Called when the item is selected." },
        { prop: "description", type: "string",                       description: "Secondary text shown next to the label." },
        { prop: "icon",        type: "ReactNode",                    description: "Icon shown before the label." },
        { prop: "shortcut",    type: "string",                       description: "Keyboard shortcut hint (e.g. \"G+D\", \"Ctrl+K\")." },
        { prop: "group",       type: "string",                       description: "Group label — items with the same group are listed together." },
        { prop: "keywords",    type: "string[]",                     description: "Extra search terms that match this item." },
      ]} /></Section>
    </DocsLayout>
  )
}
