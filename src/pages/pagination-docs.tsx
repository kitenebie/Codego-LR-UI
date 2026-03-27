import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Pagination } from "../components/ui/pagination"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",     label: "Basic" },
  { id: "firstlast", label: "First / Last" },
  { id: "pagesize",  label: "Page Size" },
  { id: "siblings",  label: "Sibling Count" },
  { id: "props",     label: "Props" },
]

export function PaginationDocs() {
  const [page1, setPage1] = useState(1)
  const [page2, setPage2] = useState(5)
  const [page3, setPage3] = useState(3)
  const [pageSize, setPageSize] = useState(10)
  const [page4, setPage4] = useState(6)

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Basic Pagination" description="Page navigation with ellipsis for large page counts."
          code={`<Pagination page={page} total={200} pageSize={10} onPageChange={setPage} />`}>
          <Pagination page={page1} total={200} pageSize={10} onPageChange={setPage1} />
        </Playground>
      </Section>
      <Section id="firstlast">
        <Playground title="First / Last Buttons" description="Show jump-to-first and jump-to-last buttons."
          code={`<Pagination page={page} total={500} showFirstLast onPageChange={setPage} />`}>
          <Pagination page={page2} total={500} pageSize={10} showFirstLast onPageChange={setPage2} />
        </Playground>
      </Section>
      <Section id="pagesize">
        <Playground title="Page Size Selector" description="Let users choose how many rows per page."
          code={`<Pagination page={page} total={300} pageSize={pageSize} showPageSize onPageChange={setPage} onPageSizeChange={setPageSize} />`}>
          <Pagination
            page={page3}
            total={300}
            pageSize={pageSize}
            showPageSize
            showFirstLast
            onPageChange={setPage3}
            onPageSizeChange={(s) => { setPageSize(s); setPage3(1) }}
          />
        </Playground>
      </Section>
      <Section id="siblings">
        <Playground title="Sibling Count" description="Control how many page numbers show around the current page."
          code={`<Pagination page={page} total={200} siblingCount={2} onPageChange={setPage} />`}>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">siblingCount=1 (default)</p>
              <Pagination page={page4} total={200} siblingCount={1} onPageChange={setPage4} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">siblingCount=2</p>
              <Pagination page={page4} total={200} siblingCount={2} onPageChange={setPage4} />
            </div>
          </div>
        </Playground>
      </Section>
      <Section id="props"><PropsTable rows={[
        { prop: "page",             type: "number",            required: true, description: "Current active page (1-based)." },
        { prop: "total",            type: "number",            required: true, description: "Total number of items." },
        { prop: "pageSize",         type: "number",            default: "10",  description: "Number of items per page." },
        { prop: "onPageChange",     type: "(page: number) => void", required: true, description: "Fired when the user navigates to a different page." },
        { prop: "siblingCount",     type: "number",            default: "1",   description: "Number of page buttons shown on each side of the current page." },
        { prop: "showFirstLast",    type: "boolean",           default: "false", description: "Show jump-to-first and jump-to-last buttons." },
        { prop: "showPageSize",     type: "boolean",           default: "false", description: "Show a page-size selector dropdown." },
        { prop: "pageSizeOptions",  type: "number[]",          default: "[10, 20, 50, 100]", description: "Options available in the page-size selector." },
        { prop: "onPageSizeChange", type: "(size: number) => void",              description: "Fired when the user changes the page size." },
        { prop: "className",        type: "string",                              description: "Additional CSS classes on the wrapper." },
      ]} /></Section>
    </DocsLayout>
  )
}
