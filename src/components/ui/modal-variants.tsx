import * as React from "react"
import { AlertTriangle, CheckCircle, Trash2, X } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Checkbox } from "./checkbox"
import { ToggleSwitch } from "./toggle-switch"
import { Select } from "./select"
import { RadioGroup } from "./radio-group"
import { Slider } from "./slider"
import { TagInput } from "./tag-input"
import { OtpInput } from "./otp-input"
import { Combobox } from "./combobox"
import { ColorPicker } from "./color-picker"
import { DateRangePicker } from "./date-range-picker"
import { RichTextEditor } from "./rich-text-editor"
import { FileUpload } from "./file-upload"
import { Repeater } from "./repeater"

// ─── Shared overlay/panel ────────────────────────────────────────────────────

function ModalBase({
  isOpen,
  onClose,
  children,
  className,
  unclosable = false,
}: {
  isOpen: boolean
  onClose?: () => void
  children: React.ReactNode
  className?: string
  unclosable?: boolean
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !unclosable) onClose?.()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", onKey)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [isOpen, unclosable, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => !unclosable && onClose?.()}
      />
      <div
        className={cn(
          "relative z-50 w-full max-w-md border border-white/10 bg-background/90 backdrop-blur-xl shadow-2xl rounded-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

// ─── ModalUnchange ───────────────────────────────────────────────────────────

export interface ModalUnchangeProps {
  isOpen: boolean
  /** Title shown in the header */
  title?: React.ReactNode
  /** Subtitle / description */
  description?: React.ReactNode
  /** Icon shown next to the title */
  icon?: React.ReactNode
  /** Footer action buttons */
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

/**
 * A modal that cannot be dismissed by clicking the backdrop or pressing Escape.
 * Use for critical flows (e.g. accept terms, mandatory onboarding).
 */
export function ModalUnchange({
  isOpen,
  title,
  description,
  icon,
  footer,
  children,
  className,
}: ModalUnchangeProps) {
  return (
    <ModalBase isOpen={isOpen} unclosable className={className}>
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
          <div className="space-y-1">
            {title && <h2 className="text-lg font-semibold leading-tight">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {children && <div className="text-sm">{children}</div>}
        {footer && (
          <div className="flex justify-end gap-2 pt-2">{footer}</div>
        )}
      </div>
    </ModalBase>
  )
}

// ─── ModalConfirmation ───────────────────────────────────────────────────────

export type ConfirmVariant = "danger" | "warning" | "success" | "info"

export interface ModalConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  /** Visual variant — affects icon and confirm button color */
  variant?: ConfirmVariant
  title?: React.ReactNode
  description?: React.ReactNode
  /** Label for the confirm button */
  confirmLabel?: string
  /** Label for the cancel button */
  cancelLabel?: string
  /** Show a loading spinner on the confirm button */
  loading?: boolean
  className?: string
}

const VARIANT_CONFIG: Record<ConfirmVariant, { icon: React.ReactNode; btnClass: string }> = {
  danger:  { icon: <Trash2 className="h-5 w-5 text-danger" />,        btnClass: "bg-danger hover:bg-danger/90 text-white" },
  warning: { icon: <AlertTriangle className="h-5 w-5 text-warning" />, btnClass: "bg-warning hover:bg-warning/90 text-white" },
  success: { icon: <CheckCircle className="h-5 w-5 text-success" />,   btnClass: "bg-success hover:bg-success/90 text-white" },
  info:    { icon: <CheckCircle className="h-5 w-5 text-info" />,      btnClass: "bg-info hover:bg-info/90 text-white" },
}

/**
 * A two-button confirmation modal with danger / warning / success / info variants.
 */
export function ModalConfirmation({
  isOpen,
  onClose,
  onConfirm,
  variant = "danger",
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  className,
}: ModalConfirmationProps) {
  const { icon, btnClass } = VARIANT_CONFIG[variant]

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} className={className}>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{icon}</div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold leading-tight">{title}</h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
              btnClass
            )}
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalBase>
  )
}

// ─── ModalWithForms ──────────────────────────────────────────────────────────

export type FormFieldType =
  | "text" | "email" | "password" | "number"
  | "textarea" | "checkbox" | "toggle" | "select" | "radio"
  | "slider" | "tag-input" | "otp" | "combobox" | "color-picker"
  | "date-range" | "rich-text" | "file-upload" | "repeater" | "button"

export interface FormField {
  /** Unique key */
  name: string
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  /** Options for select / radio / combobox — string[] or { label, value }[] */
  options?: string[] | { label: string; value: string }[]
  /** Custom renderer — overrides built-in field */
  render?: (value: any, onChange: (v: any) => void) => React.ReactNode
  /** Button label (type="button") */
  buttonLabel?: string
  /** Button variant */
  buttonVariant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger" | "success" | "destructive"
  /** onClick for type="button" */
  onClick?: () => void
  min?: number
  max?: number
  step?: number
  /** OTP digit length */
  digits?: number
}

