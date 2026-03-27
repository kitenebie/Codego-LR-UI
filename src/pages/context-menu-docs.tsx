import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { ContextMenu } from "../components/ui/context-menu"
import { PropsTable } from "../components/ui/props-table"
import { Copy, Trash2, Edit, Share, Download, Star, FolderOpen } from "lucide-react"
import { useToast } from "../components/ui/notification"

const TOC = [
  { id: "basic",    label: "Basic" },
  { id: "icons",    label: "With Icons" },
  { id: "danger",   label: "Danger Items" },
  { id: "submenu",  label: "Sub-menu" },
  { id: "props",    label: "Props" },
  { id: "dataformat", label: "Item Format" },
]

export function ContextMenuDocs() {
  const { toast } = useToast()

  const basicItems = [
    { label: "Open", onClick: () => toast({ title: "Open", variant: "default", duration: 2000 }) },
    { label: "Copy", onClick: () => toast({ title: "Copied!", variant: "success", duration: 2000 }) },
    { separator: true },
    { label: "Delete", onClick: () => toast({ title: "Deleted", variant: "error", duration: 2000 }) },
  ]

  const iconItems = [
    { label: "Open folder", icon: <FolderOpen className="h-3.5 w-3.5" />, onClick: () => {} },
    { label: "Edit", icon: <Edit className="h-3.5 w-3.5" />, onClick: () => {} },
    { label: "Copy", icon: <Copy className="h-3.5 w-3.5" />, onClick: () => {} },
    { label: "Download", icon: <Download className="h-3.5 w-3.5" />, onClick: () => {} },
    { separator: true },
    { label: "Share", icon: <Share className="h-3.5 w-3.5" />, onClick: () => {} },
    { label: "Favourite", icon: <Star className="h-3.5 w-3.5" />, onClick: () => {} },
    { separator: true },
    { label: "Delete", icon: <Trash2 className="h-3.5 w-3.5" />, danger: true, onClick: () => {} },
  ]

  const subItems = [
    { label: "Open", icon: <FolderOpen className="h-3.5 w-3.5" />, onClick: () => {} },
    {
      label: "Share",
      icon: <Share className="h-3.5 w-3.5" />,
      children: [
        { label: "Copy link", onClick: () => {} },
        { label: "Email", onClick: () => {} },
        { label: "Slack", onClick: () => {} },
      ],
    },
    { separator: true },
    { label: "Delete", icon: <Trash2 className="h-3.5 w-3.5" />, danger: true, onClick: () => {} },
  ]

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Context Menu" description="Right-click the target area to open the menu."
          code={`<ContextMenu items={items}>\n  <div>Right-click me</div>\n</ContextMenu>`}>
          <ContextMenu items={basicItems}>
            <div className="flex h-32 w-full max-w-sm items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground select-none cursor-context-menu hover:bg-accent/30 transition-colors">
              Right-click here
            </div>
          </ContextMenu>
        </Playground>
      </Section>
      <Section id="icons">
        <Playground title="Context Menu with Icons" description="Add icons and separators to menu items."
          code={`{ label: "Edit", icon: <Edit className="h-3.5 w-3.5" />, onClick: () => {} }`}>
          <ContextMenu items={iconItems}>
            <div className="flex h-32 w-full max-w-sm items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground select-none cursor-context-menu hover:bg-accent/30 transition-colors">
              Right-click for file menu
            </div>
          </ContextMenu>
        </Playground>
      </Section>
      <Section id="danger">
        <Playground title="Danger Items" description="Set danger: true to style an item in red."
          code={`{ label: "Delete", danger: true, onClick: () => {} }`}>
          <ContextMenu items={[
            { label: "Rename", icon: <Edit className="h-3.5 w-3.5" />, onClick: () => {} },
            { separator: true },
            { label: "Move to trash", icon: <Trash2 className="h-3.5 w-3.5" />, danger: true, onClick: () => toast({ title: "Moved to trash", variant: "error", duration: 2000 }) },
          ]}>
            <div className="flex h-24 w-full max-w-sm items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground select-none cursor-context-menu hover:bg-accent/30 transition-colors">
              Right-click for danger menu
            </div>
          </ContextMenu>
        </Playground>
      </Section>
      <Section id="submenu">
        <Playground title="Sub-menu" description="Nest children to create sub-menus on hover."
          code={`{ label: "Share", children: [{ label: "Copy link" }, { label: "Email" }] }`}>
          <ContextMenu items={subItems}>
            <div className="flex h-32 w-full max-w-sm items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground select-none cursor-context-menu hover:bg-accent/30 transition-colors">
              Right-click for sub-menu
            </div>
          </ContextMenu>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "items",     type: "ContextMenuItem[]", required: true, description: "Array of menu item definitions." },
        { prop: "children",  type: "ReactNode",         required: true, description: "The target element that receives the right-click event." },
        { prop: "className", type: "string",                            description: "Additional CSS classes on the wrapper." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "label",     type: "ReactNode",          description: "Display text for the menu item." },
        { prop: "icon",      type: "ReactNode",          description: "Icon shown before the label." },
        { prop: "shortcut",  type: "string",             description: "Keyboard shortcut hint shown on the right." },
        { prop: "onClick",   type: "() => void",         description: "Handler called when the item is clicked." },
        { prop: "disabled",  type: "boolean",            description: "Prevent interaction with this item." },
        { prop: "danger",    type: "boolean",            description: "Style the item in red for destructive actions." },
        { prop: "separator", type: "boolean",            description: "Render a horizontal divider instead of an item." },
        { prop: "children",  type: "ContextMenuItem[]",  description: "Nested items that open as a sub-menu on hover." },
      ]} /></Section>
    </DocsLayout>
  )
}
