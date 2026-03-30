import * as React from "react"
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay,
  parseISO, isValid, setHours, setMinutes, getHours, getMinutes,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn, FloatingPortal } from "@/src/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface DatePickerProps {
  mode: "date" | "dateTime" | "time"
  value: string
  disabledDates?: string[]
  disabledDateTimes?: string[]
  onChange: (value: string) => void
  onClose: () => void
  anchorEl?: HTMLElement | null
  popupRef?: React.RefObject<HTMLDivElement>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

function buildCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month))
  const end = endOfWeek(endOfMonth(month))
  const days: Date[] = []
  let cur = start
  while (cur <= end) { days.push(cur); cur = addDays(cur, 1) }
  return days
}

function parseValue(value: string, mode: DatePickerProps["mode"]): Date | null {
  if (!value) return null
  try {
    if (mode === "time") {
      const [h, m] = value.split(":").map(Number)
      const d = new Date(); d.setHours(h, m, 0, 0); return d
    }
    const d = parseISO(value)
    return isValid(d) ? d : null
  } catch { return null }
}

function getAnchorStyle(anchorEl: HTMLElement | null, wide = false): React.CSSProperties {
  if (!anchorEl) return { position: "fixed", top: 0, left: 0, zIndex: 9999 }
  const r = anchorEl.getBoundingClientRect()
  const spaceBelow = window.innerHeight - r.bottom
  const dropH = wide ? 320 : 300
  const dropW = wide ? 400 : 280
  const placement = spaceBelow < dropH && r.top > spaceBelow ? "top" : "bottom"
  let left = r.left
  // Clamp left to keep within screen
  left = Math.max(8, Math.min(left, window.innerWidth - dropW - 8))
  return {
    position: "fixed",
    top: placement === "bottom" ? r.bottom + 4 : undefined,
    bottom: placement === "top" ? window.innerHeight - r.top + 4 : undefined,
    left,
    zIndex: 9999,
  }
}

// ─── Time Picker ─────────────────────────────────────────────────────────────

