import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { PropsTable } from "../components/ui/props-table"
import { Wizard } from "../components/ui/wizard"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Check, Rocket, User, CreditCard, ShieldCheck, Palette, Settings } from "lucide-react"

const TOC = [
  { id: "default",        label: "Default" },
  { id: "dots",           label: "Dots" },
  { id: "minimal",        label: "Minimal" },
  { id: "cards",          label: "Cards" },
  { id: "sidebar",        label: "Sidebar" },
  { id: "modal",          label: "Modal" },
  { id: "custom-actions", label: "Custom Actions" },
  { id: "validation",     label: "Validation" },
  { id: "clickable",      label: "Clickable Steps" },
  { id: "props",          label: "Props" },
  { id: "step-props",     label: "WizardStep Props" },
  { id: "action-props",   label: "WizardAction Props" },
]

// ─── Shared step content ──────────────────────────────────────────────────────

function StepContent({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground max-w-xs">{body}</p>
    </div>
  )
}

const BASIC_STEPS = [
  {
    title: "Account",
    description: "Set up your account",
    icon: <User className="h-3.5 w-3.5" />,
    content: <StepContent icon={User} title="Create your account" body="Enter your name and email to get started with the platform." />,
  },
  {
    title: "Plan",
    description: "Choose a plan",
    icon: <CreditCard className="h-3.5 w-3.5" />,
    content: <StepContent icon={CreditCard} title="Choose your plan" body="Select the plan that best fits your needs. You can upgrade anytime." />,
  },
  {
    title: "Review",
    description: "Confirm details",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    content: <StepContent icon={ShieldCheck} title="Review & confirm" body="Everything looks good! Click Finish to complete your setup." />,
  },
]

const LONG_STEPS = [
  { title: "Profile",   icon: <User className="h-3.5 w-3.5" />,        content: <StepContent icon={User}        title="Your profile"       body="Tell us a bit about yourself." /> },
  { title: "Billing",   icon: <CreditCard className="h-3.5 w-3.5" />,  content: <StepContent icon={CreditCard}  title="Billing details"    body="Add your payment method securely." /> },
  { title: "Theme",     icon: <Palette className="h-3.5 w-3.5" />,     content: <StepContent icon={Palette}     title="Personalise"        body="Choose your preferred theme and colours." /> },
  { title: "Settings",  icon: <Settings className="h-3.5 w-3.5" />,    content: <StepContent icon={Settings}    title="Preferences"        body="Configure notifications and privacy settings." /> },
  { title: "Launch",    icon: <Rocket className="h-3.5 w-3.5" />,      content: <StepContent icon={Rocket}      title="You're all set!"    body="Click Finish to launch your workspace." /> },
]

// ─── Code snippets ────────────────────────────────────────────────────────────

const CODE_DEFAULT = [
  "const steps = [",
  '  { title: "Account", content: <AccountStep /> },',
  '  { title: "Plan",    content: <PlanStep /> },',
  '  { title: "Review",  content: <ReviewStep /> },',
  "]",
  "",
  "<Wizard",
  "  steps={steps}",
  '  onFinish={() => console.log("done")}',
  "/>",
].join("\n")

const CODE_MODAL = [
  "const [open, setOpen] = useState(false)",
  "",
  '<Button onClick={() => setOpen(true)}>Open Wizard</Button>',
  "",
  "<Wizard",
  '  layout="modal"',
  "  isOpen={open}",
  "  steps={steps}",
  "  showClose",
  "  onClose={() => setOpen(false)}",
  '  onFinish={() => setOpen(false)}',
  "/>",
].join("\n")

const CODE_CUSTOM_ACTIONS = [
  "<Wizard",
  "  steps={steps}",
  "  renderActions={({ onBack, onNext, isFirst, isLast }) => (",
  "    <div className=\"flex justify-between w-full\">",
  "      <Button variant=\"ghost\" onClick={onBack} disabled={isFirst}>← Back</Button>",
  "      <Button variant=\"success\" onClick={onNext}>",
  "        {isLast ? \"🚀 Launch\" : \"Continue →\"}",
  "      </Button>",
  "    </div>",
  "  )}",
  "/>",
].join("\n")

