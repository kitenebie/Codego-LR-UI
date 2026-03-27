import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Accordion } from "../components/ui/accordion"
import { PropsTable } from "../components/ui/props-table"
import { HelpCircle, Settings, Shield } from "lucide-react"

const TOC = [
  { id: "default",   label: "Default" },
  { id: "multiple",  label: "Multiple" },
  { id: "variants",  label: "Variants" },
  { id: "icons",     label: "With Icons" },
  { id: "disabled",  label: "Disabled Item" },
  { id: "props",     label: "Props" },
  { id: "dataformat",label: "Data Format" },
]

const FAQ = [
  { value: "q1", trigger: "What is Codego UI?", content: "Codego UI is a component library built with React and Tailwind CSS, designed for modern web applications." },
  { value: "q2", trigger: "Is it free to use?", content: "Yes, Codego UI is open source and free to use in personal and commercial projects." },
  { value: "q3", trigger: "Does it support dark mode?", content: "Yes, all components support both light and dark mode out of the box via CSS variables." },
  { value: "q4", trigger: "Can I customize the theme?", content: "Absolutely. All colors and design tokens are CSS variables you can override in your stylesheet." },
]

export function AccordionDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="default">
        <Playground title="Accordion (Single)" description="Only one item open at a time."
          code={`<Accordion type="single" items={items} />`}>
          <div className="max-w-lg">
            <Accordion type="single" defaultValue="q1" items={FAQ} />
          </div>
        </Playground>
      </Section>
      <Section id="multiple">
        <Playground title="Accordion (Multiple)" description="Multiple items can be open simultaneously."
          code={`<Accordion type="multiple" items={items} />`}>
          <div className="max-w-lg">
            <Accordion type="multiple" defaultValue={["q1", "q3"]} items={FAQ} />
          </div>
        </Playground>
      </Section>
      <Section id="variants">
        <Playground title="Accordion Variants" description="Four visual styles: default, bordered, separated, ghost."
          code={`<Accordion variant="separated" items={items} />`}>
          <div className="space-y-6 max-w-lg">
            {(["default", "bordered", "separated", "ghost"] as const).map((v) => (
              <div key={v}>
                <p className="text-xs text-muted-foreground mb-2 font-medium">{v}</p>
                <Accordion variant={v} type="single" items={FAQ.slice(0, 2)} />
              </div>
            ))}
          </div>
        </Playground>
      </Section>
      <Section id="icons">
        <Playground title="Accordion with Icons" description="Add icons to each item trigger."
          code={`{ value: "help", trigger: "Help", icon: <HelpCircle className="h-4 w-4" />, content: "..." }`}>
          <div className="max-w-lg">
            <Accordion type="single" variant="separated" items={[
              { value: "help", trigger: "Help & Support", icon: <HelpCircle className="h-4 w-4" />, content: "Visit our documentation or contact support at help@example.com." },
              { value: "settings", trigger: "Account Settings", icon: <Settings className="h-4 w-4" />, content: "Manage your profile, notifications, and preferences in the settings panel." },
              { value: "security", trigger: "Security", icon: <Shield className="h-4 w-4" />, content: "Enable two-factor authentication and review active sessions." },
            ]} />
          </div>
        </Playground>
      </Section>
      <Section id="disabled">
        <Playground title="Disabled Item" description="Set disabled on individual items."
          code={`{ value: "q2", trigger: "Disabled", disabled: true, content: "..." }`}>
          <div className="max-w-lg">
            <Accordion type="single" items={[
              { value: "q1", trigger: "Active item", content: "This item is active and can be opened." },
              { value: "q2", trigger: "Disabled item", content: "This cannot be opened.", disabled: true },
              { value: "q3", trigger: "Another active item", content: "This item is also active." },
            ]} />
          </div>
        </Playground>
      </Section>
      <Section id="props"><PropsTable rows={[
        { prop: "items",        type: "AccordionItem[]",              required: true,  description: "Array of accordion items to render." },
        { prop: "type",         type: '"single" | "multiple"',        default: '"single"',   description: "Whether one or multiple items can be open at a time." },
        { prop: "defaultValue", type: "string | string[]",                              description: "Initially open item(s). Uncontrolled." },
        { prop: "value",        type: "string | string[]",                              description: "Controlled open item(s)." },
        { prop: "onChange",     type: "(value: string | string[]) => void",             description: "Callback fired when open state changes." },
        { prop: "variant",      type: '"default" | "bordered" | "separated" | "ghost"', default: '"default"', description: "Visual style of the accordion." },
        { prop: "className",    type: "string",                                         description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "value",    type: "string",       required: true,  description: "Unique identifier for the item." },
        { prop: "trigger",  type: "ReactNode",    required: true,  description: "Content shown in the clickable header." },
        { prop: "content",  type: "ReactNode",    required: true,  description: "Content revealed when the item is open." },
        { prop: "icon",     type: "ReactNode",                     description: "Optional icon shown before the trigger text." },
        { prop: "disabled", type: "boolean",      default: "false", description: "Prevents the item from being opened." },
      ]} /></Section>
    </DocsLayout>
  )
}
