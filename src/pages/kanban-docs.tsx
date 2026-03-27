import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { KanbanBoard, type KanbanColumn } from "../components/ui/kanban"
import { PropsTable } from "../components/ui/props-table"
import { useToast } from "../components/ui/notification"

const TOC = [
  { id: "basic",      label: "Basic Board" },
  { id: "priority",   label: "With Priority" },
  { id: "props",      label: "Props" },
  { id: "dataformat", label: "Data Format" },
]

const INITIAL: KanbanColumn[] = [
  {
    id: "todo", title: "To Do", color: "#6366f1",
    cards: [
      { id: "1", title: "Design new landing page", description: "Create wireframes and mockups for the new marketing site.", tags: ["design"] },
      { id: "2", title: "Set up CI/CD pipeline", description: "Configure GitHub Actions for automated testing and deployment." },
      { id: "3", title: "Write API documentation" },
    ],
  },
  {
    id: "progress", title: "In Progress", color: "#f59e0b",
    cards: [
      { id: "4", title: "Implement auth flow", description: "OAuth2 with Google and GitHub providers.", tags: ["backend", "auth"] },
      { id: "5", title: "Dashboard analytics", description: "Build charts for the main dashboard." },
    ],
  },
  {
    id: "review", title: "In Review", color: "#3b82f6",
    cards: [
      { id: "6", title: "Mobile responsive fixes", description: "Fix layout issues on small screens." },
    ],
  },
  {
    id: "done", title: "Done", color: "#22c55e",
    cards: [
      { id: "7", title: "Project setup", description: "Initialize repo, install dependencies." },
      { id: "8", title: "Database schema", description: "Design and migrate initial schema." },
    ],
  },
]

const PRIORITY_BOARD: KanbanColumn[] = [
  {
    id: "backlog", title: "Backlog", color: "#64748b",
    cards: [
      { id: "p1", title: "Refactor auth module", priority: "low", tags: ["tech-debt"] },
      { id: "p2", title: "Add dark mode", priority: "medium" },
    ],
  },
  {
    id: "sprint", title: "This Sprint", color: "#8b5cf6",
    cards: [
      { id: "p3", title: "Fix payment bug", priority: "high", description: "Users cannot complete checkout.", tags: ["bug"] },
      { id: "p4", title: "Performance audit", priority: "medium" },
    ],
  },
  {
    id: "blocked", title: "Blocked", color: "#ef4444",
    cards: [
      { id: "p5", title: "Third-party API integration", priority: "high", description: "Waiting for API keys from vendor." },
    ],
  },
]

export function KanbanDocs() {
  const [cols, setCols] = useState(INITIAL)
  const [priorityCols, setPriorityCols] = useState(PRIORITY_BOARD)
  const { toast } = useToast()

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Kanban Board" description="Drag cards between columns. onChange fires with updated columns."
          code={`<KanbanBoard columns={columns} onChange={setColumns} />`}>
          <KanbanBoard columns={cols} onChange={setCols} onAddCard={(colId) => toast({ title: "Add card", description: `Column: ${colId}`, variant: "info", duration: 2000 })} />
        </Playground>
      </Section>
      <Section id="priority">
        <Playground title="Kanban with Priority" description="Cards support priority: low, medium, high."
          code={`{ id: "1", title: "Fix bug", priority: "high", tags: ["bug"] }`}>
          <KanbanBoard columns={priorityCols} onChange={setPriorityCols} />
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "columns",   type: "KanbanColumn[]",              required: true, description: "Array of column definitions with their cards." },
        { prop: "onChange",  type: "(columns: KanbanColumn[]) => void",           description: "Fired after a card is dragged to a new column." },
        { prop: "onAddCard", type: "(columnId: string) => void",                  description: "Fired when the + button in a column header is clicked." },
        { prop: "className", type: "string",                                      description: "Additional CSS classes on the board wrapper." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "KanbanColumn.id",          type: "string",       required: true, description: "Unique column identifier." },
        { prop: "KanbanColumn.title",       type: "ReactNode",    required: true, description: "Column header label." },
        { prop: "KanbanColumn.cards",       type: "KanbanCard[]", required: true, description: "Cards belonging to this column." },
        { prop: "KanbanColumn.color",       type: "string",                       description: "Dot color shown next to the column title." },
        { prop: "KanbanCard.id",            type: "string",       required: true, description: "Unique card identifier." },
        { prop: "KanbanCard.title",         type: "ReactNode",    required: true, description: "Card heading." },
        { prop: "KanbanCard.description",   type: "ReactNode",                    description: "Secondary text shown below the title." },
        { prop: "KanbanCard.tags",          type: "string[]",                     description: "Tag chips rendered at the bottom of the card." },
        { prop: "KanbanCard.priority",      type: '"low" | "medium" | "high"',    description: "Priority badge shown on the card." },
        { prop: "KanbanCard.assignee",      type: "ReactNode",                    description: "Assignee avatar or element shown at the bottom-right." },
      ]} /></Section>
    </DocsLayout>
  )
}
