import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Stepper } from "../components/ui/stepper"
import { Button } from "../components/ui/button"
import { User, CreditCard, CheckCircle, Package } from "lucide-react"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "horizontal", label: "Horizontal" },
  { id: "vertical",   label: "Vertical" },
  { id: "clickable",  label: "Clickable" },
  { id: "content",    label: "With Content" },
  { id: "icons",      label: "Custom Icons" },
  { id: "props",      label: "Props" },
  { id: "dataformat", label: "Data Format" },
]

const STEPS = [
  { label: "Account", description: "Basic info" },
  { label: "Profile", description: "Personal details" },
  { label: "Review",  description: "Confirm details" },
  { label: "Done",    description: "All set!" },
]

export function StepperDocs() {
  const [step1, setStep1] = useState(1)
  const [step2, setStep2] = useState(0)
  const [step3, setStep3] = useState(1)

  return (
    <DocsLayout toc={TOC}>
      <Section id="horizontal">
        <Playground title="Horizontal Stepper" description="Step indicator with progress connector."
          code={`<Stepper steps={steps} current={current} />`}>
          <div className="w-full max-w-lg space-y-4">
            <Stepper steps={STEPS} current={step1} />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep1((s) => Math.max(0, s - 1))} disabled={step1 === 0}>Back</Button>
              <Button size="sm" onClick={() => setStep1((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step1 === STEPS.length - 1}>Next</Button>
            </div>
          </div>
        </Playground>
      </Section>
      <Section id="vertical">
        <Playground title="Vertical Stepper" description="Vertical layout with inline content."
          code={`<Stepper orientation="vertical" steps={steps} current={current} />`}>
          <div className="max-w-xs space-y-4">
            <Stepper orientation="vertical" steps={STEPS} current={step2} />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep2((s) => Math.max(0, s - 1))} disabled={step2 === 0}>Back</Button>
              <Button size="sm" onClick={() => setStep2((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step2 === STEPS.length - 1}>Next</Button>
            </div>
          </div>
        </Playground>
      </Section>
      <Section id="clickable">
        <Playground title="Clickable Steps" description="Set clickable to allow jumping to any step."
          code={`<Stepper clickable steps={steps} current={current} onChange={setCurrent} />`}>
          <div className="w-full max-w-lg">
            <Stepper clickable steps={STEPS} current={step3} onChange={setStep3} />
          </div>
        </Playground>
      </Section>
      <Section id="content">
        <Playground title="Stepper with Content" description="Each step can have a content panel shown when active."
          code={`{ label: "Account", content: <AccountForm /> }`}>
          <div className="w-full max-w-lg space-y-4">
            <Stepper
              clickable
              current={step3}
              onChange={setStep3}
              steps={[
                { label: "Account", content: <div className="p-4 rounded-xl bg-muted/30 text-sm">Fill in your email and password.</div> },
                { label: "Profile", content: <div className="p-4 rounded-xl bg-muted/30 text-sm">Add your name and profile photo.</div> },
                { label: "Review",  content: <div className="p-4 rounded-xl bg-muted/30 text-sm">Review your information before submitting.</div> },
                { label: "Done",    content: <div className="p-4 rounded-xl bg-success/10 text-success text-sm font-medium">Your account is ready!</div> },
              ]}
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep3((s) => Math.max(0, s - 1))} disabled={step3 === 0}>Back</Button>
              <Button size="sm" onClick={() => setStep3((s) => Math.min(3, s + 1))} disabled={step3 === 3}>
                {step3 === 3 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </Playground>
      </Section>
      <Section id="icons">
        <Playground title="Custom Step Icons" description="Replace step numbers with custom icons."
          code={`{ label: "Account", icon: <User className="h-4 w-4" /> }`}>
          <div className="w-full max-w-lg">
            <Stepper
              current={step3}
              steps={[
                { label: "Account",  icon: <User className="h-4 w-4" /> },
                { label: "Shipping", icon: <Package className="h-4 w-4" /> },
                { label: "Payment",  icon: <CreditCard className="h-4 w-4" /> },
                { label: "Confirm",  icon: <CheckCircle className="h-4 w-4" /> },
              ]}
            />
          </div>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "steps",          type: "Step[]",                              required: true, description: "Array of step definitions." },
        { prop: "current",        type: "number",                                              description: "Controlled active step index (0-based)." },
        { prop: "defaultCurrent", type: "number",                              default: "0",   description: "Initial active step (uncontrolled)." },
        { prop: "onChange",       type: "(step: number) => void",                              description: "Fired when a step is clicked (requires clickable)." },
        { prop: "orientation",    type: '"horizontal" | "vertical"',           default: '"horizontal"', description: "Layout direction." },
        { prop: "clickable",      type: "boolean",                             default: "false", description: "Allow jumping to any step by clicking." },
        { prop: "className",      type: "string",                                              description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "Step.label",       type: "ReactNode", required: true, description: "Step heading." },
        { prop: "Step.description", type: "ReactNode",                 description: "Secondary text below the label." },
        { prop: "Step.icon",        type: "ReactNode",                 description: "Custom icon replacing the step number." },
        { prop: "Step.content",     type: "ReactNode",                 description: "Content panel shown when this step is active." },
        { prop: "Step.optional",    type: "boolean",                  description: "Show an (optional) label next to the step." },
      ]} /></Section>
    </DocsLayout>
  )
}
