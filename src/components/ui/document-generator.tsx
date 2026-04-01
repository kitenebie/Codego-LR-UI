import React, { forwardRef, useRef, useState, useEffect } from "react"
import { useReactToPrint } from "react-to-print"
import { Printer, Building2, User, FileText, Hash, ImageIcon, Settings2, X, MapPin, Copy, Download, Eye } from "lucide-react"
import { cn } from "../../lib/utils"
import { useToast } from "./notification"

// ─── Payload Types ────────────────────────────────────────────────────────────

export type BorderVariant = "double" | "single" | "thick" | "dashed" | "none"
export type CivilStatus = "Single" | "Married" | "Widowed" | "Separated"
export type Gender = "he" | "she" | "they"
export type PaperSize = "Letter" | "Legal" | "A4"

export interface GridlinesColRows {
  cols: number
  rows: number
}

export interface StylesPayloadItem {
  shape: "line" | "box"
  width: number
  height: number
  color: string
  fillColor?: string
  xAxis: number
  yAxis: number
}

export interface DataPayloadItem {
  xAxis: number
  yAxis: number
  value: string
  font_size?: number
  font_family?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  color?: string
  textWidth?: number
  textAlign?: "left" | "center" | "justify" | "right"
  textIndent?: number
  image?: {
    url: string
    width: number
    height: number
    opacity?: number
  }
  zIndex?: number
}

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
  paperSize?: PaperSize
  gridlines?: GridlinesColRows
  showGridlines?: boolean
  dataPayloads?: DataPayloadItem[]
  stylesPayload?: StylesPayloadItem[]
  dataLinkPayload?: { key: string; value: string; bold?: boolean; italic?: boolean; underline?: boolean; color?: string }[]
}

// ─── Defaults ─────────────────────────────────────────────────────

const DEFAULT_CONFIG: DocumentConfig = {
  borderVariant: "none",
  borderWidth: 0,
  borderColor: "#6366f1",
  backgroundImage: "",
  backgroundOpacity: 0,
  showCtc: false,
  paperSize: "A4",
  gridlines: { cols: 2481, rows: 3507 },
  showGridlines: true,
  dataPayloads: [],
  stylesPayload: [],
  dataLinkPayload: [],
}

const PAPER_SIZES: Record<PaperSize, GridlinesColRows> = {
  Letter: { cols: 2550, rows: 3300 },
  Legal: { cols: 2550, rows: 4200 },
  A4: { cols: 2481, rows: 3507 },
}

const DEFAULT_PAYLOAD: DocumentPayload = {
  type: "Barangay Clearance",
  header: {
    republic: "",
    barangayName: "",
    cityMunicipality: "",
    province: "",
    officialSeal: "",
  },
  title: "",
  controlNumber: "",
  certificationStatement: {
    fullName: "",
    civilStatus: "Single",
    gender: "he",
    completeAddress: "",
    purpose: "",
  },
  issuanceDate: "",
  signatories: {
    captain: { name: "", title: "" },
    secretary: { name: "", title: "" },
  },
  ctc: { number: "", date: "", place: "" },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"

// Process text replacement using dataLinkPayload
type DataLinkItem = { key: string; value: string; bold?: boolean; italic?: boolean; underline?: boolean; color?: string }
function processTextReplacement(text: string, dataLinkPayload: DataLinkItem[] = []): string {
  let processedText = text
  dataLinkPayload.forEach(({ key, value }) => {
    const pattern = new RegExp(`\\[${key}\\]`, 'g')
    processedText = processedText.replace(pattern, value)
  })
  return processedText
}

function renderTextWithLinks(text: string, dataLinkPayload: DataLinkItem[], baseStyle: React.CSSProperties): React.ReactNode[] {
  if (!dataLinkPayload.length) return [<span key={0} style={baseStyle}>{text}</span>]
  const nodes: React.ReactNode[] = []
  let remaining = text
  let nodeIdx = 0
  for (const link of dataLinkPayload) {
    const placeholder = `[${link.key}]`
    const idx = remaining.indexOf(placeholder)
    if (idx === -1) continue
    if (idx > 0) nodes.push(<span key={nodeIdx++} style={baseStyle}>{remaining.slice(0, idx)}</span>)
    nodes.push(
      <span key={nodeIdx++} style={{
        ...baseStyle,
        fontWeight: link.bold ? 'bold' : baseStyle.fontWeight,
        fontStyle: link.italic ? 'italic' : baseStyle.fontStyle,
        textDecoration: link.underline ? 'underline' : baseStyle.textDecoration,
        color: link.color || baseStyle.color,
      }}>{link.value}</span>
    )
    remaining = remaining.slice(idx + placeholder.length)
  }
  if (remaining) nodes.push(<span key={nodeIdx++} style={baseStyle}>{remaining}</span>)
  return nodes.length ? nodes : [<span key={0} style={baseStyle}>{text}</span>]
}

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
  { value: "thick", label: "Thick" },
  { value: "dashed", label: "Dashed" },
  { value: "none", label: "None" },
]

