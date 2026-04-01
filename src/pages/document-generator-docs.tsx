import { DocsLayout, Section } from "../components/ui/toc"
import { Playground } from "../components/playground"
import { PropsTable } from "../components/ui/props-table"
import { DocumentGenerator, PreviewDocument, type DocumentPayload, type DocumentConfig, type GridlinesColRows, type DataPayloadItem, type StylesPayloadItem, type PaperSize } from "../components/ui/document-generator"
import { useState, useRef } from "react"
import { Upload, FileText, AlertCircle, CheckCircle, Link, Download } from "lucide-react"

const TOC = [
  { id: "live", label: "Live Generator" },
  { id: "import", label: "JSON Import" },
  { id: "usage", label: "Usage Example" },
  { id: "src-usage", label: "src & dataLinkPayload" },
  { id: "payload", label: "Payload Structure" },
  { id: "config", label: "DocumentConfig" },
  { id: "gridlines", label: "Gridlines & Data" },
  { id: "styles", label: "Styles Payload" },
  { id: "props", label: "Props" },
]

const DEMO_PAYLOAD: DocumentPayload = {
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

const DEMO_CONFIG: DocumentConfig = {
  borderVariant: "none",
  borderWidth: 0,
  borderColor: "#6366f1",
  backgroundImage: "",
  backgroundOpacity: 0,
  showCtc: false,
  paperSize: "A4",
  gridlines: { cols: 2481, rows: 3507 },
  showGridlines: true,
  dataPayloads: [
    { xAxis: 1000, yAxis: 500, value: "Sample Text", font_size: 14, bold: true, color: "#ff0000" },
    { xAxis: 1500, yAxis: 800, value: "Another Cell", font_size: 12, italic: true, color: "#0000ff" },
  ],
  stylesPayload: [
    { shape: "line", width: 2, height: 120, color: "#000000", xAxis: 100, yAxis: 98 },
    { shape: "box", width: 120, height: 80, color: "#333333", xAxis: 390, yAxis: 800 },
  ],
}

// JSON Import Playground Component
function JsonImportPlayground() {
  const [importedPayload, setImportedPayload] = useState<DocumentPayload | null>(null)
  const [importedConfig, setImportedConfig] = useState<DocumentConfig | null>(null)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)

        // Validate the JSON structure
        if (!jsonData.config || !jsonData.payload) {
          throw new Error('Invalid JSON structure. Expected { config: {...}, payload: {...} }')
        }

        setImportedConfig(jsonData.config)
        setImportedPayload(jsonData.payload)
        setImportStatus('success')
        setErrorMessage('')
      } catch (error) {
        setImportStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Invalid JSON file')
        setImportedConfig(null)
        setImportedPayload(null)
      }
    }
    reader.readAsText(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        // Create a proper file input and trigger the upload
        if (fileInputRef.current) {
          const dt = new DataTransfer()
          dt.items.add(file)
          fileInputRef.current.files = dt.files
          handleFileUpload({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>)
        }
      } else {
        setImportStatus('error')
        setErrorMessage('Please upload a JSON file')
      }
    }
  }

  const resetImport = () => {
    setImportedPayload(null)
    setImportedConfig(null)
    setImportStatus('idle')
    setErrorMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Upload JSON Payload</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop a JSON file here, or click to browse
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4" />
          Accepts .json files exported from "Show Payloads"
        </div>
      </div>

      {/* Status Messages */}
      {importStatus === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-md text-success">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">JSON imported successfully!</span>
          <button
            onClick={resetImport}
            className="ml-auto text-xs underline hover:no-underline"
          >
            Reset
          </button>
        </div>
      )}

      {importStatus === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Error: {errorMessage}</span>
          <button
            onClick={resetImport}
            className="ml-auto text-xs underline hover:no-underline"
          >
            Reset
          </button>
        </div>
      )}

      {/* Preview */}
      {importedPayload && importedConfig && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Imported Document Preview</h4>
          <div className="overflow-auto border border-border rounded-lg bg-muted/30 p-4 flex justify-center">
            <div style={{ transform: "scale(0.4)", transformOrigin: "top center", height: "120mm" }}>
              <PreviewDocument payload={importedPayload} config={importedConfig} />
            </div>
          </div>

          {/* JSON Display */}
          <details className="border border-border rounded-md">
            <summary className="p-3 cursor-pointer hover:bg-muted/50 text-sm font-medium">
              View Imported JSON Data
            </summary>
            <div className="p-4 border-t border-border bg-muted/20">
              <pre className="text-xs overflow-auto max-h-64 bg-background p-3 rounded border">
                <code>{JSON.stringify({ config: importedConfig, payload: importedPayload }, null, 2)}</code>
              </pre>
            </div>
          </details>

          {/* Implementation Code Example */}
          <div className="mt-6 p-4 border border-border rounded-md bg-muted/20">
            <h5 className="text-sm font-semibold mb-3 text-foreground">Implementation Code</h5>
            <p className="text-xs text-muted-foreground mb-3">
              Copy this code to implement the DocumentGenerator with your imported JSON data:
            </p>
            <pre className="text-xs overflow-auto max-h-48 bg-background p-3 rounded border font-mono">
              <code>{`import { DocumentGenerator, type DocumentConfig, type DocumentPayload } from "@juv/codego-react-ui"
import { useState } from "react"

function MyDocumentApp() {
  // Initialize with imported data
  const [payload, setPayload] = useState<DocumentPayload>(${JSON.stringify(importedPayload, null, 2)})
  
  const [config, setConfig] = useState<DocumentConfig>(${JSON.stringify(importedConfig, null, 2)})

  return (
    <div className="h-screen">
      <DocumentGenerator 
        payload={payload}
        config={config}
        onPayload={setPayload}
        onConfig={setConfig}
        onBgUpload={(url) => setConfig(prev => ({ ...prev, backgroundImage: url }))}
        onPrint={() => console.log('Print triggered')}
      />
    </div>
  )
}`}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

// URL Import Playground Component
function UrlImportPlayground({ src }: { src?: string }) {
  const [url, setUrl] = useState(src || '')
  const [importedPayload, setImportedPayload] = useState<DocumentPayload | null>(null)
  const [importedConfig, setImportedConfig] = useState<DocumentConfig | null>(null)
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleUrlImport = async () => {
    if (!url.trim()) {
      setImportStatus('error')
      setErrorMessage('Please enter a valid URL')
      return
    }

    setImportStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new Error('URL does not return JSON content')
      }

      const jsonData = await response.json()

      // Validate the JSON structure
      if (!jsonData.config || !jsonData.payload) {
        throw new Error('Invalid JSON structure. Expected { config: {...}, payload: {...} }')
      }

      setImportedConfig(jsonData.config)
      setImportedPayload(jsonData.payload)
      setImportStatus('success')
    } catch (error) {
      setImportStatus('error')
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage('Network error: Unable to fetch from URL. Check CORS policy.')
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to import from URL')
      }
      setImportedConfig(null)
      setImportedPayload(null)
    }
  }

  const resetImport = () => {
    setImportedPayload(null)
    setImportedConfig(null)
    setImportStatus('idle')
    setErrorMessage('')
    setUrl(src || '')
  }

  const downloadJson = () => {
    if (!importedPayload || !importedConfig) return

    const data = { config: importedConfig, payload: importedPayload }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `imported-payload-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  }

  return (
    <div className="space-y-6">
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Link className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Import from URL</h3>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/payload.json"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={importStatus === 'loading'}
          />
          <button
            onClick={handleUrlImport}
            disabled={importStatus === 'loading' || !url.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {importStatus === 'loading' ? 'Loading...' : 'Import'}
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Enter a URL that returns JSON data with the expected payload structure
        </p>
      </div>

      {importStatus === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-md text-success">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">JSON imported successfully from URL!</span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={downloadJson}
              className="text-xs underline hover:no-underline flex items-center gap-1"
            >
              <Download className="h-3 w-3" />Download
            </button>
            <button
              onClick={resetImport}
              className="text-xs underline hover:no-underline"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {importStatus === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
          <AlertCircle className="h-4 w-4" />
          <div className="flex-1">
            <span className="text-sm font-medium">Error: {errorMessage}</span>
            {errorMessage.includes('CORS') && (
              <p className="text-xs mt-1 opacity-80">
                Tip: The server must allow CORS requests or serve the JSON from the same domain.
              </p>
            )}
          </div>
          <button
            onClick={resetImport}
            className="text-xs underline hover:no-underline"
          >
            Reset
          </button>
        </div>
      )}

      {importedPayload && importedConfig && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Imported Document Preview</h4>
          <div className="overflow-auto border border-border rounded-lg bg-muted/30 p-4 flex justify-center">
            <div style={{ transform: "scale(0.4)", transformOrigin: "top center", height: "120mm" }}>
              <PreviewDocument payload={importedPayload} config={importedConfig} />
            </div>
          </div>

          <details className="border border-border rounded-md">
            <summary className="p-3 cursor-pointer hover:bg-muted/50 text-sm font-medium">
              View Imported JSON Data
            </summary>
            <div className="p-4 border-t border-border bg-muted/20">
              <pre className="text-xs overflow-auto max-h-64 bg-background p-3 rounded border">
                <code>{JSON.stringify({ config: importedConfig, payload: importedPayload }, null, 2)}</code>
              </pre>
            </div>
          </details>

          <div className="mt-6 p-4 border border-border rounded-md bg-muted/20">
            <h5 className="text-sm font-semibold mb-3 text-foreground">Implementation Code</h5>
            <p className="text-xs text-muted-foreground mb-3">
              Copy this code to implement the DocumentGenerator with your imported JSON data:
            </p>
            <pre className="text-xs overflow-auto max-h-48 bg-background p-3 rounded border font-mono">
              <code>{`import { DocumentGenerator, type DocumentConfig, type DocumentPayload } from "@juv/codego-react-ui"
import { useState } from "react"

function MyDocumentApp() {
  // Initialize with imported data from URL: ${url}
  const [payload, setPayload] = useState<DocumentPayload>(${JSON.stringify(importedPayload, null, 2)})
  
  const [config, setConfig] = useState<DocumentConfig>(${JSON.stringify(importedConfig, null, 2)})

  return (
    <div className="h-screen">
      <DocumentGenerator 
        payload={payload}
        config={config}
        onPayload={setPayload}
        onConfig={setConfig}
        onBgUpload={(url) => setConfig(prev => ({ ...prev, backgroundImage: url }))}
        onPrint={() => console.log('Print triggered')}
      />
    </div>
  )
}`}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export function DocumentGeneratorDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Playground title="🎯 Data Payload Customization"
      description="Configure gridlines → Add data items → Preview updates → Print / PDF"
      code={`
        // URL-based loading
        <DocumentGenerator src="https://api.example.com/document.json" />

        // Direct object loading
        const myData = { config: {...}, payload: {...} }
        <DocumentGenerator src={myData} />

        // No src (manual configuration)
        <DocumentGenerator />

        `}>
            <DocumentGenerator />
      </Playground>
      <Section id="import">
        <Playground
          title="JSON Import Playground"
          description="Upload and preview JSON files exported from the 'Show Payloads' feature. Drag and drop or click to browse for .json files."
          code={`// Expected JSON structure from exported payloads:
{
  "config": {
    "paperSize": "A4",
    "gridlines": { "cols": 2481, "rows": 3507 },
    "showGridlines": true,
    "dataPayloads": [
      {
        "xAxis": 1240,
        "yAxis": 400,
        "value": "CERTIFICATE",
        "font_size": 18,
        "bold": true,
        "color": "#000000"
      }
    ],
    "stylesPayload": [
      {
        "shape": "line",
        "width": 2,
        "height": 100,
        "color": "#000000",
        "xAxis": 1240,
        "yAxis": 350
      }
    ]
  },
  "payload": {
    "type": "Barangay Clearance",
    "header": { ... },
    "certificationStatement": { ... },
    // ... rest of document payload
  }
}

// Usage in your app:
function importJsonData(jsonFile: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result as string)
    setConfig(data.config)
    setPayload(data.payload)
  }
  reader.readAsText(jsonFile)
}
  
