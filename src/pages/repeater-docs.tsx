import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Repeater } from "../components/ui/repeater"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select } from "../components/ui/select"
import { Textarea } from "../components/ui/textarea"
import { Checkbox } from "../components/ui/checkbox"
import { ToggleSwitch } from "../components/ui/toggle-switch"
import { FileUpload } from "../components/ui/file-upload"
import { PropsTable } from "../components/ui/props-table"

interface RepeaterItem {
  name: string
  email: string
  role: string
  tags: string[]
  dob: string
  notes: string
  active: boolean
  agreed: boolean
  file: File | null
}

const defaultItem = (): RepeaterItem => ({
  name: "",
  email: "",
  role: "",
  tags: [],
  dob: "",
  notes: "",
  active: false,
  agreed: false,
  file: null,
})

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
]

const TAG_OPTIONS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Design" },
  { value: "devops", label: "DevOps" },
]

export function RepeaterDocs() {
  const [items, setItems] = useState<RepeaterItem[]>([defaultItem()])

  const update = (index: number, patch: Partial<RepeaterItem>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <DocsLayout toc={[
      { id: "allcomponents", label: "All Components" },
      { id: "props",         label: "Props" },
    ]}>
      <Section id="allcomponents"><Playground
        title="Repeater — All Components"
        description="A dynamic repeater showcasing every available form component."
        code={`const [items, setItems] = useState([{ name: "", email: "" }])

const handleAdd = () => {
  setItems([...items, { name: "", email: "" }])
}

const handleRemove = (index) => {
  setItems(items.filter((_, i) => i !== index))
}

<Repeater
  items={items}
  onAdd={handleAdd}
  onRemove={handleRemove}
  addButtonText="Add Member"
  renderItem={(item, index) => (
    <div>
      <Input placeholder="Full Name" />
      <Input placeholder="Email" />
      <Select options={roleOptions} placeholder="Role" />
      <Textarea placeholder="Notes" />
      <ToggleSwitch label="Active" />
      <Checkbox label="Agreed to terms" />
    </div>
  )}
/>`}
      >
        <div className="w-full max-w-2xl">
          <Repeater
            items={items}
            onAdd={() => setItems((prev) => [...prev, defaultItem()])}
            onRemove={(i) => setItems((prev) => prev.filter((_, idx) => idx !== i))}
            addButtonText="Add Member"
            renderItem={(item: RepeaterItem, index) => (
              <div className="space-y-4">
                {/* Row 1 — Name + Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Full Name</Label>
                    <Input
                      placeholder="e.g. Jane Doe"
                      value={item.name}
                      onChange={(e) => update(index, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input
                      inputType="email"
                      placeholder="jane@example.com"
                      value={item.email}
                      onChange={(e) => update(index, { email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 2 — Role (Select) + Date of Birth */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Role</Label>
                    <Select
                      options={ROLE_OPTIONS}
                      value={item.role}
                      placeholder="Select role"
                      onChange={(v) => update(index, { role: v as string })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Date of Birth</Label>
                    <Input
                      inputType="date"
                      value={item.dob}
                      onChange={(e) => update(index, { dob: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 3 — Tags (multi-select) */}
                <div className="space-y-1">
                  <Label>Tags</Label>
                  <Select
                    options={TAG_OPTIONS}
                    value={item.tags}
                    multiple
                    placeholder="Select tags"
                    onChange={(v) => update(index, { tags: v as string[] })}
                  />
                </div>

                {/* Row 4 — Notes (Textarea) */}
                <div className="space-y-1">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Any additional notes..."
                    rows={2}
                    maxLength={200}
                    value={item.notes}
                    onChange={(e) => update(index, { notes: e.target.value })}
                  />
                </div>

                {/* Row 5 — File Upload */}
                <div className="space-y-1">
                  <Label>Attachment</Label>
                  <FileUpload
                    label=""
                    helperText="Upload a document or image"
                    onFileSelect={(f) => update(index, { file: f })}
                  />
                </div>

                {/* Row 6 — Toggle + Checkbox */}
                <div className="flex items-center gap-6">
                  <ToggleSwitch
                    inline
                    label="Active"
                    checked={item.active}
                    onChange={(e) => update(index, { active: e.target.checked })}
                  />
                  <Checkbox
                    inline
                    label="Agreed to terms"
                    checked={item.agreed}
                    onChange={(e) => update(index, { agreed: e.target.checked })}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </Playground></Section>

      <Section id="props"><PropsTable rows={[
        { prop: "items",          type: "T[]",                              required: true, description: "Array of item data objects." },
        { prop: "onAdd",          type: "() => void",                       required: true, description: "Called when the Add button is clicked." },
        { prop: "onRemove",       type: "(index: number) => void",          required: true, description: "Called when the remove button on an item is clicked." },
        { prop: "renderItem",     type: "(item: T, index: number) => ReactNode", required: true, description: "Render function for each item's content." },
        { prop: "addButtonText",  type: "string",                          default: '"Add Item"', description: "Label for the add button." },
        { prop: "className",      type: "string",                                          description: "Additional CSS classes on the wrapper." },
      ]} /></Section>
    </DocsLayout>
  )
}
