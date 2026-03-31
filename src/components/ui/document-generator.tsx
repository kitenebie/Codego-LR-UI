import React, { forwardRef, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Printer, Building2, User, FileText, Hash, ImageIcon, Settings2, X, MapPin } from "lucide-react"
import { cn } from "../../lib/utils"

// ─── Payload Types ────────────────────────────────────────────────────────────

export type BorderVariant = "double" | "single" | "thick" | "dashed" | "none"
export type CivilStatus = "Single" | "Married" | "Widowed" | "Separated"
export type Gender = "he" | "she" | "they"

export interface DocumentHeader {
  republic: string          // "Republic of the Philippines"
  barangayName: string
  cityMunicipality: string
  province: string
  officialSeal: string      // image URL / data URL
}

export interface CertificationStatement {
  fullName: string
  civilStatus: CivilStatus
  gender: Gender
  completeAddress: string
  purpose: string
}

export interface DocumentSignatory {
  name: string
  title: string
}

export interface CtcData {
  number: string
  date: string
  place: string
}

export interface DocumentPayload {
  type: "Barangay Clearance"
  header: DocumentHeader
  title: string
  controlNumber: string
  certificationStatement: CertificationStatement
  issuanceDate: string
  signatories: {
    captain: DocumentSignatory
    secretary: DocumentSignatory
  }
  ctc?: CtcData
}

