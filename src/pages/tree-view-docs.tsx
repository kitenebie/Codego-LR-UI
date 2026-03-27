import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { TreeView, type TreeNode } from "../components/ui/tree-view"
import { FileText, Image, Settings } from "lucide-react"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",      label: "Basic" },
  { id: "icons",      label: "Custom Icons" },
  { id: "select",     label: "Selection" },
  { id: "multi",      label: "Multi-select" },
  { id: "props",      label: "Props" },
  { id: "dataformat", label: "Data Format" },
]

const FILE_TREE: TreeNode[] = [
  {
    id: "src", label: "src",
    children: [
      {
        id: "components", label: "components",
        children: [
          { id: "button", label: "button.tsx" },
          { id: "card", label: "card.tsx" },
          { id: "input", label: "input.tsx" },
        ],
      },
      {
        id: "pages", label: "pages",
        children: [
          { id: "home", label: "home.tsx" },
          { id: "about", label: "about.tsx" },
        ],
      },
      { id: "app", label: "App.tsx" },
      { id: "main", label: "main.tsx" },
    ],
  },
  {
    id: "public", label: "public",
    children: [
      { id: "favicon", label: "favicon.ico" },
      { id: "logo", label: "logo.png" },
    ],
  },
  { id: "pkg", label: "package.json" },
  { id: "tsconfig", label: "tsconfig.json" },
]

const ICON_TREE: TreeNode[] = [
  {
    id: "docs", label: "Documents",
    children: [
      { id: "report", label: "Annual Report.pdf", icon: <FileText className="h-4 w-4 text-info" /> },
      { id: "budget", label: "Budget 2024.xlsx", icon: <FileText className="h-4 w-4 text-success" /> },
    ],
  },
  {
    id: "images", label: "Images",
    children: [
      { id: "logo", label: "logo.png", icon: <Image className="h-4 w-4 text-warning" /> },
      { id: "banner", label: "banner.jpg", icon: <Image className="h-4 w-4 text-warning" /> },
    ],
  },
  { id: "config", label: "config.json", icon: <Settings className="h-4 w-4 text-muted-foreground" /> },
]

export function TreeViewDocs() {
  const [selected, setSelected] = useState("")
  const [multiSelected, setMultiSelected] = useState<string[]>([])

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Tree View" description="Collapsible nested tree with folder/file icons."
          code={`<TreeView nodes={nodes} />`}>
          <div className="w-64 rounded-xl border border-border p-2">
            <TreeView nodes={FILE_TREE} defaultExpanded={["src", "components"]} />
          </div>
        </Playground>
      </Section>
      <Section id="icons">
        <Playground title="Custom Icons" description="Override default icons per node."
          code={`{ id: "report", label: "Report.pdf", icon: <FileText className="h-4 w-4" /> }`}>
          <div className="w-64 rounded-xl border border-border p-2">
            <TreeView nodes={ICON_TREE} defaultExpanded={["docs", "images"]} />
          </div>
        </Playground>
      </Section>
      <Section id="select">
        <Playground title="Selection" description="Click a node to select it."
          code={`<TreeView nodes={nodes} selected={selected} onSelect={setSelected} />`}>
          <div className="flex gap-4 items-start">
            <div className="w-64 rounded-xl border border-border p-2">
              <TreeView nodes={FILE_TREE} defaultExpanded={["src"]} selected={selected} onSelect={(v) => setSelected(v as string)} />
            </div>
            <p className="text-sm text-muted-foreground">Selected: <span className="font-mono text-foreground">{selected || "none"}</span></p>
          </div>
        </Playground>
      </Section>
      <Section id="multi">
        <Playground title="Multi-select" description="Set multiple to allow selecting multiple nodes."
          code={`<TreeView multiple nodes={nodes} selected={selected} onSelect={setSelected} />`}>
          <div className="flex gap-4 items-start">
            <div className="w-64 rounded-xl border border-border p-2">
              <TreeView multiple nodes={FILE_TREE} defaultExpanded={["src", "components"]} selected={multiSelected} onSelect={(v) => setMultiSelected(v as string[])} />
            </div>
            <p className="text-sm text-muted-foreground">Selected: {multiSelected.length > 0 ? multiSelected.join(", ") : "none"}</p>
          </div>
        </Playground>
      </Section>
      <Section id="props"><PropsTable rows={[
        { prop: "nodes",           type: "TreeNode[]",                    required: true, description: "Root-level tree nodes." },
        { prop: "selected",        type: "string | string[]",                             description: "Controlled selected node id(s)." },
        { prop: "onSelect",        type: "(value: string | string[]) => void",            description: "Fired when a node is clicked." },
        { prop: "multiple",        type: "boolean",                       default: "false", description: "Allow selecting multiple nodes." },
        { prop: "defaultExpanded", type: "string[]",                                      description: "Node ids that are expanded by default." },
        { prop: "className",       type: "string",                                        description: "Additional CSS classes on the wrapper." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "TreeNode.id",       type: "string",      required: true, description: "Unique identifier for the node." },
        { prop: "TreeNode.label",    type: "ReactNode",   required: true, description: "Display label for the node." },
        { prop: "TreeNode.icon",     type: "ReactNode",                   description: "Custom icon overriding the default folder/file icon." },
        { prop: "TreeNode.children", type: "TreeNode[]",                  description: "Child nodes — presence makes this node a folder (expandable)." },
        { prop: "TreeNode.disabled", type: "boolean",                     description: "Prevent selection of this node." },
      ]} /></Section>
    </DocsLayout>
  )
}
