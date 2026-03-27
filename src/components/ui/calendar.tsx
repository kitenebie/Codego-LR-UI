import * as React from "react"
import { ChevronLeft, ChevronRight, Plus, X, Clock, Calendar as CalIcon } from "lucide-react"
import { cn } from "@/src/lib/utils"

export interface CalendarEvent {
  id?: string
  date: Date
  endDate?: Date
  label: string
  color?: string
  allDay?: boolean
  description?: string
}

export type CalendarView = "month" | "week" | "day"

export interface CalendarProps {
  events?: CalendarEvent[]
  defaultView?: CalendarView
  defaultDate?: Date
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
  onAddEvent?: (date: Date) => void
  className?: string
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DAYS_LONG = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const HOURS = Array.from({ length: 24 }, (_, i) => i)

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function fmt(d: Date, opts: Intl.DateTimeFormatOptions) {
  return d.toLocaleDateString("en-US", opts)
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}

function startOfWeek(d: Date) {
  const r = new Date(d); r.setDate(r.getDate() - r.getDay()); r.setHours(0,0,0,0); return r
}

function getWeekDays(d: Date): Date[] {
  const s = startOfWeek(d)
  return Array.from({ length: 7 }, (_, i) => addDays(s, i))
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const days: (Date | null)[] = Array(first.getDay()).fill(null)
  for (let i = 1; i <= last.getDate(); i++) days.push(new Date(year, month, i))
  while (days.length % 7 !== 0) days.push(null)
  return days
}

function eventsForDay(events: CalendarEvent[], d: Date) {
  return events.filter(e => sameDay(e.date, d))
}

function eventTop(e: CalendarEvent) {
  const h = e.date.getHours() + e.date.getMinutes() / 60
  return h * 64
}

function eventHeight(e: CalendarEvent) {
  if (!e.endDate) return 48
  const diff = (e.endDate.getTime() - e.date.getTime()) / 3600000
  return Math.max(diff * 64, 24)
}

const EVENT_COLORS = [
  "var(--primary)", "var(--info)", "var(--success)",
  "var(--warning)", "var(--danger)", "var(--accent-foreground)",
]

// ── Event Pill ────────────────────────────────────────────────────────────────
function EventPill({ event, onClick, compact = false }: { event: CalendarEvent; onClick?: () => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      className={cn(
        "w-full text-left rounded-md px-1.5 text-white truncate transition-opacity hover:opacity-80",
        compact ? "text-[10px] py-0.5" : "text-xs py-1"
      )}
      style={{ backgroundColor: event.color ?? "var(--primary)" }}
    >
      {!compact && event.allDay === false && (
        <span className="opacity-80 mr-1">{fmtTime(event.date)}</span>
      )}
      {event.label}
    </button>
  )
}

// ── Month View ────────────────────────────────────────────────────────────────
function MonthView({
  year, month, today, events, onDateClick, onEventClick,
}: {
  year: number; month: number; today: Date
  events: CalendarEvent[]
  onDateClick?: (d: Date) => void
  onEventClick?: (e: CalendarEvent) => void
}) {
  const days = getMonthDays(year, month)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS_SHORT.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground py-2">{d}</div>
        ))}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${days.length / 7}, minmax(0, 1fr))` }}>
        {days.map((d, i) => {
          const isToday = d ? sameDay(d, today) : false
          const isCurrentMonth = d ? d.getMonth() === month : false
          const dayEvents = d ? eventsForDay(events, d) : []
          return (
            <div
              key={i}
              onClick={() => d && onDateClick?.(d)}
              className={cn(
                "border-b border-r border-border p-1 flex flex-col gap-0.5 cursor-pointer min-h-[90px]",
                "hover:bg-accent/40 transition-colors",
                !isCurrentMonth && "bg-muted/20",
                i % 7 === 0 && "border-l-0"
              )}
            >
              {d && (
                <span className={cn(
                  "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full self-start",
                  isToday && "bg-primary text-primary-foreground font-bold",
                  !isToday && !isCurrentMonth && "text-muted-foreground",
                  !isToday && isCurrentMonth && "text-foreground"
                )}>
                  {d.getDate()}
                </span>
              )}
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {dayEvents.slice(0, 3).map((ev, ei) => (
                  <EventPill key={ei} event={ev} onClick={() => onEventClick?.(ev)} compact />
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-muted-foreground pl-1">+{dayEvents.length - 3} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Time Grid (shared by week + day) ─────────────────────────────────────────
function TimeGrid({
  days, today, events, onDateClick, onEventClick,
}: {
  days: Date[]; today: Date
  events: CalendarEvent[]
  onDateClick?: (d: Date) => void
  onEventClick?: (e: CalendarEvent) => void
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // scroll to 7am on mount
    if (scrollRef.current) scrollRef.current.scrollTop = 7 * 64
  }, [])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Column headers */}
      <div className="flex border-b border-border shrink-0">
        <div className="w-14 shrink-0" />
        {days.map((d, i) => {
          const isToday = sameDay(d, today)
          return (
            <div key={i} className="flex-1 text-center py-2 border-l border-border">
              <p className="text-[11px] text-muted-foreground">{DAYS_SHORT[d.getDay()]}</p>
              <p className={cn(
                "text-sm font-semibold mx-auto w-8 h-8 flex items-center justify-center rounded-full",
                isToday && "bg-primary text-primary-foreground"
              )}>
                {d.getDate()}
              </p>
            </div>
          )
        })}
      </div>
      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex flex-1 overflow-y-auto min-h-0">
        {/* Hour labels */}
        <div className="w-14 shrink-0 relative">
          {HOURS.map(h => (
            <div key={h} className="h-16 flex items-start justify-end pr-2 pt-0.5">
              {h > 0 && <span className="text-[10px] text-muted-foreground">{h % 12 || 12}{h < 12 ? "am" : "pm"}</span>}
            </div>
          ))}
        </div>
        {/* Day columns */}
        {days.map((d, di) => {
          const dayEvents = eventsForDay(events, d).filter(e => !e.allDay)
          return (
            <div
              key={di}
              className="flex-1 border-l border-border relative"
              style={{ height: 24 * 64 }}
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                const y = e.clientY - rect.top
                const hour = Math.floor(y / 64)
                const clicked = new Date(d)
                clicked.setHours(hour, 0, 0, 0)
                onDateClick?.(clicked)
              }}
            >
              {/* Hour lines */}
              {HOURS.map(h => (
                <div key={h} className="absolute w-full border-t border-border/50" style={{ top: h * 64 }} />
              ))}
              {/* Current time indicator */}
              {sameDay(d, today) && (() => {
                const now = new Date()
                const top = (now.getHours() + now.getMinutes() / 60) * 64
                return (
                  <div className="absolute w-full flex items-center z-10 pointer-events-none" style={{ top }}>
                    <div className="w-2 h-2 rounded-full bg-danger shrink-0 -ml-1" />
                    <div className="flex-1 h-px bg-danger" />
                  </div>
                )
              })()}
              {/* Events */}
              {dayEvents.map((ev, ei) => (
                <button
                  key={ei}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onEventClick?.(ev) }}
                  className="absolute left-0.5 right-0.5 rounded-md px-1.5 text-white text-xs text-left overflow-hidden hover:opacity-80 transition-opacity z-20"
                  style={{
                    top: eventTop(ev),
                    height: eventHeight(ev),
                    backgroundColor: ev.color ?? "var(--primary)",
                  }}
                >
                  <p className="font-medium truncate">{ev.label}</p>
                  <p className="opacity-80 text-[10px]">{fmtTime(ev.date)}{ev.endDate ? ` – ${fmtTime(ev.endDate)}` : ""}</p>
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Event Detail Modal ────────────────────────────────────────────────────────
function EventModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 rounded-2xl border border-border bg-card shadow-2xl p-5 w-80"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: event.color ?? "var(--primary)" }} />
            <h3 className="font-semibold text-sm">{event.label}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalIcon className="h-3.5 w-3.5 shrink-0" />
            <span>{fmt(event.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
          {!event.allDay && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{fmtTime(event.date)}{event.endDate ? ` – ${fmtTime(event.endDate)}` : ""}</span>
            </div>
          )}
          {event.description && <p className="pt-1 text-foreground/80">{event.description}</p>}
        </div>
      </div>
    </div>
  )
}

// ── Main Calendar ─────────────────────────────────────────────────────────────
export function Calendar({
  events = [],
  defaultView = "month",
  defaultDate,
  onEventClick,
  onDateClick,
  onAddEvent,
  className,
}: CalendarProps) {
  const today = React.useMemo(() => new Date(), [])
  const [view, setView] = React.useState<CalendarView>(defaultView)
  const [current, setCurrent] = React.useState<Date>(defaultDate ?? today)
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null)

  const viewMonth = current.getMonth()
  const viewYear = current.getFullYear()

  function navigate(dir: -1 | 1) {
    const d = new Date(current)
    if (view === "month") d.setMonth(d.getMonth() + dir)
    else if (view === "week") d.setDate(d.getDate() + dir * 7)
    else d.setDate(d.getDate() + dir)
    setCurrent(d)
  }

  function goToday() { setCurrent(new Date(today)) }

  const weekDays = getWeekDays(current)

  function headerLabel() {
    if (view === "month") return `${MONTHS[viewMonth]} ${viewYear}`
    if (view === "week") {
      const s = weekDays[0]; const e = weekDays[6]
      if (s.getMonth() === e.getMonth()) return `${MONTHS[s.getMonth()]} ${s.getFullYear()}`
      return `${MONTHS[s.getMonth()]} – ${MONTHS[e.getMonth()]} ${e.getFullYear()}`
    }
    return fmt(current, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  function handleEventClick(ev: CalendarEvent) {
    setSelectedEvent(ev)
    onEventClick?.(ev)
  }

  function handleDateClick(d: Date) {
    onDateClick?.(d)
    onAddEvent?.(d)
  }

  return (
    <div className={cn("flex flex-col rounded-2xl border border-border bg-card overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <button
          type="button"
          onClick={goToday}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-accent transition-colors"
        >
          Today
        </button>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <h2 className="text-sm font-semibold flex-1">{headerLabel()}</h2>
        {onAddEvent && (
          <button
            type="button"
            onClick={() => onAddEvent(new Date(current))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add event
          </button>
        )}
        {/* View switcher */}
        <div className="flex rounded-lg border border-border overflow-hidden text-xs font-medium">
          {(["month", "week", "day"] as CalendarView[]).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1.5 capitalize transition-colors",
                view === v ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* View content */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {view === "month" && (
          <MonthView
            year={viewYear} month={viewMonth} today={today}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
        {view === "week" && (
          <TimeGrid
            days={weekDays} today={today}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
        {view === "day" && (
          <TimeGrid
            days={[current]} today={today}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}

export { EVENT_COLORS }
