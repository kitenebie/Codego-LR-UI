import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { ColorPicker } from "../components/ui/color-picker"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",      label: "Basic" },
  { id: "opacity",    label: "With Opacity" },
  { id: "noswatches", label: "No Swatches" },
  { id: "validation", label: "Validation" },
  { id: "props",      label: "Props" },
]

export function ColorPickerDocs() {
  const [c1, setC1] = useState("#6366f1")
  const [c2, setC2] = useState("#22c55e")
  const [c3, setC3] = useState("#ef4444")

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Color Picker" description="Click to open. Choose from swatches or enter a hex value."
          code={`<ColorPicker value={color} onChange={setColor} />`}>
          <div className="flex flex-wrap gap-4 items-center">
            <ColorPicker value={c1} onChange={setC1} />
            <span className="text-sm text-muted-foreground">Selected: <span className="font-mono">{c1}</span></span>
          </div>
        </Playground>
      </Section>
      <Section id="opacity">
        <Playground title="Color Picker with Opacity" description="Show an opacity slider."
          code={`<ColorPicker showOpacity value={color} onChange={setColor} />`}>
          <ColorPicker showOpacity value={c2} onChange={setC2} />
        </Playground>
      </Section>
      <Section id="noswatches">
        <Playground title="Without Swatches" description="Hide the swatch palette."
          code={`<ColorPicker showSwatches={false} value={color} onChange={setColor} />`}>
          <ColorPicker showSwatches={false} value={c3} onChange={setC3} />
        </Playground>
      </Section>
      <Section id="validation">
        <Playground title="Validation" description="Use required and error to add validation state."
          code={`<ColorPicker value={color} onChange={setColor} required />
<ColorPicker value={color} onChange={setColor} required error="Please select a color" />`}>
          <div className="flex flex-wrap gap-6 items-start">
            <ColorPicker value={c1} onChange={setC1} required />
            <ColorPicker value={c2} onChange={setC2} required error="Please select a color" />
          </div>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "value",        type: "string",             required: true, description: "Controlled hex color value." },
        { prop: "onChange",     type: "(color: string) => void", required: true, description: "Fired when the color changes." },
        { prop: "showOpacity",  type: "boolean",            default: "false", description: "Show an opacity/alpha slider." },
        { prop: "showSwatches", type: "boolean",            default: "true",  description: "Show the preset swatch palette." },
        { prop: "swatches",     type: "string[]",                             description: "Custom swatch colors to display." },
        { prop: "className",    type: "string",                               description: "Additional CSS classes on the trigger." },
        { prop: "required",     type: "boolean",                              description: "Marks the field as required." },
        { prop: "error",        type: "string",                               description: "External error message displayed below the picker." },
      ]} /></Section>
    </DocsLayout>
  )
}
