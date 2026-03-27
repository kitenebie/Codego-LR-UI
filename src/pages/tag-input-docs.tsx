import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { TagInput } from "../components/ui/tag-input"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",    label: "Basic" },
  { id: "max",      label: "Max Tags" },
  { id: "disabled", label: "Disabled" },
  { id: "validation",label: "Validation" },
  { id: "props",    label: "Props" },
]

export function TagInputDocs() {
  const [tags1, setTags1] = useState(["React", "TypeScript"])
  const [tags2, setTags2] = useState(["Design", "UI"])
  const [tags3, setTags3] = useState(["locked"])

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Tag Input" description="Type and press Enter or comma to add tags. Backspace removes the last tag."
          code={`<TagInput value={tags} onChange={setTags} placeholder="Add tag..." />`}>
          <div className="w-full max-w-sm">
            <TagInput value={tags1} onChange={setTags1} placeholder="Add technologies..." />
            <p className="mt-2 text-xs text-muted-foreground">Tags: {tags1.join(", ") || "none"}</p>
          </div>
        </Playground>
      </Section>
      <Section id="max">
        <Playground title="Max Tags" description="Limit the number of tags with maxTags."
          code={`<TagInput maxTags={3} value={tags} onChange={setTags} />`}>
          <div className="w-full max-w-sm">
            <TagInput value={tags2} onChange={setTags2} maxTags={3} placeholder="Max 3 tags..." />
            <p className="mt-2 text-xs text-muted-foreground">{tags2.length}/3 tags</p>
          </div>
        </Playground>
      </Section>
      <Section id="disabled">
        <Playground title="Disabled Tag Input" description="Set disabled to prevent adding or removing tags."
          code={`<TagInput disabled value={tags} />`}>
          <div className="w-full max-w-sm">
            <TagInput disabled value={tags3} />
          </div>
        </Playground>
      </Section>
      <Section id="validation">
        <Playground title="Validation" description="Use required and error to add validation state to the tag input."
          code={`<TagInput required placeholder="Required tags..." />
<TagInput required error="At least one tag is required" placeholder="Add tags..." />`}>
          <div className="w-full max-w-sm space-y-3">
            <TagInput required placeholder="Required tags..." />
            <TagInput required error="At least one tag is required" placeholder="Add tags..." />
          </div>
        </Playground>
      </Section>
      <Section id="props">
        <PropsTable rows={[
          { prop: "value",          type: "string[]",                  description: "Controlled array of tags." },
          { prop: "onChange",       type: "(tags: string[]) => void",  description: "Fired when tags change." },
          { prop: "placeholder",    type: "string",   default: '"Add tag..."', description: "Placeholder shown when empty." },
          { prop: "maxTags",        type: "number",                    description: "Maximum number of tags allowed." },
          { prop: "allowDuplicates",type: "boolean",  default: "false", description: "Allow duplicate tag values." },
          { prop: "disabled",       type: "boolean",  default: "false", description: "Prevent adding or removing tags." },
          { prop: "required",       type: "boolean",                   description: "Marks the field as required." },
          { prop: "error",          type: "string",                    description: "External error message displayed below the input." },
        ]} />
      </Section>
    </DocsLayout>
  )
}
