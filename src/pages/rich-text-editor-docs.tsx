import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { RichTextEditor } from "../components/ui/rich-text-editor"

const TOC = [
  { id: "basic",       label: "Basic Editor" },
  { id: "default",     label: "Default Content" },
  { id: "disabled",    label: "Disabled" },
]

export function RichTextEditorDocs() {
  const [html, setHtml] = useState("")

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Rich Text Editor" description="Toolbar with bold, italic, underline, headings, lists, blockquote, code, and link."
          code={`<RichTextEditor value={html} onChange={setHtml} placeholder="Start typing..." />`}>
          <div className="w-full max-w-2xl">
            <RichTextEditor value={html} onChange={setHtml} />
          </div>
        </Playground>
      </Section>
      <Section id="default">
        <Playground title="With Default Content" description="Pre-populate with HTML via defaultValue."
          code={`<RichTextEditor defaultValue="<h2>Hello</h2><p>World</p>" />`}>
          <div className="w-full max-w-2xl">
            <RichTextEditor defaultValue="<h2>Welcome to Codego UI</h2><p>This is a <strong>rich text editor</strong> with <em>formatting</em> support.</p><ul><li>Bold, italic, underline</li><li>Headings and lists</li><li>Blockquotes and code blocks</li></ul>" />
          </div>
        </Playground>
      </Section>
      <Section id="disabled">
        <Playground title="Disabled Editor" description="Set disabled to make the editor read-only."
          code={`<RichTextEditor disabled defaultValue="<p>Read only content</p>" />`}>
          <div className="w-full max-w-2xl">
            <RichTextEditor disabled defaultValue="<p>This editor is <strong>disabled</strong> and cannot be edited.</p>" />
          </div>
        </Playground>
      </Section>
    </DocsLayout>
  )
}
