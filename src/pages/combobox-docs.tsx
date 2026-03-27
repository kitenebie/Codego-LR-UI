import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Combobox } from "../components/ui/combobox"
import { PropsTable } from "../components/ui/props-table"
import { Globe, Code, Palette } from "lucide-react"

const TOC = [
  { id: "basic",      label: "Basic" },
  { id: "multi",      label: "Multi-select" },
  { id: "create",     label: "Creatable" },
  { id: "grouped",    label: "Grouped" },
  { id: "icons",      label: "With Icons" },
  { id: "validation", label: "Validation" },
  { id: "props",      label: "Props" },
  { id: "dataformat", label: "Data Format" },
  { id: "sampledata", label: "Sample Option Data" },
]

const FRAMEWORKS = [
  { value: "react",   label: "React",   description: "Meta" },
  { value: "vue",     label: "Vue",     description: "Evan You" },
  { value: "angular", label: "Angular", description: "Google" },
  { value: "svelte",  label: "Svelte",  description: "Rich Harris" },
  { value: "solid",   label: "SolidJS", description: "Ryan Carniato" },
]

const GROUPED = [
  { value: "react",      label: "React",      group: "Frontend" },
  { value: "vue",        label: "Vue",        group: "Frontend" },
  { value: "node",       label: "Node.js",    group: "Backend" },
  { value: "django",     label: "Django",     group: "Backend" },
  { value: "postgres",   label: "PostgreSQL", group: "Database" },
  { value: "mongo",      label: "MongoDB",    group: "Database" },
]

const ICON_OPTIONS = [
  { value: "web",    label: "Web",    icon: <Globe className="h-4 w-4" /> },
  { value: "code",   label: "Code",   icon: <Code className="h-4 w-4" /> },
  { value: "design", label: "Design", icon: <Palette className="h-4 w-4" /> },
]

export function ComboboxDocs() {
  const [v1, setV1] = useState("")
  const [v2, setV2] = useState<string[]>([])
  const [v3, setV3] = useState("")
  const [v4, setV4] = useState("")
  const [v5, setV5] = useState("")

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Combobox" description="Searchable select dropdown."
          code={`<Combobox options={options} value={value} onChange={setValue} />`}>
          <div className="w-full max-w-xs">
            <Combobox options={FRAMEWORKS} value={v1} onChange={(v) => setV1(v as string)} placeholder="Select framework..." />
          </div>
        </Playground>
      </Section>
      <Section id="multi">
        <Playground title="Multi-select Combobox" description="Select multiple options."
          code={`<Combobox multiple options={options} value={value} onChange={setValue} />`}>
          <div className="w-full max-w-xs">
            <Combobox multiple options={FRAMEWORKS} value={v2} onChange={(v) => setV2(v as string[])} placeholder="Select frameworks..." />
          </div>
        </Playground>
      </Section>
      <Section id="create">
        <Playground title="Creatable Combobox" description="Type a new value and press Enter to create it."
          code={`<Combobox creatable options={options} value={value} onChange={setValue} />`}>
          <div className="w-full max-w-xs">
            <Combobox creatable options={FRAMEWORKS} value={v3} onChange={(v) => setV3(v as string)} placeholder="Select or create..." />
          </div>
        </Playground>
      </Section>
      <Section id="grouped">
        <Playground title="Grouped Options" description="Options organized by group."
          code={`{ value: "react", label: "React", group: "Frontend" }`}>
          <div className="w-full max-w-xs">
            <Combobox options={GROUPED} value={v4} onChange={(v) => setV4(v as string)} placeholder="Select technology..." />
          </div>
        </Playground>
      </Section>
      <Section id="icons">
        <Playground title="Options with Icons" description="Add icons to each option."
          code={`{ value: "web", label: "Web", icon: <Globe className="h-4 w-4" /> }`}>
          <div className="w-full max-w-xs">
            <Combobox options={ICON_OPTIONS} value={v5} onChange={(v) => setV5(v as string)} placeholder="Select category..." />
          </div>
        </Playground>
      </Section>
      <Section id="validation">
        <Playground title="Validation" description="Use required and error to add validation state."
          code={`<Combobox options={options} value={value} onChange={setValue} required placeholder="Required field" />
<Combobox options={options} value="" onChange={setValue} required error="Please select a framework" placeholder="Select framework..." />`}>
          <div className="w-full max-w-xs space-y-3">
            <Combobox options={FRAMEWORKS} value={v1} onChange={(v) => setV1(v as string)} required placeholder="Required field" />
            <Combobox options={FRAMEWORKS} value="" onChange={() => {}} required error="Please select a framework" placeholder="Select framework..." />
          </div>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "options",     type: "ComboboxOption[]",              required: true, description: "Array of options to display." },
        { prop: "value",       type: "string | string[]",                             description: "Controlled selected value(s)." },
        { prop: "onChange",    type: "(value: string | string[]) => void",             description: "Fired when selection changes." },
        { prop: "placeholder", type: "string",                        default: '"Select..."', description: "Placeholder text when nothing is selected." },
        { prop: "multiple",    type: "boolean",                       default: "false",       description: "Allow selecting multiple options." },
        { prop: "creatable",   type: "boolean",                       default: "false",       description: "Allow creating new options by typing and pressing Enter." },
        { prop: "disabled",    type: "boolean",                       default: "false",       description: "Disable the combobox." },
        { prop: "className",   type: "string",                                                description: "Additional CSS classes." },
        { prop: "required",    type: "boolean",                                               description: "Marks the field as required." },
        { prop: "error",       type: "string",                                                description: "External error message displayed below the combobox." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "value",       type: "string",    required: true, description: "Unique option identifier." },
        { prop: "label",       type: "string",    required: true, description: "Display text for the option." },
        { prop: "description", type: "string",                    description: "Secondary text shown below the label." },
        { prop: "icon",        type: "ReactNode",                  description: "Icon shown before the label." },
        { prop: "group",       type: "string",                    description: "Group label — options with the same group are listed together." },
        { prop: "disabled",    type: "boolean",                   description: "Prevent this option from being selected." },
      ]} /></Section>

      <Section id="sampledata">
        <div className="rounded-xl glass overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-gradient">Sample Option Data</h2>
            <p className="text-muted-foreground text-sm mt-1">Each option is a plain object with value, label, and optional fields.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left">
                  <th className="px-6 py-3 font-medium text-muted-foreground">value</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">label</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">description</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">group</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">disabled</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["react",    "React",     "Meta",         "",          ""],
                  ["vue",      "Vue",       "Evan You",     "",          ""],
                  ["angular",  "Angular",   "Google",       "",          ""],
                  ["node",     "Node.js",   "",             "Backend",   ""],
                  ["postgres", "PostgreSQL","",             "Database",  ""],
                  ["legacy",   "Legacy API","",             "",          "true"],
                ].map(([value, label, desc, group, disabled], i) => (
                  <tr key={i} className={i % 2 === 0 ? "border-b border-white/5" : "border-b border-white/5 bg-white/[0.02]"}>
                    <td className="px-6 py-3 font-mono text-primary">{value}</td>
                    <td className="px-6 py-3 font-mono text-amber-400">{label}</td>
                    <td className="px-6 py-3 text-muted-foreground">{desc || <span className="opacity-30">—</span>}</td>
                    <td className="px-6 py-3 text-muted-foreground">{group || <span className="opacity-30">—</span>}</td>
                    <td className="px-6 py-3 text-muted-foreground">{disabled || <span className="opacity-30">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </DocsLayout>
  )
}
