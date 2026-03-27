import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from "../components/ui/dropdown"
import { PropsTable } from "../components/ui/props-table"
import { Button } from "../components/ui/button"
import { Settings, User, LogOut, Bell, Shield, Trash2, ChevronDown } from "lucide-react"

export function DropdownDocs() {
  return (
    <DocsLayout toc={[
      { id: "icons",    label: "With Icons" },
      { id: "labels",   label: "Labels & Sections" },
      { id: "alignment",label: "Alignment" },
      { id: "placement",label: "Placement" },
      { id: "width",    label: "Width" },
      { id: "disabled", label: "Disabled States" },
      { id: "props",    label: "Props" },
      { id: "dataformat", label: "Item Format" },
    ]}>

      {/* Basic with icons */}
      <Section id="icons"><Playground
        title="Dropdown with Icons"
        description="Items support an icon prop for leading icons."
        code={`<Dropdown trigger={<Button variant="outline">Options <ChevronDown className="ml-1 h-4 w-4" /></Button>}>
  <DropdownItem icon={<User className="h-4 w-4" />}>Profile</DropdownItem>
  <DropdownItem icon={<Settings className="h-4 w-4" />}>Settings</DropdownItem>
  <DropdownSeparator />
  <DropdownItem icon={<LogOut className="h-4 w-4" />} variant="danger">Logout</DropdownItem>
</Dropdown>`}
      >
        <div className="flex items-center gap-4">
          <Dropdown trigger={<Button variant="outline">Options <ChevronDown className="ml-1 h-4 w-4" /></Button>}>
            <DropdownItem icon={<User className="h-4 w-4" />}>Profile</DropdownItem>
            <DropdownItem icon={<Settings className="h-4 w-4" />}>Settings</DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon={<LogOut className="h-4 w-4" />} variant="danger">Logout</DropdownItem>
          </Dropdown>
        </div>
      </Playground></Section>

      {/* Labels & Sections */}
      <Section id="labels"><Playground
        title="Labels & Sections"
        description="Use DropdownLabel and DropdownSeparator to group items."
        code={`<Dropdown trigger={<Button>Account</Button>}>
  <DropdownLabel>Account</DropdownLabel>
  <DropdownItem icon={<User className="h-4 w-4" />}>Profile</DropdownItem>
  <DropdownItem icon={<Bell className="h-4 w-4" />}>Notifications</DropdownItem>
  <DropdownSeparator />
  <DropdownLabel>Security</DropdownLabel>
  <DropdownItem icon={<Shield className="h-4 w-4" />}>Privacy</DropdownItem>
  <DropdownSeparator />
  <DropdownItem icon={<Trash2 className="h-4 w-4" />} variant="danger">Delete Account</DropdownItem>
</Dropdown>`}
      >
        <div className="flex items-center gap-4">
          <Dropdown trigger={<Button>Account</Button>}>
            <DropdownLabel>Account</DropdownLabel>
            <DropdownItem icon={<User className="h-4 w-4" />}>Profile</DropdownItem>
            <DropdownItem icon={<Bell className="h-4 w-4" />}>Notifications</DropdownItem>
            <DropdownSeparator />
            <DropdownLabel>Security</DropdownLabel>
            <DropdownItem icon={<Shield className="h-4 w-4" />}>Privacy</DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon={<Trash2 className="h-4 w-4" />} variant="danger">Delete Account</DropdownItem>
          </Dropdown>
        </div>
      </Playground></Section>

      {/* Alignment */}
      <Section id="alignment"><Playground
        title="Alignment"
        description="Control menu alignment with the align prop: left, center, or right."
        code={`<Dropdown align="left" trigger={<Button variant="outline">Left</Button>}>
  <DropdownItem>Item A</DropdownItem>
  <DropdownItem>Item B</DropdownItem>
</Dropdown>
<Dropdown align="center" trigger={<Button variant="outline">Center</Button>}>
  <DropdownItem>Item A</DropdownItem>
  <DropdownItem>Item B</DropdownItem>
</Dropdown>
<Dropdown align="right" trigger={<Button variant="outline">Right</Button>}>
  <DropdownItem>Item A</DropdownItem>
  <DropdownItem>Item B</DropdownItem>
</Dropdown>`}
      >
        <div className="flex items-center justify-center gap-4">
          <Dropdown align="left" trigger={<Button variant="outline">Left</Button>}>
            <DropdownItem>Item A</DropdownItem>
            <DropdownItem>Item B</DropdownItem>
          </Dropdown>
          <Dropdown align="center" trigger={<Button variant="outline">Center</Button>}>
            <DropdownItem>Item A</DropdownItem>
            <DropdownItem>Item B</DropdownItem>
          </Dropdown>
          <Dropdown align="right" trigger={<Button variant="outline">Right</Button>}>
            <DropdownItem>Item A</DropdownItem>
            <DropdownItem>Item B</DropdownItem>
          </Dropdown>
        </div>
      </Playground></Section>

      {/* Placement */}
      <Section id="placement"><Playground
        title="Placement"
        description="Use placement='top' to open the menu upward."
        code={`<Dropdown placement="bottom" trigger={<Button variant="outline">Bottom (default)</Button>}>
  <DropdownItem>Item A</DropdownItem>
  <DropdownItem>Item B</DropdownItem>
</Dropdown>
<Dropdown placement="top" trigger={<Button variant="outline">Top</Button>}>
  <DropdownItem>Item A</DropdownItem>
  <DropdownItem>Item B</DropdownItem>
</Dropdown>`}
      >
        <div className="flex items-center justify-center gap-4 pt-16">
          <Dropdown placement="bottom" trigger={<Button variant="outline">Bottom (default)</Button>}>
            <DropdownItem>Item A</DropdownItem>
            <DropdownItem>Item B</DropdownItem>
          </Dropdown>
          <Dropdown placement="top" trigger={<Button variant="outline">Top</Button>}>
            <DropdownItem>Item A</DropdownItem>
            <DropdownItem>Item B</DropdownItem>
          </Dropdown>
        </div>
      </Playground></Section>

      {/* Width */}
      <Section id="width"><Playground
        title="Width"
        description="Control menu width with sm, md, lg, or auto."
        code={`<Dropdown width="sm" trigger={<Button variant="outline">Small</Button>}>
  <DropdownItem>Item</DropdownItem>
</Dropdown>
<Dropdown width="lg" trigger={<Button variant="outline">Large</Button>}>
  <DropdownItem>Item</DropdownItem>
</Dropdown>`}
      >
        <div className="flex items-center gap-4">
          <Dropdown width="sm" trigger={<Button variant="outline">Small</Button>}>
            <DropdownItem>Item</DropdownItem>
          </Dropdown>
          <Dropdown width="md" trigger={<Button variant="outline">Medium</Button>}>
            <DropdownItem>Item</DropdownItem>
          </Dropdown>
          <Dropdown width="lg" trigger={<Button variant="outline">Large</Button>}>
            <DropdownItem>Item</DropdownItem>
          </Dropdown>
          <Dropdown width="auto" trigger={<Button variant="outline">Auto</Button>}>
            <DropdownItem>Short</DropdownItem>
            <DropdownItem>A much longer item label</DropdownItem>
          </Dropdown>
        </div>
      </Playground></Section>

      {/* Disabled states */}
      <Section id="disabled"><Playground
        title="Disabled States"
        description="Disable the entire dropdown or individual items."
        code={`<Dropdown disabled trigger={<Button variant="outline">Disabled Trigger</Button>}>
  <DropdownItem>Item</DropdownItem>
</Dropdown>
<Dropdown trigger={<Button variant="outline">With Disabled Item</Button>}>
  <DropdownItem icon={<User className="h-4 w-4" />}>Profile</DropdownItem>
  <DropdownItem icon={<Settings className="h-4 w-4" />} disabled>Settings (disabled)</DropdownItem>
  <DropdownItem icon={<Bell className="h-4 w-4" />}>Notifications</DropdownItem>
</Dropdown>`}
      >
        <div className="flex items-center gap-4">
          <Dropdown disabled trigger={<Button variant="outline">Disabled Trigger</Button>}>
            <DropdownItem>Item</DropdownItem>
          </Dropdown>
          <Dropdown trigger={<Button variant="outline">With Disabled Item</Button>}>
            <DropdownItem icon={<User className="h-4 w-4" />}>Profile</DropdownItem>
            <DropdownItem icon={<Settings className="h-4 w-4" />} disabled>Settings (disabled)</DropdownItem>
            <DropdownItem icon={<Bell className="h-4 w-4" />}>Notifications</DropdownItem>
          </Dropdown>
        </div>
      </Playground></Section>

      <Section id="props"><PropsTable rows={[
        { prop: "trigger",       type: "ReactNode",                                    required: true, description: "Element that opens the dropdown on click." },
        { prop: "children",      type: "ReactNode",                                    required: true, description: "Menu content — DropdownItem, DropdownLabel, DropdownSeparator." },
        { prop: "align",         type: '"left" | "right" | "center"',  default: '"left"',    description: "Horizontal alignment of the menu relative to the trigger." },
        { prop: "placement",     type: '"bottom" | "top"',             default: '"bottom"',  description: "Whether the menu opens above or below the trigger." },
        { prop: "width",         type: '"sm" | "md" | "lg" | "auto"',  default: '"md"',      description: "Width preset of the dropdown panel." },
        { prop: "disabled",      type: "boolean",                      default: "false",     description: "Prevent the dropdown from opening." },
        { prop: "closeOnSelect", type: "boolean",                      default: "true",      description: "Close the menu when an item is clicked." },
        { prop: "onOpenChange",  type: "(open: boolean) => void",                             description: "Callback fired when open state changes." },
        { prop: "className",     type: "string",                                              description: "Additional CSS classes on the menu panel." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "DropdownItem — children",  type: "ReactNode",  required: true, description: "Item label content." },
        { prop: "DropdownItem — icon",      type: "ReactNode",                  description: "Leading icon shown before the label." },
        { prop: "DropdownItem — variant",   type: '"default" | "danger"', default: '"default"', description: "Danger variant styles the item in red." },
        { prop: "DropdownItem — disabled",  type: "boolean",   default: "false", description: "Prevent interaction with this item." },
        { prop: "DropdownItem — onClick",   type: "() => void",                 description: "Click handler." },
        { prop: "DropdownLabel — children", type: "ReactNode",  required: true, description: "Section heading text." },
        { prop: "DropdownSeparator",        type: "—",                          description: "Renders a horizontal divider between items." },
      ]} /></Section>
    </DocsLayout>
  )
}
