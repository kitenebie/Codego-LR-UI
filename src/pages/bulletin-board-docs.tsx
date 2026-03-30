import { useState, useEffect } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { BulletinBoard, BulletinPreview } from "../components/ui/bulletin-board"
import type { BulletinItem } from "../components/ui/bulletin-board"
import { PropsTable } from "../components/ui/props-table"
import { Button } from "../components/ui/button"
import { api } from "@/src/lib/codego"
import { decryptResponse } from "@/src/core/decryption/decode"
import { Plus, Pencil, Trash, Eye } from "lucide-react"

const TOC = [
  { id: "basic",      label: "Basic" },
  { id: "layout",     label: "Layouts" },
  { id: "variant",    label: "Variants" },
  { id: "search",     label: "Search & Filter" },
  { id: "priority",   label: "Priority & Pinned" },
  { id: "actions",    label: "Item Actions" },
  { id: "preview",    label: "Preview Modal" },
  { id: "footer",     label: "Footer Actions" },
  { id: "server",     label: "API Data Fetching" },
  { id: "loading",    label: "Loading State" },
  { id: "props",      label: "Props" },
  { id: "dataformat", label: "BulletinItem" },
]

const SAMPLE: BulletinItem[] = [
  {
    id: 1,
    title: "Q3 All-Hands Meeting",
    body: "Join us for the quarterly all-hands meeting. We'll cover company updates, team highlights, and upcoming roadmap.",
    author: "Sarah Chen",
    date: "2024-07-15",
    category: "Events",
    pinned: true,
    priority: "urgent",
    tags: ["meeting", "company"],
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&q=80",
  },
  {
    id: 2,
    title: "New Design System Released",
    body: "Version 2.0 of our internal design system is now live. Check the docs for migration guides and new component APIs.",
    author: "Alex Rivera",
    date: "2024-07-12",
    category: "Engineering",
    priority: "high",
    tags: ["design", "frontend"],
  },
  {
    id: 3,
    title: "Office Closure — Public Holiday",
    body: "The office will be closed on July 4th. Remote work is available for those who need to continue working.",
    author: "HR Team",
    date: "2024-07-01",
    category: "HR",
    priority: "medium",
    tags: ["holiday", "office"],
  },
  {
    id: 4,
    title: "Parking Lot Maintenance",
    body: "The east parking lot will be unavailable from July 20–22 due to resurfacing work. Please use the west lot.",
    author: "Facilities",
    date: "2024-07-18",
    category: "Facilities",
    priority: "low",
    tags: ["parking", "maintenance"],
  },
  {
    id: 5,
    title: "Lunch & Learn: AI Tools",
    body: "This Friday at noon we'll explore the latest AI productivity tools. Lunch is provided. RSVP by Thursday.",
    author: "Dev Guild",
    date: "2024-07-19",
    category: "Events",
    tags: ["ai", "learning"],
  },
  {
    id: 6,
    title: "Security Policy Update",
    body: "Our password and 2FA policies have been updated. All employees must re-enroll by end of month.",
    author: "IT Security",
    date: "2024-07-10",
    category: "IT",
    priority: "high",
    tags: ["security", "policy"],
  },
]

