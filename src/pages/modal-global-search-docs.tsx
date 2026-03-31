import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { GlobalSearchModal } from "../components/ui/global-search-modal"
import { Button } from "../components/ui/button"
import { useState } from "react"

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "basic-usage", label: "Basic Usage" },
  { id: "customization", label: "Customization" },
  { id: "api-reference", label: "API Reference" },
]

const SAMPLE_RECORDS = [
  {
    objectID: "page-1",
    name: "Dashboard",
    description: "Main dashboard overview",
    path: "/",
    brand: "Navigation"
  },
  {
    objectID: "page-2",
    name: "Buttons",
    description: "Button component documentation",
    path: "/buttons",
    brand: "Components"
  },
  {
    objectID: "page-3",
    name: "Input Fields",
    description: "Form input components",
    path: "/inputs",
    brand: "Forms"
  },
  {
    objectID: "page-4",
    name: "Data Tables",
    description: "Table component with sorting and pagination",
    path: "/table",
    brand: "Data Display"
  }
]

export function ModalGlobalSearchDocs() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSelect = (record: any) => {
    console.log("Selected:", record)
    alert(`Selected: ${record.name}`)
  }

  return (
    <DocsLayout toc={TOC}>
      <Section id="overview">
        <Playground
          title="Modal Global Search"
          description="A modal-based global search component that displays search results in an overlay modal."
        >
          <div className="space-y-4">
            <Button onClick={() => setIsModalOpen(true)}>
              Open Search Modal
            </Button>

            <GlobalSearchModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              searchRecords={SAMPLE_RECORDS}
              onGlobalSearchSelect={handleSelect}
            />
          </div>
        </Playground>
      </Section>

      <Section id="basic-usage">
        <Playground
          title="Basic Usage"
          description="Simple implementation with default settings."
          code={`import { GlobalSearchModal } from "../components/ui/global-search-modal"
import { useState } from "react"

const SEARCH_RECORDS = [
  {
    objectID: "page-1",
    name: "Dashboard",
    description: "Main dashboard overview",
    path: "/",
    brand: "Navigation"
  },
  {
    objectID: "page-2",
    name: "Buttons",
    description: "Button component documentation",
    path: "/buttons",
    brand: "Components"
  }
]

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Search
      </button>

      <GlobalSearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        searchRecords={SEARCH_RECORDS}
        onGlobalSearchSelect={(record) => {
          console.log("Selected:", record)
          // Handle navigation or other actions
        }}
      />
    </>
  )
}`}
        >
          <div className="text-sm text-muted-foreground">
            Click the button above to see the basic modal in action.
          </div>
        </Playground>
      </Section>

      <Section id="customization">
        <Playground
          title="Customization Options"
          description="Customize the modal appearance and behavior."
          code={`<GlobalSearchModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  searchRecords={SEARCH_RECORDS}
  recordTitleAttribute="name"
  globalSearchDescriptionAttribute="description"
  globalSearchResultsLimit={10}
  placeholder="Search documentation..."
  onGlobalSearchSelect={handleSelect}
/>`}
        >
          <div className="space-y-2 text-sm">
            <div><strong>recordTitleAttribute:</strong> Field to use as title (default: "name")</div>
            <div><strong>globalSearchDescriptionAttribute:</strong> Field to use as description (default: "description")</div>
            <div><strong>globalSearchResultsLimit:</strong> Maximum results to show (default: 8)</div>
            <div><strong>placeholder:</strong> Input placeholder text</div>
            <div><strong>onGlobalSearchSelect:</strong> Callback when item is selected</div>
          </div>
        </Playground>
      </Section>

      <Section id="api-reference">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Props</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-3 py-2 text-left">Prop</th>
                    <th className="border border-border px-3 py-2 text-left">Type</th>
                    <th className="border border-border px-3 py-2 text-left">Default</th>
                    <th className="border border-border px-3 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-3 py-2"><code>isOpen</code></td>
                    <td className="border border-border px-3 py-2"><code>boolean</code></td>
                    <td className="border border-border px-3 py-2">-</td>
                    <td className="border border-border px-3 py-2">Controls modal visibility</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2"><code>onClose</code></td>
                    <td className="border border-border px-3 py-2"><code>{`() => void`}</code></td>
                    <td className="border border-border px-3 py-2">-</td>
                    <td className="border border-border px-3 py-2">Called when modal should close</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2"><code>searchRecords</code></td>
                    <td className="border border-border px-3 py-2"><code>GlobalSearchRecord[]</code></td>
                    <td className="border border-border px-3 py-2"><code>[]</code></td>
                    <td className="border border-border px-3 py-2">Array of records to search through</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2"><code>recordTitleAttribute</code></td>
                    <td className="border border-border px-3 py-2"><code>string</code></td>
                    <td className="border border-border px-3 py-2"><code>"name"</code></td>
                    <td className="border border-border px-3 py-2">Field to use as title</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2"><code>globalSearchDescriptionAttribute</code></td>
                    <td className="border border-border px-3 py-2"><code>string</code></td>
                    <td className="border border-border px-3 py-2"><code>"description"</code></td>
                    <td className="border border-border px-3 py-2">Field to use as description</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2"><code>globalSearchResultsLimit</code></td>
                    <td className="border border-border px-3 py-2"><code>number</code></td>
                    <td className="border border-border px-3 py-2"><code>8</code></td>
                    <td className="border border-border px-3 py-2">Maximum results to show</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2"><code>placeholder</code></td>
                    <td className="border border-border px-3 py-2"><code>string</code></td>
                    <td className="border border-border px-3 py-2"><code>"Search pages…"</code></td>
                    <td className="border border-border px-3 py-2">Input placeholder text</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2"><code>onGlobalSearchSelect</code></td>
                    <td className="border border-border px-3 py-2"><code>{`(record: GlobalSearchRecord) => void`}</code></td>
                    <td className="border border-border px-3 py-2">-</td>
                    <td className="border border-border px-3 py-2">Called when item is selected</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">GlobalSearchRecord Type</h3>
            <div className="bg-muted/50 p-3 rounded-md font-mono text-sm">
              {`interface GlobalSearchRecord {
  objectID: string
  name: string
  description?: string
  path?: string
  brand?: string
  [key: string]: any
}`}
            </div>
          </div>
        </div>
      </Section>
    </DocsLayout>
  )
}