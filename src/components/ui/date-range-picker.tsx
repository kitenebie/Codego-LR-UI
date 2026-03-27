import * as React from "react"
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn, getPortalPosition, FloatingPortal } from "@/src/lib/utils"

export interface DateRange {
  from: Date | null
  to: Date | null
}

export interface DateRangePickerProps {
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function inRange(d: Date, from: Date | null, to: Date | null) {
  if (!from || !to) return false
  return d > from && d < to
}

function formatDate(d: Date | null) {
  if (!d) return ""
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function DateRangePicker({
  value: controlled,
  defaultValue = { from: null, to: null },
  onChange,
  placeholder = "Pick a date range",
  disabled = false,
  minDate,
  maxDate,
  className,
}: DateRangePickerProps) {
  const [internal, setInternal] = React.useState<DateRange>(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [hover, setHover] = React.useState<Date | null>(null)
  const [selecting, setSelecting] = React.useState<"from" | "to">("from")
  const today = new Date()
  const [viewMonth, setViewMonth] = React.useState(today.getMonth())
  const [viewYear, setViewYear] = React.useState(today.getFullYear())
  const ref = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const [dropStyle, setDropStyle] = React.useState<React.CSSProperties>({})

  const range = controlled ?? internal

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      const inTrigger = ref.current?.contains(e.target as Node)
      const inPopup = popupRef.current?.contains(e.target as Node)
      if (!inTrigger && !inPopup) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function update(r: DateRange) {
    if (!controlled) setInternal(r)
    onChange?.(r)
  }

  function openPicker() {
    if (triggerRef.current) {
      const pos = getPortalPosition(triggerRef.current, 340)
      setDropStyle({
        position: "fixed",
        top: pos.placement === "bottom" ? pos.top : undefined,
        bottom: pos.placement === "top" ? window.innerHeight - pos.top : undefined,
        left: pos.left,
        zIndex: 9999,
      })
    }
    setOpen(true)
  }

  function selectDay(d: Date) {
    if (selecting === "from") {
      update({ from: d, to: null })
      setSelecting("to")
    } else {
      if (range.from && d < range.from) {
        update({ from: d, to: range.from })
      } else {
        update({ from: range.from, to: d })
      }
      setSelecting("from")
      setOpen(false)
    }
  }

  function getDays() {
    const first = new Date(viewYear, viewMonth, 1)
    const last = new Date(viewYear, viewMonth + 1, 0)
    const startPad = first.getDay()
    const days: (Date | null)[] = Array(startPad).fill(null)
    for (let i = 1; i <= last.getDate(); i++) days.push(new Date(viewYear, viewMonth, i))
    return days
  }

  function isDisabled(d: Date) {
    if (minDate && d < minDate) return true
    if (maxDate && d > maxDate) return true
    return false
  }

  const days = getDays()
  const effectiveTo = range.to ?? (selecting === "to" && hover ? hover : null)

  const label = range.from
    ? range.to
      ? `${formatDate(range.from)} – ${formatDate(range.to)}`
      : formatDate(range.from)
    : placeholder

  return (
    <div ref={ref} className={cn("relative inline-block w-full", className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => open ? setOpen(false) : openPicker()}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border-2 border-border bg-background px-3 py-2 text-sm transition-colors",
          "hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring",
          "dark:bg-gray-400/5",
          open && "border-primary ring-2 ring-ring",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          !range.from && "text-muted-foreground"
        )}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-left truncate">{label}</span>
        {(range.from || range.to) && (
          <span onClick={(e) => { e.stopPropagation(); update({ from: null, to: null }); setSelecting("from") }}
            className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {open && (
        <FloatingPortal>
          <div ref={popupRef} className="rounded-xl border border-border glass shadow-2xl p-4 w-72 dark:border-white/30 dark:bg-gray-400/5" style={dropStyle}>
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }}
                className="p-1 rounded-md hover:bg-accent transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold">{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }}
                className="p-1 rounded-md hover:bg-accent transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-0.5">
              {days.map((d, i) => {
                if (!d) return <div key={i} />
                const isFrom = range.from && sameDay(d, range.from)
                const isTo = effectiveTo && sameDay(d, effectiveTo)
                const isIn = inRange(d, range.from, effectiveTo)
                const isToday = sameDay(d, today)
                const dis = isDisabled(d)
                return (
                  <button key={i} type="button" disabled={dis} onClick={() => selectDay(d)}
                    onMouseEnter={() => selecting === "to" && setHover(d)}
                    onMouseLeave={() => setHover(null)}
                    className={cn(
                      "relative h-8 w-full text-xs font-medium transition-colors",
                      dis && "opacity-30 cursor-not-allowed pointer-events-none",
                      isIn && "bg-primary/15",
                      (isFrom || isTo) && "bg-primary text-primary-foreground rounded-lg z-10",
                      !isFrom && !isTo && !isIn && !dis && "hover:bg-accent rounded-lg",
                      isToday && !isFrom && !isTo && "font-bold text-primary",
                      isFrom && "rounded-r-none",
                      isTo && "rounded-l-none",
                      isIn && "rounded-none"
                    )}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              {selecting === "from" ? "Select start date" : "Select end date"}
            </p>
          </div>
        </FloatingPortal>
      )}
    </div>
  )
}

// ─── CalendarDateRangePicker ──────────────────────────────────────────────────

export type CalendarDateRangeVariant =
  | "default"
  | "split"
  | "minimal"
  | "card"
  | "sidebar"
  | "timeline"
  | "compact"

export interface CalendarDateRangePickerProps {
  variant?: CalendarDateRangeVariant
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (range: DateRange) => void
  showPresets?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string 
}

const PRESETS = [
  { label: "Today",        getDates: () => { const d = new Date(); return { from: d, to: d } } },
  { label: "Yesterday",    getDates: () => { const d = new Date(); d.setDate(d.getDate() - 1); return { from: d, to: d } } },
  { label: "Last 7 days",  getDates: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 6); return { from: s, to: e } } },
  { label: "Last 30 days", getDates: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 29); return { from: s, to: e } } },
  { label: "This month",   getDates: () => { const n = new Date(); return { from: new Date(n.getFullYear(), n.getMonth(), 1), to: new Date(n.getFullYear(), n.getMonth() + 1, 0) } } },
  { label: "Last month",   getDates: () => { const n = new Date(); return { from: new Date(n.getFullYear(), n.getMonth() - 1, 1), to: new Date(n.getFullYear(), n.getMonth(), 0) } } },
  { label: "This year",    getDates: () => { const n = new Date(); return { from: new Date(n.getFullYear(), 0, 1), to: new Date(n.getFullYear(), 11, 31) } } },
]

function getDaysForMonth(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const days: (Date | null)[] = Array(first.getDay()).fill(null)
  for (let i = 1; i <= last.getDate(); i++) days.push(new Date(year, month, i))
  return days
}

function useCalendarState(defaultValue: DateRange) {
  const today = new Date()
  const [range, setRange] = React.useState<DateRange>(defaultValue)
  const [hover, setHover] = React.useState<Date | null>(null)
  const [selecting, setSelecting] = React.useState<"from" | "to">("from")
  const [viewMonth, setViewMonth] = React.useState(today.getMonth())
  const [viewYear, setViewYear] = React.useState(today.getFullYear())

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(d: Date, onComplete?: (r: DateRange) => void) {
    if (selecting === "from") {
      const next = { from: d, to: null }
      setRange(next)
      setSelecting("to")
    } else {
      const next = range.from && d < range.from
        ? { from: d, to: range.from }
        : { from: range.from, to: d }
      setRange(next)
      setSelecting("from")
      onComplete?.(next)
    }
  }

  const effectiveTo = range.to ?? (selecting === "to" && hover ? hover : null)

  return { range, setRange, hover, setHover, selecting, setSelecting, viewMonth, viewYear, prevMonth, nextMonth, selectDay, effectiveTo, today }
}

interface CalGridProps {
  year: number
  month: number
  range: DateRange
  effectiveTo: Date | null
  today: Date
  hover: Date | null
  selecting: "from" | "to"
  onDay: (d: Date) => void
  onHover: (d: Date | null) => void
  minDate?: Date
  maxDate?: Date
  rounded?: "lg" | "full"
}

function CalGrid({ year, month, range, effectiveTo, today, selecting, onDay, onHover, minDate, maxDate, rounded = "lg" }: CalGridProps) {
  const days = getDaysForMonth(year, month)
  return (
    <>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((d, i) => {
          if (!d) return <div key={i} />
          const isFrom = range.from && sameDay(d, range.from)
          const isTo = effectiveTo && sameDay(d, effectiveTo)
          const isIn = inRange(d, range.from, effectiveTo)
          const isToday = sameDay(d, today)
          const dis = (minDate && d < minDate) || (maxDate && d > maxDate)
          const r = rounded === "full" ? "rounded-full" : "rounded-lg"
          return (
            <button key={i} type="button" disabled={!!dis} onClick={() => onDay(d)}
              onMouseEnter={() => selecting === "to" && onHover(d)}
              onMouseLeave={() => onHover(null)}
              className={cn(
                "h-8 w-full text-xs font-medium transition-colors",
                dis && "opacity-30 cursor-not-allowed pointer-events-none",
                isIn && "bg-primary/15",
                (isFrom || isTo) && `bg-primary text-primary-foreground ${r} z-10`,
                !isFrom && !isTo && !isIn && !dis && `hover:bg-accent ${r}`,
                isToday && !isFrom && !isTo && "font-bold text-primary",
                isFrom && "rounded-r-none",
                isTo && "rounded-l-none",
                isIn && "rounded-none"
              )}
            >{d.getDate()}</button>
          )
        })}
      </div>
    </>
  )
}