const CIVIL_STATUSES: CivilStatus[] = ["Single", "Married", "Widowed", "Separated"]
const PAPER_SIZE_OPTIONS: { value: PaperSize; label: string }[] = [
  { value: "Letter", label: "Letter (2550×3300)" },
  { value: "Legal", label: "Legal (2550×4200)" },
  { value: "A4", label: "A4 (2481×3507)" },
]

// ─── Form Component ───────────────────────────────────────────────────────────

interface FormProps {
  payload: DocumentPayload
  config: DocumentConfig
  onPayload: (payload: DocumentPayload) => void
  onConfig: (config: DocumentConfig) => void
  onBgUpload: (dataUrl: string) => void
  onPrint: () => void
  onShowPayloads: () => void
}

export function FormComponent({ payload, config, onPayload, onConfig, onBgUpload, onPrint, onShowPayloads }: FormProps) {
  const bgRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const [openDataIndex, setOpenDataIndex] = useState<number | null>(null)
  const [openStyleIndex, setOpenStyleIndex] = useState<number | null>(null)
  const [openLinkIndex, setOpenLinkIndex] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'data' | 'style' | 'link'; index: number } | null>(null)

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

  function handleUploadPayload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (data.config) onConfig({ ...DEFAULT_CONFIG, ...data.config })
        if (data.payload) onPayload(data.payload)
      } catch { /* ignore */ }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6 p-5">

      {/* Upload Existing Payload */}
      <div className="flex items-center gap-2">
        <input ref={uploadRef} type="file" accept=".json" onChange={handleUploadPayload} className="hidden" />
        <button onClick={() => uploadRef.current?.click()} className="w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-primary/50 px-3 py-2 text-xs text-primary hover:bg-primary/5 transition">
          <Download className="h-3.5 w-3.5" />Upload Existing Payload
        </button>
      </div>

      {/* Paper Size & Gridlines */}
      <FieldGroup label="Paper Configuration" icon={Settings2}>
        <Field label="Paper Size">
          <select className={inputCls} value={config.paperSize || "A4"}
            onChange={(e) => {
              const paperSize = e.target.value as PaperSize
              const gridlines = PAPER_SIZES[paperSize]
              onConfig({ ...config, paperSize, gridlines })
            }}>
            {PAPER_SIZE_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </Field>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Show Gridlines</span>
          <Toggle checked={config.showGridlines || false} onChange={() => onConfig({ ...config, showGridlines: !config.showGridlines })} />
        </div>
      </FieldGroup>

      {/* Data Payloads */}
      <FieldGroup label="Data Payloads" icon={Hash}>
        <div className="space-y-2">
          {(config.dataPayloads || []).map((item, index) => (
            <div key={index} className="border border-border rounded-md bg-muted/20 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-muted/40 transition"
                onClick={() => setOpenDataIndex(openDataIndex === index ? null : index)}
              >
                <span className="text-muted-foreground truncate max-w-[160px]">{item.value || `Item ${index + 1}`}</span>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ type: 'data', index }) }} className="text-destructive hover:bg-destructive/10 p-0.5 rounded"><X className="h-3 w-3" /></button>
                  <span className="text-muted-foreground">{openDataIndex === index ? '▲' : '▼'}</span>
                </div>
              </button>
              {openDataIndex === index && (
                <div className="p-3 border-t border-border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="X Axis *">
                      <input type="number" className={cn(inputCls, !item.xAxis && "border-destructive")} value={item.xAxis||""} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,xAxis:e.target.value===""?0:Number(e.target.value)}; onConfig({...config,dataPayloads:n}) }} placeholder="Required" min="0" />
                    </Field>
                    <Field label="Y Axis *">
                      <input type="number" className={cn(inputCls, !item.yAxis && "border-destructive")} value={item.yAxis||""} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,yAxis:e.target.value===""?0:Number(e.target.value)}; onConfig({...config,dataPayloads:n}) }} placeholder="Required" min="0" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Font Size">
                      <input type="number" className={inputCls} value={item.font_size||12} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,font_size:Number(e.target.value)||12}; onConfig({...config,dataPayloads:n}) }} min="8" max="72" />
                    </Field>
                    <Field label="Text Width">
                      <input type="number" className={inputCls} value={item.textWidth||""} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,textWidth:e.target.value===""?undefined:Number(e.target.value)}; onConfig({...config,dataPayloads:n}) }} placeholder="Auto" min="0" />
                    </Field>
                  </div>
                  <Field label="Text Align">
                    <div className="flex gap-1">
                      {(["left","center","justify","right"] as const).map(a => (
                        <button key={a} onClick={() => { const n=[...(config.dataPayloads||[])]; n[index]={...item,textAlign:a}; onConfig({...config,dataPayloads:n}) }} className={cn("flex-1 py-1 text-xs rounded border transition capitalize", (item.textAlign||"center")===a ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted")}>{a}</button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Text Indent">
                    <input type="number" className={inputCls} value={item.textIndent||""} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,textIndent:e.target.value===""?undefined:Number(e.target.value)}; onConfig({...config,dataPayloads:n}) }} placeholder="0" min="0" />
                  </Field>
                  <Field label="Text Value">
                    <input className={inputCls} value={item.value} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,value:e.target.value}; onConfig({...config,dataPayloads:n}) }} placeholder="Text content" />
                  </Field>
                  <Field label="Image URL">
                    <input className={inputCls} value={item.image?.url||""} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,image:e.target.value?{url:e.target.value,width:item.image?.width||50,height:item.image?.height||50,opacity:item.image?.opacity||100}:undefined}; onConfig({...config,dataPayloads:n}) }} placeholder="https://..." />
                  </Field>
                  {item.image?.url && (
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Img W"><input type="number" className={inputCls} value={item.image.width} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,image:{...item.image!,width:Number(e.target.value)||50}}; onConfig({...config,dataPayloads:n}) }} /></Field>
                      <Field label="Img H"><input type="number" className={inputCls} value={item.image.height} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,image:{...item.image!,height:Number(e.target.value)||50}}; onConfig({...config,dataPayloads:n}) }} /></Field>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Font Family">
                      <select className={inputCls} value={item.font_family||"Times New Roman"} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,font_family:e.target.value}; onConfig({...config,dataPayloads:n}) }}>
                        {["Times New Roman","Arial","Helvetica","Georgia","Courier New"].map(f=><option key={f}>{f}</option>)}
                      </select>
                    </Field>
                    <Field label="Color"><input type="color" className={inputCls} value={item.color||"#1a1a1a"} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,color:e.target.value}; onConfig({...config,dataPayloads:n}) }} /></Field>
                  </div>
                  <div className="flex gap-3">
                    {(["bold","italic","underline"] as const).map(k => (
                      <label key={k} className="flex items-center gap-1.5 text-xs cursor-pointer capitalize">
                        <input type="checkbox" checked={!!item[k]} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,[k]:e.target.checked}; onConfig({...config,dataPayloads:n}) }} className="rounded" />{k}
                      </label>
                    ))}
                  </div>
                  <Field label="Z-Index">
                    <input type="number" className={inputCls} value={item.zIndex||1} onChange={(e) => { const n=[...(config.dataPayloads||[])]; n[index]={...item,zIndex:Number(e.target.value)||1}; onConfig({...config,dataPayloads:n}) }} min="0" max="999" />
                  </Field>
                </div>
              )}
            </div>
          ))}
          <button onClick={() => {
            const newIdx = (config.dataPayloads||[]).length
            onConfig({ ...config, dataPayloads: [...(config.dataPayloads||[]), { xAxis:100,yAxis:100,value:"New Text",font_size:12,font_family:"Times New Roman",bold:false,italic:false,underline:false,color:"#1a1a1a" }] })
            setOpenDataIndex(newIdx)
          }} className="w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary transition">
            <Hash className="h-3.5 w-3.5" />Add Data Item
          </button>
        </div>
      </FieldGroup>

      {/* Styles Payload */}
      <FieldGroup label="Styles Payload" icon={Settings2}>
        <div className="space-y-2">
          {(config.stylesPayload || []).map((item, index) => (
            <div key={index} className="border border-border rounded-md bg-muted/20 overflow-hidden">
              <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-muted/40 transition" onClick={() => setOpenStyleIndex(openStyleIndex===index?null:index)}>
                <span className="text-muted-foreground">{item.shape} {index+1} ({item.xAxis},{item.yAxis})</span>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ type: 'style', index }) }} className="text-destructive hover:bg-destructive/10 p-0.5 rounded"><X className="h-3 w-3" /></button>
                  <span className="text-muted-foreground">{openStyleIndex===index?'▲':'▼'}</span>
                </div>
              </button>
              {openStyleIndex === index && (
                <div className="p-3 border-t border-border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="X Axis *"><input type="number" className={inputCls} value={item.xAxis||""} onChange={(e) => { const n=[...(config.stylesPayload||[])]; n[index]={...item,xAxis:e.target.value===""?0:Number(e.target.value)}; onConfig({...config,stylesPayload:n}) }} /></Field>
                    <Field label="Y Axis *"><input type="number" className={inputCls} value={item.yAxis||""} onChange={(e) => { const n=[...(config.stylesPayload||[])]; n[index]={...item,yAxis:e.target.value===""?0:Number(e.target.value)}; onConfig({...config,stylesPayload:n}) }} /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Shape"><select className={inputCls} value={item.shape} onChange={(e) => { const n=[...(config.stylesPayload||[])]; n[index]={...item,shape:e.target.value as "line"|"box"}; onConfig({...config,stylesPayload:n}) }}><option value="line">Line</option><option value="box">Box</option></select></Field>
                    <Field label="Border Color"><input type="color" className={inputCls} value={item.color||"#000000"} onChange={(e) => { const n=[...(config.stylesPayload||[])]; n[index]={...item,color:e.target.value}; onConfig({...config,stylesPayload:n}) }} /></Field>
                  </div>
                  {item.shape === "box" && (
                    <Field label="Fill Color">
                      <div className="flex items-center gap-2">
                        <input type="color" className={inputCls} value={item.fillColor||"#ffffff"} onChange={(e) => { const n=[...(config.stylesPayload||[])]; n[index]={...item,fillColor:e.target.value}; onConfig({...config,stylesPayload:n}) }} />
                        <button onClick={() => { const n=[...(config.stylesPayload||[])]; n[index]={...item,fillColor:undefined}; onConfig({...config,stylesPayload:n}) }} className="text-xs text-muted-foreground hover:text-destructive">Clear</button>
                      </div>
                    </Field>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Width *"><input type="number" className={inputCls} value={item.width||""} onChange={(e) => { const n=[...(config.stylesPayload||[])]; n[index]={...item,width:e.target.value===""?0:Number(e.target.value)}; onConfig({...config,stylesPayload:n}) }} /></Field>
                    <Field label="Height *"><input type="number" className={inputCls} value={item.height||""} onChange={(e) => { const n=[...(config.stylesPayload||[])]; n[index]={...item,height:e.target.value===""?0:Number(e.target.value)}; onConfig({...config,stylesPayload:n}) }} /></Field>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button onClick={() => { const newIdx=(config.stylesPayload||[]).length; onConfig({...config,stylesPayload:[...(config.stylesPayload||[]),{shape:"line",width:2,height:120,color:"#000000",xAxis:100,yAxis:98}]}); setOpenStyleIndex(newIdx) }} className="w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary transition">
            <Settings2 className="h-3.5 w-3.5" />Add Style Item
          </button>
        </div>
      </FieldGroup>

      {/* Data Link Payload */}
      <FieldGroup label="Data Link Payload" icon={MapPin}>
        <div className="space-y-2">
          {(config.dataLinkPayload || []).map((item, index) => (
            <div key={index} className="border border-border rounded-md bg-muted/20 overflow-hidden">
              <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-muted/40 transition" onClick={() => setOpenLinkIndex(openLinkIndex===index?null:index)}>
                <span className="text-muted-foreground">[{item.key}] → {item.value}</span>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ type: 'link', index }) }} className="text-destructive hover:bg-destructive/10 p-0.5 rounded"><X className="h-3 w-3" /></button>
                  <span className="text-muted-foreground">{openLinkIndex===index?'▲':'▼'}</span>
                </div>
              </button>
              {openLinkIndex === index && (
                <div className="p-3 border-t border-border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Key *"><input className={inputCls} value={item.key} onChange={(e) => { const n=[...(config.dataLinkPayload||[])]; n[index]={...item,key:e.target.value}; onConfig({...config,dataLinkPayload:n}) }} placeholder="name" /></Field>
                    <Field label="Value *"><input className={inputCls} value={item.value} onChange={(e) => { const n=[...(config.dataLinkPayload||[])]; n[index]={...item,value:e.target.value}; onConfig({...config,dataLinkPayload:n}) }} placeholder="Juan" /></Field>
                  </div>
                  <div className="flex items-center gap-3">
                    {(['bold','italic','underline'] as const).map(k => (
                      <label key={k} className="flex items-center gap-1.5 text-xs cursor-pointer capitalize">
                        <input type="checkbox" checked={!!item[k]} onChange={(e) => { const n=[...(config.dataLinkPayload||[])]; n[index]={...item,[k]:e.target.checked}; onConfig({...config,dataLinkPayload:n}) }} className="rounded" />{k}
                      </label>
                    ))}
                    <Field label="Color">
                      <input type="color" className="h-7 w-10 rounded border border-input cursor-pointer" value={item.color||'#1a1a1a'} onChange={(e) => { const n=[...(config.dataLinkPayload||[])]; n[index]={...item,color:e.target.value}; onConfig({...config,dataLinkPayload:n}) }} />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button onClick={() => { const newIdx=(config.dataLinkPayload||[]).length; onConfig({...config,dataLinkPayload:[...(config.dataLinkPayload||[]),{key:"name",value:"Juan"}]}); setOpenLinkIndex(newIdx) }} className="w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary transition">
            <MapPin className="h-3.5 w-3.5" />Add Data Link
          </button>
        </div>
      </FieldGroup>

      {/* Delete Confirmation Modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-80 p-5 space-y-4">
            <h3 className="text-sm font-semibold">Confirm Delete</h3>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to remove this {confirmDelete.type === 'data' ? 'data item' : confirmDelete.type === 'style' ? 'style item' : 'data link'}? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted transition">Cancel</button>
              <button onClick={() => {
                if (confirmDelete.type === 'data') {
                  const n = [...(config.dataPayloads||[])]; n.splice(confirmDelete.index, 1); onConfig({...config, dataPayloads: n})
                  if (openDataIndex === confirmDelete.index) setOpenDataIndex(null)
                } else if (confirmDelete.type === 'style') {
                  const n = [...(config.stylesPayload||[])]; n.splice(confirmDelete.index, 1); onConfig({...config, stylesPayload: n})
                  if (openStyleIndex === confirmDelete.index) setOpenStyleIndex(null)
                } else {
                  const n = [...(config.dataLinkPayload||[])]; n.splice(confirmDelete.index, 1); onConfig({...config, dataLinkPayload: n})
                  if (openLinkIndex === confirmDelete.index) setOpenLinkIndex(null)
                }
                setConfirmDelete(null)
              }} className="px-3 py-1.5 text-xs rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
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
  if (v === "thick") return { outer: { ...base, border: `${bw + 3}px solid ${c}` }, inner: null }
  if (v === "dashed") return { outer: { ...base, border: `${bw}px dashed ${c}` }, inner: { ...base2, border: `${Math.max(1, bw - 1)}px dotted ${c}` } }
  return { outer: {} as React.CSSProperties, inner: null }
}

// ─── Preview Document ─────────────────────────────────────────────────────────

interface PreviewDocumentProps {
  payload?: DocumentPayload
  config?: DocumentConfig
  src?: string | { config: DocumentConfig; payload: DocumentPayload }
  dataLinkPayload?: { key: string; value: string }[]
}

export const PreviewDocument = forwardRef<HTMLDivElement, PreviewDocumentProps>(
  ({ payload: propPayload, config: propConfig = DEFAULT_CONFIG, src, dataLinkPayload }, ref) => {
    const [payload, setPayload] = useState<DocumentPayload>(propPayload || DEFAULT_PAYLOAD)
    const [config, setConfig] = useState<DocumentConfig>(propConfig)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    // Handle src and dataLinkPayload prop changes
    useEffect(() => {
      // Handle dataLinkPayload prop merging
      if (dataLinkPayload && dataLinkPayload.length > 0) {
        setConfig(prev => {
          const existingKeys = (prev.dataLinkPayload || []).map(item => item.key)
          const newLinks = dataLinkPayload.filter(item => !existingKeys.includes(item.key))
          return {
            ...prev,
            dataLinkPayload: [...(prev.dataLinkPayload || []), ...newLinks]
          }
        })
      }

      if (!src) {
        if (propPayload) setPayload(propPayload)
        if (propConfig) setConfig(propConfig)
        return
      }

      // If src is an object (direct data)
      if (typeof src === 'object') {
        const mergedConfig = {
          ...src.config,
          dataLinkPayload: [...(src.config.dataLinkPayload || []), ...(dataLinkPayload || [])]
        }
        setConfig(mergedConfig)
        setPayload(src.payload)
        return
      }

      // If src is a URL string
      if (typeof src === 'string') {
        setLoading(true)

        fetch(src)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            return response.json()
          })
          .then(data => {
            if (!data.config || !data.payload) {
              throw new Error('Invalid JSON structure. Expected { config: {...}, payload: {...} }')
            }
            
            // Merge dataLinkPayload prop with loaded config
            const mergedConfig = {
              ...data.config,
              dataLinkPayload: [...(data.config.dataLinkPayload || []), ...(dataLinkPayload || [])]
            }
            
            setConfig(mergedConfig)
            setPayload(data.payload)
            
            if (toast) {
              toast({
                title: "Data loaded successfully!",
                description: `Document payload loaded from ${src}${dataLinkPayload ? ' with additional data links' : ''}`,
                duration: 3000,
              })
            }
          })
          .catch(error => {
            console.error('Failed to load data:', error.message)
            if (toast) {
              toast({
                title: "Failed to load data",
                description: error.message,
                variant: "error",
                duration: 5000,
              })
            }
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }, [src, dataLinkPayload, propPayload, propConfig, toast])

    const { header, certificationStatement: cs, signatories, ctc, issuanceDate, controlNumber } = payload
    const accentColor = config.borderVariant !== "none" ? config.borderColor : "#6366f1"

    if (loading) {
      return (
        <div ref={ref} style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#666" }}>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>Loading document...</div>
            <div style={{ fontSize: "12px" }}>Please wait</div>
          </div>
        </div>
      )
    }

    const formattedDate = issuanceDate
      ? new Date(issuanceDate).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })
      : "_______________"

    const pronoun = cs.gender === "she" ? "she" : cs.gender === "they" ? "they" : "he"
    const { outer, inner } = resolveBorders(config)

    const gridlines = config.gridlines || PAPER_SIZES[config.paperSize || "A4"]
    const dataPayloads = config.dataPayloads || []
    const stylesPayload = config.stylesPayload || []
    const mergedDataLinkPayload = config.dataLinkPayload || []

    return (
      <div ref={ref} style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#ffffff", color: "#1a1a1a", fontFamily: "'Times New Roman', Times, serif", padding: "18mm 20mm", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>

        {/* Watermark */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-35deg)", fontSize: "72px", fontWeight: 900, color: "rgba(99,102,241,0.05)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", letterSpacing: "4px" }}>
          {/* OFFICIAL DOCUMENT */}
        </div>

        {/* Background image */}
        {config.backgroundImage && (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${config.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center", opacity: config.backgroundOpacity / 100, pointerEvents: "none" }} />
        )}

        {/* Border */}
        {Object.keys(outer).length > 0 && <div style={outer} />}
        {inner && <div style={inner} />}

        {/* Gridlines */}
        {config.showGridlines && gridlines && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.3 }}>
            <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#6366f1" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        )}

        {/* Styles Payload */}
        {stylesPayload.map((item, index) => {
          const x = (item.xAxis * 210) / gridlines.cols
          const y = (item.yAxis * 297) / gridlines.rows
          const width = (item.width * 210) / gridlines.cols
          const height = (item.height * 297) / gridlines.rows

          if (item.shape === "line") {
            return (
              <div
                key={`style-${index}`}
                style={{
                  position: "absolute",
                  left: `${x}mm`,
                  top: `${y}mm`,
                  width: `${width}mm`,
                  height: `${item.width}px`,
                  backgroundColor: item.color,
                  pointerEvents: "none",
                }}
              />
            )
          } else if (item.shape === "box") {
            return (
              <div
                key={`style-${index}`}
                style={{
                  position: "absolute",
                  left: `${x}mm`,
                  top: `${y}mm`,
                  width: `${width}mm`,
                  height: `${height}mm`,
                  border: `1px solid ${item.color}`,
                  backgroundColor: item.fillColor || "transparent",
                  pointerEvents: "none",
                }}
              />
            )
          }
          return null
        })}

        {/* Data Payloads */}
        {dataPayloads
          .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
          .map((item, index) => {
            const x = (item.xAxis * 210) / gridlines.cols
            const y = (item.yAxis * 297) / gridlines.rows

            // Render image if present
            if (item.image?.url) {
              const imageWidth = (item.image.width * 210) / gridlines.cols
              const imageHeight = (item.image.height * 297) / gridlines.rows
              const imageOpacity = (item.image.opacity || 100) / 100

              return (
                <img
                  key={`image-${index}`}
                  src={item.image.url}
                  alt={item.value || "Image"}
                  style={{
                    position: "absolute",
                    left: `${x}mm`,
                    top: `${y}mm`,
                    width: `${imageWidth}mm`,
                    height: `${imageHeight}mm`,
                    objectFit: "contain",
                    pointerEvents: "none",
                    transform: "translate(-50%, -50%)",
                    opacity: imageOpacity,
                    zIndex: item.zIndex || 1,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              )
            }

            // Render text if no image or if text is provided
            if (item.value) {
              const textWidthMm = item.textWidth ? (item.textWidth * 210) / gridlines.cols : undefined
              const baseStyle: React.CSSProperties = {
                fontWeight: item.bold ? 'bold' : 'normal',
                fontStyle: item.italic ? 'italic' : 'normal',
                textDecoration: item.underline ? 'underline' : 'none',
              }
              return (
                <div
                  key={`text-${index}`}
                  style={{
                    position: "absolute",
                    left: `${x}mm`,
                    top: `${y}mm`,
                    fontSize: `${item.font_size || 12}px`,
                    fontFamily: item.font_family || "'Times New Roman', Times, serif",
                    color: item.color || "#1a1a1a",
                    pointerEvents: "none",
                    transform: "translate(-50%, -50%)",
                    whiteSpace: textWidthMm ? "normal" : "nowrap",
                    width: textWidthMm ? `${textWidthMm}mm` : undefined,
                    wordBreak: textWidthMm ? "break-word" : undefined,
                    zIndex: item.zIndex || 1,
                    textAlign: item.textAlign || "center",
                    textIndent: item.textIndent ? `${(item.textIndent * 210) / gridlines.cols}mm` : undefined,
                  }}
                >
                  {renderTextWithLinks(item.value, mergedDataLinkPayload, baseStyle)}
                </div>
              )
            }

            return null
          })}

        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: "6mm" }}>
          <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#555", margin: 0 }}>{header.republic}</p>
          <p style={{ fontSize: "9px", color: "#555", margin: "1mm 0 0" }}>{header.province}</p>
          <p style={{ fontSize: "9px", color: "#555", margin: "0" }}>{header.cityMunicipality}</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12mm", margin: "5mm 0" }}>
            {header.officialSeal && (
              <img src={header.officialSeal} alt="Official Seal"
                style={{ width: "22mm", height: "22mm", objectFit: "contain" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            )}
            <div>
              <p style={{ fontSize: "8px", letterSpacing: "1px", textTransform: "uppercase", color: "#555", margin: 0 }}></p>
              <h1 style={{ fontSize: "18px", fontWeight: 900, margin: "1mm 0", color: "#1a1a1a", letterSpacing: "1px" }}>
                {header.barangayName}
              </h1>
              <p style={{ fontSize: "9px", color: "#555", margin: 0 }}>{header.cityMunicipality}</p>
            </div>
          </div>

          {/* <div style={{ borderTop: `2px solid ${accentColor}`, margin: "3mm 0 1mm" }} />
          <div style={{ borderTop: `1px solid ${accentColor}`, margin: "0 0 4mm" }} /> */}

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
          {cs.fullName && (
            <>
              <p style={{ margin: "0 0 4mm" }}>TO WHOM IT MAY CONCERN:</p>

              <p style={{ margin: "0 0 5mm", textIndent: "12mm" }}>
                This is to certify that{" "}
                <strong style={{ borderBottom: "1px solid #1a1a1a" }}>
                  {cs.fullName.toUpperCase()}
                </strong>
                , of legal age, <strong>{cs.civilStatus}</strong>, residing at{" "}
                <strong>{cs.completeAddress}</strong>,
                is a bonafide resident of this barangay. Based on barangay records,{" "}
                <strong>{pronoun}</strong> has no pending case, complaint, or violation and is of good moral character.
                This certificate is issued upon request of the above-named person for{" "}
                <strong>{cs.purpose}</strong>.
              </p>

              <p style={{ margin: "0 0 6mm", textIndent: "12mm" }}>
                Issued this <strong>{formattedDate}</strong> at {header.barangayName}, {header.cityMunicipality}, Philippines.
              </p>
            </>
          )}
        </div>

        {/* ── CTC — optional ── */}
        {config.showCtc && (ctc?.number || ctc?.date || ctc?.place) && (
          <div style={{ border: "1px solid #ccc", borderRadius: "3px", padding: "3mm 4mm", marginBottom: "8mm", fontSize: "9px", backgroundColor: "#fafafa" }}>
            <p style={{ margin: 0, fontWeight: 700, marginBottom: "1mm" }}>Community Tax Certificate (CTC)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2mm" }}>
              <span>No.: <strong>{ctc?.number}</strong></span>
              <span>Date: <strong>{ctc?.date}</strong></span>
              <span>Place: <strong>{ctc?.place}</strong></span>
            </div>
          </div>
        )}

        {/* ── SIGNATORIES ── */}
        {(signatories.secretary.name || signatories.captain.name) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10mm", marginTop: "4mm" }}>
            {[signatories.secretary, signatories.captain].map((s, i) => (
              s.name && (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ borderBottom: "1px solid #1a1a1a", marginBottom: "2mm", paddingBottom: "8mm" }} />
                  <p style={{ margin: 0, fontSize: "10px", fontWeight: 700 }}>{s.name}</p>
                  <p style={{ margin: "1mm 0 0", fontSize: "9px", color: "#555" }}>{s.title}</p>
                </div>
              )
            ))}
          </div>
        )}

        {/* ── BARANGAY SEAL stamp area ── */}
        {header.officialSeal && (
          <div style={{ position: "absolute", bottom: "28mm", right: "22mm", width: "22mm", height: "22mm", border: "1px dashed #ccc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={header.officialSeal} alt="Seal"
              style={{ width: "18mm", height: "18mm", objectFit: "contain", opacity: 0.25 }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
          </div>
        )}

        {/* Footer */}
        <div style={{ position: "absolute", bottom: "14mm", left: "20mm", right: "20mm", textAlign: "center", fontSize: "8px", color: "#aaa", borderTop: "0.5px solid #ddd", paddingTop: "2mm" }}>
          {/* This document is valid only when signed and sealed by the issuing authority. */}
        </div>
      </div>
    )
  }
)
PreviewDocument.displayName = "PreviewDocument"

// ─── DocumentGenerator ────────────────────────────────────────────────────────

interface DocumentGeneratorProps {
  className?: string
  src?: string | { config: DocumentConfig; payload: DocumentPayload }
  dataLinkPayload?: { key: string; value: string }[]
}

export function DocumentGenerator({ className, src, dataLinkPayload }: DocumentGeneratorProps) {
  const [payload, setPayload] = useState<DocumentPayload>(DEFAULT_PAYLOAD)
  const [config, setConfig] = useState<DocumentConfig>(DEFAULT_CONFIG)
  const [showPayloads, setShowPayloads] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(0.85)
  const printRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Handle src and dataLinkPayload prop changes
  useEffect(() => {
    // Handle dataLinkPayload prop merging
    if (dataLinkPayload && dataLinkPayload.length > 0) {
      setConfig(prev => {
        const existingKeys = (prev.dataLinkPayload || []).map(item => item.key)
        const newLinks = dataLinkPayload.filter(item => !existingKeys.includes(item.key))
        return {
          ...prev,
          dataLinkPayload: [...(prev.dataLinkPayload || []), ...newLinks]
        }
      })
    }

    if (!src) return

    // If src is an object (direct data)
    if (typeof src === 'object') {
      const mergedConfig = {
        ...src.config,
        dataLinkPayload: [...(src.config.dataLinkPayload || []), ...(dataLinkPayload || [])]
      }
      setConfig(mergedConfig)
      setPayload(src.payload)
      setError(null)
      return
    }

    // If src is a URL string
    if (typeof src === 'string') {
      setLoading(true)
      setError(null)

      fetch(src)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          return response.json()
        })
        .then(data => {
          if (!data.config || !data.payload) {
            throw new Error('Invalid JSON structure. Expected { config: {...}, payload: {...} }')
          }
          
          // Merge dataLinkPayload prop with loaded config
          const mergedConfig = {
            ...data.config,
            dataLinkPayload: [...(data.config.dataLinkPayload || []), ...(dataLinkPayload || [])]
          }
          
          setConfig(mergedConfig)
          setPayload(data.payload)
          setError(null)
          toast({
            title: "Data loaded successfully!",
            description: `Document payload loaded from ${src}${dataLinkPayload ? ' with additional data links' : ''}`,
            duration: 3000,
          })
        })
        .catch(error => {
          setError(error.message)
          toast({
            title: "Failed to load data",
            description: error.message,
            variant: "error",
            duration: 5000,
          })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [src, dataLinkPayload, toast])
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${payload.title}-${payload.certificationStatement.fullName || "Document"}`,
    pageStyle: `@page{size:A4;margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`,
  })

  const payloadData = {
    config: {
      paperSize: config.paperSize,
      gridlines: config.gridlines,
      showGridlines: config.showGridlines,
      dataPayloads: config.dataPayloads,
      stylesPayload: config.stylesPayload,
      dataLinkPayload: config.dataLinkPayload
    },
    payload
  }

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(payloadData, null, 2));
    toast({
      title: "Copied to clipboard!",
      description: "The document payload has been copied to your clipboard.",
      duration: 2000,
    })
  }

  const handleDownloadPayload = () => {
    const blob = new Blob([JSON.stringify(payloadData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document-payload-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn("flex gap-0 h-screen", className)}>
      {/* Left: Form — scrollable */}
      <div className="w-100 shrink-0 border-r border-border overflow-y-auto bg-card">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-border bg-card/90 backdrop-blur">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Data Payload Customization</span>
            {loading && <span className="text-xs text-muted-foreground">(Loading...)</span>}
            {error && <span className="text-xs text-destructive">(Error)</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePrint()}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition print:hidden">
              <Printer className="h-3.5 w-3.5" />Print / PDF
            </button>
            <button onClick={() => setShowPayloads(true)}
              className="flex items-center gap-1.5 rounded-md bg-warning px-3 py-1.5 text-xs font-semibold text-warning-foreground hover:bg-warning/90 transition print:hidden">
              <Eye className="h-3.5 w-3.5" />Show Payloads
            </button>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mx-5 mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-xs">
            <strong>Failed to load from src:</strong> {error}
          </div>
        )}
        
        <FormComponent
          payload={payload} config={config}
          onPayload={setPayload} onConfig={setConfig}
          onBgUpload={(url) => setConfig((p) => ({ ...p, backgroundImage: url }))}
          onPrint={() => handlePrint()}
          onShowPayloads={() => setShowPayloads(true)}
        />
      </div>

      {/* Right: A4 Preview — sticky */}
      <div className="flex-1 bg-muted/40 flex flex-col items-center py-8 px-4 overflow-y-auto">
        <div className="sticky top-8">
          <div className="flex items-center justify-center gap-2 mb-4 print:hidden">
            <button onClick={() => setZoom(z => Math.max(0.3, +(z - 0.1).toFixed(1)))} className="w-7 h-7 rounded border border-border bg-card hover:bg-muted flex items-center justify-center text-sm font-bold">-</button>
            <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))} className="w-7 h-7 rounded border border-border bg-card hover:bg-muted flex items-center justify-center text-sm font-bold">+</button>
            <button onClick={() => setZoom(0.85)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border bg-card hover:bg-muted">Reset</button>
          </div>
          <div style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.18)", borderRadius: "2px", transform: `scale(${zoom})`, transformOrigin: "top center" }}>
            <PreviewDocument ref={printRef} payload={payload} config={config} />
          </div>
        </div>
      </div>

      {/* Payload Modal */}
      {showPayloads && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">JSON Payload</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/90 transition"
                >
                  <Copy className="h-3.5 w-3.5" />Copy
                </button>
                <button
                  onClick={handleDownloadPayload}
                  className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
                >
                  <Download className="h-3.5 w-3.5" />Download
                </button>
                <button
                  onClick={() => setShowPayloads(false)}
                  className="flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 transition"
                >
                  <X className="h-3.5 w-3.5" />Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-xs bg-muted/50 p-4 rounded-md overflow-auto">
                <code>{JSON.stringify(payloadData, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
