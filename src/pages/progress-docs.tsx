import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Progress, CircularProgress } from "../components/ui/progress"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "linear",        label: "Linear" },
  { id: "variants",      label: "Variants" },
  { id: "sizes",         label: "Sizes" },
  { id: "label",         label: "With Label" },
  { id: "striped",       label: "Striped" },
  { id: "indeterminate", label: "Indeterminate" },
  { id: "circular",      label: "Circular" },
  { id: "circular-ind",  label: "Circular Indeterminate" },
  { id: "props",         label: "Props" },
]

export function ProgressDocs() {
  const [val, setVal] = useState(60)
  return (
    <DocsLayout toc={TOC}>
      <Section id="linear">
        <Playground title="Linear Progress" description="Basic progress bar with value 0-100."
          code={`<Progress value={60} />`}>
          <div className="w-full max-w-sm space-y-3">
            <Progress value={val} />
            <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full accent-primary" />
          </div>
        </Playground>
      </Section>
      <Section id="variants">
        <Playground title="Progress Variants" description="Five color variants."
          code={`<Progress value={70} variant="success" />\n<Progress value={50} variant="warning" />\n<Progress value={30} variant="error" />`}>
          <div className="w-full max-w-sm space-y-3">
            <Progress value={80} variant="default" label="Default" showValue />
            <Progress value={70} variant="success" label="Success" showValue />
            <Progress value={50} variant="warning" label="Warning" showValue />
            <Progress value={30} variant="error" label="Error" showValue />
            <Progress value={60} variant="info" label="Info" showValue />
          </div>
        </Playground>
      </Section>
      <Section id="sizes">
        <Playground title="Progress Sizes" description="Four sizes: xs, sm, md, lg."
          code={`<Progress value={60} size="xs" />\n<Progress value={60} size="sm" />\n<Progress value={60} size="md" />\n<Progress value={60} size="lg" />`}>
          <div className="w-full max-w-sm space-y-3">
            <Progress value={60} size="xs" label="xs" />
            <Progress value={60} size="sm" label="sm" />
            <Progress value={60} size="md" label="md" />
            <Progress value={60} size="lg" label="lg" />
          </div>
        </Playground>
      </Section>
      <Section id="label">
        <Playground title="Progress with Label and Value" description="Show label and percentage value."
          code={`<Progress value={75} label="Uploading..." showValue />`}>
          <div className="w-full max-w-sm space-y-3">
            <Progress value={75} label="Uploading files..." showValue variant="info" />
            <Progress value={45} label="Processing" showValue variant="warning" />
          </div>
        </Playground>
      </Section>
      <Section id="striped">
        <Playground title="Striped Progress" description="Add a diagonal stripe pattern."
          code={`<Progress value={60} striped />`}>
          <div className="w-full max-w-sm space-y-3">
            <Progress value={60} striped variant="default" label="Striped" />
            <Progress value={80} striped variant="success" label="Striped Success" />
          </div>
        </Playground>
      </Section>
      <Section id="indeterminate">
        <Playground title="Indeterminate Progress" description="Use when progress is unknown."
          code={`<Progress indeterminate />`}>
          <div className="w-full max-w-sm space-y-3">
            <Progress indeterminate label="Loading..." variant="default" />
            <Progress indeterminate label="Syncing..." variant="info" />
          </div>
        </Playground>
      </Section>
      <Section id="circular">
        <Playground title="Circular Progress" description="Circular variant with optional value label."
          code={`<CircularProgress value={75} showValue />`}>
          <div className="flex flex-wrap gap-6 items-end">
            <CircularProgress value={25} showValue variant="error" label="Error" />
            <CircularProgress value={50} showValue variant="warning" label="Warning" size={80} strokeWidth={8} />
            <CircularProgress value={75} showValue variant="success" label="Success" size={96} strokeWidth={8} />
            <CircularProgress value={90} showValue variant="info" label="Info" size={112} strokeWidth={10} />
          </div>
        </Playground>
      </Section>
      <Section id="circular-ind">
        <Playground title="Circular Indeterminate" description="Spinning circular loader."
          code={`<CircularProgress indeterminate />`}>
          <div className="flex flex-wrap gap-6 items-center">
            <CircularProgress indeterminate variant="default" />
            <CircularProgress indeterminate variant="info" size={48} />
            <CircularProgress indeterminate variant="success" size={64} strokeWidth={8} />
          </div>
        </Playground>
      </Section>
      <Section id="props">
        <PropsTable rows={[
          { prop: "value",         type: "number",                                                    description: "Progress value 0–100." },
          { prop: "variant",       type: '"default" | "success" | "warning" | "error" | "info"', default: '"default"', description: "Color variant." },
          { prop: "size",          type: '"xs" | "sm" | "md" | "lg"',                           default: '"md"',      description: "Bar height." },
          { prop: "label",         type: "string",                                                    description: "Text label shown above the bar." },
          { prop: "showValue",     type: "boolean",                                              default: "false",     description: "Show percentage value next to the label." },
          { prop: "striped",       type: "boolean",                                              default: "false",     description: "Add a diagonal stripe pattern to the bar." },
          { prop: "indeterminate", type: "boolean",                                              default: "false",     description: "Animate the bar when progress is unknown." },
          { prop: "className",     type: "string",                                                    description: "Additional CSS classes on the wrapper." },
        ]} />
        <PropsTable rows={[
          { prop: "value",         type: "number",                                                    description: "Progress value 0–100." },
          { prop: "variant",       type: '"default" | "success" | "warning" | "error" | "info"', default: '"default"', description: "Color variant." },
          { prop: "size",          type: "number",                                               default: "64",        description: "Diameter of the circle in pixels." },
          { prop: "strokeWidth",   type: "number",                                               default: "6",         description: "Stroke width of the circle track." },
          { prop: "showValue",     type: "boolean",                                              default: "false",     description: "Show percentage value in the center." },
          { prop: "label",         type: "string",                                                    description: "Text label shown below the circle." },
          { prop: "indeterminate", type: "boolean",                                              default: "false",     description: "Spin animation when progress is unknown." },
          { prop: "className",     type: "string",                                                    description: "Additional CSS classes." },
        ]} />
      </Section>
    </DocsLayout>
  )
}
