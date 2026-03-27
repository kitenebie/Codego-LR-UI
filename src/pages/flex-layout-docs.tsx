import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { FlexLayout, FlexItem } from "../components/ui/flex-layout"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "direction",  label: "Direction" },
  { id: "justify",    label: "Justify Content" },
  { id: "align",      label: "Align Items" },
  { id: "wrap",       label: "Wrap" },
  { id: "gaps",       label: "Gap Sizes" },
  { id: "grow",       label: "Grow & Shrink" },
  { id: "basis",      label: "Flex Basis" },
  { id: "order",      label: "Order" },
  { id: "selfAlign",  label: "Align Self" },
  { id: "navbar",     label: "Navbar Pattern" },
  { id: "card",       label: "Card Pattern" },
  { id: "props",      label: "Props" },
]

function Box({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-xl border border-border bg-primary/10 text-primary text-sm font-medium px-4 py-3 ${className}`}>
      {label}
    </div>
  )
}

export function FlexLayoutDocs() {
  return (
    <DocsLayout toc={TOC}>

      <Section id="direction">
        <Playground
          title="Direction"
          description="row (default), row-reverse, col, col-reverse."
          code={`<FlexLayout direction="row" gap="md">...</FlexLayout>
<FlexLayout direction="col" gap="md">...</FlexLayout>`}
        >
          <div className="w-full space-y-6">
            {(["row","row-reverse","col","col-reverse"] as const).map(d => (
              <div key={d}>
                <p className="text-xs text-muted-foreground mb-2">direction="{d}"</p>
                <FlexLayout direction={d} gap="sm">
                  {["A","B","C"].map(n => <Box key={n} label={n} />)}
                </FlexLayout>
              </div>
            ))}
          </div>
        </Playground>
      </Section>

      <Section id="justify">
        <Playground
          title="Justify Content"
          description="start, center, end, between, around, evenly."
          code={`<FlexLayout justify="between" gap="md">...</FlexLayout>`}
        >
          <div className="w-full space-y-4">
            {(["start","center","end","between","around","evenly"] as const).map(j => (
              <div key={j}>
                <p className="text-xs text-muted-foreground mb-1">justify="{j}"</p>
                <FlexLayout justify={j} gap="sm" className="w-full border border-border rounded-xl p-2">
                  {["1","2","3"].map(n => <Box key={n} label={n} />)}
                </FlexLayout>
              </div>
            ))}
          </div>
        </Playground>
      </Section>

      <Section id="align">
        <Playground
          title="Align Items"
          description="start, center, end, stretch, baseline."
          code={`<FlexLayout align="center" gap="md">...</FlexLayout>`}
        >
          <div className="w-full space-y-4">
            {(["start","center","end","stretch","baseline"] as const).map(a => (
              <div key={a}>
                <p className="text-xs text-muted-foreground mb-1">align="{a}"</p>
                <FlexLayout align={a} gap="sm" className="w-full border border-border rounded-xl p-2 h-20">
                  <Box label="Short" />
                  <div className="flex items-center justify-center rounded-xl border border-border bg-info/10 text-info text-sm font-medium px-4 py-6">Tall</div>
                  <Box label="Short" />
                </FlexLayout>
              </div>
            ))}
          </div>
        </Playground>
      </Section>

      <Section id="wrap">
        <Playground
          title="Wrap"
          description="nowrap (default), wrap, wrap-reverse."
          code={`<FlexLayout wrap="wrap" gap="sm">
  {manyItems.map(i => <Box key={i} label={i} />)}
</FlexLayout>`}
        >
          <div className="w-full space-y-6">
            {(["nowrap","wrap","wrap-reverse"] as const).map(w => (
              <div key={w}>
                <p className="text-xs text-muted-foreground mb-2">wrap="{w}"</p>
                <FlexLayout wrap={w} gap="sm" className="border border-border rounded-xl p-2">
                  {["Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta"].map(n => <Box key={n} label={n} />)}
                </FlexLayout>
              </div>
            ))}
          </div>
        </Playground>
      </Section>

      <Section id="gaps">
        <Playground
          title="Gap Sizes"
          description="none, xs, sm, md, lg, xl."
          code={`<FlexLayout gap="lg">...</FlexLayout>`}
        >
          <div className="w-full space-y-4">
            {(["none","xs","sm","md","lg","xl"] as const).map(g => (
              <div key={g}>
                <p className="text-xs text-muted-foreground mb-1">gap="{g}"</p>
                <FlexLayout gap={g}>
                  {["1","2","3","4"].map(n => <Box key={n} label={n} />)}
                </FlexLayout>
              </div>
            ))}
          </div>
        </Playground>
      </Section>

      <Section id="grow">
        <Playground
          title="Grow & Shrink"
          description="FlexItem grow makes an item fill remaining space."
          code={`<FlexLayout gap="md">
  <FlexItem><Box label="Fixed" /></FlexItem>
  <FlexItem grow><Box label="Grows" /></FlexItem>
  <FlexItem><Box label="Fixed" /></FlexItem>
</FlexLayout>`}
        >
          <div className="w-full">
            <FlexLayout gap="md" className="w-full">
              <FlexItem><Box label="Fixed" /></FlexItem>
              <FlexItem grow><Box label="Grows to fill" className="w-full" /></FlexItem>
              <FlexItem><Box label="Fixed" /></FlexItem>
            </FlexLayout>
          </div>
        </Playground>
      </Section>

      <Section id="basis">
        <Playground
          title="Flex Basis"
          description="Set an initial size with the basis prop."
          code={`<FlexLayout gap="md" wrap="wrap">
  <FlexItem basis="200px"><Box label="200px" /></FlexItem>
  <FlexItem basis="33%"><Box label="33%" /></FlexItem>
  <FlexItem grow><Box label="grow" /></FlexItem>
</FlexLayout>`}
        >
          <div className="w-full">
            <FlexLayout gap="md" wrap="wrap" className="w-full">
              <FlexItem basis="200px"><Box label="basis 200px" /></FlexItem>
              <FlexItem basis="33%"><Box label="basis 33%" /></FlexItem>
              <FlexItem grow><Box label="grow" className="w-full" /></FlexItem>
            </FlexLayout>
          </div>
        </Playground>
      </Section>

      <Section id="order">
        <Playground
          title="Order"
          description="Reorder items visually without changing the DOM."
          code={`<FlexLayout gap="md">
  <FlexItem order={3}><Box label="DOM 1 → visual 3" /></FlexItem>
  <FlexItem order={1}><Box label="DOM 2 → visual 1" /></FlexItem>
  <FlexItem order={2}><Box label="DOM 3 → visual 2" /></FlexItem>
</FlexLayout>`}
        >
          <div className="w-full">
            <FlexLayout gap="md">
              <FlexItem order={3}><Box label="DOM 1 → pos 3" /></FlexItem>
              <FlexItem order={1}><Box label="DOM 2 → pos 1" /></FlexItem>
              <FlexItem order={2}><Box label="DOM 3 → pos 2" /></FlexItem>
            </FlexLayout>
          </div>
        </Playground>
      </Section>

      <Section id="selfAlign">
        <Playground
          title="Align Self"
          description="Override the parent's align for individual items."
          code={`<FlexLayout align="stretch" gap="md" className="h-24">
  <FlexItem alignSelf="start"><Box label="start" /></FlexItem>
  <FlexItem alignSelf="center"><Box label="center" /></FlexItem>
  <FlexItem alignSelf="end"><Box label="end" /></FlexItem>
</FlexLayout>`}
        >
          <div className="w-full">
            <FlexLayout align="stretch" gap="md" className="h-24 border border-border rounded-xl p-2">
              <FlexItem alignSelf="start"><Box label="start" /></FlexItem>
              <FlexItem alignSelf="center"><Box label="center" /></FlexItem>
              <FlexItem alignSelf="end"><Box label="end" /></FlexItem>
              <FlexItem alignSelf="stretch"><Box label="stretch" className="h-full" /></FlexItem>
            </FlexLayout>
          </div>
        </Playground>
      </Section>

      <Section id="navbar">
        <Playground
          title="Navbar Pattern"
          description="Classic logo + nav + actions layout using FlexLayout."
          code={`<FlexLayout justify="between" align="center" className="px-4 py-3 border rounded-xl">
  <span>Logo</span>
  <FlexLayout gap="sm">
    <a>Home</a><a>Docs</a><a>Blog</a>
  </FlexLayout>
  <FlexLayout gap="sm">
    <Button variant="outline">Login</Button>
    <Button>Sign up</Button>
  </FlexLayout>
</FlexLayout>`}
        >
          <div className="w-full">
            <FlexLayout justify="between" align="center" className="w-full px-4 py-3 border border-border rounded-xl bg-card/50">
              <span className="font-bold text-primary">Logo</span>
              <FlexLayout gap="md">
                {["Home","Docs","Blog","Pricing"].map(l => (
                  <span key={l} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</span>
                ))}
              </FlexLayout>
              <FlexLayout gap="sm">
                <Box label="Login" className="py-1.5 text-xs" />
                <div className="flex items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-medium px-4 py-1.5">Sign up</div>
              </FlexLayout>
            </FlexLayout>
          </div>
        </Playground>
      </Section>

      <Section id="card">
        <Playground
          title="Card Pattern"
          description="Media + content layout using FlexLayout and FlexItem."
          code={`<FlexLayout gap="md" align="start">
  <FlexItem shrink={false}><img className="w-16 h-16 rounded-xl" /></FlexItem>
  <FlexItem grow>
    <h3>Title</h3>
    <p>Description</p>
  </FlexItem>
  <FlexItem shrink={false}><Button>Action</Button></FlexItem>
</FlexLayout>`}
        >
          <div className="w-full space-y-3">
            {[
              { name: "Alice Johnson", role: "Senior Engineer", img: "https://i.pravatar.cc/64?img=1" },
              { name: "Bob Martinez",  role: "Product Designer", img: "https://i.pravatar.cc/64?img=2" },
              { name: "Carol White",   role: "Data Analyst",     img: "https://i.pravatar.cc/64?img=3" },
            ].map(u => (
              <div key={u.name} className="rounded-xl border border-border bg-card/50 p-4">
                <FlexLayout gap="md" align="center">
                  <FlexItem shrink={false}>
                    <img src={u.img} alt={u.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-border" />
                  </FlexItem>
                  <FlexItem grow>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.role}</p>
                  </FlexItem>
                  <FlexItem shrink={false}>
                    <div className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">View</div>
                  </FlexItem>
                </FlexLayout>
              </div>
            ))}
          </div>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "direction", type: '"row" | "row-reverse" | "col" | "col-reverse"',                  default: '"row"',    description: "Flex direction." },
        { prop: "wrap",      type: '"nowrap" | "wrap" | "wrap-reverse"',                             default: '"nowrap"', description: "Flex wrap behaviour." },
        { prop: "gap",       type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"',                     default: '"md"',     description: "Gap between children." },
        { prop: "align",     type: '"start" | "center" | "end" | "stretch" | "baseline"',            default: '"start"',  description: "Cross-axis alignment (align-items)." },
        { prop: "justify",   type: '"start" | "center" | "end" | "between" | "around" | "evenly"',  default: '"start"',  description: "Main-axis alignment (justify-content)." },
        { prop: "inline",    type: "boolean",                                                        default: "false",    description: "Use inline-flex instead of flex." },
        { prop: "children",  type: "ReactNode",                                     required: true,               description: "Flex children." },
        { prop: "className", type: "string",                                                                         description: "Additional CSS classes." },
      ]} />
      <PropsTable rows={[
        { prop: "FlexItem.grow",      type: "boolean | number",                                    description: "flex-grow value. true = 1." },
        { prop: "FlexItem.shrink",    type: "boolean | number",                                    description: "flex-shrink value. false = 0." },
        { prop: "FlexItem.basis",     type: "string",                                              description: "flex-basis value e.g. \"200px\" or \"33%\"." },
        { prop: "FlexItem.order",     type: "number",                                              description: "Visual order override." },
        { prop: "FlexItem.alignSelf", type: '"start" | "center" | "end" | "stretch" | "baseline"', description: "Override parent align for this item." },
        { prop: "FlexItem.children",  type: "ReactNode",                          required: true,  description: "Item content." },
        { prop: "FlexItem.className", type: "string",                                              description: "Additional CSS classes." },
      ]} /></Section>

    </DocsLayout>
  )
}
