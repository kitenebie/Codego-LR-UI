import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Calendar, EVENT_COLORS, type CalendarEvent, type CalendarView } from "../components/ui/calendar"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "month",     label: "Month View" },
  { id: "week",      label: "Week View" },
  { id: "day",       label: "Day View" },
  { id: "addevent",  label: "Add Event" },
  { id: "props",     label: "Props" },
  { id: "eventtype", label: "CalendarEvent Type" },
]

const today = new Date()

function makeEvent(dayOffset: number, hour: number, label: string, color: string, durationH = 1, description?: string): CalendarEvent {
  const d = new Date(today)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, 0, 0, 0)
  const end = new Date(d)
  end.setHours(hour + durationH)
  return { id: label, date: d, endDate: end, label, color, allDay: false, description }
}

const DEMO_EVENTS: CalendarEvent[] = [
  makeEvent(0,  9,  "Standup",          EVENT_COLORS[0], 1,   "Daily team sync"),
  makeEvent(0,  14, "Design Review",    EVENT_COLORS[1], 2,   "Review new mockups"),
  makeEvent(1,  10, "Sprint Planning",  EVENT_COLORS[2], 3),
  makeEvent(1,  15, "1:1 with Manager", EVENT_COLORS[0], 1),
  makeEvent(2,  11, "Client Call",      EVENT_COLORS[4], 1,   "Quarterly update"),
  makeEvent(3,  9,  "Workshop",         EVENT_COLORS[3], 4),
  makeEvent(4,  13, "Lunch & Learn",    EVENT_COLORS[2], 1.5),
  makeEvent(-1, 10, "Retrospective",    EVENT_COLORS[1], 2),
  makeEvent(-2, 14, "Release Deploy",   EVENT_COLORS[4], 1),
  { date: new Date(today.getFullYear(), today.getMonth(), 5),  label: "Team Offsite",   color: EVENT_COLORS[3], allDay: true },
  { date: new Date(today.getFullYear(), today.getMonth(), 20), label: "Product Launch", color: EVENT_COLORS[4], allDay: true },
]

export function CalendarDocs() {
  const [events, setEvents] = useState<CalendarEvent[]>(DEMO_EVENTS)
  const [addCount, setAddCount] = useState(0)

  function handleAddEvent(date: Date) {
    const n = addCount + 1
    setAddCount(n)
    const end = new Date(date)
    end.setHours(end.getHours() + 1)
    setEvents(prev => [...prev, {
      id: `new-${n}`,
      date,
      endDate: end,
      label: `New Event ${n}`,
      color: EVENT_COLORS[n % EVENT_COLORS.length],
      allDay: false,
    }])
  }

  return (
    <DocsLayout toc={TOC}>
      <Section id="month">
        <Playground
          title="Month View"
          description="Full month grid with event dots and overflow count. Click a date to add an event."
          code={`<Calendar events={events} defaultView="month" onAddEvent={handleAddEvent} />`}
          fullBleed
        >
          <Calendar
            events={events}
            defaultView="month"
            onAddEvent={handleAddEvent}
            className="h-[680px] w-full rounded-none border-0"
          />
        </Playground>
      </Section>

      <Section id="week">
        <Playground
          title="Week View"
          description="7-day time grid with hour slots. Events are positioned by start time and duration. Click a slot to add an event."
          code={`<Calendar events={events} defaultView="week" onAddEvent={handleAddEvent} />`}
          fullBleed
        >
          <Calendar
            events={events}
            defaultView="week"
            onAddEvent={handleAddEvent}
            className="h-[680px] w-full rounded-none border-0"
          />
        </Playground>
      </Section>

      <Section id="day">
        <Playground
          title="Day View"
          description="Single-day time grid. Red line shows current time. Click a slot to add an event."
          code={`<Calendar events={events} defaultView="day" onAddEvent={handleAddEvent} />`}
          fullBleed
        >
          <Calendar
            events={events}
            defaultView="day"
            onAddEvent={handleAddEvent}
            className="h-[680px] w-full rounded-none border-0"
          />
        </Playground>
      </Section>

      <Section id="addevent">
        <Playground
          title="Add Event Interaction"
          description="Click any date cell or time slot to add a new event. Events persist across view switches."
          code={`const [events, setEvents] = useState(DEMO_EVENTS)\nfunction handleAddEvent(date: Date) {\n  setEvents(prev => [...prev, { date, label: "New Event", color: "var(--primary)" }])\n}`}
          fullBleed
        >
          <div className="w-full">
            <p className="text-xs text-muted-foreground px-4 pt-3">
              {addCount === 0 ? "Click any date or time slot to add an event." : `${addCount} event${addCount > 1 ? "s" : ""} added — switch views to see them.`}
            </p>
            <Calendar
              events={events}
              defaultView="month"
              onAddEvent={handleAddEvent}
              className="h-[640px] w-full rounded-none border-0 border-t border-border"
            />
          </div>
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "events",       type: "CalendarEvent[]",          default: "[]",     description: "Array of events to display." },
          { prop: "defaultView",  type: "CalendarView",             default: "\"month\"", description: "Initial view: month | week | day." },
          { prop: "defaultDate",  type: "Date",                                         description: "Initial focused date. Defaults to today." },
          { prop: "onEventClick", type: "(event: CalendarEvent) => void",               description: "Fired when an event is clicked." },
          { prop: "onDateClick",  type: "(date: Date) => void",                         description: "Fired when a date cell or time slot is clicked." },
          { prop: "onAddEvent",   type: "(date: Date) => void",                         description: "Shows the Add event button and fires on click or date cell click." },
          { prop: "className",    type: "string",                                       description: "Additional CSS classes on the root element." },
        ]} />
      </Section>

      <Section id="eventtype">
        <PropsTable rows={[
          { prop: "id",          type: "string",  description: "Optional unique identifier." },
          { prop: "date",        type: "Date",    required: true, description: "Start date/time of the event." },
          { prop: "endDate",     type: "Date",    description: "End date/time. Used to calculate block height in week/day views." },
          { prop: "label",       type: "string",  required: true, description: "Display name of the event." },
          { prop: "color",       type: "string",  description: "CSS color string (e.g. var(--primary)). Use EVENT_COLORS array for presets." },
          { prop: "allDay",      type: "boolean", description: "If true, shown as a full-day pill in month view without a time." },
          { prop: "description", type: "string",  description: "Optional detail text shown in the event detail modal." },
        ]} />
      </Section>
    </DocsLayout>
  )
}
