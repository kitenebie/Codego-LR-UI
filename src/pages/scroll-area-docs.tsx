import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { ScrollArea } from "../components/ui/scroll-area"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "vertical",   label: "Vertical" },
  { id: "horizontal", label: "Horizontal" },
  { id: "both",       label: "Both Axes" },
  { id: "props",      label: "Props" },
]

const LONG_TEXT = Array.from({ length: 30 }, (_, i) => `Line ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`).join("\n")

export function ScrollAreaDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="vertical">
        <Playground title="Vertical Scroll Area" description="Constrain height with maxHeight and scroll vertically."
          code={`<ScrollArea maxHeight="200px">\n  {longContent}\n</ScrollArea>`}>
          <ScrollArea maxHeight="200px" className="w-full max-w-sm rounded-xl border border-border p-4">
            {LONG_TEXT.split("\n").map((l, i) => <p key={i} className="text-sm py-0.5">{l}</p>)}
          </ScrollArea>
        </Playground>
      </Section>
      <Section id="horizontal">
        <Playground title="Horizontal Scroll Area" description="Scroll horizontally with orientation=horizontal."
          code={`<ScrollArea orientation="horizontal" maxWidth="400px">\n  {wideContent}\n</ScrollArea>`}>
          <ScrollArea orientation="horizontal" maxWidth="400px" className="rounded-xl border border-border p-4">
            <div className="flex gap-3" style={{ width: "900px" }}>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="shrink-0 w-32 h-20 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">Card {i + 1}</div>
              ))}
            </div>
          </ScrollArea>
        </Playground>
      </Section>
      <Section id="both">
        <Playground title="Both Axes" description="orientation=both enables scrolling in both directions."
          code={`<ScrollArea orientation="both" maxHeight="200px" maxWidth="400px">\n  {content}\n</ScrollArea>`}>
          <ScrollArea orientation="both" maxHeight="200px" maxWidth="400px" className="rounded-xl border border-border p-4">
            <div style={{ width: "700px" }}>
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="text-sm py-0.5 whitespace-nowrap">Row {i + 1}: This is a very long line of content that extends beyond the container width.</p>
              ))}
            </div>
          </ScrollArea>
        </Playground>
      </Section>
      <Section id="props"><PropsTable rows={[
        { prop: "orientation", type: '"vertical" | "horizontal" | "both"', default: '"vertical"', description: "Scroll axis — vertical, horizontal, or both." },
        { prop: "maxHeight",   type: "string",                                                    description: "CSS max-height applied to the scroll container (e.g. \"200px\")." },
        { prop: "maxWidth",    type: "string",                                                    description: "CSS max-width applied to the scroll container (e.g. \"400px\")." },
        { prop: "children",    type: "ReactNode",                          required: true,        description: "Scrollable content." },
        { prop: "className",   type: "string",                                                    description: "Additional CSS classes on the wrapper." },
      ]} /></Section>
    </DocsLayout>
  )
}
