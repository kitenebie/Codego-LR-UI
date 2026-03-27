import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { ToggleSwitch } from "../components/ui/toggle-switch"
import { Label } from "../components/ui/label"

const PROPS = [
  { name: "inline",        type: "boolean",         default: "false",   description: "Renders the label inline next to the toggle as a single clickable element." },
  { name: "label",         type: "ReactNode",       default: "—",       description: "Label text rendered inline when inline={true}." },
  { name: "accepted",      type: "boolean",         default: "false",   description: "Forces an ON visual state to indicate acceptance." },
  { name: "acceptedColor", type: "string",          default: "#22c55e", description: "Custom track color for the accepted state. Accepts any CSS color." },
  { name: "declined",      type: "boolean",         default: "false",   description: "Forces an OFF visual state to indicate rejection." },
  { name: "declinedColor", type: "string",          default: "#ef4444", description: "Custom track color for the declined state. Accepts any CSS color." },
  { name: "width",         type: "number | string", default: "2.75rem", description: "Sets the width of the track. Numbers are treated as px, strings as raw CSS values." },
  { name: "height",        type: "number | string", default: "1.5rem",  description: "Sets the height of the track. Numbers are treated as px, strings as raw CSS values." },
  { name: "required",      type: "boolean",         default: "—",       description: "Marks the toggle as required. Shows a * indicator next to the inline label." },
  { name: "error",         type: "string",          default: "—",       description: "External error message displayed below the toggle." },
]

export function ToggleDocs() {
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
      <Section id="props"><div className="rounded-xl glass overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-2xl font-bold tracking-tight text-gradient">Props</h2>
          <p className="text-muted-foreground text-sm mt-1">All available props for the ToggleSwitch component.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-left">
                <th className="px-6 py-3 font-medium text-muted-foreground">Prop</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Type</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Default</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {PROPS.map((p, i) => (
                <tr key={p.name} className={i % 2 === 0 ? "border-b border-white/5" : "border-b border-white/5 bg-white/[0.02]"}>
                  <td className="px-6 py-3 font-mono text-primary">{p.name}</td>
                  <td className="px-6 py-3 font-mono text-amber-400">{p.type}</td>
                  <td className="px-6 py-3 font-mono text-muted-foreground">{p.default}</td>
                  <td className="px-6 py-3 text-muted-foreground">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div></Section>

      {/* ── Default ── */}
      <Section id="default"><Playground
        title="Toggle Switch"
        description="A simple toggle switch with an external label."
        code={`<div className="flex items-center space-x-2">
  <ToggleSwitch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>`}
      >
        <div className="flex items-center space-x-2">
          <ToggleSwitch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
      </Playground></Section>

      {/* ── inline ── */}
      <Section id="inline"><Playground
        title="inline"
        description="Renders the label directly next to the toggle as a single clickable element. Pass the label text via the label prop."
        code={`<ToggleSwitch inline label="Enable notifications" />
<ToggleSwitch inline label="Dark mode" defaultChecked />`}
      >
        <div className="flex flex-col gap-3">
          <ToggleSwitch inline label="Enable notifications" />
          <ToggleSwitch inline label="Dark mode" defaultChecked />
        </div>
      </Playground></Section>

      {/* ── accepted ── */}
      <Section id="accepted"><Playground
        title="accepted"
        description="Forces an ON visual state to indicate acceptance or approval."
        code={`<ToggleSwitch accepted inline label="Request approved" />
<ToggleSwitch accepted inline label="Access granted" />`}
      >
        <div className="flex flex-col gap-3">
          <ToggleSwitch accepted inline label="Request approved" />
          <ToggleSwitch accepted inline label="Access granted" />
        </div>
      </Playground></Section>

      {/* ── declined ── */}
      <Section id="declined"><Playground
        title="declined"
        description="Forces an OFF visual state to indicate rejection or denial."
        code={`<ToggleSwitch declined inline label="Request denied" />
<ToggleSwitch declined inline label="Access revoked" />`}
      >
        <div className="flex flex-col gap-3">
          <ToggleSwitch declined inline label="Request denied" />
          <ToggleSwitch declined inline label="Access revoked" />
        </div>
      </Playground></Section>

      {/* ── acceptedColor / declinedColor ── */}
      <Section id="colors"><Playground
        title="acceptedColor & declinedColor"
        description="Overrides the default green/red track color. Accepts any CSS color string."
        code={`<ToggleSwitch accepted acceptedColor="#3b82f6" inline label="Accepted — blue" />
<ToggleSwitch accepted acceptedColor="#8b5cf6" inline label="Accepted — purple" />
<ToggleSwitch declined declinedColor="#f59e0b" inline label="Declined — amber" />
<ToggleSwitch declined declinedColor="#ec4899" inline label="Declined — pink" />`}
      >
        <div className="flex flex-col gap-3">
          <ToggleSwitch accepted acceptedColor="#3b82f6" inline label="Accepted — blue" />
          <ToggleSwitch accepted acceptedColor="#8b5cf6" inline label="Accepted — purple" />
          <ToggleSwitch declined declinedColor="#f59e0b" inline label="Declined — amber" />
          <ToggleSwitch declined declinedColor="#ec4899" inline label="Declined — pink" />
        </div>
      </Playground></Section>

      {/* ── width & height ── */}
      <Section id="sizes"><Playground
        title="width & height"
        description="Controls the size of the toggle track. Accepts a number (px) or any CSS string."
        code={`<ToggleSwitch inline label="Small"   width={36} height={20} defaultChecked />
<ToggleSwitch inline label="Default" defaultChecked />
<ToggleSwitch inline label="Large"   width={56} height={28} defaultChecked />
<ToggleSwitch inline label="XL"      width={72} height={36} defaultChecked />`}
      >
        <div className="flex flex-col gap-4">
          <ToggleSwitch inline label="Small"   width={36} height={20} defaultChecked />
          <ToggleSwitch inline label="Default" defaultChecked />
          <ToggleSwitch inline label="Large"   width={56} height={28} defaultChecked />
          <ToggleSwitch inline label="XL"      width={72} height={36} defaultChecked />
        </div>
      </Playground></Section>

      {/* ── Status List ── */}
      <Section id="statuslist"><Playground
        title="Status List"
        description="Using accepted and declined together to show a mixed status list."
        code={`<ToggleSwitch accepted inline label="Notifications enabled" />
<ToggleSwitch accepted inline label="Two-factor auth active" />
<ToggleSwitch declined inline label="Marketing emails off" />
<ToggleSwitch declined inline label="Analytics disabled" />`}
      >
        <div className="flex flex-col gap-3">
          <ToggleSwitch accepted inline label="Notifications enabled" />
          <ToggleSwitch accepted inline label="Two-factor auth active" />
          <ToggleSwitch declined inline label="Marketing emails off" />
          <ToggleSwitch declined inline label="Analytics disabled" />
        </div>
      </Playground></Section>

      <Section id="validation"><Playground
        title="Validation"
        description="Use required to mark a toggle as required (shows * next to label). Use error to display an external validation message."
        code={`<ToggleSwitch inline label="Enable feature" required />
<ToggleSwitch inline label="Enable feature" required error="This setting is required" />`}
      >
        <div className="flex flex-col gap-3">
          <ToggleSwitch inline label="Enable feature" required />
          <ToggleSwitch inline label="Enable feature" required error="This setting is required" />
        </div>
      </Playground></Section>
    </DocsLayout>
  )
}
