import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { OtpInput } from "../components/ui/otp-input"
import { useToast } from "../components/ui/notification"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",    label: "Basic OTP" },
  { id: "length",   label: "Custom Length" },
  { id: "mask",     label: "Masked" },
  { id: "invalid",  label: "Invalid State" },
  { id: "validation",label: "Validation" },
  { id: "props",    label: "Props" },
]

export function OtpInputDocs() {
  const { toast } = useToast()
  const [v1, setV1] = useState("")
  const [v2, setV2] = useState("")
  const [v3, setV3] = useState("")
  const [invalid, setInvalid] = useState(false)

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="OTP Input" description="6-digit code input with auto-focus and paste support."
          code={`<OtpInput length={6} value={value} onChange={setValue} onComplete={(v) => console.log(v)} />`}>
          <div className="space-y-3">
            <OtpInput
              length={6}
              value={v1}
              onChange={setV1}
              onComplete={(v) => toast({ title: "Code entered", description: v, variant: "success", duration: 3000 })}
            />
            <p className="text-xs text-muted-foreground">Value: {v1 || "empty"}</p>
          </div>
        </Playground>
      </Section>
      <Section id="length">
        <Playground title="Custom Length" description="4-digit PIN style."
          code={`<OtpInput length={4} />`}>
          <OtpInput length={4} value={v2} onChange={setV2} />
        </Playground>
      </Section>
      <Section id="mask">
        <Playground title="Masked Input" description="Set mask to hide digits like a password."
          code={`<OtpInput mask length={6} />`}>
          <OtpInput mask length={6} value={v3} onChange={setV3} />
        </Playground>
      </Section>
      <Section id="invalid">
        <Playground title="Invalid State" description="Set invalid to show error styling."
          code={`<OtpInput invalid length={6} />`}>
          <div className="space-y-3">
            <OtpInput length={6} invalid={invalid} defaultValue="123456" />
            <button
              className="text-xs text-primary hover:underline"
              onClick={() => setInvalid((v) => !v)}
            >
              Toggle invalid: {invalid ? "on" : "off"}
            </button>
          </div>
        </Playground>
      </Section>
      <Section id="validation">
        <Playground title="Validation" description="Use required and error to add validation state."
          code={`<OtpInput length={6} required />
<OtpInput length={6} required error="Please enter the 6-digit code" />`}>
          <div className="space-y-3">
            <OtpInput length={6} required />
            <OtpInput length={6} required error="Please enter the 6-digit code" />
          </div>
        </Playground>
      </Section>
      <Section id="props">
        <PropsTable rows={[
          { prop: "length",     type: "number",              default: "6",     description: "Number of OTP digits." },
          { prop: "value",      type: "string",                               description: "Controlled OTP value." },
          { prop: "onChange",   type: "(value: string) => void",              description: "Fired on every digit change." },
          { prop: "onComplete", type: "(value: string) => void",              description: "Fired when all digits are filled." },
          { prop: "mask",       type: "boolean",             default: "false", description: "Hide digits like a password." },
          { prop: "disabled",   type: "boolean",             default: "false", description: "Disable all inputs." },
          { prop: "invalid",    type: "boolean",             default: "false", description: "Show error border styling." },
          { prop: "required",   type: "boolean",                              description: "Marks the field as required." },
          { prop: "error",      type: "string",                               description: "External error message displayed below the inputs." },
        ]} />
      </Section>
    </DocsLayout>
  )
}