const CODE_VALIDATION = [
  "const steps = [",
  "  {",
  '    title: "Email",',
  "    content: <EmailStep />,",
  "    validate: () => {",
  '      if (!email) return "Email is required"',
  '      if (!email.includes("@")) return "Enter a valid email"',
  "      return true",
  "    },",
  "  },",
  "]",
  "",
  "<Wizard steps={steps} />",
].join("\n")

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WizardDocs() {
  const [modalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [finished, setFinished] = useState<string | null>(null)

  const validationSteps = [
    {
      title: "Email",
      description: "Required field",
      content: (
        <div className="space-y-3 py-2">
          <p className="text-sm font-medium">Enter your email address</p>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      ),
      validate: () => {
        if (!email.trim()) return "Email is required."
        if (!email.includes("@")) return "Please enter a valid email address."
        return true
      },
    },
    {
      title: "Confirm",
      content: (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <Check className="h-6 w-6" />
          </div>
          <p className="font-semibold">Looks good!</p>
          <p className="text-sm text-muted-foreground">We'll send a confirmation to <strong>{email || "your email"}</strong>.</p>
        </div>
      ),
    },
  ]

  return (
    <DocsLayout toc={TOC}>

      {/* Default */}
      <Section id="default">
        <Playground
          title="Default"
          description="Numbered circles with a horizontal connector bar and progress indicator."
          code={CODE_DEFAULT}
        >
          <div className="w-full max-w-lg">
            <Wizard
              steps={BASIC_STEPS}
              variant="default"
              title="Onboarding"
              description="Complete the steps below to get started."
              showCancel
              onFinish={() => setFinished("default")}
              onClose={() => {}}
            />
            {finished === "default" && (
              <p className="mt-3 text-center text-sm text-success font-medium">✓ Wizard finished!</p>
            )}
          </div>
        </Playground>
      </Section>

      {/* Dots */}
      <Section id="dots">
        <Playground
          title="Dots"
          description="Compact pill-dot indicator — great for simple flows or tight spaces."
          code={[
            '<Wizard steps={steps} variant="dots" />',
          ].join("\n")}
        >
          <div className="w-full max-w-lg">
            <Wizard steps={BASIC_STEPS} variant="dots" title="Quick Setup" />
          </div>
        </Playground>
      </Section>

      {/* Minimal */}
      <Section id="minimal">
        <Playground
          title="Minimal"
          description="Just the step title and a Step X of Y counter — maximum content space."
          code={[
            '<Wizard steps={steps} variant="minimal" />',
          ].join("\n")}
        >
          <div className="w-full max-w-lg">
            <Wizard steps={BASIC_STEPS} variant="minimal" />
          </div>
        </Playground>
      </Section>

      {/* Cards */}
      <Section id="cards">
        <Playground
          title="Cards"
          description="Pill-shaped step chips — completed steps stay visible and clickable."
          code={[
            '<Wizard steps={steps} variant="cards" clickableSteps />',
          ].join("\n")}
        >
          <div className="w-full max-w-xl">
            <Wizard steps={LONG_STEPS} variant="cards" clickableSteps />
          </div>
        </Playground>
      </Section>

      {/* Sidebar */}
      <Section id="sidebar">
        <Playground
          title="Sidebar"
          description="Vertical sidebar navigation — ideal for complex multi-step forms."
          code={[
            '<Wizard steps={steps} variant="sidebar" size="lg" clickableSteps />',
          ].join("\n")}
        >
          <div className="w-full max-w-2xl">
            <Wizard
              steps={LONG_STEPS}
              variant="sidebar"
              size="lg"
              title="Project Setup"
              description="Configure your new project."
              clickableSteps
            />
          </div>
        </Playground>
      </Section>

      {/* Modal */}
      <Section id="modal">
        <Playground
          title="Modal"
          description="Render the wizard as a modal overlay. Controlled via isOpen / onClose."
          code={CODE_MODAL}
        >
          <div className="flex flex-col items-center gap-4">
            <Button onClick={() => setModalOpen(true)}>
              <Rocket className="h-4 w-4 mr-2" /> Open Wizard Modal
            </Button>
            <Wizard
              layout="modal"
              variant="default"
              isOpen={modalOpen}
              showClose
              steps={BASIC_STEPS}
              title="Get Started"
              description="Complete the steps to set up your account."
              showCancel
              cancelLabel="Cancel"
              onClose={() => setModalOpen(false)}
              onFinish={() => setModalOpen(false)}
            />
          </div>
        </Playground>
      </Section>

      {/* Custom Actions */}
      <Section id="custom-actions">
        <Playground
          title="Custom Actions"
          description="Use renderActions to fully replace the footer buttons with your own UI."
          code={CODE_CUSTOM_ACTIONS}
        >
          <div className="w-full max-w-lg">
            <Wizard
              steps={BASIC_STEPS}
              variant="dots"
              renderActions={({ onBack, onNext, isFirst, isLast, loading }) => (
                <div className="flex items-center justify-between w-full">
                  <Button variant="ghost" size="sm" onClick={onBack} disabled={isFirst}>
                    ← Back
                  </Button>
                  <span className="text-xs text-muted-foreground">Custom footer</span>
                  <Button variant="success" size="sm" onClick={onNext} loading={loading}>
                    {isLast ? "🚀 Launch" : "Continue →"}
                  </Button>
                </div>
              )}
            />
          </div>
        </Playground>
      </Section>

      {/* Validation */}
      <Section id="validation">
        <Playground
          title="Validation"
          description="Each step can define a validate() function. Returning false or a string blocks navigation and shows an error."
          code={CODE_VALIDATION}
        >
          <div className="w-full max-w-lg">
            <Wizard
              steps={validationSteps}
              variant="minimal"
              finishLabel="Send confirmation"
              onFinish={() => setFinished("validation")}
            />
            {finished === "validation" && (
              <p className="mt-3 text-center text-sm text-success font-medium">✓ Confirmation sent to {email}!</p>
            )}
          </div>
        </Playground>
      </Section>

      {/* Clickable Steps */}
      <Section id="clickable">
        <Playground
          title="Clickable Steps"
          description="Set clickableSteps to allow jumping back to any previously visited step."
          code={[
            '<Wizard steps={steps} variant="default" clickableSteps />',
          ].join("\n")}
        >
          <div className="w-full max-w-xl">
            <Wizard steps={LONG_STEPS} variant="default" clickableSteps title="Clickable Steps" />
          </div>
        </Playground>
      </Section>

      {/* Props */}
      <Section id="props">
        <PropsTable rows={[
          { prop: "steps",            type: "WizardStep[]",                                    required: true,  description: "Array of step definitions." },
          { prop: "step",             type: "number",                                                           description: "Controlled current step index (0-based)." },
          { prop: "defaultStep",      type: "number",                                           default: "0",    description: "Initial step when uncontrolled." },
          { prop: "onStepChange",     type: "(step: number) => void",                                           description: "Called whenever the active step changes." },
          { prop: "onFinish",         type: "() => void",                                                       description: "Called when the user completes the last step." },
          { prop: "onClose",          type: "() => void",                                                       description: "Called when the wizard is cancelled or closed." },
          { prop: "layout",           type: '"modal" | "page" | "inline"',                      default: '"inline"', description: "Render mode — modal overlay, full page, or inline block." },
          { prop: "variant",          type: '"default" | "minimal" | "cards" | "sidebar" | "dots"', default: '"default"', description: "Visual design of the step indicator." },
          { prop: "size",             type: '"sm" | "md" | "lg" | "xl" | "full"',               default: '"md"',  description: "Max-width of the wizard panel." },
          { prop: "isOpen",           type: "boolean",                                                          description: "Controls modal visibility (layout=\"modal\" only)." },
          { prop: "showClose",        type: "boolean",                                           default: "true", description: "Show the × close button in modal mode." },
          { prop: "unchange",         type: "boolean",                                           default: "false", description: "Prevent closing the modal by clicking the backdrop or Escape." },
          { prop: "title",            type: "ReactNode",                                                         description: "Wizard title shown above the step indicator." },
          { prop: "description",      type: "ReactNode",                                                         description: "Subtitle shown below the title." },
          { prop: "hideHeader",       type: "boolean",                                           default: "false", description: "Hide the entire step indicator header." },
          { prop: "footer",           type: "ReactNode",                                                         description: "Fully replace the footer with custom content." },
          { prop: "renderActions",    type: "(props: WizardActionProps) => ReactNode",                           description: "Render-prop to replace only the action buttons." },
          { prop: "backLabel",        type: "ReactNode",                                         default: '"Back"',   description: "Label for the Back button." },
          { prop: "nextLabel",        type: "ReactNode",                                         default: '"Next"',   description: "Label for the Next button." },
          { prop: "finishLabel",      type: "ReactNode",                                         default: '"Finish"', description: "Label for the Finish button on the last step." },
          { prop: "cancelLabel",      type: "ReactNode",                                         default: '"Cancel"', description: "Label for the Cancel button." },
          { prop: "showCancel",       type: "boolean",                                           default: "false", description: "Show a Cancel button in the footer." },
          { prop: "showBackOnFirst",  type: "boolean",                                           default: "false", description: "Show the Back button even on the first step (disabled state)." },
          { prop: "loading",          type: "boolean",                                           default: "false", description: "Put the Next/Finish button into a loading state." },
          { prop: "clickableSteps",   type: "boolean",                                           default: "false", description: "Allow clicking step indicators to jump to any visited step." },
          { prop: "className",        type: "string",                                                            description: "Additional CSS classes on the outer wrapper." },
          { prop: "contentClassName", type: "string",                                                            description: "Additional CSS classes on the step content area." },
        ]} />
      </Section>

      {/* WizardStep Props */}
      <Section id="step-props">
        <PropsTable rows={[
          { prop: "title",       type: "string",              required: true,  description: "Step label shown in the indicator and sidebar." },
          { prop: "description", type: "string",                               description: "Subtitle shown below the title in some variants." },
          { prop: "icon",        type: "ReactNode",                            description: "Custom icon rendered inside the step circle." },
          { prop: "content",     type: "ReactNode",           required: true,  description: "The body content rendered when this step is active." },
          { prop: "optional",    type: "boolean",                              description: "Mark the step as optional (shown as a label)." },
          { prop: "validate",    type: "() => boolean | string",               description: "Called before advancing. Return true to proceed, false or a string to block with an error message." },
        ]} />
      </Section>

      {/* WizardActionProps */}
      <Section id="action-props">
        <PropsTable rows={[
          { prop: "step",    type: "number",      required: true, description: "Current step index (0-based)." },
          { prop: "total",   type: "number",      required: true, description: "Total number of steps." },
          { prop: "onBack",  type: "() => void",  required: true, description: "Navigate to the previous step." },
          { prop: "onNext",  type: "() => void",  required: true, description: "Navigate to the next step or trigger onFinish." },
          { prop: "onClose", type: "() => void",                  description: "Close / cancel the wizard." },
          { prop: "isFirst", type: "boolean",     required: true, description: "True when on the first step." },
          { prop: "isLast",  type: "boolean",     required: true, description: "True when on the last step." },
          { prop: "loading", type: "boolean",                     description: "Whether the next action is in a loading state." },
        ]} />
      </Section>

    </DocsLayout>
  )
}
