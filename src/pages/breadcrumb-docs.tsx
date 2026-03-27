import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Breadcrumb } from "../components/ui/breadcrumb"
import { PropsTable } from "../components/ui/props-table"
import { Home, Folder, File, ChevronRight, Slash } from "lucide-react"

const TOC = [
  { id: "basic",     label: "Basic" },
  { id: "icons",     label: "With Icons" },
  { id: "separator", label: "Custom Separator" },
  { id: "collapse",  label: "Collapsed" },
  { id: "props",     label: "Props" },
  { id: "dataformat",label: "Item Format" },
]

export function BreadcrumbDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Basic Breadcrumb" description="Simple path trail with links."
          code={`<Breadcrumb items={[\n  { label: "Home", href: "/" },\n  { label: "Projects", href: "/projects" },\n  { label: "Dashboard" },\n]} />`}>
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: "Dashboard" },
          ]} />
        </Playground>
      </Section>
      <Section id="icons">
        <Playground title="Breadcrumb with Icons" description="Add icons to each item."
          code={`<Breadcrumb items={[\n  { label: "Home", icon: <Home className="h-3.5 w-3.5" /> },\n  { label: "Documents", icon: <Folder className="h-3.5 w-3.5" /> },\n  { label: "report.pdf", icon: <File className="h-3.5 w-3.5" /> },\n]} />`}>
          <Breadcrumb items={[
            { label: "Home", href: "/", icon: <Home className="h-3.5 w-3.5" /> },
            { label: "Documents", href: "/docs", icon: <Folder className="h-3.5 w-3.5" /> },
            { label: "report.pdf", icon: <File className="h-3.5 w-3.5" /> },
          ]} />
        </Playground>
      </Section>
      <Section id="separator">
        <Playground title="Custom Separator" description="Use any React node as separator."
          code={`<Breadcrumb separator={<Slash className="h-3 w-3" />} items={[...]} />`}>
          <div className="space-y-3">
            <Breadcrumb
              separator={<Slash className="h-3 w-3 text-muted-foreground/60" />}
              items={[{ label: "Home", href: "/" }, { label: "Settings", href: "/settings" }, { label: "Profile" }]}
            />
            <Breadcrumb
              separator={<span className="text-muted-foreground/60 text-xs">/</span>}
              items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Post Title" }]}
            />
          </div>
        </Playground>
      </Section>
      <Section id="collapse">
        <Playground title="Collapsed Breadcrumb" description="Long paths collapse with maxItems. Click ... to expand."
          code={`<Breadcrumb maxItems={3} items={[...6 items...]} />`}>
          <Breadcrumb
            maxItems={3}
            items={[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/projects" },
              { label: "Frontend", href: "/projects/frontend" },
              { label: "Components", href: "/projects/frontend/components" },
              { label: "UI Kit", href: "/projects/frontend/components/ui" },
              { label: "Badge" },
            ]}
          />
        </Playground>
      </Section>
      <Section id="props"><PropsTable rows={[
        { prop: "items",     type: "BreadcrumbItem[]", required: true, description: "Ordered list of breadcrumb items." },
        { prop: "separator", type: "ReactNode", default: "<ChevronRight />", description: "Custom separator rendered between items." },
        { prop: "maxItems",  type: "number",                                  description: "Collapse to ellipsis when item count exceeds this value." },
        { prop: "className", type: "string",                                  description: "Additional CSS classes on the nav element." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "label",   type: "ReactNode", required: true, description: "Display text or node for the breadcrumb item." },
        { prop: "href",    type: "string",                    description: "URL — renders the item as an anchor tag." },
        { prop: "icon",    type: "ReactNode",                 description: "Icon shown before the label." },
        { prop: "onClick", type: "() => void",                description: "Click handler (used for the ellipsis expand button)." },
      ]} /></Section>
    </DocsLayout>
  )
}
