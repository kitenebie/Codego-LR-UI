import * as React from "react"
import { Check, X, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { cn } from "@/src/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type WizardVariant = "default" | "minimal" | "cards" | "sidebar" | "dots"
export type WizardLayout  = "modal" | "page" | "inline"
export type WizardSize    = "sm" | "md" | "lg" | "xl" | "full"

export interface WizardStep {
  /** Step title shown in the header / sidebar */
  title: string
  /** Optional subtitle / description */
  description?: string
  /** Optional icon rendered in the step indicator */
  icon?: React.ReactNode
  /** Step body content */
  content: React.ReactNode
  /** Mark step as optional */
  optional?: boolean
  /** Prevent advancing past this step until resolved */
  validate?: () => boolean | string
}

export interface WizardActionProps {
  /** Current step index (0-based) */
  step: number
  /** Total number of steps */
  total: number
  /** Go to previous step */
  onBack: () => void
  /** Go to next step / finish */
  onNext: () => void
  /** Close / cancel the wizard */
  onClose?: () => void
  /** Whether the wizard is on the last step */
  isLast: boolean
  /** Whether the wizard is on the first step */
  isFirst: boolean
  /** Whether the next action is loading */
  loading?: boolean
}

export interface WizardProps {
  // ── Content ──────────────────────────────────────────────────────────────
  steps: WizardStep[]

  // ── State ────────────────────────────────────────────────────────────────
  /** Controlled current step (0-based) */
  step?: number
  /** Initial step when uncontrolled */
  defaultStep?: number
  /** Called when the step changes */
  onStepChange?: (step: number) => void
  /** Called when the wizard finishes (last step → next) */
  onFinish?: () => void
  /** Called when the wizard is closed / cancelled */
  onClose?: () => void

  // ── Layout ───────────────────────────────────────────────────────────────
  /** Render mode: modal overlay, full page, or inline block */
  layout?: WizardLayout
  /** Visual design variant */
  variant?: WizardVariant
  /** Size of the wizard panel */
  size?: WizardSize

  // ── Modal-specific ───────────────────────────────────────────────────────
  /** Controls modal visibility (required when layout="modal") */
  isOpen?: boolean
  /** Show the × close button in modal mode */
  showClose?: boolean
  /** Prevent closing by clicking the backdrop */
  unchange?: boolean

  // ── Header ───────────────────────────────────────────────────────────────
  /** Override the wizard title shown in the header */
  title?: React.ReactNode
  /** Subtitle shown below the title */
  description?: React.ReactNode
  /** Hide the step indicator header entirely */
  hideHeader?: boolean

  // ── Footer / Actions ─────────────────────────────────────────────────────
  /** Fully replace the footer with custom content */
  footer?: React.ReactNode
  /** Replace only the action buttons with a render-prop */
  renderActions?: (props: WizardActionProps) => React.ReactNode
  /** Label for the Back button */
  backLabel?: React.ReactNode
  /** Label for the Next button */
  nextLabel?: React.ReactNode
  /** Label for the Finish button (last step) */
  finishLabel?: React.ReactNode
  /** Label for the Cancel button */
  cancelLabel?: React.ReactNode
  /** Show a Cancel button in the footer */
  showCancel?: boolean
  /** Show the Back button on the first step */
  showBackOnFirst?: boolean
  /** Whether the next/finish action is in a loading state */
  loading?: boolean
  /** Allow clicking step indicators to jump to any visited step */
  clickableSteps?: boolean

  // ── Styling ──────────────────────────────────────────────────────────────
  className?: string
  contentClassName?: string
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<WizardSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-lg",
  lg:   "max-w-2xl",
  xl:   "max-w-4xl",
  full: "max-w-full",
}

// ─── Step status helper ───────────────────────────────────────────────────────

function stepStatus(idx: number, current: number): "complete" | "current" | "upcoming" {
  if (idx < current)  return "complete"
  if (idx === current) return "current"
  return "upcoming"
}

// ─── Variant: Default (numbered circles + horizontal bar) ─────────────────────

function HeaderDefault({
  steps, current, clickable, onGo,
}: { steps: WizardStep[]; current: number; clickable: boolean; onGo: (i: number) => void }) {
  return (
    <div className="flex items-start w-full">
      {steps.map((step, i) => {
        const status = stepStatus(i, current)
        const isLast = i === steps.length - 1
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div className={cn("flex-1 h-0.5 transition-colors", i <= current ? "bg-primary" : "bg-border")} />
                )}
                <button
                  type="button"
                  disabled={!clickable || status === "upcoming"}
                  onClick={() => clickable && status !== "upcoming" && onGo(i)}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all",
                    status === "complete" && "bg-primary border-primary text-primary-foreground",
                    status === "current"  && "bg-background border-primary text-primary ring-4 ring-primary/20",
                    status === "upcoming" && "bg-background border-border text-muted-foreground",
                    clickable && status !== "upcoming" && "cursor-pointer hover:scale-110",
                  )}
                >
                  {status === "complete" ? <Check className="h-3.5 w-3.5" /> : step.icon ?? <span>{i + 1}</span>}
                </button>
                {!isLast && (
                  <div className={cn("flex-1 h-0.5 transition-colors", i < current ? "bg-primary" : "bg-border")} />
                )}
              </div>
              <div className="mt-2 text-center px-1 max-w-[80px]">
                <p className={cn("text-xs font-medium leading-tight truncate",
                  status === "current"  ? "text-primary" :
                  status === "complete" ? "text-foreground" : "text-muted-foreground"
                )}>{step.title}</p>
                {step.optional && <span className="text-[10px] text-muted-foreground">(optional)</span>}
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Variant: Dots ────────────────────────────────────────────────────────────

function HeaderDots({ steps, current, clickable, onGo }: { steps: WizardStep[]; current: number; clickable: boolean; onGo: (i: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={!clickable || i > current}
            onClick={() => clickable && i <= current && onGo(i)}
            className={cn(
              "rounded-full transition-all duration-200",
              i === current  ? "w-6 h-2.5 bg-primary" :
              i < current    ? "w-2.5 h-2.5 bg-primary/60 hover:bg-primary cursor-pointer" :
                               "w-2.5 h-2.5 bg-border",
            )}
          />
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold">{steps[current]?.title}</p>
        {steps[current]?.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{steps[current].description}</p>
        )}
      </div>
    </div>
  )
}

// ─── Variant: Minimal (just "Step X of Y") ────────────────────────────────────

function HeaderMinimal({ steps, current }: { steps: WizardStep[]; current: number }) {
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <p className="text-base font-semibold">{steps[current]?.title}</p>
        {steps[current]?.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{steps[current].description}</p>
        )}
      </div>
      <span className="text-xs font-medium text-muted-foreground shrink-0 ml-4">
        Step {current + 1} of {steps.length}
      </span>
    </div>
  )
}