CODE (JSON):
  <JsonImportPlayground />

CODE (URL)
  <UrlImportPlayground src="https://api.example.com/document-payload.json" />
`}
        >
          <div className="flex flex-col gap-4">
            <JsonImportPlayground />
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Import from URL</h4>
              <UrlImportPlayground src="https://api.example.com/document-payload.json" />
            </div>
          </div>
        </Playground>
      </Section>

      <Section id="usage">
        <Playground
          title="Usage Example"
          description="Complete example showing how to use the DocumentGenerator with data payloads and styles."
          code={`import { DocumentGenerator, type DocumentConfig } from "@juv/codego-react-ui"

function MyDocumentApp() {
  const [config, setConfig] = useState<DocumentConfig>({
    paperSize: "A4",
    gridlines: { cols: 2481, rows: 3507 },
    dataPayloads: [
      {
        xAxis: 1240,        // Center horizontally
        yAxis: 400,         // Top area
        value: "CERTIFICATE OF EMPLOYMENT",
        font_size: 18,
        bold: true,
        color: "#000000"
      },
      {
        xAxis: 620,         // Left aligned
        yAxis: 800,
        value: "Employee Name:",
        font_size: 12,
        bold: true,
        color: "#333333"
      },
      {
        xAxis: 1200,        // Value position
        yAxis: 800,
        value: "John Doe",
        font_size: 12,
        underline: true,
        color: "#000000"
      }
    ],
    stylesPayload: [
      {
        shape: "line",
        width: 3,           // Line thickness
        height: 1000,       // Line length
        color: "#000000",
        xAxis: 1240,        // Center line
        yAxis: 350
      },
      {
        shape: "box",
        width: 2000,        // Box width
        height: 1500,       // Box height
        color: "#666666",
        xAxis: 1240,        // Center box
        yAxis: 1200
      }
    ]
  })

  return (
    <div className="h-screen">
      <DocumentGenerator 
        config={config}
        onConfig={setConfig}
      />
    </div>
  )
}`}
        >
          <div className="text-sm text-muted-foreground p-4 border border-border rounded-md bg-muted/30 space-y-2">
            <p><strong>Text Centering:</strong> xAxis/yAxis coordinates represent the center point of text elements.</p>
            <p><strong>Grid System:</strong> A4 paper uses 2481×3507 grid for precise positioning.</p>
            <p><strong>Layering:</strong> Styles render first, then text elements on top.</p>
            <p><strong>Responsive:</strong> All elements scale proportionally with the document size.</p>
          </div>
        </Playground>
      </Section>

      <Section id="src-usage">
        <Playground
          title="src & dataLinkPayload Props"
          description="Load document data from URLs or objects with dynamic text replacement."
          code={`// URL loading with user data
