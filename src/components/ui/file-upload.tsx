import * as React from "react"
import { UploadCloud, X, GripVertical, Crop, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Sun, Contrast, Check } from "lucide-react"
import { cn } from "@/src/lib/utils"

// ─── Image Editor Types ───────────────────────────────────────────────────────

export type ImageEditorMode = "crop" | "rotate" | "flip" | "brightness" | "contrast"

export interface ImageEditorOptions {
  /** Which tools to show in the editor. Defaults to all. */
  modes?: ImageEditorMode[]
  /** Lock crop to aspect ratio e.g. "1:1", "16:9", "4:3" */
  cropAspectRatio?: string
  /** Initial brightness value 0–200, default 100 */
  defaultBrightness?: number
  /** Initial contrast value 0–200, default 100 */
  defaultContrast?: number
}

// ─── Validation Types ─────────────────────────────────────────────────────────

export interface FileTypeValidation {
  /** Allowed file extensions e.g. [".jpg", ".png", ".pdf"] */
  allowedFileTypes?: string[]
  /** Blocked file extensions e.g. [".exe", ".bat"] */
  rejectedFileTypes?: string[]
  /** Allowed MIME types e.g. ["image/png", "application/pdf"] */
  mimeTypes?: string[]
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement>, FileTypeValidation {
  onFileSelect?: (file: File | null) => void
  onFilesChange?: (files: File[]) => void
  /** Called when any validation rule fails */
  onValidationError?: (message: string, file: File) => void
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  reorderable?: boolean
  imagePreviewHeight?: number
  panelAspectRatio?: string
  label?: string
  helperText?: string
  hint?: string
  /** Enable inline image editor after selecting an image */
  imageEditor?: boolean
  /** Image editor configuration */
  imageEditorOptions?: ImageEditorOptions
  className?: string
  required?: boolean
  error?: string
}

// ─── Animated Dash Border ───────────────────────────────────────────────────────

function DashBorder({ active, disabled }: { active: boolean; disabled: boolean }) {
  const stroke = disabled
    ? "var(--border)"
    : active
    ? "var(--primary)"
    : "var(--muted-foreground)"
  return (
    <svg
      className="absolute inset-0 w-full h-full rounded-xl pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1" y="1"
        width="calc(100% - 2px)" height="calc(100% - 2px)"
        rx="11" ry="11"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeDasharray="6 4"
        style={{
          transition: "stroke 0.2s ease",
          strokeDashoffset: 0,
          animation: active ? "dash-march 0.6s linear infinite" : undefined,
        }}
      />
      <style>{`@keyframes dash-march { to { stroke-dashoffset: -20; } }`}</style>
    </svg>
  )
}

// ─── Image Editor Modal ───────────────────────────────────────────────────────

interface EditorState {
  rotation: number
  flipH: boolean
  flipV: boolean
  brightness: number
  contrast: number
  cropRatio: number | null
}

function ImageEditorModal({
  src,
  options = {},
  onSave,
  onClose,
}: {
  src: string
  options?: ImageEditorOptions
  onSave: (dataUrl: string) => void
  onClose: () => void
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const imgRef = React.useRef<HTMLImageElement | null>(null)
  const modes = options.modes ?? ["crop", "rotate", "flip", "brightness", "contrast"]

  const parseCropRatio = (r?: string): number | null => {
    if (!r) return null
    const [w, h] = r.split(":").map(Number)
    return w && h ? w / h : null
  }

  const [state, setState] = React.useState<EditorState>({
    rotation: 0,
    flipH: false,
    flipV: false,
    brightness: options.defaultBrightness ?? 100,
    contrast: options.defaultContrast ?? 100,
    cropRatio: parseCropRatio(options.cropAspectRatio),
  })

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext("2d")!
    const rad = (state.rotation * Math.PI) / 180
    const sin = Math.abs(Math.sin(rad))
    const cos = Math.abs(Math.cos(rad))
    canvas.width = img.naturalWidth * cos + img.naturalHeight * sin
    canvas.height = img.naturalWidth * sin + img.naturalHeight * cos
    ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%)`
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(rad)
    ctx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1)
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }, [state])

  React.useEffect(() => {
    const img = new Image()
    img.onload = () => { imgRef.current = img; draw() }
    img.src = src
  }, [src])

  React.useEffect(() => { if (imgRef.current) draw() }, [draw])

  const update = (patch: Partial<EditorState>) => setState((s) => ({ ...s, ...patch }))

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (state.cropRatio) {
      const out = document.createElement("canvas")
      const cw = canvas.width
      const ch = canvas.height
      const targetH = cw / state.cropRatio
      const sy = Math.max(0, (ch - targetH) / 2)
      out.width = cw
      out.height = Math.min(ch, targetH)
      out.getContext("2d")!.drawImage(canvas, 0, sy, cw, out.height, 0, 0, cw, out.height)
      onSave(out.toDataURL("image/png"))
    } else {
      onSave(canvas.toDataURL("image/png"))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm ">
      <div className="bg-background border border-white/10 rounded-2xl shadow-2xl p-4 w-full max-w-2xl space-y-4 ">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Edit Image</p>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="overflow-auto rounded-xl bg-black/30 flex items-center justify-center max-h-[50vh]">
          <canvas ref={canvasRef} className="max-w-full max-h-[50vh] object-contain" />
        </div>

        <div className="flex flex-wrap gap-2">
          {modes.includes("rotate") && (
            <>
              <EditorBtn icon={<RotateCcw className="w-4 h-4" />} label="CCW" onClick={() => update({ rotation: state.rotation - 90 })} />
              <EditorBtn icon={<RotateCw className="w-4 h-4" />} label="CW" onClick={() => update({ rotation: state.rotation + 90 })} />
            </>
          )}
          {modes.includes("flip") && (
            <>
              <EditorBtn icon={<FlipHorizontal className="w-4 h-4" />} label="Flip H" onClick={() => update({ flipH: !state.flipH })} active={state.flipH} />
              <EditorBtn icon={<FlipVertical className="w-4 h-4" />} label="Flip V" onClick={() => update({ flipV: !state.flipV })} active={state.flipV} />
            </>
          )}
          {modes.includes("crop") && state.cropRatio && (
            <EditorBtn icon={<Crop className="w-4 h-4" />} label={`Crop ${options.cropAspectRatio}`} onClick={() => {}} active />
          )}
        </div>

        {(modes.includes("brightness") || modes.includes("contrast")) && (
          <div className="space-y-2">
            {modes.includes("brightness") && (
              <SliderRow icon={<Sun className="w-4 h-4" />} label="Brightness" value={state.brightness} onChange={(v) => update({ brightness: v })} />
            )}
            {modes.includes("contrast") && (
              <SliderRow icon={<Contrast className="w-4 h-4" />} label="Contrast" value={state.contrast} onChange={(v) => update({ contrast: v })} />
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1.5 text-sm rounded-lg border border-white/10 hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1">
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  )
}

function EditorBtn({ icon, label, onClick, active }: { icon: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn("flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-colors",
        active ? "border-primary bg-primary/10 text-primary" : "border-white/10 hover:bg-muted text-muted-foreground"
      )}
    >
      {icon}{label}
    </button>
  )
}

function SliderRow({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground w-20">{label}</span>
      <input type="range" min={0} max={200} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-primary" />
      <span className="text-xs text-muted-foreground w-8 text-right">{value}%</span>
    </div>
  )
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateFileType(
  f: File,
  opts: FileTypeValidation
): string | null {
  const ext = "." + f.name.split(".").pop()?.toLowerCase()
  const mime = f.type.toLowerCase()

  if (opts.rejectedFileTypes?.some((r) => r.toLowerCase() === ext))
    return `"${f.name}" has a blocked file type (${ext}).`

  if (opts.allowedFileTypes?.length && !opts.allowedFileTypes.some((a) => a.toLowerCase() === ext))
    return `"${f.name}" is not an allowed file type. Allowed: ${opts.allowedFileTypes.join(", ")}`

  if (opts.mimeTypes?.length && !opts.mimeTypes.some((m) => mime === m.toLowerCase() || (m.endsWith("/*") && mime.startsWith(m.slice(0, -1)))))
    return `"${f.name}" has an unsupported MIME type (${mime}).`

  return null
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FileUpload({
  className,
  onFileSelect,
  onFilesChange,
  onValidationError,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled = false,
  reorderable = false,
  imagePreviewHeight = 192,
  panelAspectRatio,
  label,
  helperText,
  hint,
  imageEditor = false,
  imageEditorOptions = {},
  allowedFileTypes,
  rejectedFileTypes,
  mimeTypes,
  required,
  error: externalError,
  ...props
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const [previews, setPreviews] = React.useState<Record<string, string>>({})
  const [error, setError] = React.useState<string | null>(null)
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dragItem = React.useRef<number | null>(null)
  const dragOverItem = React.useRef<number | null>(null)

  const validateFile = (f: File): string | null => {
    if (maxSize && f.size / 1024 > maxSize)
      return `"${f.name}" exceeds the maximum size of ${maxSize >= 1024 ? `${(maxSize / 1024).toFixed(0)} MB` : `${maxSize} KB`}.`
    return validateFileType(f, { allowedFileTypes, rejectedFileTypes, mimeTypes })
  }

  const generatePreview = (f: File): Promise<[string, string]> =>
    new Promise((resolve) => {
      if (!f.type.startsWith("image/")) return resolve([f.name, ""])
      const reader = new FileReader()
      reader.onloadend = () => resolve([f.name, reader.result as string])
      reader.readAsDataURL(f)
    })

  const handleFiles = async (incoming: FileList | File[]) => {
    setError(null)
    const arr = Array.from(incoming)
    for (const f of arr) {
      const err = validateFile(f)
      if (err) {
        setError(err)
        onValidationError?.(err, f)
        return
      }
    }
    if (multiple) {
      const next = [...files, ...arr].slice(0, maxFiles ?? Infinity)
      const newPreviews = await Promise.all(next.map(generatePreview))
      setPreviews(Object.fromEntries(newPreviews.filter(([, v]) => v)))
      setFiles(next)
      onFilesChange?.(next)
    } else {
      const f = arr[0]
      const [name, src] = await generatePreview(f)
      setPreviews(src ? { [name]: src } : {})
      setFiles([f])
      onFileSelect?.(f)
      onFilesChange?.([f])
    }
  }

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index)
    const removed = files[index]
    setPreviews((p) => { const c = { ...p }; delete c[removed.name]; return c })
    setFiles(next)
    onFilesChange?.(next)
    if (!multiple) { onFileSelect?.(null); if (inputRef.current) inputRef.current.value = "" }
  }

  const handleEditorSave = (dataUrl: string) => {
    if (editingIndex === null) return
    const f = files[editingIndex]
    setPreviews((p) => ({ ...p, [f.name]: dataUrl }))
    setEditingIndex(null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (disabled) return
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(false)
    if (disabled || !e.dataTransfer.files.length) return
    handleFiles(e.dataTransfer.files)
  }

  const handleReorderEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    const next = [...files]
    const [moved] = next.splice(dragItem.current, 1)
    next.splice(dragOverItem.current, 0, moved)
    dragItem.current = null; dragOverItem.current = null
    setFiles(next)
    onFilesChange?.(next)
  }

  const isEmpty = files.length === 0
  const panelStyle = panelAspectRatio ? { aspectRatio: panelAspectRatio } : {}

  return (
    <div className={cn("w-full space-y-1 ", className)} {...props}>
      {label && <p className="text-sm font-medium text-foreground">{label}{required && <span className="text-destructive ml-1">*</span>}</p>}

      <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files) }}
        />

        {isEmpty ? (
          <div
            style={panelStyle}
            className={cn(
              "relative flex flex-col items-center justify-center w-full py-6 rounded-xl transition-colors dark:border-white/30 dark:bg-gray-400/5",
              !panelAspectRatio && `h-[${imagePreviewHeight}px]`,
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer bg-background/50 backdrop-blur-sm hover:bg-background/80",
              dragActive && "bg-background/80"
            )}
            onClick={() => !disabled && inputRef.current?.click()}
          >
            <DashBorder active={dragActive} disabled={disabled} />
            <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              {allowedFileTypes?.length
                ? `Allowed: ${allowedFileTypes.join(", ")}`
                : mimeTypes?.length
                ? mimeTypes.join(", ")
                : "Any file type"}
              {maxSize ? ` · Max ${maxSize >= 1024 ? `${(maxSize / 1024).toFixed(0)} MB` : `${maxSize} KB`}` : ""}
              {maxFiles && multiple ? ` · Up to ${maxFiles} files` : ""}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div
                key={`${f.name}-${i}`}
                draggable={reorderable}
                onDragStart={() => { dragItem.current = i }}
                onDragEnter={() => { dragOverItem.current = i }}
                onDragEnd={handleReorderEnd}
                style={{ height: previews[f.name] ? imagePreviewHeight : undefined }}
                className="relative flex items-center justify-center border border-white/10 rounded-xl glass p-4 overflow-hidden"
              >
                {reorderable && (
                  <GripVertical className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-grab" />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {imageEditor && previews[f.name] && (
                    <button
                      onClick={() => setEditingIndex(i)}
                      className="p-1 bg-background/80 backdrop-blur-md rounded-full shadow-sm hover:bg-muted transition-colors"
                      title="Edit image"
                    >
                      <Crop className="w-4 h-4 text-foreground" />
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(i)}
                    className="p-1 bg-background/80 backdrop-blur-md rounded-full shadow-sm hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                {previews[f.name] ? (
                  <img src={previews[f.name]} alt={f.name} className="max-h-full max-w-full object-contain rounded-md" />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <span className="text-primary font-bold text-lg">{f.name.split(".").pop()?.toUpperCase()}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
              </div>
            ))}
            {multiple && (!maxFiles || files.length < maxFiles) && (
              <button
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className="w-full py-2 text-sm text-muted-foreground border-2 border-dashed border-slate-300 rounded-xl hover:bg-background/50 transition-colors "
              >
                + Add file
              </button>
            )}
          </div>
        )}
      </div>

      {(error || externalError) && <p className="text-xs text-destructive">{error || externalError}</p>}
      {(helperText || hint) && !(error || externalError) && (
        <p className="text-xs text-muted-foreground">{helperText ?? hint}</p>
      )}

      {editingIndex !== null && previews[files[editingIndex]?.name] && (
        <ImageEditorModal
          src={previews[files[editingIndex].name]}
          options={imageEditorOptions}
          onSave={handleEditorSave}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </div>
  )
}
