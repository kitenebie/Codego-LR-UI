import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Popover } from "../components/ui/popover"
import { PropsTable } from "../components/ui/props-table"
import { Button } from "../components/ui/button"
import { Info, Settings, User } from "lucide-react"

const TOC = [
  { id: "basic",     label: "Basic" },
  { id: "placement", label: "Placement" },
  { id: "hover",     label: "Hover Trigger" },
  { id: "rich",      label: "Rich Content" },
  { id: "props",     label: "Props" },
]

export function PopoverDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Popover" description="Click trigger to open. Click outside to close."
          code={`<Popover trigger={<Button>Open</Button>} content={<div className="p-3">Content</div>} />`}>
          <Popover
            trigger={<Button>Open Popover</Button>}
            content={
              <div className="p-4 w-64">
                <p className="text-sm font-semibold mb-1">Popover Title</p>
                <p className="text-xs text-muted-foreground">This is the popover content. It can contain any React node.</p>
              </div>
            }
          />
        </Playground>
      </Section>
      <Section id="placement">
        <Playground title="Placement" description="Eight placement options."
          code={`<Popover placement="top" trigger={...} content={...} />`}>
          <div className="flex flex-wrap gap-2 justify-center py-8">
            {(["top", "bottom", "left", "right", "top-start", "top-end", "bottom-start", "bottom-end"] as const).map((p) => (
              <Popover
                key={p}
                placement={p}
                trigger={<Button variant="outline" size="sm">{p}</Button>}
                content={<div className="px-3 py-2 text-xs font-medium">{p}</div>}
              />
            ))}
          </div>
        </Playground>
      </Section>
      <Section id="hover">
        <Playground title="Hover Trigger" description="Set triggerOn=hover to open on mouse enter."
          code={`<Popover triggerOn="hover" trigger={<Info />} content={<div>Tooltip-like content</div>} />`}>
          <div className="flex gap-4">
            <Popover
              triggerOn="hover"
              placement="top"
              trigger={
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="h-4 w-4" /> Hover me
                </button>
              }
              content={<div className="px-3 py-2 text-xs max-w-48">This popover opens on hover. Great for help text and hints.</div>}
            />
          </div>
        </Playground>
      </Section>
      <Section id="rich">
        <Playground title="Rich Content Popover" description="Popovers can contain forms, menus, or any content."
          code={`<Popover trigger={<Button>Profile</Button>} content={<UserCard />} />`}>
          <Popover
            trigger={<Button variant="outline" leftIcon={<User className="h-4 w-4" />}>Profile</Button>}
            content={
              <div className="w-64 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                  <div>
                    <p className="text-sm font-semibold">Alice Johnson</p>
                    <p className="text-xs text-muted-foreground">alice@example.com</p>
                  </div>
                </div>
                <div className="border-t border-border pt-2 space-y-1">
                  {["View Profile", "Settings", "Sign out"].map((item) => (
                    <button key={item} className="flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors">{item}</button>
                  ))}
                </div>
              </div>
            }
          />
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "trigger",      type: "ReactNode",                                                                                    required: true, description: "Element that opens the popover." },
        { prop: "content",      type: "ReactNode",                                                                                    required: true, description: "Content rendered inside the popover panel." },
        { prop: "placement",    type: '"top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end"', default: '"bottom-start"', description: "Position of the popover relative to the trigger." },
        { prop: "triggerOn",    type: '"click" | "hover"',                                                                            default: '"click"',       description: "Whether the popover opens on click or mouse enter." },
        { prop: "open",         type: "boolean",                                                                                      description: "Controlled open state." },
        { prop: "onOpenChange", type: "(open: boolean) => void",                                                                      description: "Callback fired when open state changes." },
        { prop: "className",    type: "string",                                                                                       description: "Additional CSS classes on the popover panel." },
      ]} /></Section>
    </DocsLayout>
  )
}
