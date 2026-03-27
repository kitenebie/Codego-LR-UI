import { useState } from "react"
import { ChevronDown, List } from "lucide-react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Select } from "../components/ui/select"
import { Button } from "../components/ui/button"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "suffixicon",  label: "Suffix Icon" },
  { id: "standard",   label: "Standard" },
  { id: "label",      label: "With Label" },
  { id: "searchable", label: "Searchable" },
  { id: "custommsg",  label: "Custom Messages" },
  { id: "multiple",   label: "Multiple" },
  { id: "reorderable",label: "Reorderable" },
  { id: "disabled",   label: "Disabled" },
  { id: "native",     label: "Native" },
  { id: "nativemulti",label: "Native Multiple" },
  { id: "nativelabel",label: "Native Label" },
  { id: "nativedisabled", label: "Native Disabled" },
  { id: "createform", label: "Create Option" },
  { id: "fullfeatured",label: "Full Featured" },
  { id: "validation", label: "Validation" },
  { id: "props",      label: "Props" },
  { id: "dataformat", label: "Data Format" },
  { id: "sampledata", label: "Sample Option Data" },
]

export function SelectDocs() {
  const [val1, setVal1] = useState("")
  const [val2, setVal2] = useState("")
  const [val3, setVal3] = useState("")
  const [val4, setVal4] = useState<string[]>([])
  const [val5, setVal5] = useState<string[]>([])
  const [val6, setVal6] = useState("")
  const [val7, setVal7] = useState("")
  const [val8, setVal8] = useState("")
  const [val9, setVal9] = useState("")
  const [val10, setVal10] = useState("")
  const [val11, setVal11] = useState("")

  const options = [
    { eth: "Ethereum (ETH)" },
    { btc: "Bitcoin (BTC)" },
    { sol: "Solana (SOL)" },
    { matic: "Polygon (MATIC)" },
    { avax: "Avalanche (AVAX)" },
  ]

  const statusOptions = [
    { draft: "Draft" },
    { reviewing: "Reviewing" },
    { published: "Published" },
  ]

  const authorOptions = [
    { john: "John Doe" },
    { jane: "Jane Smith" },
    { bob: "Bob Johnson" },
    { alice: "Alice Williams" },
    { charlie: "Charlie Brown" },
  ]

  return (
    <DocsLayout toc={TOC}>
      <Section id="suffixicon"><Playground
        title="suffixIcon"
        description="Replaces the default ChevronDown with a custom icon button that opens the dropdown. Accepts suffixIconColor with semantic tokens or any CSS color."
        code={`import { ChevronDown, List } from "lucide-react"

{/* Custom chevron icon */}
<Select
  options={options}
  value={value}
  onChange={setValue}
  label="Token"
  placeholder="Select a token"
  suffixIcon={<ChevronDown size={16} />}
/>

{/* List icon with semantic color */}
<Select
  options={options}
  value={value}
  onChange={setValue}
  label="Token (success color)"
  placeholder="Select a token"
  suffixIcon={<List size={16} />}
  suffixIconColor="success"
/>

{/* Hex color */}
<Select
  options={options}
  value={value}
  onChange={setValue}
  label="Token (hex color)"
  placeholder="Select a token"
  suffixIcon={<List size={16} />}
  suffixIconColor="#f59e0b"
/>`}
      >
        <div className="w-full max-w-xs space-y-3">
          <Select
            options={options}
            value={val1}
            onChange={(v) => setVal1(v as string)}
            label="Custom chevron"
            placeholder="Select a token"
            suffixIcon={<ChevronDown size={16} />}
          />
          <Select
            options={options}
            value={val2}
            onChange={(v) => setVal2(v as string)}
            label="List icon — success"
            placeholder="Select a token"
            suffixIcon={<List size={16} />}
            suffixIconColor="success"
          />
          <Select
            options={options}
            value={val3}
            onChange={(v) => setVal3(v as string)}
            label="List icon — hex color"
            placeholder="Select a token"
            suffixIcon={<List size={16} />}
            suffixIconColor="#f59e0b"
          />
        </div>
      </Playground></Section>

      <Section id="standard"><Playground
        title="Standard Select"
        description="A simple dropdown select."
        code={`<Select
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Select a token"
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={options}
            value={val1}
            onChange={(v) => setVal1(v as string)}
            placeholder="Select a token"
          />
        </div>
      </Playground></Section>

      <Section id="label"><Playground
        title="With Label"
        description="Add a label above the select component."
        code={`<Select
  options={statusOptions}
  value={value}
  onChange={setValue}
  label="Status"
  placeholder="Select status"
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={statusOptions}
            value={val2}
            onChange={(v) => setVal2(v as string)}
            label="Status"
            placeholder="Select status"
          />
        </div>
      </Playground></Section>

      <Section id="searchable"><Playground
        title="Searchable Select"
        description="A select dropdown with a search input."
        code={`<Select
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Search and select..."
  searchable
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={options}
            value={val3}
            onChange={(v) => setVal3(v as string)}
            placeholder="Search and select..."
            searchable
          />
        </div>
      </Playground></Section>

      <Section id="custommsg"><Playground
        title="Searchable with Custom Messages"
        description="Customize loading, searching, and no results messages for searchable selects."
        code={`<Select
  options={authorOptions}
  value={value}
  onChange={setValue}
  placeholder="Search authors..."
  searchable
  loadingMessage="Loading authors..."
  searchingMessage="Searching authors..."
  noSearchResultsMessage="No authors found."
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={authorOptions}
            value={val6}
            onChange={(v) => setVal6(v as string)}
            placeholder="Search authors..."
            searchable
            loadingMessage="Loading authors..."
            searchingMessage="Searching authors..."
            noSearchResultsMessage="No authors found."
          />
        </div>
      </Playground></Section>

      <Section id="multiple"><Playground
        title="Multiple Selection"
        description="Allow selecting multiple values from the list."
        code={`<Select
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Select tokens..."
  multiple
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={options}
            value={val4}
            onChange={(v) => setVal4(v as string[])}
            placeholder="Select tokens..."
            multiple
          />
        </div>
      </Playground></Section>

      <Section id="reorderable"><Playground
        title="Multiple with Reorderable"
        description="Enable drag-and-drop reordering for multiple selections."
        code={`<Select
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Select and reorder tokens..."
  multiple
  reorderable
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={options}
            value={val5}
            onChange={(v) => setVal5(v as string[])}
            placeholder="Select and reorder tokens..."
            multiple
            reorderable
          />
        </div>
      </Playground></Section>

      <Section id="disabled"><Playground
        title="Disabled Select"
        description="Disable the select component to prevent interaction."
        code={`<Select
  options={options}
  value="eth"
  onChange={setValue}
  placeholder="Select a token"
  disabled
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={options}
            value="eth"
            onChange={() => {}}
            placeholder="Select a token"
            disabled
          />
        </div>
      </Playground></Section>

      <Section id="native"><Playground
        title="Native Select"
        description="Use the native HTML select element instead of custom implementation."
        code={`<Select
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Select a token"
  native
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={options}
            value={val7}
            onChange={(v) => setVal7(v as string)}
            placeholder="Select a token"
            native
          />
        </div>
      </Playground></Section>

      <Section id="nativemulti"><Playground
        title="Native Multiple Select"
        description="Native HTML select with multiple selection support."
        code={`<Select
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Select tokens..."
  native
  multiple
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={options}
            value={val8}
            onChange={(v) => setVal8(v as string[])}
            placeholder="Select tokens..."
            native
            multiple
          />
        </div>
      </Playground></Section>

      <Section id="nativelabel"><Playground
        title="Native with Label"
        description="Native select with a label."
        code={`<Select
  options={statusOptions}
  value={value}
  onChange={setValue}
  label="Status"
  placeholder="Select status"
  native
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={statusOptions}
            value={val9}
            onChange={(v) => setVal9(v as string)}
            label="Status"
            placeholder="Select status"
            native
          />
        </div>
      </Playground></Section>

      <Section id="nativedisabled"><Playground
        title="Native Disabled"
        description="Native select in disabled state."
        code={`<Select
  options={options}
  value="eth"
  onChange={setValue}
  placeholder="Select a token"
  native
  disabled
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={options}
            value="eth"
            onChange={() => {}}
            placeholder="Select a token"
            native
            disabled
          />
        </div>
      </Playground></Section>

      <Section id="createform"><Playground
        title="With Create Option Form"
        description="Add a custom form at the bottom of the dropdown for creating new options."
        code={`<Select
  options={authorOptions}
  value={value}
  onChange={setValue}
  placeholder="Select author..."
  searchable
  createOptionForm={
    <Button variant="ghost" className="w-full justify-start">
      <Plus className="mr-2 h-4 w-4" />
      Create new author
    </Button>
  }
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={authorOptions}
            value={val10}
            onChange={(v) => setVal10(v as string)}
            placeholder="Select author..."
            searchable
            createOptionForm={
              <Button variant="ghost" className="w-full justify-start">
                + Create new author
              </Button>
            }
          />
        </div>
      </Playground></Section>

      <Section id="fullfeatured"><Playground
        title="Fully Featured Select"
        description="Combining multiple features: label, searchable, custom messages, and create option form."
        code={`<Select
  options={authorOptions}
  value={value}
  onChange={setValue}
  label="Author"
  placeholder="Select author..."
  searchable
  loadingMessage="Loading authors..."
  searchingMessage="Searching authors..."
  noSearchResultsMessage="No authors found."
  createOptionForm={
    <Button variant="primary"  onClick={() => alert("Create new author clicked!")} className="w-full justify-start">
      <Plus className="mr-2 h-4 w-4" />
      Create new author
    </Button>
  }
/>`}
      >
        <div className="w-full max-w-xs">
          <Select
            options={authorOptions}
            value={val11}
            onChange={(v) => setVal11(v as string)}
            label="Author"
            placeholder="Select author..."
            searchable
            loadingMessage="Loading authors..."
            searchingMessage="Searching authors..."
            noSearchResultsMessage="No authors found."
            createOptionForm={
              <Button variant="primary" onClick={() => alert("Create new author clicked!")} className="w-full justify-start">
                + Create new author
              </Button>
            }
          />
        </div>
      </Playground></Section>

      <Section id="validation"><Playground
        title="Validation"
        description="Use required to mark a field as required (shows * next to label). Use error to display an external validation message."
        code={`<Select options={options} value={value} onChange={setValue} label="Token" required placeholder="Select a token" />
<Select options={options} value={value} onChange={setValue} label="Token" required error="Please select a token" placeholder="Select a token" />`}
      >
        <div className="w-full max-w-xs space-y-3">
          <Select options={options} value={val11} onChange={(v) => setVal11(v as string)} label="Token (required)" required placeholder="Select a token" />
          <Select options={options} value="" onChange={() => {}} label="Token (with error)" required error="Please select a token" placeholder="Select a token" />
        </div>
      </Playground></Section>

      <Section id="props"><PropsTable rows={[
        { prop: "options",                type: "SelectOption[]",                required: true, description:  `Array of option objects. Each is a single-key record: { key: label }. \n\n e.g., const user = [{ id: \"1\", name: \"John Doe\" } ];` },
        { prop: "value",                  type: "string | string[]",                             description: "Controlled selected value(s)." },
        { prop: "onChange",               type: "(value: string | string[]) => void",             description: "Fired when selection changes." },
        { prop: "placeholder",            type: "string",            default: '"Select an option"', description: "Placeholder text when nothing is selected." },
        { prop: "label",                  type: "string",                                        description: "Label rendered above the select." },
        { prop: "searchable",             type: "boolean",           default: "false",            description: "Show a search input inside the dropdown." },
        { prop: "multiple",               type: "boolean",           default: "false",            description: "Allow selecting multiple values." },
        { prop: "reorderable",            type: "boolean",           default: "false",            description: "Enable drag-and-drop reordering of selected tags." },
        { prop: "native",                 type: "boolean",           default: "false",            description: "Use the native HTML select element." },
        { prop: "disabled",               type: "boolean",           default: "false",            description: "Disable the select." },
        { prop: "loadingMessage",         type: "string",            default: '"Loading..."',     description: "Message shown while searching." },
        { prop: "searchingMessage",       type: "string",            default: '"Searching..."',   description: "Placeholder inside the search input." },
        { prop: "noSearchResultsMessage", type: "string",            default: '"No results found."', description: "Message shown when search returns no results." },
        { prop: "createOptionForm",       type: "ReactNode",                                     description: "Custom form rendered at the bottom of the dropdown." },
        { prop: "suffixIcon",             type: "ReactNode",                                     description: "Replace the default ChevronDown with a custom icon." },
        { prop: "suffixIconColor",        type: '"success" | "error" | "warning" | "info" | string', description: "Color for the suffix icon." },
        { prop: "required",               type: "boolean",                                          description: "Marks the field as required. Shows a * indicator next to the label." },
        { prop: "error",                  type: "string",                                           description: "External error message displayed below the select." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "SelectOption", type: "Record<string, string>", required: true, description: "Single-key object where the key is the option value and the value is the display label. Example: { eth: \"Ethereum (ETH)\" }." },
      ]} /></Section>

      <Section id="sampledata">
        <div className="rounded-xl glass overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-gradient">Sample Option Data</h2>
            <p className="text-muted-foreground text-sm mt-1">Each option is a single-key object — the key is the value, the string is the label.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left">
                  <th className="px-6 py-3 font-medium text-muted-foreground">Object (option)</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">Key (value)</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">String (label)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["{ \"eth\": \"Ethereum (ETH)\" }",   "eth",   "Ethereum (ETH)"],
                  ["{ \"btc\": \"Bitcoin (BTC)\" }",     "btc",   "Bitcoin (BTC)"],
                  ["{ \"sol\": \"Solana (SOL)\" }",      "sol",   "Solana (SOL)"],
                  ["{ \"draft\": \"Draft\" }",           "draft", "Draft"],
                  ["{ \"published\": \"Published\" }",   "published", "Published"],
                ].map(([obj, key, label], i) => (
                  <tr key={i} className={i % 2 === 0 ? "border-b border-white/5" : "border-b border-white/5 bg-white/[0.02]"}>
                    <td className="px-6 py-3 font-mono text-primary">{obj}</td>
                    <td className="px-6 py-3 font-mono text-amber-400">{key}</td>
                    <td className="px-6 py-3 text-muted-foreground">{label}</td>
                  </tr>
                ))}
                <tr className="border-b border-white/10 bg-white/5 text-left">
                  <th className="px-6 py-3 font-bold text-muted-foreground">Object (option)</th>
                  <th className="px-6 py-3 font-bold text-muted-foreground">Key (value)</th>
                  <th className="px-6 py-3 font-bold text-muted-foreground">String (label)</th>
                </tr>
                {[  
                  ["{ 1: \"One\" }",   "1",   "One"],
                  ["{ 2: \"Two\" }",     "2",   "Two"],
                  ["{ 3: \"Three\" }",      "3",   "Three"],
                  ["{ 4: \"Four\" }",           "4", "Four"],
                  ["{ 5: \"Five\" }",   "5", "Five"],
                ].map(([obj, key, label], i) => (
                  <tr key={i} className={i % 2 === 0 ? "border-b border-white/5" : "border-b border-white/5 bg-white/[0.02]"}>
                    <td className="px-6 py-3 font-mono text-primary">{obj}</td>
                    <td className="px-6 py-3 font-mono text-amber-400">{key}</td>
                    <td className="px-6 py-3 text-muted-foreground">{label}</td>
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