// ─── Variant: Cards (pill tabs) ───────────────────────────────────────────────

function HeaderCards({ steps, current, clickable, onGo }: { steps: WizardStep[]; current: number; clickable: boolean; onGo: (i: number) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {steps.map((step, i) => {
        const status = stepStatus(i, current)
        return (
          <button
            key={i}
            type="button"
            disabled={!clickable || status === "upcoming"}
            onClick={() => clickable && status !== "upcoming" && onGo(i)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all",
              status === "complete" && "bg-primary/10 border-primary/30 text-primary cursor-pointer",
              status === "current"  && "bg-primary border-primary text-primary-foreground shadow-sm",
              status === "upcoming" && "bg-muted/40 border-border text-muted-foreground",
              clickable && status !== "upcoming" && "hover:scale-105",
            )}
          >
            {status === "complete" ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
            {step.title}
            {step.optional && <span className="opacity-60">(opt)</span>}
          </button>
        )
      })}
    </div>
  )
}

// ─── Variant: Sidebar ─────────────────────────────────────────────────────────

function SidebarNav({ steps, current, clickable, onGo }: { steps: WizardStep[]; current: number; clickable: boolean; onGo: (i: number) => void }) {
  return (
    <nav className="flex flex-col gap-0.5 w-48 shrink-0 border-r border-border pr-4 py-1">
      {steps.map((step, i) => {
        const status = stepStatus(i, current)
        return (
          <button
            key={i}
            type="button"
            disabled={!clickable || status === "upcoming"}
            onClick={() => clickable && status !== "upcoming" && onGo(i)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-left transition-colors w-full",
              status === "current"  && "bg-primary text-primary-foreground",
              status === "complete" && "text-foreground hover:bg-muted/60 cursor-pointer",
              status === "upcoming" && "text-muted-foreground",
            )}
          >
            <span className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border",
              status === "complete" && "bg-primary/20 border-primary/40 text-primary",
              status === "current"  && "bg-primary-foreground/20 border-primary-foreground/40 text-primary-foreground",
              status === "upcoming" && "bg-muted border-border text-muted-foreground",
            )}>
              {status === "complete" ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{step.title}</span>
              {step.optional && <span className="text-[10px] opacity-60">Optional</span>}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current) / (total - 1)) * 100)
  return (
    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-300 rounded-full"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ─── Default footer actions ───────────────────────────────────────────────────

function DefaultActions({
  step, total, onBack, onNext, onClose, isLast, isFirst,
  backLabel, nextLabel, finishLabel, cancelLabel,
  showCancel, showBackOnFirst, loading,
}: WizardActionProps & Pick<WizardProps,
  "backLabel" | "nextLabel" | "finishLabel" | "cancelLabel" | "showCancel" | "showBackOnFirst" | "loading"
>) {
  const showBack = !isFirst || showBackOnFirst

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <div className="flex items-center gap-2">
        {showCancel && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            {cancelLabel ?? "Cancel"}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isFirst}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
            {backLabel ?? "Back"}
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Processing...
            </span>
          ) : isLast ? (
            <><Check className="h-4 w-4" />{finishLabel ?? "Finish"}</>
          ) : (
            <>{nextLabel ?? "Next"}<ChevronRight className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Wizard inner panel ───────────────────────────────────────────────────────

function WizardPanel({
  steps, current, onGo,
  variant, size,
  title, description, hideHeader,
  footer, renderActions,
  backLabel, nextLabel, finishLabel, cancelLabel,
  showCancel, showBackOnFirst, loading, clickableSteps,
  onBack, onNext, onClose,
  className, contentClassName,
}: {
  steps: WizardStep[]
  current: number
  onGo: (i: number) => void
  onBack: () => void
  onNext: () => void
  onClose?: () => void
} & Pick<WizardProps,
  "variant" | "size" | "title" | "description" | "hideHeader" |
  "footer" | "renderActions" |
  "backLabel" | "nextLabel" | "finishLabel" | "cancelLabel" |
  "showCancel" | "showBackOnFirst" | "loading" | "clickableSteps" |
  "className" | "contentClassName"
>) {
  const isFirst = current === 0
  const isLast  = current === steps.length - 1
  const isSidebar = variant === "sidebar"

  const [validationError, setValidationError] = React.useState<string | null>(null)

  const handleNext = () => {
    const validate = steps[current]?.validate
    if (validate) {
      const result = validate()
      if (result === false) { setValidationError("Please complete this step before continuing."); return }
      if (typeof result === "string") { setValidationError(result); return }
    }
    setValidationError(null)
    onNext()
  }

  const actionProps: WizardActionProps = {
    step: current, total: steps.length,
    onBack, onNext: handleNext, onClose,
    isFirst, isLast, loading,
  }

  return (
    <div className={cn(
      "flex flex-col w-full",
      size && !isSidebar && SIZE_MAP[size ?? "md"],
      className,
    )}>
      {/* Header */}
      {!hideHeader && (
        <div className={cn(
          "shrink-0 px-6 pt-5 pb-4",
          variant !== "sidebar" && "border-b border-border",
        )}>
          {(title || description) && (
            <div className="mb-4">
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
            </div>
          )}
          {variant === "default"  && <HeaderDefault steps={steps} current={current} clickable={!!clickableSteps} onGo={onGo} />}
          {variant === "dots"     && <HeaderDots    steps={steps} current={current} clickable={!!clickableSteps} onGo={onGo} />}
          {variant === "minimal"  && <HeaderMinimal steps={steps} current={current} />}
          {variant === "cards"    && <HeaderCards   steps={steps} current={current} clickable={!!clickableSteps} onGo={onGo} />}
          {(variant === "default" || variant === "minimal") && (
            <div className="mt-3">
              <ProgressBar current={current} total={steps.length} />
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className={cn("flex flex-1 min-h-0", isSidebar && "gap-6 px-6 py-5")}>
        {isSidebar && (
          <SidebarNav steps={steps} current={current} clickable={!!clickableSteps} onGo={onGo} />
        )}
        <div className={cn(
          "flex-1 min-w-0",
          !isSidebar && "px-6 py-5",
          contentClassName,
        )}>
          {validationError && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {validationError}
            </div>
          )}
          {steps[current]?.content}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-6 py-4">
        {footer ?? (
          renderActions
            ? renderActions(actionProps)
            : (
              <DefaultActions
                {...actionProps}
                backLabel={backLabel}
                nextLabel={nextLabel}
                finishLabel={finishLabel}
                cancelLabel={cancelLabel}
                showCancel={showCancel}
                showBackOnFirst={showBackOnFirst}
                loading={loading}
              />
            )
        )}
      </div>
    </div>
  )
}

// ─── Main Wizard component ────────────────────────────────────────────────────

export function Wizard({
  steps,
  step: controlledStep,
  defaultStep = 0,
  onStepChange,
  onFinish,
  onClose,
  layout = "inline",
  variant = "default",
  size = "md",
  isOpen = false,
  showClose = true,
  unchange = false,
  title,
  description,
  hideHeader = false,
  footer,
  renderActions,
  backLabel,
  nextLabel,
  finishLabel,
  cancelLabel,
  showCancel = false,
  showBackOnFirst = false,
  loading = false,
  clickableSteps = false,
  className,
  contentClassName,
}: WizardProps) {
  const [internalStep, setInternalStep] = React.useState(defaultStep)
  const current = controlledStep ?? internalStep

  const go = (idx: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, idx))
    if (controlledStep === undefined) setInternalStep(clamped)
    onStepChange?.(clamped)
  }

  const handleBack = () => go(current - 1)
  const handleNext = () => {
    if (current === steps.length - 1) { onFinish?.(); return }
    go(current + 1)
  }

  // Escape key for modal
  React.useEffect(() => {
    if (layout !== "modal" || !isOpen || unchange) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [layout, isOpen, unchange, onClose])

  const panel = (
    <WizardPanel
      steps={steps}
      current={current}
      onGo={go}
      onBack={handleBack}
      onNext={handleNext}
      onClose={onClose}
      variant={variant}
      size={size}
      title={title}
      description={description}
      hideHeader={hideHeader}
      footer={footer}
      renderActions={renderActions}
      backLabel={backLabel}
      nextLabel={nextLabel}
      finishLabel={finishLabel}
      cancelLabel={cancelLabel}
      showCancel={showCancel}
      showBackOnFirst={showBackOnFirst}
      loading={loading}
      clickableSteps={clickableSteps}
      contentClassName={contentClassName}
    />
  )

  // ── Modal layout ────────────────────────────────────────────────────────────
  if (layout === "modal") {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => !unchange && onClose?.()}
        />
        <div className={cn(
          "relative z-10 w-full rounded-2xl border border-border bg-background/90 backdrop-blur-xl shadow-2xl overflow-hidden",
          SIZE_MAP[size],
          className,
        )}>
          {showClose && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
          {panel}
        </div>
      </div>
    )
  }

  // ── Page layout ─────────────────────────────────────────────────────────────
  if (layout === "page") {
    return (
      <div className={cn("w-full min-h-screen flex items-start justify-center p-6 bg-background", className)}>
        <div className={cn(
          "w-full rounded-2xl border border-border bg-card shadow-lg overflow-hidden",
          SIZE_MAP[size],
        )}>
          {panel}
        </div>
      </div>
    )
  }

  // ── Inline layout ───────────────────────────────────────────────────────────
  return (
    <div className={cn(
      "w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden",
      SIZE_MAP[size],
      className,
    )}>
      {panel}
    </div>
  )
}
