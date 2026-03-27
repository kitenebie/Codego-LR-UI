import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Slider, RangeSlider } from "../components/ui/slider"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",    label: "Basic Slider" },
  { id: "label",    label: "With Label" },
  { id: "marks",    label: "With Marks" },
  { id: "range",    label: "Range Slider" },
  { id: "disabled", label: "Disabled" },
  { id: "validation",label: "Validation" },
  { id: "props",    label: "Props" },
]

export function SliderDocs() {
  const [v1, setV1] = useState(40)
  const [v2, setV2] = useState(70)
  const [range, setRange] = useState<[number, number]>([20, 80])

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Basic Slider" description="Single handle slider with tooltip on hover."
          code={`<Slider value={value} onChange={setValue} />`}>
          <div className="w-full max-w-sm">
            <Slider value={v1} onChange={setV1} showValue label="Volume" />
          </div>
        </Playground>
      </Section>
      <Section id="label">
        <Playground title="Slider with Label and Value" description="Show label and current value."
          code={`<Slider value={value} onChange={setValue} label="Opacity" showValue />`}>
          <div className="w-full max-w-sm space-y-6">
            <Slider value={v1} onChange={setV1} label="Opacity" showValue min={0} max={100} />
            <Slider value={v2} onChange={setV2} label="Brightness" showValue min={0} max={200} step={5} />
          </div>
        </Playground>
      </Section>
      <Section id="marks">
        <Playground title="Slider with Marks" description="Show tick marks at specific values."
          code={`<Slider showMarks marks={[{ value: 0, label: "0" }, { value: 50, label: "50" }, { value: 100, label: "100" }]} />`}>
          <div className="w-full max-w-sm pb-6">
            <Slider
              value={v1}
              onChange={setV1}
              showMarks
              marks={[
                { value: 0, label: "0" },
                { value: 25, label: "25" },
                { value: 50, label: "50" },
                { value: 75, label: "75" },
                { value: 100, label: "100" },
              ]}
            />
          </div>
        </Playground>
      </Section>
      <Section id="range">
        <Playground title="Range Slider" description="Dual handle slider for selecting a range."
          code={`<RangeSlider value={range} onChange={setRange} label="Price range" showValue />`}>
          <div className="w-full max-w-sm">
            <RangeSlider value={range} onChange={setRange} label="Price range" showValue min={0} max={1000} step={10} />
          </div>
        </Playground>
      </Section>
      <Section id="disabled">
        <Playground title="Disabled Slider" description="Set disabled to prevent interaction."
          code={`<Slider value={50} disabled />`}>
          <div className="w-full max-w-sm space-y-4">
            <Slider value={50} disabled label="Disabled" showValue />
            <RangeSlider value={[20, 70]} disabled label="Disabled range" showValue />
          </div>
        </Playground>
      </Section>
      <Section id="validation">
        <Playground title="Validation" description="Use required and error to add validation state to Slider and RangeSlider."
          code={`<Slider value={value} onChange={setValue} label="Volume" required />
<Slider value={value} onChange={setValue} label="Volume" required error="Please set a value" />`}>
          <div className="w-full max-w-sm space-y-6">
            <Slider value={v1} onChange={setV1} label="Volume" showValue required />
            <Slider value={v1} onChange={setV1} label="Volume" showValue required error="Please set a value" />
          </div>
        </Playground>
      </Section>
      <Section id="props">
        <PropsTable rows={[
          { prop: "value",       type: "number",              description: "Controlled value." },
          { prop: "min",         type: "number",  default: "0",   description: "Minimum value." },
          { prop: "max",         type: "number",  default: "100", description: "Maximum value." },
          { prop: "step",        type: "number",  default: "1",   description: "Step increment." },
          { prop: "onChange",    type: "(value: number) => void", description: "Fired on change." },
          { prop: "disabled",    type: "boolean", default: "false", description: "Disable interaction." },
          { prop: "showTooltip", type: "boolean", default: "true",  description: "Show value tooltip on hover." },
          { prop: "showMarks",   type: "boolean", default: "false", description: "Show tick marks." },
          { prop: "label",       type: "ReactNode",                 description: "Label shown above the slider." },
          { prop: "showValue",   type: "boolean", default: "false", description: "Show current value next to label." },
          { prop: "required",    type: "boolean",                   description: "Marks the field as required. Shows * next to label." },
          { prop: "error",       type: "string",                    description: "External error message displayed below the slider." },
        ]} />
      </Section>
    </DocsLayout>
  )
}