export interface DocumentConfig {
  borderVariant: BorderVariant
  borderWidth: number
  borderColor: string
  backgroundImage: string
  backgroundOpacity: number
  showCtc: boolean
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: DocumentConfig = {
  borderVariant: "double",
  borderWidth: 2,
  borderColor: "#6366f1",
  backgroundImage: "",
  backgroundOpacity: 8,
  showCtc: true,
}

const DEFAULT_PAYLOAD: DocumentPayload = {
  type: "Barangay Clearance",
  header: {
    republic: "Republic of the Philippines",
    barangayName: "Barangay San Jose",
    cityMunicipality: "Calamba City",
    province: "Laguna",
    officialSeal: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Coat_of_arms_of_the_Philippines.svg/200px-Coat_of_arms_of_the_Philippines.svg.png",
  },
  title: "Barangay Clearance",
  controlNumber: "",
  certificationStatement: {
    fullName: "",
    civilStatus: "Single",
    gender: "he",
    completeAddress: "",
    purpose: "",
  },
  issuanceDate: new Date().toISOString().split("T")[0],
  signatories: {
    captain:   { name: "", title: "Punong Barangay" },
    secretary: { name: "", title: "Barangay Secretary" },
  },
  ctc: { number: "", date: "", place: "" },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"

function FieldGroup({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
        <Icon className="h-3.5 w-3.5" />{label}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn("relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors", checked ? "bg-primary" : "bg-muted")}
    >
      <span className={cn("pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform", checked ? "translate-x-4" : "translate-x-0")} />
    </button>
  )
}

const BORDER_VARIANTS: { value: BorderVariant; label: string }[] = [
  { value: "double", label: "Double" },
  { value: "single", label: "Single" },
  { value: "thick",  label: "Thick"  },
  { value: "dashed", label: "Dashed" },
  { value: "none",   label: "None"   },
]

const CIVIL_STATUSES: CivilStatus[] = ["Single", "Married", "Widowed", "Separated"]

// ─── Form Component ───────────────────────────────────────────────────────────

interface FormProps {
  payload: DocumentPayload
  config: DocumentConfig
  onPayload: (payload: DocumentPayload) => void
  onConfig: (config: DocumentConfig) => void
  onBgUpload: (dataUrl: string) => void
  onPrint: () => void
}

export function FormComponent({ payload, config, onPayload, onConfig, onBgUpload, onPrint }: FormProps) {
  const bgRef = useRef<HTMLInputElement>(null)

  const sh = (field: keyof DocumentHeader, val: string) =>
    onPayload({ ...payload, header: { ...payload.header, [field]: val } })

  const sc = (field: keyof CertificationStatement, val: string) =>
    onPayload({ ...payload, certificationStatement: { ...payload.certificationStatement, [field]: val } })

  const ss = (role: "captain" | "secretary", field: keyof DocumentSignatory, val: string) =>
    onPayload({ ...payload, signatories: { ...payload.signatories, [role]: { ...payload.signatories[role], [field]: val } } })

  const sctc = (field: keyof CtcData, val: string) =>
    onPayload({ ...payload, ctc: { ...(payload.ctc ?? { number: "", date: "", place: "" }), [field]: val } })

  function handleBgFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onBgUpload(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6 p-5">

      {/* Document Style */}
      <FieldGroup label="Document Style" icon={Settings2}>
        <Field label="Border Style">
          <div className="flex flex-wrap gap-1.5">
            {BORDER_VARIANTS.map((v) => (
              <button key={v.value}
                onClick={() => onConfig({ ...config, borderVariant: v.value })}
                className={cn("px-2.5 py-1 rounded text-xs font-medium border transition",
                  config.borderVariant === v.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                )}
              >{v.label}</button>
            ))}
          </div>
        </Field>

        {config.borderVariant !== "none" && (
          <Field label={`Border Width: ${config.borderWidth}px`}>
            <input type="range" min={1} max={8} step={1} value={config.borderWidth}
              onChange={(e) => onConfig({ ...config, borderWidth: Number(e.target.value) })}
              className="w-full accent-primary" />
          </Field>
        )}

        {config.borderVariant !== "none" && (
          <Field label="Border Color">
            <div className="flex items-center gap-2">
              <input type="color" value={config.borderColor}
                onChange={(e) => onConfig({ ...config, borderColor: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border border-input bg-background p-0.5" />
              <input className={cn(inputCls, "flex-1")} value={config.borderColor}
                onChange={(e) => onConfig({ ...config, borderColor: e.target.value })} placeholder="#6366f1" />
            </div>
          </Field>
        )}

        <Field label="Background Image">
          <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={handleBgFile} />
          <div className="flex gap-2">
            <button onClick={() => bgRef.current?.click()}
              className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition flex-1 justify-center">
              <ImageIcon className="h-3.5 w-3.5" />
              {config.backgroundImage ? "Change Image" : "Upload Image"}
            </button>
            {config.backgroundImage && (
              <button onClick={() => onBgUpload("")}
                className="flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition">
                <X className="h-3.5 w-3.5" />Remove
              </button>
            )}
          </div>
          {config.backgroundImage && (
            <div className="mt-2 rounded overflow-hidden border border-border" style={{ height: 60 }}>
              <img src={config.backgroundImage} alt="bg" className="w-full h-full object-cover" />
            </div>
          )}
        </Field>

        {config.backgroundImage && (
          <Field label={`Background Opacity: ${config.backgroundOpacity}%`}>
            <input type="range" min={2} max={40} step={1} value={config.backgroundOpacity}
              onChange={(e) => onConfig({ ...config, backgroundOpacity: Number(e.target.value) })}
              className="w-full accent-primary" />
          </Field>
        )}
      </FieldGroup>

      {/* Header */}
      <FieldGroup label="Header" icon={Building2}>
        <Field label="Barangay Name">
          <input className={inputCls} value={payload.header.barangayName} onChange={(e) => sh("barangayName", e.target.value)} placeholder="Barangay San Jose" />
        </Field>
        <Field label="City / Municipality">
          <input className={inputCls} value={payload.header.cityMunicipality} onChange={(e) => sh("cityMunicipality", e.target.value)} placeholder="Calamba City" />
        </Field>
        <Field label="Province">
          <input className={inputCls} value={payload.header.province} onChange={(e) => sh("province", e.target.value)} placeholder="Laguna" />
        </Field>
        <Field label="Official Seal URL">
          <input className={inputCls} value={payload.header.officialSeal} onChange={(e) => sh("officialSeal", e.target.value)} placeholder="https://..." />
        </Field>
      </FieldGroup>

      {/* Certification Statement */}
      <FieldGroup label="Certification Statement" icon={User}>
        <Field label="Full Name">
          <input className={inputCls} value={payload.certificationStatement.fullName}
            onChange={(e) => sc("fullName", e.target.value)} placeholder="Juan Dela Cruz" />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Civil Status">
            <select className={inputCls} value={payload.certificationStatement.civilStatus}
              onChange={(e) => sc("civilStatus", e.target.value)}>
              {CIVIL_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Pronoun">
            <select className={inputCls} value={payload.certificationStatement.gender}
              onChange={(e) => sc("gender", e.target.value)}>
              <option value="he">he/him</option>
              <option value="she">she/her</option>
              <option value="they">they/them</option>
            </select>
          </Field>
        </div>
        <Field label="Complete Address">
          <input className={inputCls} value={payload.certificationStatement.completeAddress}
            onChange={(e) => sc("completeAddress", e.target.value)} placeholder="123 Rizal St., Brgy. San Jose" />
        </Field>
        <Field label="Purpose">
          <textarea className={cn(inputCls, "resize-none")} rows={2}
            value={payload.certificationStatement.purpose}
            onChange={(e) => sc("purpose", e.target.value)}
            placeholder="Employment / Loan Application / etc." />
        </Field>
      </FieldGroup>

      {/* Document Details */}
      <FieldGroup label="Document Details" icon={FileText}>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Control No.">
            <input className={inputCls} value={payload.controlNumber}
              onChange={(e) => onPayload({ ...payload, controlNumber: e.target.value })} placeholder="2024-001" />
          </Field>
          <Field label="Date of Issuance">
            <input type="date" className={inputCls} value={payload.issuanceDate}
              onChange={(e) => onPayload({ ...payload, issuanceDate: e.target.value })} />
          </Field>
        </div>
      </FieldGroup>

      {/* Signatories */}
      <FieldGroup label="Signatories" icon={MapPin}>
        <Field label="Barangay Captain">
          <input className={inputCls} value={payload.signatories.captain.name}
            onChange={(e) => ss("captain", "name", e.target.value)} placeholder="Hon. Maria Santos" />
        </Field>
        <Field label="Barangay Secretary">
          <input className={inputCls} value={payload.signatories.secretary.name}
            onChange={(e) => ss("secretary", "name", e.target.value)} placeholder="Juan Reyes" />
        </Field>
      </FieldGroup>

      {/* CTC — optional */}
      <FieldGroup label="CTC / Cedula" icon={Hash}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Include CTC in document</span>
          <Toggle checked={config.showCtc} onChange={() => onConfig({ ...config, showCtc: !config.showCtc })} />
        </div>
        {config.showCtc && (
          <>
            <Field label="CTC Number">
              <input className={inputCls} value={payload.ctc?.number ?? ""}
                onChange={(e) => sctc("number", e.target.value)} placeholder="12345678" />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Date Issued">
                <input type="date" className={inputCls} value={payload.ctc?.date ?? ""}
                  onChange={(e) => sctc("date", e.target.value)} />
              </Field>
              <Field label="Place Issued">
                <input className={inputCls} value={payload.ctc?.place ?? ""}
                  onChange={(e) => sctc("place", e.target.value)} placeholder="Calamba, Laguna" />
              </Field>
            </div>
          </>
        )}
      </FieldGroup>
    </div>
  )
}

// ─── Border resolver ──────────────────────────────────────────────────────────

function resolveBorders(config: DocumentConfig) {
  const { borderVariant: v, borderWidth: bw, borderColor: c } = config
  if (v === "none") return { outer: {} as React.CSSProperties, inner: null as React.CSSProperties | null }
  const base: React.CSSProperties = { position: "absolute", inset: "8mm", borderRadius: "4px", pointerEvents: "none" }
  const base2: React.CSSProperties = { position: "absolute", inset: "10.5mm", borderRadius: "3px", pointerEvents: "none" }
  if (v === "double") return { outer: { ...base, border: `${bw}px solid ${c}` }, inner: { ...base2, border: `${Math.max(1, bw - 1)}px solid ${c}` } }
  if (v === "single") return { outer: { ...base, border: `${bw}px solid ${c}` }, inner: null }
  if (v === "thick")  return { outer: { ...base, border: `${bw + 3}px solid ${c}` }, inner: null }
  if (v === "dashed") return { outer: { ...base, border: `${bw}px dashed ${c}` }, inner: { ...base2, border: `${Math.max(1, bw - 1)}px dotted ${c}` } }
  return { outer: {} as React.CSSProperties, inner: null }
}

// ─── Preview Document ─────────────────────────────────────────────────────────

export const PreviewDocument = forwardRef<HTMLDivElement, { payload: DocumentPayload; config?: DocumentConfig }>(
  ({ payload, config = DEFAULT_CONFIG }, ref) => {
    const { header, certificationStatement: cs, signatories, ctc, issuanceDate, controlNumber } = payload
    const accentColor = config.borderVariant !== "none" ? config.borderColor : "#6366f1"

    const formattedDate = issuanceDate
      ? new Date(issuanceDate).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })
      : "_______________"

    const pronoun = cs.gender === "she" ? "she" : cs.gender === "they" ? "they" : "he"
    const { outer, inner } = resolveBorders(config)

    return (
      <div ref={ref} style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#ffffff", color: "#1a1a1a", fontFamily: "'Times New Roman', Times, serif", padding: "18mm 20mm", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>

        {/* Watermark */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-35deg)", fontSize: "72px", fontWeight: 900, color: "rgba(99,102,241,0.05)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", letterSpacing: "4px" }}>
          OFFICIAL DOCUMENT
        </div>

        {/* Background image */}
        {config.backgroundImage && (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${config.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center", opacity: config.backgroundOpacity / 100, pointerEvents: "none" }} />
        )}

        {/* Border */}
        {Object.keys(outer).length > 0 && <div style={outer} />}
        {inner && <div style={inner} />}

        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: "6mm" }}>
          <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#555", margin: 0 }}>{header.republic}</p>
          <p style={{ fontSize: "9px", color: "#555", margin: "1mm 0 0" }}>{header.province || "Province of ___________"}</p>
          <p style={{ fontSize: "9px", color: "#555", margin: "0" }}>{header.cityMunicipality || "City / Municipality of ___________"}</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12mm", margin: "5mm 0" }}>
            <img src={header.officialSeal} alt="Official Seal"
              style={{ width: "22mm", height: "22mm", objectFit: "contain" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            <div>
              <p style={{ fontSize: "8px", letterSpacing: "1px", textTransform: "uppercase", color: "#555", margin: 0 }}>Office of the Punong Barangay</p>
              <h1 style={{ fontSize: "18px", fontWeight: 900, margin: "1mm 0", color: "#1a1a1a", letterSpacing: "1px" }}>
                {header.barangayName || "BARANGAY ___________"}
              </h1>
              <p style={{ fontSize: "9px", color: "#555", margin: 0 }}>{header.cityMunicipality || "City / Municipality of ___________"}</p>
            </div>
          </div>

          <div style={{ borderTop: `2px solid ${accentColor}`, margin: "3mm 0 1mm" }} />
          <div style={{ borderTop: `1px solid ${accentColor}`, margin: "0 0 4mm" }} />

          {/* ── TITLE ── */}
          <h2 style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "4px", textTransform: "uppercase", margin: 0, color: "#1a1a1a" }}>
            {payload.title}
          </h2>
          {controlNumber && (
            <p style={{ fontSize: "9px", color: "#888", margin: "1mm 0 0", letterSpacing: "1px" }}>
              Control No.: <strong>{controlNumber}</strong>
            </p>
          )}
        </div>

        {/* ── CERTIFICATION STATEMENT ── */}
        <div style={{ fontSize: "11px", lineHeight: "1.9", textAlign: "justify" }}>
          <p style={{ margin: "0 0 4mm" }}>TO WHOM IT MAY CONCERN:</p>

          <p style={{ margin: "0 0 5mm", textIndent: "12mm" }}>
            This is to certify that{" "}
            <strong style={{ borderBottom: "1px solid #1a1a1a" }}>
              {cs.fullName ? cs.fullName.toUpperCase() : "________________________________"}
            </strong>
            , of legal age, <strong>{cs.civilStatus}</strong>, residing at{" "}
            <strong>{cs.completeAddress || "________________________________"}</strong>,
            is a bonafide resident of this barangay. Based on barangay records,{" "}
            <strong>{pronoun}</strong> has no pending case, complaint, or violation and is of good moral character.
            This certificate is issued upon request of the above-named person for{" "}
            <strong>{cs.purpose || "________________________________"}</strong>.
          </p>

          <p style={{ margin: "0 0 6mm", textIndent: "12mm" }}>
            Issued this <strong>{formattedDate}</strong> at {header.barangayName || "___________"}, {header.cityMunicipality || "___________"}, Philippines.
          </p>
        </div>

        {/* ── CTC — optional ── */}
        {config.showCtc && (
          <div style={{ border: "1px solid #ccc", borderRadius: "3px", padding: "3mm 4mm", marginBottom: "8mm", fontSize: "9px", backgroundColor: "#fafafa" }}>
            <p style={{ margin: 0, fontWeight: 700, marginBottom: "1mm" }}>Community Tax Certificate (CTC)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2mm" }}>
              <span>No.: <strong>{ctc?.number || "___________"}</strong></span>
              <span>Date: <strong>{ctc?.date || "___________"}</strong></span>
              <span>Place: <strong>{ctc?.place || "___________"}</strong></span>
            </div>
          </div>
        )}

        {/* ── SIGNATORIES ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10mm", marginTop: "4mm" }}>
          {[signatories.secretary, signatories.captain].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ borderBottom: "1px solid #1a1a1a", marginBottom: "2mm", paddingBottom: "8mm" }} />
              <p style={{ margin: 0, fontSize: "10px", fontWeight: 700 }}>{s.name || "___________________"}</p>
              <p style={{ margin: "1mm 0 0", fontSize: "9px", color: "#555" }}>{s.title}</p>
            </div>
          ))}
        </div>

        {/* ── BARANGAY SEAL stamp area ── */}
        <div style={{ position: "absolute", bottom: "28mm", right: "22mm", width: "22mm", height: "22mm", border: "1px dashed #ccc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={header.officialSeal} alt="Seal"
            style={{ width: "18mm", height: "18mm", objectFit: "contain", opacity: 0.25 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: "14mm", left: "20mm", right: "20mm", textAlign: "center", fontSize: "8px", color: "#aaa", borderTop: "0.5px solid #ddd", paddingTop: "2mm" }}>
          This document is valid only when signed and sealed by the issuing authority.
        </div>
      </div>
    )
  }
)
PreviewDocument.displayName = "PreviewDocument"

// ─── DocumentGenerator ────────────────────────────────────────────────────────

export function DocumentGenerator({ className }: { className?: string }) {
  const [payload, setPayload] = useState<DocumentPayload>(DEFAULT_PAYLOAD)
  const [config, setConfig]   = useState<DocumentConfig>(DEFAULT_CONFIG)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${payload.title}-${payload.certificationStatement.fullName || "Document"}`,
    pageStyle: `@page{size:A4;margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`,
  })

  return (
    <div className={cn("flex gap-0 h-full", className)}>
      {/* Left: Form */}
      <div className="w-80 shrink-0 border-r border-border overflow-y-auto bg-card">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-border bg-card/90 backdrop-blur">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Document Form</span>
          </div>
          <button onClick={() => handlePrint()}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition print:hidden">
            <Printer className="h-3.5 w-3.5" />Print / PDF
          </button>
        </div>
        <FormComponent
          payload={payload} config={config}
          onPayload={setPayload} onConfig={setConfig}
          onBgUpload={(url) => setConfig((p) => ({ ...p, backgroundImage: url }))}
          onPrint={() => handlePrint()}
        />
      </div>

      {/* Right: A4 Preview */}
      <div className="flex-1 overflow-auto bg-muted/40 flex flex-col items-center py-8 px-4">
        <p className="mb-4 text-xs text-muted-foreground print:hidden">Live Preview — updates as you type</p>
        <div style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.18)", borderRadius: "2px", transform: "scale(0.85)", transformOrigin: "top center" }}>
          <PreviewDocument ref={printRef} payload={payload} config={config} />
        </div>
      </div>
    </div>
  )
}
