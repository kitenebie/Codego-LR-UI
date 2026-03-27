import React, { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { PropsTable } from "../components/ui/props-table"

export function TextareaDocs() {
  const [autosizeVal, setAutosizeVal] = useState("")
  const [trimVal, setTrimVal] = useState("")
  const [lengthVal, setLengthVal] = useState("")
  const [minMaxVal, setMinMaxVal] = useState("")

  return (
    <DocsLayout toc={[
      { id: "props",    label: "Props" },
      { id: "rows",     label: "Rows" },
      { id: "cols",     label: "Cols" },
      { id: "autosize", label: "Autosize" },
      { id: "readonly", label: "Read Only" },
      { id: "grammarly",label: "Disable Grammarly" },
      { id: "trim",     label: "Trim" },
      { id: "minlength",label: "Min Length" },
      { id: "maxlength",label: "Max Length" },
      { id: "length",   label: "Length" },
      { id: "validation",label: "Validation" },
    ]}>

      {/* ── Props Table ── */}
      <Section id="props"><PropsTable rows={[
        { prop: "rows",             type: "number",  default: "3",     description: "Visible number of text lines." },
        { prop: "cols",             type: "number",                    description: "Visible width in average character widths." },
        { prop: "autosize",         type: "boolean", default: "false", description: "Grows height automatically as the user types." },
        { prop: "readOnly",         type: "boolean", default: "false", description: "Makes the textarea non-editable with a muted style." },
        { prop: "disableGrammarly", type: "boolean", default: "false", description: "Injects data attributes to block the Grammarly extension." },
        { prop: "trim",             type: "boolean", default: "false", description: "Trims leading/trailing whitespace on blur." },
        { prop: "minLength",        type: "number",                    description: "Minimum number of characters required (native validation)." },
        { prop: "maxLength",        type: "number",                    description: "Maximum characters allowed. Shows a live counter." },
        { prop: "length",           type: "number",                    description: "Shorthand character cap — takes priority over maxLength. Shows a live counter." },
        { prop: "label",            type: "string",                    description: "Label rendered above the textarea." },
        { prop: "required",         type: "boolean",                   description: "Marks the field as required. Shows a * indicator next to the label." },
        { prop: "error",            type: "string",                    description: "External error message displayed below the textarea." },
      ]} /></Section>

      <Section id="rows"><Playground
        title="rows"
        description="Controls the visible number of text lines via the rows prop (default: 3)."
        code={`<Textarea rows={10} placeholder="10 rows tall..." />`}
      >
        <Textarea rows={10} placeholder="10 rows tall..." className="max-w-sm" />
      </Playground></Section>

      <Section id="cols"><Playground
        title="cols"
        description="Sets the visible width in average character widths via the cols prop."
        code={`<Textarea cols={20} placeholder="20 cols wide..." />`}
      >
        <Textarea cols={20} placeholder="20 cols wide..." />
      </Playground></Section>

      <Section id="autosize"><Playground
        title="autosize"
        description="Automatically grows the textarea height as the user types."
        code={`const [val, setVal] = useState("")
<Textarea
  autosize
  value={val}
  onChange={(e) => setVal(e.target.value)}
  placeholder="Start typing — I'll grow..."
/>`}
      >
        <Textarea
          autosize
          value={autosizeVal}
          onChange={(e) => setAutosizeVal(e.target.value)}
          placeholder="Start typing — I'll grow..."
          className="max-w-sm"
        />
      </Playground></Section>

      <Section id="readonly"><Playground
        title="readOnly"
        description="Makes the textarea non-editable. Styled with a muted background to signal read-only state."
        code={`<Textarea readOnly value="This content cannot be edited." />`}
      >
        <Textarea readOnly value="This content cannot be edited." className="max-w-sm" />
      </Playground></Section>

      <Section id="grammarly"><Playground
        title="disableGrammarly"
        description="Injects data attributes to prevent Grammarly from injecting into the textarea."
        code={`<Textarea disableGrammarly placeholder="Grammarly won't touch this..." />`}
      >
        <Textarea disableGrammarly placeholder="Grammarly won't touch this..." className="max-w-sm" />
      </Playground></Section>

      <Section id="trim"><Playground
        title="trim"
        description="Trims leading and trailing whitespace from the value on blur."
        code={`const [val, setVal] = useState("")
<Textarea
  trim
  value={val}
  onChange={(e) => setVal(e.target.value)}
  placeholder="Add spaces around text, then click away..."
/>`}
      >
        <Textarea
          trim
          value={trimVal}
          onChange={(e) => setTrimVal(e.target.value)}
          placeholder="Add spaces around text, then click away..."
          className="max-w-sm"
        />
      </Playground></Section>

      <Section id="minlength"><Playground
        title="minLength"
        description="Sets the minimum number of characters required (native HTML validation)."
        code={`<Textarea minLength={2} placeholder="At least 2 characters required..." />`}
      >
        <Textarea minLength={2} placeholder="At least 2 characters required..." className="max-w-sm" />
      </Playground></Section>

      <Section id="maxlength"><Playground
        title="maxLength"
        description="Limits input to a maximum number of characters. Shows a live counter."
        code={`const [val, setVal] = useState("")
<Textarea
  maxLength={1024}
  value={val}
  onChange={(e) => setVal(e.target.value)}
  placeholder="Up to 1024 characters..."
/>`}
      >
        <Textarea
          maxLength={1024}
          value={minMaxVal}
          onChange={(e) => setMinMaxVal(e.target.value)}
          placeholder="Up to 1024 characters..."
          className="max-w-sm"
        />
      </Playground></Section>

      <Section id="length"><Playground
        title="length"
        description="Shorthand for an exact character cap — same as maxLength but takes priority over it. Shows a live counter."
        code={`const [val, setVal] = useState("")
<Textarea
  length={100}
  value={val}
  onChange={(e) => setVal(e.target.value)}
  placeholder="Capped at 100 characters..."
/>`}
      >
        <Textarea
          length={100}
          value={lengthVal}
          onChange={(e) => setLengthVal(e.target.value)}
          placeholder="Capped at 100 characters..."
          className="max-w-sm"
        />
      </Playground></Section>

      <Section id="validation"><Playground
        title="Validation"
        description="Use label + required to show a * indicator. Use error to display an external validation message."
        code={`<Textarea label="Bio" required placeholder="Required field" />
<Textarea label="Bio" required error="Bio is required" placeholder="Tell us about yourself" />`}
      >
        <Textarea label="Bio" required placeholder="Required field" className="max-w-sm" />
        <Textarea label="Bio" required error="Bio is required" placeholder="Tell us about yourself" className="max-w-sm mt-3" />
      </Playground></Section>
    </DocsLayout>
  )
}
