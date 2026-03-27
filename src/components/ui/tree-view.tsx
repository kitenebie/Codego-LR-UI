import * as React from "react"
import { ChevronRight, Folder, FolderOpen, File } from "lucide-react"
import { cn } from "@/src/lib/utils"

export interface TreeNode {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
  children?: TreeNode[]
  disabled?: boolean
}

export interface TreeViewProps {
  nodes: TreeNode[]
  selected?: string | string[]
  defaultSelected?: string | string[]
  onSelect?: (id: string | string[]) => void
  defaultExpanded?: string[]
  multiple?: boolean
  className?: string
}

interface NodeProps {
  node: TreeNode
  depth: number
  selected: string[]
  expanded: string[]
  onToggleExpand: (id: string) => void
  onSelect: (id: string) => void
  multiple: boolean
}

function TreeNodeItem({ node, depth, selected, expanded, onToggleExpand, onSelect, multiple }: NodeProps) {
  const hasChildren = !!node.children?.length
  const isExpanded = expanded.includes(node.id)
  const isSelected = selected.includes(node.id)

  const defaultIcon = hasChildren
    ? isExpanded ? <FolderOpen className="h-4 w-4 text-warning" /> : <Folder className="h-4 w-4 text-warning" />
    : <File className="h-4 w-4 text-muted-foreground" />

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm cursor-pointer transition-colors select-none",
          isSelected ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground",
          node.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) onToggleExpand(node.id)
          onSelect(node.id)
        }}
      >
        {hasChildren ? (
          <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <span className="shrink-0">{node.icon ?? defaultIcon}</span>
        <span className="truncate">{node.label}</span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              multiple={multiple}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TreeView({
  nodes,
  selected: controlled,
  defaultSelected,
  onSelect,
  defaultExpanded = [],
  multiple = false,
  className,
}: TreeViewProps) {
  const init = defaultSelected ? (Array.isArray(defaultSelected) ? defaultSelected : [defaultSelected]) : []
  const [internal, setInternal] = React.useState<string[]>(init)
  const [expanded, setExpanded] = React.useState<string[]>(defaultExpanded)

  const selected = controlled
    ? Array.isArray(controlled) ? controlled : [controlled]
    : internal

  function handleSelect(id: string) {
    let next: string[]
    if (multiple) {
      next = selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]
    } else {
      next = selected.includes(id) ? [] : [id]
    }
    if (!controlled) setInternal(next)
    onSelect?.(multiple ? next : next[0] ?? "")
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])
  }

  return (
    <div className={cn("w-full", className)}>
      {nodes.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          depth={0}
          selected={selected}
          expanded={expanded}
          onToggleExpand={toggleExpand}
          onSelect={handleSelect}
          multiple={multiple}
        />
      ))}
    </div>
  )
}
