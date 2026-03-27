import * as React from "react"
import { cn } from "@/src/lib/utils"
import {
  LayoutDashboard, Type, MousePointerClick, FormInput, ToggleLeft,
  CheckSquare, Table as TableIcon, Box, Image, AlignLeft, Minus,
  Square, Circle, ChevronLeft, ChevronRight, Eye, EyeOff, Trash2,
  GripVertical, Grid3x3, Move, RotateCcw,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface ComponentDef {
  id: string
  label: string
  icon: React.ElementType
  defaultW: number
  defaultH: number
  render: (props: CanvasItem) => React.ReactNode
}

interface CanvasItem {
  uid: string
  componentId: string
  label: string
  x: number
  y: number
  w: number
  h: number
  props: Record<string, string>
}

const CELL = 40 // grid cell size in px

// ─── Component Library ───────────────────────────────────────────────────────

const COMPONENTS: ComponentDef[] = [
  {
    id: "topbar", label: "Top Bar", icon: LayoutDashboard, defaultW: 12, defaultH: 2,
    render: () => (
      <div className="w-full h-full flex items-center px-4 bg-primary/20 border border-primary/30 rounded text-xs font-semibold text-primary">
        Top Bar
      </div>
    ),
  },
  {
    id: "sidebar", label: "Sidebar", icon: AlignLeft, defaultW: 3, defaultH: 8,
    render: () => (
      <div className="w-full h-full flex flex-col gap-1 p-2 bg-muted border border-border rounded text-xs text-muted-foreground">
        <div className="font-semibold text-foreground mb-1">Sidebar</div>
        {["Home", "Dashboard", "Settings"].map(i => (
          <div key={i} className="px-2 py-1 rounded hover:bg-primary/20 cursor-pointer">{i}</div>
        ))}
      </div>
    ),
  },
  {
    id: "button", label: "Button", icon: MousePointerClick, defaultW: 3, defaultH: 1,
    render: (item) => (
      <button className="w-full h-full bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary-hover transition-colors">
        {item.props.label || "Button"}
      </button>
    ),
  },
  {
    id: "input", label: "Input", icon: FormInput, defaultW: 4, defaultH: 1,
    render: (item) => (
      <input
        readOnly
        placeholder={item.props.placeholder || "Input field..."}
        className="w-full h-full px-3 bg-input border border-border rounded text-xs text-foreground placeholder:text-muted-foreground outline-none"
      />
    ),
  },
  {
    id: "card", label: "Card", icon: Box, defaultW: 4, defaultH: 4,
    render: (item) => (
      <div className="w-full h-full bg-card border border-border rounded-lg p-3 flex flex-col gap-1">
        <div className="text-xs font-semibold text-foreground">{item.props.title || "Card Title"}</div>
        <div className="text-xs text-muted-foreground flex-1">{item.props.description || "Card description goes here."}</div>
      </div>
    ),
  },
  {
    id: "text", label: "Text", icon: Type, defaultW: 4, defaultH: 1,
    render: (item) => (
      <div className="w-full h-full flex items-center text-xs text-foreground px-1">
        {item.props.content || "Text block"}
      </div>
    ),
  },
  {
    id: "image", label: "Image", icon: Image, defaultW: 4, defaultH: 3,
    render: () => (
      <div className="w-full h-full bg-muted border border-dashed border-border rounded flex items-center justify-center text-xs text-muted-foreground">
        <Image className="h-5 w-5 mr-1" /> Image
      </div>
    ),
  },
  {
    id: "divider", label: "Divider", icon: Minus, defaultW: 6, defaultH: 1,
    render: () => (
      <div className="w-full h-full flex items-center">
        <div className="w-full h-px bg-border" />
      </div>
    ),
  },
  {
    id: "checkbox", label: "Checkbox", icon: CheckSquare, defaultW: 3, defaultH: 1,
    render: (item) => (
      <label className="w-full h-full flex items-center gap-2 text-xs text-foreground cursor-pointer px-1">
        <input type="checkbox" readOnly className="accent-primary" />
        {item.props.label || "Checkbox"}
      </label>
    ),
  },
  {
    id: "toggle", label: "Toggle", icon: ToggleLeft, defaultW: 3, defaultH: 1,
    render: (item) => (
      <label className="w-full h-full flex items-center gap-2 text-xs text-foreground cursor-pointer px-1">
        <div className="w-8 h-4 bg-primary rounded-full relative">
          <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
        </div>
        {item.props.label || "Toggle"}
      </label>
    ),
  },
  {
    id: "table", label: "Table", icon: TableIcon, defaultW: 8, defaultH: 4,
    render: () => (
      <div className="w-full h-full overflow-hidden rounded border border-border text-xs">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>{["Name", "Status", "Date"].map(h => <th key={h} className="px-2 py-1 text-left text-muted-foreground font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {[["Alice", "Active", "2024-01"], ["Bob", "Idle", "2024-02"]].map((r, i) => (
              <tr key={i} className="border-t border-border">
                {r.map((c, j) => <td key={j} className="px-2 py-1 text-foreground">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "rect", label: "Rectangle", icon: Square, defaultW: 3, defaultH: 2,
    render: (item) => (
      <div
        className="w-full h-full rounded border border-border"
        style={{ backgroundColor: item.props.color || "var(--accent)" }}
      />
    ),
  },
  {
    id: "circle", label: "Circle", icon: Circle, defaultW: 2, defaultH: 2,
    render: (item) => (
      <div className="w-full h-full flex items-center justify-center">
        <div
          className="rounded-full border border-border"
          style={{
            width: "80%", height: "80%",
            backgroundColor: item.props.color || "var(--primary)",
            opacity: 0.7,
          }}
        />
      </div>
    ),
  },
]

const COMP_MAP = Object.fromEntries(COMPONENTS.map(c => [c.id, c]))

// ─── Prop definitions per component ──────────────────────────────────────────

const PROP_DEFS: Record<string, { key: string; label: string; placeholder?: string }[]> = {
  button:   [{ key: "label", label: "Label", placeholder: "Button" }],
  input:    [{ key: "placeholder", label: "Placeholder", placeholder: "Input field..." }],
  card:     [{ key: "title", label: "Title", placeholder: "Card Title" }, { key: "description", label: "Description", placeholder: "Description..." }],
  text:     [{ key: "content", label: "Content", placeholder: "Text block" }],
  checkbox: [{ key: "label", label: "Label", placeholder: "Checkbox" }],
  toggle:   [{ key: "label", label: "Label", placeholder: "Toggle" }],
  rect:     [{ key: "color", label: "Color", placeholder: "#6366f1" }],
  circle:   [{ key: "color", label: "Color", placeholder: "#8b5cf6" }],
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function snap(v: number) { return Math.round(v / CELL) * CELL }
function uid() { return Math.random().toString(36).slice(2, 9) }

// ─── Canvas Item Component ────────────────────────────────────────────────────

function CanvasItemEl({
  item, selected, onSelect, onMove, onDelete,
}: {
  item: CanvasItem
  selected: boolean
  onSelect: () => void
  onMove: (dx: number, dy: number) => void
  onDelete: () => void
}) {
  const def = COMP_MAP[item.componentId]
  const dragStart = React.useRef<{ mx: number; my: number } | null>(null)

  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation()
    onSelect()
    dragStart.current = { mx: e.clientX, my: e.clientY }

    function onMove(ev: MouseEvent) {
      if (!dragStart.current) return
      const dx = snap(ev.clientX - dragStart.current.mx)
      const dy = snap(ev.clientY - dragStart.current.my)
      if (dx !== 0 || dy !== 0) {
        dragStart.current = { mx: dragStart.current.mx + dx, my: dragStart.current.my + dy }
        onMove(dx, dy)  // eslint-disable-line
      }
    }
    function onUp() {
      dragStart.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        width: item.w * CELL,
        height: item.h * CELL,
        cursor: "move",
        zIndex: selected ? 10 : 1,
      }}
      className={cn(
        "group",
        selected && "ring-2 ring-primary ring-offset-1 ring-offset-background"
      )}
    >
      {def?.render(item)}
      {selected && (
        <button
          onMouseDown={e => { e.stopPropagation(); onDelete() }}
          className="absolute -top-3 -right-3 z-20 bg-danger text-danger-foreground rounded-full w-5 h-5 flex items-center justify-center shadow"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function UIBuilder() {
  const [leftOpen, setLeftOpen] = React.useState(true)
  const [rightOpen, setRightOpen] = React.useState(true)
  const [showGrid, setShowGrid] = React.useState(true)
  const [items, setItems] = React.useState<CanvasItem[]>([
    { uid: "default-topbar", componentId: "topbar", label: "Top Bar", x: 0, y: 0, w: 12, h: 2, props: {} },
    { uid: "default-sidebar", componentId: "sidebar", label: "Sidebar", x: 0, y: CELL * 2, w: 3, h: 8, props: {} },
  ])
  const [selected, setSelected] = React.useState<string | null>(null)
  const [preview, setPreview] = React.useState(false)
  const canvasRef = React.useRef<HTMLDivElement>(null)

  const selectedItem = items.find(i => i.uid === selected) ?? null

  // ── Drag from panel ──────────────────────────────────────────────────────
  function handlePanelDragStart(e: React.DragEvent, compId: string) {
    e.dataTransfer.setData("compId", compId)
  }

  function handleCanvasDrop(e: React.DragEvent) {
    e.preventDefault()
    const compId = e.dataTransfer.getData("compId")
    const def = COMP_MAP[compId]
    if (!def || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = snap(e.clientX - rect.left)
    const y = snap(e.clientY - rect.top)
    const newItem: CanvasItem = {
      uid: uid(), componentId: compId, label: def.label,
      x, y, w: def.defaultW, h: def.defaultH, props: {},
    }
    setItems(prev => [...prev, newItem])
    setSelected(newItem.uid)
  }

  // ── Move ─────────────────────────────────────────────────────────────────
  function moveItem(id: string, dx: number, dy: number) {
    setItems(prev => prev.map(i =>
      i.uid === id ? { ...i, x: Math.max(0, i.x + dx), y: Math.max(0, i.y + dy) } : i
    ))
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  function deleteItem(id: string) {
    setItems(prev => prev.filter(i => i.uid !== id))
    setSelected(null)
  }

  // ── Prop update ──────────────────────────────────────────────────────────
  function updateProp(key: string, value: string) {
    if (!selected) return
    setItems(prev => prev.map(i =>
      i.uid === selected ? { ...i, props: { ...i.props, [key]: value } } : i
    ))
  }

  function updateSize(key: "w" | "h", value: number) {
    if (!selected) return
    setItems(prev => prev.map(i =>
      i.uid === selected ? { ...i, [key]: Math.max(1, value) } : i
    ))
  }

  // ── Reset ────────────────────────────────────────────────────────────────
  function resetCanvas() {
    setItems([
      { uid: "default-topbar", componentId: "topbar", label: "Top Bar", x: 0, y: 0, w: 12, h: 2, props: {} },
      { uid: "default-sidebar", componentId: "sidebar", label: "Sidebar", x: 0, y: CELL * 2, w: 3, h: 8, props: {} },
    ])
    setSelected(null)
  }

  const CANVAS_COLS = 24
  const CANVAS_ROWS = 20

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground select-none">

      {/* ── Left Panel: Component Library ── */}
      <div className={cn(
        "flex flex-col shrink-0 border-r border-border bg-card transition-all duration-200 overflow-hidden",
        leftOpen ? "w-52" : "w-10"
      )}>
        <div className="flex items-center justify-between px-2 py-3 border-b border-border">
          {leftOpen && <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Components</span>}
          <button
            onClick={() => setLeftOpen(v => !v)}
            className="ml-auto p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            {leftOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-1 space-y-1">
          {COMPONENTS.map(comp => (
            <div
              key={comp.id}
              draggable
              onDragStart={e => handlePanelDragStart(e, comp.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 cursor-grab text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors active:cursor-grabbing",
                !leftOpen && "justify-center px-0"
              )}
              title={comp.label}
            >
              <comp.icon className="h-4 w-4 shrink-0" />
              {leftOpen && <span className="truncate text-xs">{comp.label}</span>}
              {leftOpen && <GripVertical className="h-3 w-3 ml-auto opacity-40" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Center: Canvas ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card shrink-0">
          <span className="text-sm font-semibold text-foreground mr-2">UI Builder</span>
          <button
            onClick={() => setShowGrid(v => !v)}
            className={cn("flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors",
              showGrid ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <Grid3x3 className="h-3.5 w-3.5" /> Grid
          </button>
          <button
            onClick={() => setPreview(v => !v)}
            className={cn("flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors",
              preview ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={resetCanvas}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-border text-muted-foreground hover:bg-muted transition-colors ml-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            onClick={() => setRightOpen(v => !v)}
            className={cn("flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors",
              rightOpen ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <Move className="h-3.5 w-3.5" /> Properties
          </button>
        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto bg-[#0d0d0d] p-6">
          <div
            ref={canvasRef}
            onDragOver={e => e.preventDefault()}
            onDrop={handleCanvasDrop}
            onClick={() => setSelected(null)}
            style={{
              position: "relative",
              width: CANVAS_COLS * CELL,
              height: CANVAS_ROWS * CELL,
              backgroundImage: showGrid
                ? `linear-gradient(to right, var(--border) 1px, transparent 1px),
                   linear-gradient(to bottom, var(--border) 1px, transparent 1px)`
                : undefined,
              backgroundSize: showGrid ? `${CELL}px ${CELL}px` : undefined,
            }}
            className="rounded-xl border border-border bg-background shadow-2xl"
          >
            {items.map(item => (
              <CanvasItemEl
                key={item.uid}
                item={item}
                selected={!preview && selected === item.uid}
                onSelect={() => !preview && setSelected(item.uid)}
                onMove={(dx, dy) => moveItem(item.uid, dx, dy)}
                onDelete={() => deleteItem(item.uid)}
              />
            ))}

            {!preview && items.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm pointer-events-none">
                Drag components here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Properties ── */}
      <div className={cn(
        "flex flex-col shrink-0 border-l border-border bg-card transition-all duration-200 overflow-hidden",
        rightOpen ? "w-60" : "w-0"
      )}>
        <div className="px-4 py-3 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Properties</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {!selectedItem ? (
            <p className="text-xs text-muted-foreground text-center mt-8">Select an element on the canvas</p>
          ) : (
            <>
              {/* Info */}
              <div>
                <div className="text-xs font-semibold text-foreground mb-1">{selectedItem.label}</div>
                <div className="text-xs text-muted-foreground font-mono">{selectedItem.uid}</div>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Size (grid units)</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">W</label>
                    <input
                      type="number" min={1} max={CANVAS_COLS}
                      value={selectedItem.w}
                      onChange={e => updateSize("w", Number(e.target.value))}
                      className="w-full mt-0.5 px-2 py-1 bg-input border border-border rounded text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">H</label>
                    <input
                      type="number" min={1} max={CANVAS_ROWS}
                      value={selectedItem.h}
                      onChange={e => updateSize("h", Number(e.target.value))}
                      className="w-full mt-0.5 px-2 py-1 bg-input border border-border rounded text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Position (px)</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">X</label>
                    <input
                      type="number" readOnly value={selectedItem.x}
                      className="w-full mt-0.5 px-2 py-1 bg-muted border border-border rounded text-xs text-muted-foreground outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Y</label>
                    <input
                      type="number" readOnly value={selectedItem.y}
                      className="w-full mt-0.5 px-2 py-1 bg-muted border border-border rounded text-xs text-muted-foreground outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Component props */}
              {PROP_DEFS[selectedItem.componentId] && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content</div>
                  {PROP_DEFS[selectedItem.componentId].map(def => (
                    <div key={def.key}>
                      <label className="text-xs text-muted-foreground">{def.label}</label>
                      <input
                        type="text"
                        value={selectedItem.props[def.key] ?? ""}
                        placeholder={def.placeholder}
                        onChange={e => updateProp(def.key, e.target.value)}
                        className="w-full mt-0.5 px-2 py-1 bg-input border border-border rounded text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Delete */}
              <button
                onClick={() => deleteItem(selectedItem.uid)}
                className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded bg-danger/10 text-danger border border-danger/30 text-xs hover:bg-danger/20 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Element
              </button>
            </>
          )}
        </div>

        {/* Layers panel */}
        <div className="border-t border-border">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Layers</div>
          <div className="max-h-40 overflow-y-auto">
            {items.map(item => (
              <div
                key={item.uid}
                onClick={() => setSelected(item.uid)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs transition-colors",
                  selected === item.uid
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {React.createElement(COMP_MAP[item.componentId]?.icon ?? Box, { className: "h-3 w-3 shrink-0" })}
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
