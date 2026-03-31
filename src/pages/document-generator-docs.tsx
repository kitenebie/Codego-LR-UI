import { DocsLayout, Section } from "../components/ui/toc"
import { Playground } from "../components/playground"
import { PropsTable } from "../components/ui/props-table"
import { DocumentGenerator, PreviewDocument, type DocumentPayload, type DocumentConfig } from "../components/ui/document-generator"

const TOC = [
  { id: "live",    label: "Live Generator" },
  { id: "payload", label: "Payload Structure" },
  { id: "config",  label: "DocumentConfig" },
  { id: "props",   label: "Props" },
]

const DEMO_PAYLOAD: DocumentPayload = {
  type: "Barangay Clearance",
  header: {
    republic: "Republic of the Philippines",
    barangayName: "Barangay San Jose",
    cityMunicipality: "Calamba City",
    province: "Laguna",
    officialSeal: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Coat_of_arms_of_the_Philippines.svg/200px-Coat_of_arms_of_the_Philippines.svg.png",
  },
  title: "Barangay Clearance",
  controlNumber: "2024-001",
  certificationStatement: {
    fullName: "Juan Dela Cruz",
    civilStatus: "Single",
    gender: "he",
    completeAddress: "123 Rizal St., Brgy. San Jose, Calamba City",
    purpose: "Employment",
  },
  issuanceDate: "2024-06-01",
  signatories: {
    captain:   { name: "Hon. Maria Santos", title: "Punong Barangay" },
    secretary: { name: "Juan Reyes",        title: "Barangay Secretary" },
  },
  ctc: { number: "12345678", date: "2024-01-15", place: "Calamba, Laguna" },
}

const DEMO_CONFIG: DocumentConfig = {
  borderVariant: "double",
  borderWidth: 2,
  borderColor: "#6366f1",
  backgroundImage: "",
  backgroundOpacity: 8,
  showCtc: true,
}

export function DocumentGeneratorDocs() {
  return (
    <DocsLayout toc={TOC}>

      <Section id="live">
        <div className="rounded-xl border border-border overflow-hidden" style={{ height: 680 }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card text-sm font-semibold">
            <span>📄 Live Document Generator</span>
            <span className="text-xs text-muted-foreground font-normal">Fill the form → preview updates → Print / PDF</span>
          </div>
          <div style={{ height: "calc(100% - 41px)" }}>
            <DocumentGenerator />
          </div>
        </div>
      </Section>

      <Section id="payload">
        <Playground
          title="Payload Structure"
          description="The DocumentPayload mirrors the official Barangay Clearance structure."
          code={`const payload: DocumentPayload = {
  type: "Barangay Clearance",
  header: {
    republic: "Republic of the Philippines",
    barangayName: "Barangay San Jose",
    cityMunicipality: "Calamba City",
    province: "Laguna",
    officialSeal: "https://...",          // image URL or data URL
  },
  title: "Barangay Clearance",
  controlNumber: "2024-001",
  certificationStatement: {
    fullName: "Juan Dela Cruz",
    civilStatus: "Single",               // Single | Married | Widowed | Separated
    gender: "he",                        // he | she | they
    completeAddress: "123 Rizal St...",
    purpose: "Employment",
  },
  issuanceDate: "2024-06-01",
  signatories: {
    captain:   { name: "Hon. Maria Santos", title: "Punong Barangay" },
    secretary: { name: "Juan Reyes",        title: "Barangay Secretary" },
  },
  ctc: { number: "12345678", date: "2024-01-15", place: "Calamba, Laguna" }, // optional
}`}
        >
          <div className="overflow-auto border border-border rounded-lg bg-muted/30 p-4 flex justify-center">
            <div style={{ transform: "scale(0.45)", transformOrigin: "top center", height: "135mm" }}>
              <PreviewDocument payload={DEMO_PAYLOAD} config={DEMO_CONFIG} />
            </div>
          </div>
        </Playground>
      </Section>

      <Section id="config">
        <Playground
          title="DocumentConfig"
          description="Controls visual styling — border variant, width, color, background image, and CTC visibility."
          code={`const config: DocumentConfig = {
  borderVariant: "double",   // double | single | thick | dashed | none
  borderWidth: 2,            // 1–8 px
  borderColor: "#6366f1",
  backgroundImage: "",       // data URL from file upload
  backgroundOpacity: 8,      // 2–40 %
  showCtc: true,             // toggle CTC section
}`}
        >
          <div className="text-sm text-muted-foreground p-4 border border-border rounded-md bg-muted/30 space-y-1">
            <p>Use the <strong>Document Style</strong> panel in the form to configure these visually.</p>
            <p>All changes reflect instantly in the live preview.</p>
          </div>
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "payload",   type: "DocumentPayload",  default: "—", description: "Full document payload passed to PreviewDocument." },
          { prop: "config",    type: "DocumentConfig",   default: "—", description: "Visual config for borders, background, and CTC toggle." },
          { prop: "onPayload", type: "(p: DocumentPayload) => void", default: "—", description: "Called when any payload field changes." },
          { prop: "onConfig",  type: "(c: DocumentConfig) => void",  default: "—", description: "Called when any config field changes." },
          { prop: "onBgUpload",type: "(dataUrl: string) => void",     default: "—", description: "Called with base64 data URL after image file is selected." },
          { prop: "className", type: "string", default: "—", description: "Extra CSS classes on the DocumentGenerator wrapper." },
        ]} />
      </Section>

    </DocsLayout>
  )
}