const userDetails = [
  { key: "name", value: "Juan Dela Cruz" },
  { key: "position", value: "Software Engineer" }
]

<DocumentGenerator 
  src="https://api.example.com/document.json" 
  dataLinkPayload={userDetails}
/>

// Object loading with user data
const documentData = { config: {...}, payload: {...} }

<DocumentGenerator 
  src={documentData} 
  dataLinkPayload={userDetails}
/>

// Preview with src prop (recommended)
<PreviewDocument 
  src={documentData} 
  dataLinkPayload={userDetails}
/>

// Preview with manual config (alternative)
const payload = {
  type: "Barangay Clearance",
  header: {
    republic: "Republic of the Philippines",
    barangayName: "Barangay San Jose",
    cityMunicipality: "Quezon City",
    province: "Metro Manila",
    officialSeal: ""
  },
  title: "BARANGAY CLEARANCE",
  controlNumber: "2024-001",
  certificationStatement: {
    fullName: "[name]",
    civilStatus: "Single",
    gender: "he",
    completeAddress: "123 Main St, Quezon City",
    purpose: "Employment"
  },
  issuanceDate: "2024-12-15",
  signatories: {
    captain: { name: "Maria Santos", title: "Barangay Captain" },
    secretary: { name: "Jose Cruz", title: "Barangay Secretary" }
  }
}

