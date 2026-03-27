import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { RadioGroup } from "../components/ui/radio-group"
import { Zap, Shield, Star } from "lucide-react"

const TOC = [
  { id: "default",     label: "Default" },
  { id: "card",        label: "Card Variant" },
  { id: "button",      label: "Button Variant" },
  { id: "horizontal",  label: "Horizontal" },
  { id: "disabled",    label: "Disabled" },
  { id: "validation",  label: "Validation" },
  { id: "props",       label: "Props" },
]

const PLANS = [
  { value: "free",    label: "Free",       description: "Up to 3 projects, 1GB storage" },
  { value: "pro",     label: "Pro",        description: "Unlimited projects, 50GB storage" },
  { value: "team",    label: "Team",       description: "Everything in Pro + team features" },
]

const SIZES = [
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "md", label: "MD" },
  { value: "lg", label: "LG" },
  { value: "xl", label: "XL" },
]

export function RadioGroupDocs() {
  const [plan, setPlan] = useState("pro")
  const [size, setSize] = useState("md")

  return (
    <DocsLayout toc={TOC}>
      <Section id="default">
        <Playground title="Radio Group (Default)" description="Standard list-style radio buttons."
          code={`<RadioGroup options={options} value={value} onChange={setValue} />`}>
          <RadioGroup options={PLANS} value={plan} onChange={setPlan} />
        </Playground>
      </Section>
      <Section id="card">
        <Playground title="Card Variant" description="Each option is a selectable card."
          code={`<RadioGroup variant="card" options={options} value={value} onChange={setValue} />`}>
          <RadioGroup
            variant="card"
            value={plan}
            onChange={setPlan}
            options={[
              { value: "starter", label: "Starter", description: "For individuals", icon: <Zap className="h-5 w-5" /> },
              { value: "pro",     label: "Pro",     description: "For professionals", icon: <Star className="h-5 w-5" /> },
              { value: "enterprise", label: "Enterprise", description: "For teams", icon: <Shield className="h-5 w-5" /> },
            ]}
          />
        </Playground>
      </Section>
      <Section id="button">
        <Playground title="Button Variant" description="Toggle-button style radio group."
          code={`<RadioGroup variant="button" options={options} value={value} onChange={setValue} />`}>
          <RadioGroup variant="button" options={SIZES} value={size} onChange={setSize} />
        </Playground>
      </Section>
      <Section id="horizontal">
        <Playground title="Horizontal Orientation" description="Lay options out in a row."
          code={`<RadioGroup orientation="horizontal" options={options} />`}>
          <RadioGroup orientation="horizontal" options={PLANS.slice(0, 3)} value={plan} onChange={setPlan} />
        </Playground>
      </Section>
      <Section id="disabled">
        <Playground title="Disabled Options" description="Individual options can be disabled."
          code={`{ value: "team", label: "Team", disabled: true }`}>
          <RadioGroup options={[
            { value: "free", label: "Free", description: "Available" },
            { value: "pro",  label: "Pro",  description: "Available" },
            { value: "team", label: "Team", description: "Coming soon", disabled: true },
          ]} value={plan} onChange={setPlan} />
        </Playground>
      </Section>
      <Section id="validation">
        <Playground title="Validation" description="Use required and error to add validation state to any RadioGroup variant."
          code={`<RadioGroup options={options} value={value} onChange={setValue} required />
<RadioGroup options={options} value="" onChange={setValue} required error="Please select a plan" />`}>
          <div className="space-y-4">
            <RadioGroup options={PLANS} value={plan} onChange={setPlan} required />
            <RadioGroup options={PLANS} value="" onChange={setPlan} required error="Please select a plan" />
          </div>
        </Playground>
      </Section>
      <Section id="props">
        <PropsTable rows={[
          { prop: "options",     type: "RadioOption[]",              required: true, description: "Array of options." },
          { prop: "value",       type: "string",                                     description: "Controlled selected value." },
          { prop: "onChange",    type: "(value: string) => void",                    description: "Fired when selection changes." },
          { prop: "variant",     type: '"default" | "card" | "button"', default: '"default"', description: "Visual style of the group." },
          { prop: "size",        type: '"sm" | "md" | "lg"',          default: '"md"',        description: "Size of radio indicators and text." },
          { prop: "orientation", type: '"horizontal" | "vertical"',   default: '"vertical"',  description: "Layout direction." },
          { prop: "name",        type: "string",                                     description: "HTML name attribute for the radio inputs." },
          { prop: "required",    type: "boolean",                                    description: "Marks the group as required." },
          { prop: "error",       type: "string",                                     description: "External error message displayed below the group." },
        ]} />
      </Section>
    </DocsLayout>
  )
}