export interface ModalWithFormsProps {
  isOpen: boolean
  onClose: () => void
  /** Called with the form values on submit */
  onSubmit: (values: Record<string, any>) => void
  title?: React.ReactNode
  description?: React.ReactNode
  fields: FormField[]
  /** Label for the submit button */
  submitLabel?: string
  /** Label for the cancel button */
  cancelLabel?: string
  /** Show loading state on submit button */
  loading?: boolean
  className?: string
}

/**
 * A modal that renders a dynamic form from a `fields` array.
 */
export function ModalWithForms({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  fields,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  loading = false,
  className,
}: ModalWithFormsProps) {
  const [values, setValues] = React.useState<Record<string, any>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  )

  function handleChange(name: string, val: any) {
    setValues((prev) => ({ ...prev, [name]: val }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  function renderField(field: FormField) {
    if (field.render) return <>{field.render(values[field.name], (v) => handleChange(field.name, v))}</>

    const strOptions = (field.options ?? []).map((o) =>
      typeof o === "string" ? { label: o, value: o } : o
    )

    switch (field.type) {
      case "textarea":
        return <Textarea value={values[field.name] ?? ""} onChange={(e) => handleChange(field.name, e.target.value)} placeholder={field.placeholder} rows={3} />
      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Checkbox checked={!!values[field.name]} onChange={(e) => handleChange(field.name, e.target.checked)} />
            <span className="text-sm">{field.label}</span>
          </div>
        )
      case "toggle":
        return <ToggleSwitch checked={!!values[field.name]} onChange={(v) => handleChange(field.name, v)} label={field.label} />
      case "select":
        return (
          <Select
            options={strOptions}
            value={values[field.name] ?? ""}
            onChange={(v) => handleChange(field.name, v)}
            placeholder={field.placeholder ?? "Select…"}
          />
        )
      case "radio":
        return <RadioGroup value={values[field.name] ?? ""} onChange={(v) => handleChange(field.name, v)} options={strOptions} />
      case "slider":
        return (
          <Slider
            value={values[field.name] ?? field.min ?? 0}
            onChange={(v) => handleChange(field.name, v)}
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
          />
        )
      case "tag-input":
        return (
          <TagInput
            value={Array.isArray(values[field.name]) ? values[field.name] : []}
            onChange={(v) => handleChange(field.name, v)}
            placeholder={field.placeholder}
          />
        )
      case "otp":
        return <OtpInput length={field.digits ?? 6} value={values[field.name] ?? ""} onChange={(v) => handleChange(field.name, v)} />
      case "combobox":
        return (
          <Combobox
            value={values[field.name] ?? ""}
            onChange={(v) => handleChange(field.name, v)}
            options={strOptions}
            placeholder={field.placeholder ?? "Search…"}
          />
        )
      case "color-picker":
        return <ColorPicker value={values[field.name] ?? "#6366f1"} onChange={(v) => handleChange(field.name, v)} />
      case "date-range":
        return <DateRangePicker value={values[field.name] ?? null} onChange={(v) => handleChange(field.name, v)} />
      case "rich-text":
        return <RichTextEditor value={values[field.name] ?? ""} onChange={(v) => handleChange(field.name, v)} />
      case "file-upload":
        return <FileUpload onChange={(files) => handleChange(field.name, files)} />
      case "repeater": {
        const items = Array.isArray(values[field.name]) ? values[field.name] : []
        return (
          <Repeater
            items={items}
            onAdd={() => handleChange(field.name, [...items, {}])}
            onRemove={(i) => handleChange(field.name, items.filter((_: any, idx: number) => idx !== i))}
            renderItem={(_, i) => <span className="text-sm text-muted-foreground">Item {i + 1}</span>}
          />
        )
      }
      case "button":
        return <Button type="button" variant={field.buttonVariant ?? "outline"} onClick={field.onClick}>{field.buttonLabel ?? field.label}</Button>
      case "password":
        return (
          <Input
            inputType="password"
            revealable
            placeholder={field.placeholder}
            required={field.required}
            value={values[field.name] ?? ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        )
      default:
        return (
          <Input
            type={field.type as any}
            placeholder={field.placeholder}
            required={field.required}
            value={values[field.name] ?? ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        )
    }
  }

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} className={cn("max-w-lg", className)}>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          {(title || description) && (
            <div className="space-y-1">
              {title && <h2 className="text-lg font-semibold leading-tight">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          )}
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1">
                {field.type !== "checkbox" && field.type !== "toggle" && field.type !== "button" && (
                  <label className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="ml-1 text-danger">*</span>}
                  </label>
                )}
                {renderField(field)}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && (
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </ModalBase>
  )
}