const config = {
  paperSize: "A4",
  gridlines: { cols: 2481, rows: 3507 },
  dataPayloads: [
    { xAxis: 1240, yAxis: 400, value: "Certificate for [name]", font_size: 16, bold: true },
    { xAxis: 1240, yAxis: 600, value: "Position: [position]", font_size: 12 }
  ],
  stylesPayload: [],
  dataLinkPayload: userDetails
}

<PreviewDocument 
  payload={payload}
  config={config}
/>`}
        >
          <div className="p-4 border border-info/20 rounded-md bg-info/10 text-xs">
            <strong>Dynamic Replacement:</strong> Use <code>[key]</code> in text values. Example: <code>"Hello [name]"</code> becomes <code>"Hello Juan Dela Cruz"</code>
          </div>
        </Playground>
      </Section>

      <Section id="payload">
        <Playground
          title="Payload Structure"
          description="The DocumentPayload mirrors the official Barangay Clearance structure."
          code={`const payload: DocumentPayload = {
  type: "Barangay Clearance",
  header: {
    republic: "",
    barangayName: "",
    cityMunicipality: "",
    province: "",
    officialSeal: "",          // image URL or data URL
  },
  title: "",
  controlNumber: "",
  certificationStatement: {
    fullName: "",
    civilStatus: "Single",               // Single | Married | Widowed | Separated
    gender: "he",                        // he | she | they
    completeAddress: "",
    purpose: "",
  },
  issuanceDate: "",
  signatories: {
    captain:   { name: "", title: "" },
    secretary: { name: "", title: "" },
  },
  ctc: { number: "", date: "", place: "" }, // optional
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
          description="Controls visual styling — border variant, width, color, background image, CTC visibility, paper size, and gridlines."
          code={`const config: DocumentConfig = {
  borderVariant: "double",   // double | single | thick | dashed | none
  borderWidth: 2,            // 1–8 px
  borderColor: "#6366f1",
  backgroundImage: "",       // data URL from file upload
  backgroundOpacity: 8,      // 2–40 %
  showCtc: true,             // toggle CTC section
  paperSize: "A4",           // Letter | Legal | A4
  gridlines: { cols: 2481, rows: 3507 },  // grid dimensions
  dataPayloads: [],          // array of text data
  stylesPayload: [],         // array of shapes/lines
}`}
        >
          <div className="text-sm text-muted-foreground p-4 border border-border rounded-md bg-muted/30 space-y-1">
            <p>Use the <strong>Document Style</strong> panel in the form to configure these visually.</p>
            <p>All changes reflect instantly in the live preview.</p>
          </div>
        </Playground>
      </Section>

      <Section id="gridlines">
        <Playground
          title="Gridlines & Data Payloads"
          description="Paper sizes with predefined grid dimensions and data payload positioning system."
          code={`// Paper Size Presets
const PAPER_SIZES = {
  Letter: { cols: 2550, rows: 3300 },
  Legal:  { cols: 2550, rows: 4200 },
  A4:     { cols: 2481, rows: 3507 },
}

// Data Payload Structure
const dataPayloads: DataPayloadItem[] = [
  {
    xAxis: 1000,             // X coordinate on grid
    yAxis: 500,              // Y coordinate on grid
    value: "Sample Text",    // Text content
    font_size: 14,           // Font size in px
    font_family: "Arial",    // Font family
    bold: true,              // Bold text
    italic: false,           // Italic text
    underline: false,        // Underlined text
    color: "#ff0000"         // Text color
  },
  // ... more items
]`}
        >
          <div className="text-sm text-muted-foreground p-4 border border-border rounded-md bg-muted/30 space-y-2">
            <p><strong>Gridlines:</strong> 1×1 pixel grid overlay with configurable dimensions per paper size.</p>
            <p><strong>Positioning:</strong> Direct X/Y coordinate positioning on the grid system.</p>
            <p><strong>Formatting:</strong> Individual text styling per data payload item.</p>
          </div>
        </Playground>
      </Section>

      <Section id="styles">
        <Playground
          title="Styles Payload"
          description="Draw lines and boxes on the document using coordinate positioning system."
          code={`// Styles Payload Structure
const stylesPayload: StylesPayloadItem[] = [
  {
    shape: "line",           // "line" | "box"
    width: 2,               // Line thickness or box width
    height: 120,            // Line length or box height
    color: "#000000",       // Shape color
    xAxis: 100,             // X coordinate on grid
    yAxis: 98               // Y coordinate on grid
  },
  {
    shape: "box",
    width: 120,
    height: 80,
    color: "#333333",
    xAxis: 390,
    yAxis: 800
  },
  // ... more items
]`}
        >
          <div className="text-sm text-muted-foreground p-4 border border-border rounded-md bg-muted/30 space-y-2">
            <p><strong>Line Shape:</strong> Creates horizontal lines with specified width (thickness) and height (length).</p>
            <p><strong>Box Shape:</strong> Creates rectangular borders with specified width and height dimensions.</p>
            <p><strong>Positioning:</strong> Uses same X/Y coordinate system as data payloads.</p>
            <p><strong>Styling:</strong> Customizable color for each shape element.</p>
          </div>
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "src", type: "string | { config: DocumentConfig; payload: DocumentPayload }", default: "—", description: "Load document data from URL or object. Supports JSON endpoints or direct data objects." },
          { prop: "dataLinkPayload", type: "{ key: string; value: string }[]", default: "—", description: "Key-value pairs for dynamic text replacement. Use [key] syntax in text values." },
          { prop: "className", type: "string", default: "—", description: "Extra CSS classes on the DocumentGenerator wrapper." },
        ]} />

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">PreviewDocument Props</h3>
          <PropsTable rows={[
            { prop: "payload", type: "DocumentPayload", default: "DEFAULT_PAYLOAD", description: "Full document payload for rendering. Optional when using src prop." },
            { prop: "config", type: "DocumentConfig", default: "DEFAULT_CONFIG", description: "Visual config for borders, background, gridlines, and data payloads. Optional when using src prop." },
            { prop: "src", type: "string | { config: DocumentConfig; payload: DocumentPayload }", default: "—", description: "Load document data from URL or object. Takes precedence over payload/config props." },
            { prop: "dataLinkPayload", type: "{ key: string; value: string }[]", default: "—", description: "Key-value pairs for dynamic text replacement. Merges with src dataLinkPayload." },
          ]} />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Type Definitions</h3>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-md bg-muted/30">
              <h4 className="font-medium mb-2">PaperSize</h4>
              <code className="text-sm">"Letter" | "Legal" | "A4"</code>
            </div>
            <div className="p-4 border border-border rounded-md bg-muted/30">
              <h4 className="font-medium mb-2">GridlinesColRows</h4>
              <code className="text-sm">{`{ cols: number; rows: number }`}</code>
            </div>
            <div className="p-4 border border-border rounded-md bg-muted/30">
              <h4 className="font-medium mb-2">StylesPayloadItem</h4>
              <code className="text-sm text-wrap">
                {`{
  shape: "line" | "box";
  width: number;
  height: number;
  color: string;
  xAxis: number;
  yAxis: number;
}`}
              </code>
            </div>
            <div className="p-4 border border-border rounded-md bg-muted/30">
              <h4 className="font-medium mb-2">DataPayloadItem</h4>
              <code className="text-sm text-wrap">
                {`{
  xAxis: number;
  yAxis: number;
  value: string;
  font_size?: number;
  font_family?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  image?: {
    url: string;
    width: number;
    height: number;
  };
}`}
              </code>
            </div>
          </div>
        </div>
      </Section>

    </DocsLayout>
  )
}