export function BulletinBoardDocs() {
  const [clicked, setClicked] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<BulletinItem | null>(null)
  const [viewLog, setViewLog] = useState<string | null>(null)
  const [editLog, setEditLog] = useState<string | null>(null)
  const [deleteLog, setDeleteLog] = useState<string | null>(null)

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground
          title="Basic"
          description="A simple bulletin board with a title and a grid of posts."
          code={`<BulletinBoard items={items} />`}
        >
          <BulletinBoard items={SAMPLE.slice(0, 3)} columns={3} />
        </Playground>
      </Section>

      <Section id="layout">
        <Playground
          title="Layouts"
          description="Switch between grid, list, and masonry layouts via the layout prop."
          code={`<BulletinBoard items={items} layout="list" />\n<BulletinBoard items={items} layout="grid" columns={2} />`}
        >
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-3">List</p>
              <BulletinBoard items={SAMPLE.slice(0, 3)} layout="list" showHeader={false} />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-3">Grid — 2 columns</p>
              <BulletinBoard items={SAMPLE.slice(0, 4)} layout="grid" columns={2} showHeader={false} />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-3">Grid — 4 columns</p>
              <BulletinBoard items={SAMPLE} layout="grid" columns={4} showHeader={false} />
            </div>
          </div>
        </Playground>
      </Section>

      <Section id="variant">
        <Playground
          title="Variants"
          description="card (glass), minimal (hover only), and bordered styles."
          code={`<BulletinBoard items={items} variant="card" />\n<BulletinBoard items={items} variant="minimal" />\n<BulletinBoard items={items} variant="bordered" />`}
        >
          <div className="space-y-8">
            {(["card", "minimal", "bordered"] as const).map((v) => (
              <div key={v}>
                <p className="text-xs font-semibold text-muted-foreground mb-3 capitalize">{v}</p>
                <BulletinBoard items={SAMPLE.slice(0, 3)} variant={v} columns={3} showHeader={false} />
              </div>
            ))}
          </div>
        </Playground>
      </Section>

      <Section id="search">
        <Playground
          title="Search & Filter"
          description="Enable searchable and filterable to add a search bar and category chips. Categories are auto-derived from items."
          code={`<BulletinBoard\n  items={items}\n  searchable\n  filterable\n  columns={3}\n/>`}
        >
          <BulletinBoard
            items={SAMPLE}
            searchable
            filterable
            columns={3}
            title="Company Announcements"
            headerAction={
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Post</Button>
            }
          />
        </Playground>
      </Section>

      <Section id="priority">
        <Playground
          title="Priority & Pinned"
          description="Items with pinned=true float to the top. priority shows a badge: urgent, high, medium, low."
          code={`{ id: 1, title: "Urgent Notice", priority: "urgent", pinned: true, ... }`}
        >
          <BulletinBoard
            items={SAMPLE}
            columns={3}
            showHeader={false}
            onItemClick={(item) => setClicked(String(item.id))}
          />
          {clicked && (
            <p className="text-xs text-muted-foreground mt-2">Clicked item id: <strong>{clicked}</strong></p>
          )}
        </Playground>
      </Section>

      <Section id="actions">
        <Playground
          title="Item Actions"
          description="Each item can have an actions array. A ⋯ menu appears on the card."
          code={`{\n  id: 1,\n  title: "Post Title",\n  actions: [\n    { label: "View",   icon: <Eye />,    onClick: (item) => {} },\n    { label: "Edit",   icon: <Pencil />, onClick: (item) => {} },\n    { label: "Delete", icon: <Trash />,  onClick: (item) => {}, variant: "danger" },\n  ],\n}`}
        >
          <BulletinBoard
            items={SAMPLE.slice(0, 3).map((item) => ({
              ...item,
              actions: [
                { label: "View",   icon: <Eye   className="h-3.5 w-3.5" />, onClick: (i) => alert(`View: ${i.title}`) },
                { label: "Edit",   icon: <Pencil className="h-3.5 w-3.5" />, onClick: (i) => alert(`Edit: ${i.title}`) },
                { label: "Delete", icon: <Trash  className="h-3.5 w-3.5" />, onClick: (i) => alert(`Delete: ${i.title}`), variant: "danger" as const },
              ],
            }))}
            columns={3}
            showHeader={false}
          />
        </Playground>
      </Section>

      <Section id="preview">
        <Playground
          title="Preview Modal"
          description="Pass preview to open a full-content modal when a card is clicked. Use editBaseUrl + editFields for built-in edit form, or onEdit for custom handling. Use deleteBaseUrl for built-in delete confirmation."
          code={`<BulletinBoard\n  items={items}\n  preview\n  onView={(item) => console.log("view", item)}\n  onEdit={(item) => console.log("edit", item)}\n  deleteBaseUrl="/api/bulletins"\n  onDelete={(item) => console.log("deleted", item)}\n/>\n\n{/* Standalone usage */}\n{open && (\n  <BulletinPreview\n    item={selectedItem}\n    onClose={() => setOpen(false)}\n    onView={(item) => handleView(item)}\n    onEdit={(item) => handleEdit(item)}\n    onDelete={(item) => handleDelete(item)}\n  />\n)}`}
        >
          <div className="space-y-4">
            <BulletinBoard
              items={SAMPLE.slice(0, 3)}
              columns={3}
              showHeader={false}
              preview
              onView={(item) => setViewLog(`View triggered: ${item.title}`)}
              onEdit={(item) => setEditLog(`Edit triggered: ${item.title}`)}
              onDelete={(item) => setDeleteLog(`Delete triggered: ${item.title}`)}
            />
            {viewLog   && <p className="text-xs text-primary">{viewLog}</p>}
            {editLog   && <p className="text-xs text-info">{editLog}</p>}
            {deleteLog && <p className="text-xs text-danger">{deleteLog}</p>}
            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground mb-3">Standalone BulletinPreview</p>
              <Button size="sm" variant="outline" onClick={() => setPreviewItem(SAMPLE[0])}>
                Open Preview
              </Button>
              {previewItem && (
                <BulletinPreview
                  item={previewItem}
                  onClose={() => setPreviewItem(null)}
                  onView={(item) => { setViewLog(`View: ${item.title}`); setPreviewItem(null) }}
                  onEdit={(item) => { setEditLog(`Edit: ${item.title}`); setPreviewItem(null) }}
                  onDelete={(item) => { setDeleteLog(`Delete: ${item.title}`); setPreviewItem(null) }}
                />
              )}
            </div>
          </div>
        </Playground>
      </Section>

      <Section id="footer">
        <Playground
          title="Footer Actions"
          description="footerAction renders below the board content (above pagination). headerPreviewAction and footerPreviewAction inject elements into the preview modal header and footer respectively."
          code={`<BulletinBoard\n  items={items}\n  preview\n  footerAction={\n    <Button size="sm" variant="outline">Load More</Button>\n  }\n  headerPreviewAction={\n    <Badge variant="info">New</Badge>\n  }\n  footerPreviewAction={\n    (item) => <Button size="sm" variant="secondary" onClick={() => shareItem(item)}>Share</Button>\n  }\n/>\n\n{/* Or directly on BulletinPreview: */}\n<BulletinPreview\n  item={item}\n  onClose={onClose}\n  headerAction={<Badge variant="info">New</Badge>}\n  footerAction={<Button size="sm" variant="secondary">Share</Button>}\n/>`}
        >
          <BulletinBoard
            items={SAMPLE.slice(0, 3)}
            columns={3}
            showHeader={false}
            preview
            footerAction={
              <div className="flex justify-center">
                <Button size="sm" variant="outline">Load More</Button>
              </div>
            }
            headerPreviewAction={
              <span className="text-[10px] font-semibold text-info">New</span>
            }
            footerPreviewAction={
              (item) => <Button size="sm" variant="secondary" onClick={() => alert(`Share item ${item.id}`)}>Share</Button>
            }
          />
        </Playground>
      </Section>

      <Section id="server">
        <Playground
          title="API Data Fetching"
          description="Fetch bulletin posts from your API using the api client with optional Laravel encryption support. Use decryptResponse from the decryption module to handle encrypted responses."
          code={`const [items, setItems] = useState([])
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

const fetchData = async () => {
    try {
        const res = await api.get('/bulletin');
        setLoading(true)
        console.log("FULL RESPONSE:", res);

        let source;

        // Check if encrypted or not
        if (res?.data?.data) {
            // encrypted
            const decoded = decryptResponse<any>(
                res.data,
                import.meta.env["VITE_LARAVEL_KEY"]
            );
            source = decoded.data;
        } else {
            // normal response
            source = res.data.data;
        }

        // transform data
        const formatted = source.map((row: any) => ({
            id: row.id,
            title: row.subject || row.title,
            body: row.content || row.body,
            author: row.posted_by || row.author,
            date: row.created_at || row.date,
            category: row.department || row.category,
            priority: row.level || row.priority,
            pinned: row.is_pinned || row.pinned,
            tags: row.tags ?? [],
            image: row.image
        }));

        setItems(formatted);
    } catch (error: any) {
        console.error("ERROR:", error);
        setError(error.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchData();
}, []);

<BulletinBoard
    items={items}
    loading={loading}
    error={error}
    preview
    onEdit={(item) => openEditModal(item)}
    deleteBaseUrl="/api/bulletins"
    onDelete={() => fetchData()}
    columns={3}
    searchable
    filterable
    headerAction={
        <Button size="sm" onClick={openCreateModal}>New Post</Button>
    }
/>`}
        >
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Live demo requires a real API endpoint.</p>
            <p>Wire up the API call to your backend and pass the returned items to BulletinBoard.</p>
            <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Using api client + decryptResponse
const [items, setItems] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get('/bulletin')
      
      // Check if response is encrypted
      let source;
      if (res?.data?.data) {
        const decoded = decryptResponse(
          res.data,
          import.meta.env["VITE_LARAVEL_KEY"]
        )
        source = decoded.data
      } else {
        source = res.data.data
      }
      
      const formatted = source.map((row: any) => ({
        id: row.id,
        title: row.subject,
        body: row.content,
        author: row.posted_by,
        date: row.created_at,
      }))
      
      setItems(formatted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [])

// Bearer token auto-attached from localStorage
<BulletinBoard
  items={items}
  loading={loading}
  preview
  columns={3}
/>`}</pre>
          </div>
        </Playground>
      </Section>

      <Section id="loading">
        <Playground
          title="Loading State"
          description="Pass loading=true to show skeleton cards. Control count with loadingCount."
          code={`<BulletinBoard items={[]} loading loadingCount={6} columns={3} />`}
        >
          <BulletinBoard items={[]} loading loadingCount={6} columns={3} showHeader={false} />
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "items",            type: "BulletinItem[]",  required: true,  description: "Array of bulletin post items." },
          { prop: "layout",           type: '"grid" | "list" | "masonry"', default: '"grid"',    description: "Board layout mode." },
          { prop: "columns",          type: "1 | 2 | 3 | 4",  default: "3",     description: "Number of grid columns (responsive)." },
          { prop: "variant",          type: '"card" | "minimal" | "bordered"', default: '"card"', description: "Visual style of each post card." },
          { prop: "searchable",       type: "boolean",         default: "false", description: "Show a search input above the board." },
          { prop: "filterable",       type: "boolean",         default: "false", description: "Show category filter chips above the board." },
          { prop: "categories",       type: "string[]",        description: "Explicit category list for filter chips. Auto-derived from items if omitted." },
          { prop: "title",            type: "ReactNode",       default: '"Bulletin Board"', description: "Board header title." },
          { prop: "headerAction",     type: "ReactNode",       description: "Trailing element in the board header (e.g. a New Post button)." },
          { prop: "showHeader",       type: "boolean",         default: "true",  description: "Show or hide the board header bar." },
          { prop: "emptyMessage",     type: "ReactNode",       default: '"No posts found."', description: "Content shown when the filtered list is empty." },
          { prop: "loading",          type: "boolean",         default: "false", description: "Show skeleton cards instead of real content." },
          { prop: "loadingCount",     type: "number",          default: "6",     description: "Number of skeleton cards to render while loading." },
          { prop: "preview",          type: "boolean",         default: "false", description: "Open a BulletinPreview modal when a card is clicked." },
          { prop: "onEdit",           type: "(item: BulletinItem) => void", description: "Called when the Edit button is clicked inside the preview." },
          { prop: "onDelete",         type: "(item: BulletinItem) => void", description: "Called after a successful delete (or when no deleteBaseUrl is set)." },
          { prop: "deleteBaseUrl",    type: "string",          description: "Base URL for built-in DELETE {baseUrl}/{id}/delete request." },
          { prop: "deleteIdKey",      type: "string",          default: '"id"',  description: "Item key used as the id segment in the delete URL." },
          { prop: "serverPagination", type: "BulletinServerPaginationProp | null", description: "Pass the serverPagination from useServerBulletin to enable server-driven pagination." },
          { prop: "onItemClick",      type: "(item: BulletinItem) => void", description: "Fired when a post card is clicked (ignored when preview=true)." },
          { prop: "footerAction",          type: "ReactNode", description: "Extra React elements rendered below the board content (above pagination)." },
          { prop: "headerPreviewAction",    type: "ReactNode", description: "Extra React elements rendered in the preview modal header's left area." },
          { prop: "footerPreviewAction",    type: "(item: BulletinItem) => ReactNode", description: "Render prop receiving the item; elements rendered in the preview modal footer's action area." },
          { prop: "className",        type: "string",          description: "Additional CSS classes on the outer wrapper." },
        ]} />
      </Section>

      <Section id="previewprops">
        <PropsTable rows={[
          { prop: "item",          type: "BulletinItem", required: true, description: "The bulletin item to display." },
          { prop: "onClose",       type: "() => void",   required: true, description: "Called when the modal is dismissed." },
          { prop: "onEdit",        type: "(item: BulletinItem) => void", description: "Show an Edit button; called when clicked." },
          { prop: "onDelete",      type: "(item: BulletinItem) => void", description: "Show a Delete button; called when clicked." },
          { prop: "onView",        type: "(item: BulletinItem) => void", description: "Show a View button; called when clicked." },
          { prop: "customActions", type: "BulletinAction[]", description: "Extra icon buttons rendered in the modal header's right action row." },
          { prop: "headerAction",  type: "ReactNode", description: "Extra React elements rendered in the modal header's left badge area." },
          { prop: "footerAction",  type: "ReactNode", description: "Extra React elements rendered in the modal footer's action area, before Edit/Delete." },
        ]} />
      </Section>

      <Section id="dataformat">
        <PropsTable rows={[
          { prop: "id",           type: "string | number",  required: true,  description: "Unique identifier." },
          { prop: "title",        type: "string",           required: true,  description: "Post headline." },
          { prop: "body",         type: "ReactNode",        description: "Post body content. Truncated to 3 lines on card; full in preview." },
          { prop: "author",       type: "string",           description: "Author display name. Used for avatar initials fallback." },
          { prop: "authorImage",  type: "string",           description: "Author avatar image URL." },
          { prop: "authorIcon",   type: "ReactNode",        description: "Fallback icon when no authorImage." },
          { prop: "date",         type: "string | Date",    description: "Post date — formatted as Mon DD, YYYY." },
          { prop: "category",     type: "string",           description: "Category label shown as a badge and used for filtering." },
          { prop: "image",        type: "string",           description: "Cover image URL." },
          { prop: "pinned",       type: "boolean",          description: "Pinned items are sorted to the top." },
          { prop: "priority",     type: '"low" | "medium" | "high" | "urgent"', description: "Priority badge shown on the card." },
          { prop: "tags",         type: "string[]",         description: "Tag chips shown at the bottom of the card." },
          { prop: "actions",      type: "BulletinAction[]", description: "Per-item action menu items (⋯ button)." },
          { prop: "className",    type: "string",           description: "Additional CSS classes on this card." },
          { prop: "BulletinAction — label",   type: "string",           required: true, description: "Action menu item label." },
          { prop: "BulletinAction — icon",    type: "ReactNode",        description: "Icon shown beside the label." },
          { prop: "BulletinAction — onClick", type: "(item) => void",   required: true, description: "Click handler receiving the parent BulletinItem." },
          { prop: "BulletinAction — variant", type: '"default" | "danger"', description: "Danger variant renders the label in red." },
        ]} />
      </Section>
    </DocsLayout>
  )
}
