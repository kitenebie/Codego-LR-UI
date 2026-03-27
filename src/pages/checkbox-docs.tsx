import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Checkbox } from "../components/ui/checkbox"
import { Label } from "../components/ui/label"
import { PropsTable } from "../components/ui/props-table"

export function CheckboxDocs() {
  return (
    <DocsLayout toc={[
      { id: "props",    label: "Props" },
      { id: "default",  label: "Default" },
      { id: "inline",   label: "Inline" },
      { id: "accepted", label: "Accepted" },
      { id: "declined", label: "Declined" },
      { id: "colors",   label: "Custom Colors" },
      { id: "sizes",    label: "Sizes" },
      { id: "statuslist",label: "Status List" },
      { id: "validation",label: "Validation" },
    ]}>

      {/* ── Props Table ── */}
      <Section id="props"><PropsTable rows={[
        { prop: "inline",        type: "boolean",         default: "false",   description: "Renders the label inline next to the checkbox as a single clickable element." },
        { prop: "label",         type: "ReactNode",       default: "—",       description: "Label text rendered inline when inline={true}." },
        { prop: "accepted",      type: "boolean",         default: "false",   description: "Forces a checked visual state to indicate acceptance." },
        { prop: "acceptedColor", type: "string",          default: "#22c55e", description: "Custom background/border color for the accepted state." },
        { prop: "declined",      type: "boolean",         default: "false",   description: "Forces an X visual state to indicate rejection." },
        { prop: "declinedColor", type: "string",          default: "#ef4444", description: "Custom background/border color for the declined state." },
        { prop: "width",         type: "number | string", default: "16px",    description: "Width of the checkbox. Numbers treated as px." },
        { prop: "height",        type: "number | string", default: "16px",    description: "Height of the checkbox. Numbers treated as px." },
        { prop: "required",      type: "boolean",                             description: "Marks the field as required. Shows a * indicator next to the inline label." },
        { prop: "error",         type: "string",                              description: "External error message displayed below the checkbox." },
      ]} /></Section>

      {/* ── Default ── */}
      <Section id="default"><Playground
        title="Checkbox"
        description="A simple checkbox with an external label."
        code={`<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`}
      >
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </Playground></Section>

      {/* ── inline ── */}
      <Section id="inline"><Playground
        title="inline"
        description="Renders the label directly next to the checkbox as a single clickable element. Pass the label text via the label prop."
        code={`<Checkbox inline label="Subscribe to newsletter" />
<Checkbox inline label="I agree to the terms" defaultChecked />`}
      >
        <div className="flex flex-col gap-3">
          <Checkbox inline label="Subscribe to newsletter" />
          <Checkbox inline label="I agree to the terms" defaultChecked />
        </div>
      </Playground></Section>

      {/* ── accepted ── */}
      <Section id="accepted"><Playground
        title="accepted"
        description="Forces a green checked state to visually indicate acceptance or approval, regardless of the checked state."
        code={`<Checkbox accepted inline label="Request approved" />
<Checkbox accepted inline label="Payment confirmed" />`}
      >
        <div className="flex flex-col gap-3">
          <Checkbox accepted inline label="Request approved" />
          <Checkbox accepted inline label="Payment confirmed" />
        </div>
      </Playground></Section>

      {/* ── declined ── */}
      <Section id="declined"><Playground
        title="declined"
        description="Forces a red X state to visually indicate rejection or denial, regardless of the checked state."
        code={`<Checkbox declined inline label="Request denied" />
<Checkbox declined inline label="Payment failed" />`}
      >
        <div className="flex flex-col gap-3">
          <Checkbox declined inline label="Request denied" />
          <Checkbox declined inline label="Payment failed" />
        </div>
      </Playground></Section>

      {/* ── acceptedColor / declinedColor ── */}
      <Section id="colors"><Playground
        title="acceptedColor & declinedColor"
        description="Overrides the default green/red color for accepted and declined states. Accepts any CSS color string."
        code={`<Checkbox accepted acceptedColor="#3b82f6" inline label="Accepted — blue" />
<Checkbox accepted acceptedColor="#8b5cf6" inline label="Accepted — purple" />
<Checkbox declined declinedColor="#f59e0b" inline label="Declined — amber" />
<Checkbox declined declinedColor="#ec4899" inline label="Declined — pink" />`}
      >
        <div className="flex flex-col gap-3">
          <Checkbox accepted acceptedColor="#3b82f6" inline label="Accepted — blue" />
          <Checkbox accepted acceptedColor="#8b5cf6" inline label="Accepted — purple" />
          <Checkbox declined declinedColor="#f59e0b" inline label="Declined — amber" />
          <Checkbox declined declinedColor="#ec4899" inline label="Declined — pink" />
        </div>
      </Playground></Section>

      {/* ── width & height ── */}
      <Section id="sizes"><Playground
        title="width & height"
        description="Controls the size of the checkbox. Accepts a number (px) or any CSS string."
        code={`<Checkbox inline label="Small (12px)"   width={12} height={12} />
<Checkbox inline label="Default (16px)" />
<Checkbox inline label="Large (24px)"   width={24} height={24} />
<Checkbox inline label="XL (32px)"      width={32} height={32} defaultChecked />`}
      >
        <div className="flex flex-col gap-4">
          <Checkbox inline label="Small (12px)"   width={12} height={12} />
          <Checkbox inline label="Default (16px)" />
          <Checkbox inline label="Large (24px)"   width={24} height={24} />
          <Checkbox inline label="XL (32px)"      width={32} height={32} defaultChecked />
        </div>
      </Playground></Section>

      {/* ── Combined ── */}
      <Section id="statuslist"><Playground
        title="Status List"
        description="Using accepted and declined together to show a mixed status list."
        code={`<Checkbox accepted inline label="Identity verified" />
<Checkbox accepted inline label="Email confirmed" />
<Checkbox declined inline label="Phone not verified" />
<Checkbox declined inline label="Address missing" />`}
      >
        <div className="flex flex-col gap-3">
          <Checkbox accepted inline label="Identity verified" />
          <Checkbox accepted inline label="Email confirmed" />
          <Checkbox declined inline label="Phone not verified" />
          <Checkbox declined inline label="Address missing" />
        </div>
      </Playground></Section>

      <Section id="validation"><Playground
        title="Validation"
        description="Use required to mark a checkbox as required (shows * next to label). Use error to display an external validation message."
        code={`<Checkbox inline label="Accept terms" required />
<Checkbox inline label="Accept terms" required error="You must accept the terms" />`}
      >
        <div className="flex flex-col gap-3">
          <Checkbox inline label="Accept terms" required />
          <Checkbox inline label="Accept terms" required error="You must accept the terms" />
        </div>
      </Playground></Section>
    </DocsLayout>
  )
}
