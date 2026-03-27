import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { GridLayout, GridItem } from "../components/ui/grid-layout"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",       label: "Basic Grid" },
  { id: "responsive",  label: "Responsive Cols" },
  { id: "gaps",        label: "Gap Sizes" },
  { id: "span",        label: "Column Span" },
  { id: "rowspan",     label: "Row Span" },
  { id: "alignment",   label: "Alignment" },
  { id: "asymmetric",  label: "Asymmetric Layout" },
  { id: "dashboard",   label: "Dashboard Layout" },
  { id: "props",       label: "Props" },
]

function Box({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-xl border border-border bg-primary/10 text-primary text-sm font-medium p-4 ${className}`}>
      {label}
    </div>
  )
}

export function GridLayoutDocs() {
  return (
    <DocsLayout toc={TOC}>

      <Section id="basic">
        <Playground
          title="Basic Grid"
          description="Equal-width columns using the cols prop."
          code={`<GridLayout cols={3} gap="md">
  <Box label="1" />
  <Box label="2" />
  <Box label="3" />
</GridLayout>`}
        >
          <div className="w-full space-y-4">
            <GridLayout cols={2} gap="md">
              {["1","2"].map(n => <Box key={n} label={`Col ${n}`} />)}
            </GridLayout>
            <GridLayout cols={3} gap="md">
              {["1","2","3"].map(n => <Box key={n} label={`Col ${n}`} />)}
            </GridLayout>
            <GridLayout cols={4} gap="md">
              {["1","2","3","4"].map(n => <Box key={n} label={`Col ${n}`} />)}
            </GridLayout>
          </div>
        </Playground>
      </Section>

      <Section id="responsive">
        <Playground
          title="Responsive Columns"
          description="Different column counts at sm, md, and lg breakpoints."
          code={`<GridLayout cols={1} smCols={2} mdCols={3} lgCols={4} gap="md">
  {items.map(i => <Box key={i} label={i} />)}
</GridLayout>`}
        >
          <div className="w-full">
            <GridLayout cols={1} smCols={2} mdCols={3} lgCols={4} gap="md">
              {["A","B","C","D","E","F","G","H"].map(n => <Box key={n} label={n} />)}
            </GridLayout>
          </div>
        </Playground>
      </Section>

      <Section id="gaps">
        <Playground
          title="Gap Sizes"
          description="none, xs, sm, md, lg, xl gap options."
          code={`<GridLayout cols={4} gap="xs">...</GridLayout>
<GridLayout cols={4} gap="md">...</GridLayout>
<GridLayout cols={4} gap="xl">...</GridLayout>`}
        >
          <div className="w-full space-y-6">
            {(["xs","sm","md","lg","xl"] as const).map(g => (
              <div key={g}>
                <p className="text-xs text-muted-foreground mb-2">gap="{g}"</p>
                <GridLayout cols={4} gap={g}>
                  {["1","2","3","4"].map(n => <Box key={n} label={n} />)}
                </GridLayout>
              </div>
            ))}
          </div>
        </Playground>
      </Section>

      <Section id="span">
        <Playground
          title="Column Span"
          description="GridItem span prop lets items span multiple columns."
          code={`<GridLayout cols={6} gap="md">
  <GridItem span={4}><Box label="span 4" /></GridItem>
  <GridItem span={2}><Box label="span 2" /></GridItem>
  <GridItem span={3}><Box label="span 3" /></GridItem>
  <GridItem span={3}><Box label="span 3" /></GridItem>
  <GridItem span="full"><Box label="full width" /></GridItem>
</GridLayout>`}
        >
          <div className="w-full">
            <GridLayout cols={6} gap="md">
              <GridItem span={4}><Box label="span 4" /></GridItem>
              <GridItem span={2}><Box label="span 2" /></GridItem>
              <GridItem span={3}><Box label="span 3" /></GridItem>
              <GridItem span={3}><Box label="span 3" /></GridItem>
              <GridItem span={2}><Box label="span 2" /></GridItem>
              <GridItem span={2}><Box label="span 2" /></GridItem>
              <GridItem span={2}><Box label="span 2" /></GridItem>
              <GridItem span="full"><Box label="full width" /></GridItem>
            </GridLayout>
          </div>
        </Playground>
      </Section>

      <Section id="rowspan">
        <Playground
          title="Row Span"
          description="GridItem rowSpan prop stretches items across multiple rows."
          code={`<GridLayout cols={3} gap="md">
  <GridItem rowSpan={2}><Box label="row span 2" /></GridItem>
  <Box label="1" />
  <Box label="2" />
  <Box label="3" />
  <Box label="4" />
</GridLayout>`}
        >
          <div className="w-full">
            <GridLayout cols={3} gap="md">
              <GridItem rowSpan={2}><Box label="row span 2" className="h-full" /></GridItem>
              <Box label="Top Right 1" />
              <Box label="Top Right 2" />
              <Box label="Bottom Right 1" />
              <Box label="Bottom Right 2" />
            </GridLayout>
          </div>
        </Playground>
      </Section>

      <Section id="alignment">
        <Playground
          title="Alignment"
          description="Control vertical alignment of grid items with the align prop."
          code={`<GridLayout cols={3} gap="md" align="center">...</GridLayout>`}
        >
          <div className="w-full space-y-6">
            {(["start","center","end","stretch"] as const).map(a => (
              <div key={a}>
                <p className="text-xs text-muted-foreground mb-2">align="{a}"</p>
                <GridLayout cols={3} gap="md" align={a}>
                  <Box label="Short" />
                  <div className="flex items-center justify-center rounded-xl border border-border bg-info/10 text-info text-sm font-medium p-8">Tall</div>
                  <Box label="Short" />
                </GridLayout>
              </div>
            ))}
          </div>
        </Playground>
      </Section>

      <Section id="asymmetric">
        <Playground
          title="Asymmetric Layout"
          description="Mix spans to create sidebar + main content layouts."
          code={`<GridLayout cols={12} gap="md">
  <GridItem span={3}><Sidebar /></GridItem>
  <GridItem span={9}><Main /></GridItem>
</GridLayout>`}
        >
          <div className="w-full">
            <GridLayout cols={12} gap="md">
              <GridItem span={3}>
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground h-32 flex items-center justify-center">Sidebar (3)</div>
              </GridItem>
              <GridItem span={9}>
                <div className="rounded-xl border border-border bg-primary/5 p-4 text-sm text-primary h-32 flex items-center justify-center">Main Content (9)</div>
              </GridItem>
            </GridLayout>
          </div>
        </Playground>
      </Section>

      <Section id="dashboard">
        <Playground
          title="Dashboard Layout"
          description="A realistic dashboard grid combining spans and rows."
          code={`<GridLayout cols={12} gap="md">
  <GridItem span={3}><StatCard /></GridItem>
  <GridItem span={3}><StatCard /></GridItem>
  <GridItem span={3}><StatCard /></GridItem>
  <GridItem span={3}><StatCard /></GridItem>
  <GridItem span={8}><ChartCard /></GridItem>
  <GridItem span={4}><SideCard /></GridItem>
  <GridItem span="full"><TableCard /></GridItem>
</GridLayout>`}
        >
          <div className="w-full">
            <GridLayout cols={12} gap="md">
              {["Users","Revenue","Orders","Growth"].map(l => (
                <GridItem key={l} span={3}>
                  <div className="rounded-xl border border-border bg-primary/10 text-primary text-sm font-medium p-4 text-center">{l}</div>
                </GridItem>
              ))}
              <GridItem span={8}>
                <div className="rounded-xl border border-border bg-info/10 text-info text-sm font-medium p-8 text-center h-32 flex items-center justify-center">Chart (8 cols)</div>
              </GridItem>
              <GridItem span={4}>
                <div className="rounded-xl border border-border bg-success/10 text-success text-sm font-medium p-4 text-center h-32 flex items-center justify-center">Side Panel (4)</div>
              </GridItem>
              <GridItem span="full">
                <div className="rounded-xl border border-border bg-muted/30 text-muted-foreground text-sm font-medium p-4 text-center">Full-width Table</div>
              </GridItem>
            </GridLayout>
          </div>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "cols",     type: "1 | 2 | 3 | 4 | 5 | 6 | 12",                                  default: "3",        description: "Number of columns." },
        { prop: "smCols",   type: "1 | 2 | 3 | 4 | 5 | 6 | 12",                                               description: "Column count at sm breakpoint." },
        { prop: "mdCols",   type: "1 | 2 | 3 | 4 | 5 | 6 | 12",                                               description: "Column count at md breakpoint." },
        { prop: "lgCols",   type: "1 | 2 | 3 | 4 | 5 | 6 | 12",                                               description: "Column count at lg breakpoint." },
        { prop: "gap",      type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"',                  default: '"md"',     description: "Gap between all cells." },
        { prop: "rowGap",   type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"',                               description: "Row gap (overrides gap for rows)." },
        { prop: "colGap",   type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"',                               description: "Column gap (overrides gap for columns)." },
        { prop: "align",    type: '"start" | "center" | "end" | "stretch"',                     default: '"stretch"', description: "Vertical alignment of grid items." },
        { prop: "justify",  type: '"start" | "center" | "end" | "stretch"',                     default: '"stretch"', description: "Horizontal alignment of grid items." },
        { prop: "children", type: "ReactNode",                                  required: true,               description: "Grid cells." },
        { prop: "className",type: "string",                                                                    description: "Additional CSS classes." },
      ]} />
      <PropsTable rows={[
        { prop: "GridItem.span",    type: "1 | 2 | 3 | 4 | 5 | 6 | 12 | \"full\"",  description: "Number of columns this item spans." },
        { prop: "GridItem.rowSpan", type: "1 | 2 | 3",                              description: "Number of rows this item spans." },
        { prop: "GridItem.children",type: "ReactNode",              required: true, description: "Cell content." },
        { prop: "GridItem.className",type: "string",                               description: "Additional CSS classes." },
      ]} /></Section>

    </DocsLayout>
  )
}
