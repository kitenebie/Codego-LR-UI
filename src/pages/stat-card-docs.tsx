import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { StatCard } from "../components/ui/stat-card"
import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",     label: "Basic" },
  { id: "trend",     label: "With Trend" },
  { id: "sparkline", label: "With Sparkline" },
  { id: "loading",   label: "Loading State" },
  { id: "grid",      label: "Grid Layout" },
  { id: "props",     label: "Props" },
]

export function StatCardDocs() {
  const [loading, setLoading] = useState(false)

  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Stat Card" description="KPI card with title and value."
          code={`<StatCard title="Total Users" value="12,345" />`}>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <StatCard title="Total Users" value="12,345" />
            <StatCard title="Revenue" value="$48,200" />
          </div>
        </Playground>
      </Section>
      <Section id="trend">
        <Playground title="Stat Card with Trend" description="Show change percentage and trend direction."
          code={`<StatCard title="Revenue" value="$48,200" change={12.5} changeLabel="vs last month" />`}>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <StatCard title="Revenue" value="$48,200" change={12.5} changeLabel="vs last month" icon={<DollarSign className="h-5 w-5" />} />
            <StatCard title="Churn Rate" value="2.4%" change={-0.8} changeLabel="vs last month" icon={<TrendingUp className="h-5 w-5" />} />
          </div>
        </Playground>
      </Section>
      <Section id="sparkline">
        <Playground title="Stat Card with Sparkline" description="Pass sparkline data to render a mini chart."
          code={`<StatCard title="Orders" value="1,234" sparkline={[10,25,18,40,35,55,48,70]} change={8.2} />`}>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <StatCard title="Orders" value="1,234" sparkline={[10,25,18,40,35,55,48,70]} change={8.2} changeLabel="this week" icon={<ShoppingCart className="h-5 w-5" />} />
            <StatCard title="Active Users" value="8,901" sparkline={[50,45,60,55,70,65,80,75]} change={5.1} changeLabel="this week" icon={<Users className="h-5 w-5" />} />
          </div>
        </Playground>
      </Section>
      <Section id="loading">
        <Playground title="Loading State" description="Set loading to show skeleton placeholders."
          code={`<StatCard loading title="Revenue" value="..." />`}>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <StatCard loading title="Revenue" value="" />
            <StatCard loading title="Users" value="" />
          </div>
        </Playground>
      </Section>
      <Section id="grid">
        <Playground title="Dashboard Grid" description="Four stat cards in a responsive grid."
          code={`<div className="grid grid-cols-4 gap-4">\n  <StatCard ... />\n</div>`}>
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Total Revenue" value="$124,500" change={14.2} changeLabel="vs last month" sparkline={[30,45,35,60,55,70,65,80]} icon={<DollarSign className="h-5 w-5" />} />
            <StatCard title="Active Users" value="8,901" change={5.1} changeLabel="vs last month" sparkline={[50,45,60,55,70,65,80,75]} icon={<Users className="h-5 w-5" />} />
            <StatCard title="New Orders" value="1,234" change={-2.4} changeLabel="vs last month" sparkline={[70,65,55,60,50,45,40,35]} icon={<ShoppingCart className="h-5 w-5" />} />
            <StatCard title="Growth Rate" value="18.7%" change={3.2} changeLabel="vs last month" sparkline={[20,30,25,40,35,50,45,60]} icon={<TrendingUp className="h-5 w-5" />} />
          </div>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "title",       type: "ReactNode",  required: true, description: "Stat label." },
        { prop: "value",       type: "ReactNode",  required: true, description: "Primary metric value." },
        { prop: "change",      type: "number",                     description: "Percentage change. Positive = up, negative = down." },
        { prop: "changeLabel", type: "string",                     description: "Context label next to the change e.g. \"vs last month\"." },
        { prop: "trend",       type: '"up" | "down" | "neutral"',  description: "Override the auto-detected trend direction." },
        { prop: "icon",        type: "ReactNode",                  description: "Icon shown in the top-right." },
        { prop: "sparkline",   type: "number[]",                   description: "Data points for the mini sparkline chart." },
        { prop: "description", type: "string",                     description: "Secondary label shown below the change." },
        { prop: "loading",     type: "boolean",    default: "false", description: "Show skeleton placeholder." },
        { prop: "className",   type: "string",                     description: "Additional CSS classes." },
      ]} /></Section>
    </DocsLayout>
  )
}
