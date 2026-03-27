import * as React from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/src/lib/utils"

export type StepStatus = "complete" | "current" | "upcoming" | "error"

export interface Step {
  label: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  content?: React.ReactNode
  optional?: boolean
}

export interface StepperProps {
  steps: Step[]
  current?: number
  defaultCurrent?: number
  onChange?: (step: number) => void
  orientation?: "horizontal" | "vertical"
  clickable?: boolean
  className?: string
}

function getStatus(idx: number, current: number): StepStatus {
  if (idx < current) return "complete"
  if (idx === current) return "current"
  return "upcoming"
}

const STEP_RING: Record<StepStatus, string> = {
  complete: "bg-primary border-primary text-primary-foreground",
  current:  "bg-background border-primary text-primary ring-4 ring-primary/20",
  upcoming: "bg-background border-border text-muted-foreground",
  error:    "bg-danger border-danger text-danger-foreground",
}

export function Stepper({
  steps,
  current: controlled,
  defaultCurrent = 0,
  onChange,
  orientation = "horizontal",
  clickable = false,
  className,
}: StepperProps) {
  const [internal, setInternal] = React.useState(defaultCurrent)
  const current = controlled ?? internal

  function go(idx: number) {
    if (!clickable) return
    if (controlled === undefined) setInternal(idx)
    onChange?.(idx)
  }

  const isHorizontal = orientation === "horizontal"

  return (
    <div className={cn("w-full", className)}>
      {/* Step indicators */}
      <div className={cn(
        "flex",
        isHorizontal ? "flex-row items-start" : "flex-col gap-0"
      )}>
        {steps.map((step, i) => {
          const status = getStatus(i, current)
          const isLast = i === steps.length - 1

          return (
            <React.Fragment key={i}>
              <div className={cn(
                "flex",
                isHorizontal ? "flex-col items-center flex-1" : "flex-row gap-4"
              )}>
                {/* Dot + connector row (horizontal) */}
                <div className={cn("flex items-center", isHorizontal ? "w-full" : "flex-col")}>
                  {/* Left connector (horizontal) */}
                  {isHorizontal && i > 0 && (
                    <div className={cn("flex-1 h-0.5 transition-colors", i <= current ? "bg-primary" : "bg-border")} />
                  )}

                  {/* Step dot */}
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => go(i)}
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all",
                      STEP_RING[status],
                      clickable && "cursor-pointer hover:scale-110",
                      !clickable && "cursor-default"
                    )}
                  >
                    {status === "complete" ? <Check className="h-4 w-4" /> :
                     status === "error"    ? <X className="h-4 w-4" /> :
                     step.icon ?? <span>{i + 1}</span>}
                  </button>

                  {/* Right connector (horizontal) */}
                  {isHorizontal && !isLast && (
                    <div className={cn("flex-1 h-0.5 transition-colors", i < current ? "bg-primary" : "bg-border")} />
                  )}

                  {/* Vertical connector */}
                  {!isHorizontal && !isLast && (
                    <div className={cn("w-0.5 flex-1 min-h-8 transition-colors mt-1", i < current ? "bg-primary" : "bg-border")} />
                  )}
                </div>

                {/* Label */}
                <div className={cn(
                  isHorizontal ? "mt-2 text-center px-1" : "pb-6 min-w-0"
                )}>
                  <p className={cn(
                    "text-sm font-medium leading-tight",
                    status === "current" ? "text-primary" :
                    status === "complete" ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                    {step.optional && <span className="ml-1 text-xs text-muted-foreground">(optional)</span>}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  )}
                  {/* Vertical content inline */}
                  {!isHorizontal && step.content && i === current && (
                    <div className="mt-3">{step.content}</div>
                  )}
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>

      {/* Horizontal content panel */}
      {isHorizontal && steps[current]?.content && (
        <div className="mt-6">{steps[current].content}</div>
      )}
    </div>
  )
}
