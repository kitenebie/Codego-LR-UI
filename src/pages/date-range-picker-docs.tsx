import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { DateRangePicker, CalendarDateRangePicker, type DateRange } from "../components/ui/date-range-picker"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",      label: "Basic" },
  { id: "minmax",     label: "Min / Max Date" },
  { id: "default",    label: "Calendar — Default" },
  { id: "split",      label: "Calendar — Split" },
  { id: "minimal",    label: "Calendar — Minimal" },
  { id: "card",       label: "Calendar — Card" },
  { id: "sidebar",    label: "Calendar — Sidebar" },
  { id: "timeline",   label: "Calendar — Timeline" },
  { id: "compact",    label: "Calendar — Compact" },
  { id: "props",      label: "Props" },
  { id: "dataformat", label: "Data Format" },
]

export function DateRangePickerDocs() {
  const [r1, setR1] = useState<DateRange>({ from: null, to: null })
  const [r2, setR2] = useState<DateRange>({ from: null, to: null })
  const [r3, setR3] = useState<DateRange>({ from: null, to: null })
  const [r4, setR4] = useState<DateRange>({ from: null, to: null })
  const [r5, setR5] = useState<DateRange>({ from: null, to: null })
  const [r6, setR6] = useState<DateRange>({ from: null, to: null })
  const [r7, setR7] = useState<DateRange>({ from: null, to: null })
  const [r8, setR8] = useState<DateRange>({ from: null, to: null })
  const [r9, setR9] = useState<DateRange>({ from: null, to: null })
  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), 1)
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0)

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Date Range Picker" description="Click to select start date, then end date. Click X to clear."
          code={`<DateRangePicker value={range} className="dark:border-white/30 dark:bg-gray-400/5" onChange={setRange} />`}>
          <div className="w-full max-w-xs space-y-2">
            <DateRangePicker className="dark:border-white/30 dark:bg-gray-400/5" value={r1} onChange={setR1} />
            {r1.from && <p className="text-xs text-muted-foreground">From: {r1.from.toLocaleDateString()} {r1.to ? `To: ${r1.to.toLocaleDateString()}` : "(select end date)"}</p>}
          </div>
        </Playground>
      </Section>

      <Section id="minmax">
        <Playground title="Min / Max Date" description="Restrict selectable dates with minDate and maxDate."
          code={`<DateRangePicker minDate={minDate} maxDate={maxDate} />`}>
          <div className="w-full max-w-xs">
            <DateRangePicker value={r2} onChange={setR2} minDate={minDate} maxDate={maxDate} placeholder="Current month only" />
          </div>
        </Playground>
      </Section>

      <Section id="default">
        <Playground title="Calendar — Default" description="Two-month side-by-side layout with optional preset pills."
          code={`<CalendarDateRangePicker variant="default" value={range} onChange={setRange} />`}>
          <CalendarDateRangePicker variant="default" value={r3} onChange={setR3} />
        </Playground>
      </Section>

      <Section id="split">
        <Playground title="Calendar — Split" description="Colored header bar showing selected start/end dates above the two-month grid."
          code={`<CalendarDateRangePicker variant="split" value={range} onChange={setRange} />`}>
          <CalendarDateRangePicker variant="split" value={r4} onChange={setR4} />
        </Playground>
      </Section>

      <Section id="minimal">
        <Playground title="Calendar — Minimal" description="Single-month, clean design with rounded-full day cells."
          code={`<CalendarDateRangePicker variant="minimal" value={range} onChange={setRange} />`}>
          <CalendarDateRangePicker variant="minimal" value={r5} onChange={setR5} />
        </Playground>
      </Section>

      <Section id="card">
        <Playground title="Calendar — Card" description="Elevated card with title, rounded-3xl corners, and a preset grid below."
          code={`<CalendarDateRangePicker variant="card" value={range} onChange={setRange} />`}>
          <CalendarDateRangePicker variant="card" value={r6} onChange={setR6} />
        </Playground>
      </Section>

      <Section id="sidebar">
        <Playground title="Calendar — Sidebar" description="Preset list on the left panel, two-month calendar on the right."
          code={`<CalendarDateRangePicker variant="sidebar" value={range} onChange={setRange} />`}>
          <CalendarDateRangePicker variant="sidebar" value={r7} onChange={setR7} />
        </Playground>
      </Section>

      <Section id="timeline">
        <Playground title="Calendar — Timeline" description="Three months displayed horizontally in a strip."
          code={`<CalendarDateRangePicker variant="timeline" value={range} onChange={setRange} />`}>
          <CalendarDateRangePicker variant="timeline" value={r8} onChange={setR8} />
        </Playground>
      </Section>

      <Section id="compact">
        <Playground title="Calendar — Compact" description="Single month with preset pills row above."
          code={`<CalendarDateRangePicker variant="compact" value={range} onChange={setRange} />`}>
          <CalendarDateRangePicker variant="compact" value={r9} onChange={setR9} />
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "value",       type: "DateRange",                    required: true,  description: "Controlled date range value { from, to }." },
          { prop: "onChange",    type: "(range: DateRange) => void",   required: true,  description: "Fired when the range changes." },
          { prop: "minDate",     type: "Date",                                          description: "Earliest selectable date." },
          { prop: "maxDate",     type: "Date",                                          description: "Latest selectable date." },
          { prop: "placeholder", type: "string",                                        description: "Placeholder text (DateRangePicker only)." },
          { prop: "className",   type: "string",                                        description: "Additional CSS classes." },
          { prop: "variant",     type: "CalendarDateRangeVariant",                      description: "CalendarDateRangePicker layout variant." },
          { prop: "showPresets", type: "boolean",                       default: "true", description: "Show quick-select preset buttons." },
        ]} />
      </Section>

      <Section id="dataformat">
        <PropsTable rows={[
          { prop: "from", type: "Date | null", required: true, description: "Start date of the range. null when not yet selected." },
          { prop: "to",   type: "Date | null", required: true, description: "End date of the range. null when not yet selected." },
        ]} />
      </Section>
    </DocsLayout>
  )
}
