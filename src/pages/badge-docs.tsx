import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Badge } from "../components/ui/badge"
import { PropsTable } from "../components/ui/props-table"
import { Star, Zap, Bell } from "lucide-react"

const TOC = [
  { id: "variants",  label: "Variants" },
  { id: "sizes",     label: "Sizes" },
  { id: "dot",       label: "With Dot" },
  { id: "icon",      label: "With Icon" },
  { id: "rounded",   label: "Rounded" },
  { id: "removable", label: "Removable" },
  { id: "props",     label: "Props" },
]

export function BadgeDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="variants">
        <Playground title="Badge Variants" description="Seven variants: default, success, error, warning, info, outline, ghost."
          code={`<Badge variant="default">Default</Badge>\n<Badge variant="success">Success</Badge>\n<Badge variant="error">Error</Badge>\n<Badge variant="warning">Warning</Badge>\n<Badge variant="info">Info</Badge>\n<Badge variant="outline">Outline</Badge>\n<Badge variant="ghost">Ghost</Badge>`}>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ghost">Ghost</Badge>
          </div>
        </Playground>
      </Section>
      <Section id="sizes">
        <Playground title="Badge Sizes" description="Three sizes: sm, md, lg."
          code={`<Badge size="sm">Small</Badge>\n<Badge size="md">Medium</Badge>\n<Badge size="lg">Large</Badge>`}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </Playground>
      </Section>
      <Section id="dot">
        <Playground title="Badge with Dot" description="Add a colored status dot before the label."
          code={`<Badge variant="success" dot>Online</Badge>\n<Badge variant="error" dot>Offline</Badge>\n<Badge variant="warning" dot>Away</Badge>`}>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success" dot>Online</Badge>
            <Badge variant="error" dot>Offline</Badge>
            <Badge variant="warning" dot>Away</Badge>
            <Badge variant="info" dot>Busy</Badge>
          </div>
        </Playground>
      </Section>
      <Section id="icon">
        <Playground title="Badge with Icon" description="Pass any React node as icon."
          code={`<Badge variant="warning" icon={<Star className="h-3 w-3" />}>Featured</Badge>`}>
          <div className="flex flex-wrap gap-2">
            <Badge variant="warning" icon={<Star className="h-3 w-3" />}>Featured</Badge>
            <Badge variant="info" icon={<Zap className="h-3 w-3" />}>New</Badge>
            <Badge variant="default" icon={<Bell className="h-3 w-3" />}>3 alerts</Badge>
          </div>
        </Playground>
      </Section>
      <Section id="rounded">
        <Playground title="Rounded Variants" description="rounded=full (default) or rounded=md for pill vs chip style."
          code={`<Badge rounded="full">Pill</Badge>\n<Badge rounded="md">Chip</Badge>`}>
          <div className="flex flex-wrap gap-2">
            <Badge rounded="full">Pill</Badge>
            <Badge rounded="md">Chip</Badge>
            <Badge variant="success" rounded="md">Chip Success</Badge>
            <Badge variant="info" rounded="full">Pill Info</Badge>
          </div>
        </Playground>
      </Section>
      <Section id="removable">
        <Playground title="Removable Badge" description="Set removable and onRemove to show an X button."
          code={`<Badge removable onRemove={() => console.log('removed')}>React</Badge>`}>
          <div className="flex flex-wrap gap-2">
            <Badge removable onRemove={() => {}}>React</Badge>
            <Badge variant="info" removable onRemove={() => {}}>TypeScript</Badge>
            <Badge variant="success" removable onRemove={() => {}}>Tailwind</Badge>
          </div>
        </Playground>
      </Section>
      <Section id="props"><PropsTable rows={[
        { prop: "variant",   type: '"default" | "success" | "error" | "warning" | "info" | "outline" | "ghost"', default: '"default"', description: "Color scheme of the badge." },
        { prop: "size",      type: '"sm" | "md" | "lg"',  default: '"md"',   description: "Size of the badge." },
        { prop: "dot",       type: "boolean",              default: "false",  description: "Show a colored status dot before the label." },
        { prop: "rounded",   type: '"md" | "full"',        default: '"full"', description: "Border radius — pill or chip style." },
        { prop: "icon",      type: "ReactNode",                               description: "Icon shown before the label." },
        { prop: "removable", type: "boolean",              default: "false",  description: "Show an × remove button." },
        { prop: "onRemove",  type: "() => void",                              description: "Callback fired when the × button is clicked." },
        { prop: "className", type: "string",                                  description: "Additional CSS classes." },
      ]} /></Section>
    </DocsLayout>
  )
}