function TimePicker({
  selected,
  disabledDateTimes,
  datePrefix,
  onChange,
}: {
  selected: Date | null
  disabledDateTimes?: string[]
  datePrefix?: string
  onChange: (h: number, m: number) => void
}) {
  const selH = selected ? getHours(selected) : -1
  const selM = selected ? getMinutes(selected) : -1

  const isDisabledSlot = (h: number, m: number) => {
    if (!disabledDateTimes || !datePrefix) return false
    const slot = `${datePrefix}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    return disabledDateTimes.includes(slot)
  }

  return (
    <div className="flex gap-2 p-3 border-t border-white/10">
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-1 text-center">Hour</p>
        <div className="grid grid-cols-4 gap-1 max-h-56 overflow-y-auto">
          {HOURS.map(h => (
            <button key={h} type="button"
              disabled={MINUTES.every(m => isDisabledSlot(h, m))}
              onClick={() => onChange(h, selM >= 0 ? selM : 0)}
              className={cn(
                "text-xs rounded px-1 py-1 transition-colors",
                selH === h ? "bg-primary text-primary-foreground" : "hover:bg-white/10 text-foreground",
                MINUTES.every(m => isDisabledSlot(h, m)) && "opacity-30 cursor-not-allowed line-through"
              )}
            >
              {String(h).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-1 text-center">Min</p>
        <div className="grid-cols-4 gap-1 max-h-56 overflow-y-auto">
          {MINUTES.map(m => (
            <button key={m} type="button"
              disabled={isDisabledSlot(selH >= 0 ? selH : 0, m)}
              onClick={() => onChange(selH >= 0 ? selH : 0, m)}
              className={cn(
                "text-xs rounded px-1 py-1 transition-colors",
                selM === m ? "bg-primary text-primary-foreground" : "hover:bg-white/10 text-foreground",
                isDisabledSlot(selH >= 0 ? selH : 0, m) && "opacity-30 cursor-not-allowed line-through"
              )}
            >
              :{String(m).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Calendar ────────────────────────────────────────────────────────────────

function Calendar({
  selected, month, disabledDates, onDayClick, onPrevMonth, onNextMonth,
}: {
  selected: Date | null
  month: Date
  disabledDates?: string[]
  onDayClick: (d: Date) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}) {
  const days = buildCalendarDays(month)
  const isDisabled = (d: Date) => disabledDates?.includes(format(d, "yyyy-MM-dd")) ?? false

  return (
    <div className="p-3 select-none">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={onPrevMonth} className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-foreground">{format(month, "MMMM yyyy")}</span>
        <button type="button" onClick={onNextMonth} className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((d, i) => {
          const outside = !isSameMonth(d, month)
          const disabled = isDisabled(d)
          const isSelected = selected ? isSameDay(d, selected) : false
          const isToday = isSameDay(d, new Date())
          return (
            <button key={i} type="button" disabled={disabled || outside} onClick={() => onDayClick(d)}
              className={cn(
                "h-8 w-8 mx-auto rounded-full text-xs transition-colors flex items-center justify-center",
                outside && "opacity-0 pointer-events-none",
                !outside && !disabled && !isSelected && "hover:bg-white/10 text-foreground",
                isToday && !isSelected && "border border-primary/50 text-primary",
                isSelected && "bg-primary text-primary-foreground font-semibold",
                disabled && !outside && "opacity-30 cursor-not-allowed line-through text-destructive"
              )}
            >
              {format(d, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── DatePicker Popup ─────────────────────────────────────────────────────────

export function DatePickerPopup({
  mode, value, disabledDates, disabledDateTimes, onChange, onClose, anchorEl, popupRef,
}: DatePickerProps) {
  const parsed = parseValue(value, mode)
  const [month, setMonth] = React.useState(parsed ?? new Date())
  const [selected, setSelected] = React.useState<Date | null>(parsed)

  const anchorStyle = getAnchorStyle(anchorEl ?? null, mode === "dateTime")

  const commit = (d: Date) => {
    if (mode === "date") onChange(format(d, "yyyy-MM-dd"))
    else if (mode === "dateTime") onChange(format(d, "yyyy-MM-dd'T'HH:mm"))
    else onChange(format(d, "HH:mm"))
    setSelected(d)
  }

  const handleDayClick = (d: Date) => {
    const base = selected ?? new Date()
    commit(setMinutes(setHours(d, getHours(base)), getMinutes(base)))
  }

  const handleTimeChange = (h: number, m: number) => {
    commit(setMinutes(setHours(selected ?? new Date(), h), m))
  }

  const datePrefix = selected ? format(selected, "yyyy-MM-dd") : undefined

  const footer = (label: string) => (
    <div className="border-t border-white/10 px-3 py-2 flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <button type="button" onClick={onClose}
        className="text-xs rounded-lg bg-primary text-primary-foreground px-3 py-1 hover:opacity-90 transition-opacity">
        Done
      </button>
    </div>
  )

  if (mode === "dateTime") {
    return (
      <FloatingPortal>
        <div ref={popupRef} className="rounded-xl border border-white/10 bg-card shadow-xl backdrop-blur-sm" style={anchorStyle}>
          <div className="flex">
            <div className="flex-1 min-w-[240px]">
              <p className="text-xs font-medium text-muted-foreground px-3 pt-3 pb-1">Date</p>
              <Calendar selected={selected} month={month} disabledDates={disabledDates}
                onDayClick={handleDayClick}
                onPrevMonth={() => setMonth(m => subMonths(m, 1))}
                onNextMonth={() => setMonth(m => addMonths(m, 1))} />
            </div>
            <div className="w-px bg-white/10 my-3" />
            <div className="flex-1 min-w-[140px] flex flex-col">
              <p className="text-xs font-medium text-muted-foreground px-3 pt-3 pb-1">Time</p>
              <div className="flex gap-2 px-3 pb-3 flex-1">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1 text-center">HH</p>
                  <div className="grid grid-cols-1 gap-1 max-h-52 overflow-y-auto">
                    {HOURS.map(h => (
                      <button key={h} type="button"
                        disabled={MINUTES.every(m => {
                          if (!disabledDateTimes || !datePrefix) return false
                          return disabledDateTimes.includes(`${datePrefix}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`)
                        })}
                        onClick={() => handleTimeChange(h, selected ? getMinutes(selected) : 0)}
                        className={cn(
                          "text-xs rounded py-1 transition-colors",
                          selected && getHours(selected) === h ? "bg-primary text-primary-foreground" : "hover:bg-white/10 text-foreground"
                        )}
                      >
                        {String(h).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-12">
                  <p className="text-xs text-muted-foreground mb-1 text-center">MM</p>
                  <div className="grid grid-cols-1 gap-1 max-h-52 overflow-y-auto">
                    {MINUTES.map(m => {
                      const h = selected ? getHours(selected) : 0
                      const dis = disabledDateTimes && datePrefix
                        ? disabledDateTimes.includes(`${datePrefix}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`)
                        : false
                      return (
                        <button key={m} type="button" disabled={dis}
                          onClick={() => handleTimeChange(h, m)}
                          className={cn(
                            "text-xs rounded py-1 transition-colors",
                            selected && getMinutes(selected) === m ? "bg-primary text-primary-foreground" : "hover:bg-white/10 text-foreground",
                            dis && "opacity-30 cursor-not-allowed line-through"
                          )}
                        >
                          :{String(m).padStart(2, "0")}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {footer(selected ? format(selected, "MMM d, yyyy HH:mm") : "No date selected")}
        </div>
      </FloatingPortal>
    )
  }

  return (
    <FloatingPortal>
      <div ref={popupRef} className="rounded-xl border border-white/10 bg-card shadow-xl backdrop-blur-sm min-w-[260px]" style={anchorStyle}>
        {mode === "date" && (
          <>
            <Calendar selected={selected} month={month} disabledDates={disabledDates}
              onDayClick={handleDayClick}
              onPrevMonth={() => setMonth(m => subMonths(m, 1))}
              onNextMonth={() => setMonth(m => addMonths(m, 1))} />
            {footer(selected ? format(selected, "MMM d, yyyy") : "No date selected")}
          </>
        )}
        {mode === "time" && (
          <>
            <TimePicker selected={selected} disabledDateTimes={disabledDateTimes}
              datePrefix={datePrefix} onChange={handleTimeChange} />
            {footer(selected ? format(selected, "HH:mm") : "No time selected")}
          </>
        )}
      </div>
    </FloatingPortal>
  )
}
