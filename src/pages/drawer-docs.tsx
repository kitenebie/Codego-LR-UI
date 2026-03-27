import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Drawer } from "../components/ui/drawer"
import { PropsTable } from "../components/ui/props-table"
import { Button } from "../components/ui/button"

const TOC = [
  { id: "right",  label: "Right Drawer" },
  { id: "left",   label: "Left Drawer" },
  { id: "bottom", label: "Bottom Sheet" },
  { id: "top",    label: "Top Drawer" },
  { id: "footer", label: "With Footer" },
  { id: "props",  label: "Props" },
]

export function DrawerDocs() {
  const [right, setRight] = useState(false)
  const [left, setLeft] = useState(false)
  const [bottom, setBottom] = useState(false)
  const [top, setTop] = useState(false)
  const [withFooter, setWithFooter] = useState(false)

  return (
    <DocsLayout toc={TOC}>
      <Section id="right">
        <Playground title="Right Drawer" description="Slides in from the right side."
          code={`<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Settings" />`}>
          <Button onClick={() => setRight(true)}>Open Right Drawer</Button>
          <Drawer open={right} onClose={() => setRight(false)} side="right" title="Settings" description="Manage your account settings.">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Drawer content goes here. You can put forms, lists, or any content.</p>
              <div className="h-32 rounded-xl bg-muted/50 flex items-center justify-center text-sm text-muted-foreground">Content area</div>
            </div>
          </Drawer>
        </Playground>
      </Section>
      <Section id="left">
        <Playground title="Left Drawer" description="Slides in from the left side."
          code={`<Drawer side="left" open={open} onClose={onClose} title="Menu" />`}>
          <Button onClick={() => setLeft(true)}>Open Left Drawer</Button>
          <Drawer open={left} onClose={() => setLeft(false)} side="left" title="Navigation" description="Browse the app.">
            <div className="space-y-2">
              {["Dashboard", "Projects", "Team", "Settings", "Help"].map((item) => (
                <button key={item} className="flex w-full items-center px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">{item}</button>
              ))}
            </div>
          </Drawer>
        </Playground>
      </Section>
      <Section id="bottom">
        <Playground title="Bottom Sheet" description="Slides up from the bottom."
          code={`<Drawer side="bottom" open={open} onClose={onClose} title="Options" />`}>
          <Button onClick={() => setBottom(true)}>Open Bottom Sheet</Button>
          <Drawer open={bottom} onClose={() => setBottom(false)} side="bottom" title="Share" description="Share this item with others.">
            <div className="flex flex-wrap gap-3">
              {["Copy link", "Email", "Twitter", "Slack", "Teams"].map((opt) => (
                <button key={opt} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-accent transition-colors">{opt}</button>
              ))}
            </div>
          </Drawer>
        </Playground>
      </Section>
      <Section id="top">
        <Playground title="Top Drawer" description="Slides down from the top."
          code={`<Drawer side="top" open={open} onClose={onClose} />`}>
          <Button onClick={() => setTop(true)}>Open Top Drawer</Button>
          <Drawer open={top} onClose={() => setTop(false)} side="top" title="Announcement">
            <p className="text-sm text-muted-foreground">System maintenance scheduled for Sunday 2am UTC. Expected downtime: 30 minutes.</p>
          </Drawer>
        </Playground>
      </Section>
      <Section id="footer">
        <Playground title="Drawer with Footer" description="Add action buttons in the footer slot."
          code={`<Drawer footer={<><Button>Save</Button><Button variant="ghost">Cancel</Button></>} />`}>
          <Button onClick={() => setWithFooter(true)}>Open with Footer</Button>
          <Drawer
            open={withFooter}
            onClose={() => setWithFooter(false)}
            side="right"
            title="Edit Profile"
            description="Update your profile information."
            footer={
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setWithFooter(false)}>Cancel</Button>
                <Button onClick={() => setWithFooter(false)}>Save changes</Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Display Name</label>
                <input className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="Alice Johnson" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Bio</label>
                <textarea className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" rows={3} defaultValue="Frontend developer at Codego." />
              </div>
            </div>
          </Drawer>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "open",           type: "boolean",                          required: true, description: "Controls whether the drawer is visible." },
        { prop: "onClose",        type: "() => void",                        required: true, description: "Called when the close button or overlay is clicked." },
        { prop: "side",           type: '"left" | "right" | "top" | "bottom"', default: '"right"', description: "Which edge the drawer slides in from." },
        { prop: "size",           type: "string",                            description: "Width (left/right) or height (top/bottom) class. Defaults to w-80 / h-64." },
        { prop: "title",          type: "ReactNode",                         description: "Heading shown in the drawer header." },
        { prop: "description",    type: "ReactNode",                         description: "Subtitle shown below the title." },
        { prop: "footer",         type: "ReactNode",                         description: "Content pinned to the bottom of the drawer." },
        { prop: "overlay",        type: "boolean",                           default: "true",  description: "Show a backdrop overlay behind the drawer." },
        { prop: "closeOnOverlay", type: "boolean",                           default: "true",  description: "Close the drawer when the overlay is clicked." },
        { prop: "children",       type: "ReactNode",                         description: "Scrollable body content." },
        { prop: "className",      type: "string",                            description: "Additional CSS classes on the panel." },
      ]} /></Section>
    </DocsLayout>
  )
}