function MonthHeader({ month, year, onPrev, onNext }: { month: number; year: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3 ">
      <button type="button" onClick={onPrev} className="p-1 rounded-md hover:bg-accent transition-colors">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm font-semibold">{MONTHS[month]} {year}</span>
      <button type="button" onClick={onNext} className="p-1 rounded-md hover:bg-accent transition-colors">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function RangeLabel({ range, selecting }: { range: DateRange; selecting: "from" | "to" }) {
  return (
    <p className="mt-3 text-center text-xs text-muted-foreground">
      {range.from && range.to
        ? `${formatDate(range.from)} – ${formatDate(range.to)}`
        : selecting === "from" ? "Select start date" : "Select end date"}
    </p>
  )
}

// next month offset helper
function nextMonthOf(month: number, year: number) {
  return month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year }
}

export function CalendarDateRangePicker({
  variant = "default",
  value: controlled,
  defaultValue = { from: null, to: null },
  onChange,
  showPresets = true,
  minDate,
  maxDate,
  className,
}: CalendarDateRangePickerProps) {
  const state = useCalendarState(controlled ?? defaultValue)
  const { range, setRange, hover, setHover, selecting, setSelecting, viewMonth, viewYear, prevMonth, nextMonth, selectDay, effectiveTo, today } = state

  React.useEffect(() => {
    if (controlled) setRange(controlled)
  }, [controlled])

  function handleDay(d: Date) {
    selectDay(d, (r) => onChange?.(r))
    if (selecting === "to") onChange?.({ from: range.from, to: d < (range.from ?? d) ? range.from : d } as DateRange)
  }

  function applyPreset(p: typeof PRESETS[0]) {
    const r = p.getDates()
    setRange(r)
    setSelecting("from")
    onChange?.(r)
  }

  const gridProps: CalGridProps = {
    year: viewYear, month: viewMonth, range, effectiveTo, today, hover, selecting,
    onDay: handleDay, onHover: setHover, minDate, maxDate,
  }
  const next = nextMonthOf(viewMonth, viewYear)

  // ── default ──────────────────────────────────────────────────────────────
  if (variant === "default") {
    return (
      <div className={cn("rounded-2xl border border-border bg-card shadow-lg p-4 inline-flex flex-col gap-4   dark:border-white/30 dark:bg-gray-400/5", className)}>
        {showPresets && (
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(p => (
              <button key={p.label} type="button" onClick={() => applyPreset(p)}
                className="px-2.5 py-1 text-xs rounded-lg border border-border hover:bg-accent hover:border-primary/40 transition-colors   dark:border-white/30 dark:bg-gray-400/5">
                {p.label}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-6">
          <div className="w-56">
            <MonthHeader month={viewMonth} year={viewYear} onPrev={prevMonth} onNext={nextMonth} />
            <CalGrid {...gridProps} />
          </div>
          <div className="w-56">
            <MonthHeader month={next.month} year={next.year} onPrev={prevMonth} onNext={nextMonth} />
            <CalGrid {...gridProps} year={next.year} month={next.month} />
          </div>
        </div>
        <RangeLabel range={range} selecting={selecting} />
      </div>
    )
  }

  // ── split ─────────────────────────────────────────────────────────────────
  if (variant === "split") {
    return (
      <div className={cn("rounded-2xl border border-border bg-card shadow-lg overflow-hidden inline-flex flex-col   dark:border-white/30 dark:bg-gray-400/5", className)}>
        <div className="flex bg-primary text-primary-foreground px-5 py-3 gap-8 text-sm">
          <div>
            <p className="text-xs opacity-70 mb-0.5">Start</p>
            <p className="font-semibold">{range.from ? formatDate(range.from) : "—"}</p>
          </div>
          <div className="w-px bg-primary-foreground/20" />
          <div>
            <p className="text-xs opacity-70 mb-0.5">End</p>
            <p className="font-semibold">{range.to ? formatDate(range.to) : "—"}</p>
          </div>
        </div>
        <div className="flex gap-6 p-4">
          <div className="w-56">
            <MonthHeader month={viewMonth} year={viewYear} onPrev={prevMonth} onNext={nextMonth} />
            <CalGrid {...gridProps} />
          </div>
          <div className="w-56">
            <MonthHeader month={next.month} year={next.year} onPrev={prevMonth} onNext={nextMonth} />
            <CalGrid {...gridProps} year={next.year} month={next.month} />
          </div>
        </div>
      </div>
    )
  }

  // ── minimal ───────────────────────────────────────────────────────────────
  if (variant === "minimal") {
    return (
      <div className={cn("rounded-2xl bg-card shadow-md p-4 inline-block w-64    dark:border-white/30 dark:bg-gray-400/5", className)}>
        <MonthHeader month={viewMonth} year={viewYear} onPrev={prevMonth} onNext={nextMonth} />
        <CalGrid {...gridProps} rounded="full" />
        <RangeLabel range={range} selecting={selecting} />
      </div>
    )
  }

  // ── card ──────────────────────────────────────────────────────────────────
  if (variant === "card") {
    return (
      <div className={cn("rounded-3xl border border-border bg-card shadow-xl p-5 inline-flex flex-col gap-4    dark:border-white/30 dark:bg-gray-400/5", className)}>
        <div>
          <p className="text-base font-semibold">Select Date Range</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {range.from && range.to ? `${formatDate(range.from)} – ${formatDate(range.to)}` : "Choose start and end dates"}
          </p>
        </div>
        <div className="flex gap-6">
          <div className="w-56">
            <MonthHeader month={viewMonth} year={viewYear} onPrev={prevMonth} onNext={nextMonth} />
            <CalGrid {...gridProps} />
          </div>
          <div className="w-56">
            <MonthHeader month={next.month} year={next.year} onPrev={prevMonth} onNext={nextMonth} />
            <CalGrid {...gridProps} year={next.year} month={next.month} />
          </div>
        </div>
        {showPresets && (
          <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-border ">
            {PRESETS.map(p => (
              <button key={p.label} type="button" onClick={() => applyPreset(p)}
                className="px-2 py-1.5 text-[11px] rounded-xl border border-border hover:bg-accent hover:border-primary/40 transition-colors text-center">
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── sidebar ───────────────────────────────────────────────────────────────
  if (variant === "sidebar") {
    return (
      <div className={cn("rounded-2xl border border-border bg-card shadow-lg inline-flex overflow-hidden    dark:border-white/30 dark:bg-gray-400/5 ", className)}>
        <div className="w-36 border-r border-border bg-muted/40 p-3 flex flex-col gap-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Quick Select</p>
          {PRESETS.map(p => (
            <button key={p.label} type="button" onClick={() => applyPreset(p)}
              className="text-left text-xs px-2 py-1.5 rounded-lg hover:bg-accent transition-colors">
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-5 p-4">
          <div className="w-52">
            <MonthHeader month={viewMonth} year={viewYear} onPrev={prevMonth} onNext={nextMonth} />
            <CalGrid {...gridProps} />
          </div>
          <div className="w-52">
            <MonthHeader month={next.month} year={next.year} onPrev={prevMonth} onNext={nextMonth} />
            <CalGrid {...gridProps} year={next.year} month={next.month} />
          </div>
        </div>
      </div>
    )
  }

  // ── timeline ──────────────────────────────────────────────────────────────
  if (variant === "timeline") {
    const next2 = nextMonthOf(next.month, next.year)
    return (
      <div className={cn("rounded-2xl border border-border bg-card shadow-lg p-4 inline-flex flex-col gap-3    dark:border-white/30 dark:bg-gray-400/5", className)}>
        <div className="flex items-center justify-between">
          <button type="button" onClick={prevMonth} className="p-1 rounded-md hover:bg-accent transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-muted-foreground">
            {MONTHS[viewMonth]} – {MONTHS[next2.month]} {next2.year}
          </span>
          <button type="button" onClick={nextMonth} className="p-1 rounded-md hover:bg-accent transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-4">
          {[{ m: viewMonth, y: viewYear }, { m: next.month, y: next.year }, { m: next2.month, y: next2.year }].map(({ m, y }) => (
            <div key={`${y}-${m}`} className="w-44">
              <p className="text-xs font-semibold text-center mb-2 text-muted-foreground">{MONTHS[m]} {y}</p>
              <CalGrid {...gridProps} year={y} month={m} />
            </div>
          ))}
        </div>
        <RangeLabel range={range} selecting={selecting} />
      </div>
    )
  }

  // ── compact ───────────────────────────────────────────────────────────────
  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-md p-4 inline-flex flex-col gap-3 w-64    dark:border-white/30 dark:bg-gray-400/5", className)}>
      {showPresets && (
        <div className="flex flex-wrap gap-1">
          {PRESETS.slice(0, 4).map(p => (
            <button key={p.label} type="button" onClick={() => applyPreset(p)}
              className="px-2 py-0.5 text-[11px] rounded-full border border-border hover:bg-accent hover:border-primary/40 transition-colors">
              {p.label}
            </button>
          ))}
        </div>
      )}
      <MonthHeader month={viewMonth} year={viewYear} onPrev={prevMonth} onNext={nextMonth} />
      <CalGrid {...gridProps} />
      <RangeLabel range={range} selecting={selecting} />
    </div>
  )
}
