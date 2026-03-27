import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { ResizablePanels } from "../components/ui/resizable-panels"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "horizontal", label: "Horizontal" },
  { id: "vertical",   label: "Vertical" },
  { id: "minmax",     label: "Min / Max Size" },
  { id: "props",      label: "Props" },
]

export function ResizablePanelsDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="horizontal">
        <Playground title="Horizontal Split" description="Drag the handle to resize panels left and right."
          code={`<ResizablePanels>\n  <div>Left panel</div>\n  <div>Right panel</div>\n</ResizablePanels>`}>
          <ResizablePanels className="h-48 w-full rounded-xl border border-border overflow-hidden">
            <div className="h-full bg-muted/30 p-4 text-sm text-muted-foreground">Left panel — drag the handle to resize</div>
            <div className="h-full bg-accent/20 p-4 text-sm text-muted-foreground">Right panel</div>
          </ResizablePanels>
        </Playground>
      </Section>
      <Section id="vertical">
        <Playground title="Vertical Split" description="Drag the handle to resize panels top and bottom."
          code={`<ResizablePanels orientation="vertical">\n  <div>Top panel</div>\n  <div>Bottom panel</div>\n</ResizablePanels>`}>
          <ResizablePanels orientation="vertical" className="h-64 w-full rounded-xl border border-border overflow-hidden">
            <div className="w-full bg-muted/30 p-4 text-sm text-muted-foreground">Top panel</div>
            <div className="w-full bg-accent/20 p-4 text-sm text-muted-foreground">Bottom panel</div>
          </ResizablePanels>
        </Playground>
      </Section>
      <Section id="minmax">
        <Playground title="Min / Max Size" description="Constrain how small or large each panel can get."
          code={`<ResizablePanels minSize={20} maxSize={80} defaultSize={30}>\n  ...\n</ResizablePanels>`}>
          <ResizablePanels minSize={20} maxSize={70} defaultSize={30} className="h-48 w-full rounded-xl border border-border overflow-hidden">
            <div className="h-full bg-primary/5 p-4 text-sm">
              <p className="font-medium text-primary">Sidebar</p>
              <p className="text-xs text-muted-foreground mt-1">Min 20%, max 70%</p>
            </div>
            <div className="h-full bg-muted/20 p-4 text-sm text-muted-foreground">Main content area</div>
          </ResizablePanels>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "children",        type: "[ReactNode, ReactNode]", required: true, description: "Exactly two child panels to render." },
        { prop: "orientation",     type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Split direction — horizontal resizes left/right, vertical resizes top/bottom." },
        { prop: "defaultSize",     type: "number",  default: "50",  description: "Initial size of the first panel as a percentage." },
        { prop: "minSize",         type: "number",  default: "10",  description: "Minimum size of the first panel as a percentage." },
        { prop: "maxSize",         type: "number",  default: "90",  description: "Maximum size of the first panel as a percentage." },
        { prop: "handleClassName", type: "string",                  description: "Additional CSS classes on the drag handle." },
        { prop: "className",       type: "string",                  description: "Additional CSS classes on the container." },
      ]} /></Section>
    </DocsLayout>
  )
}
