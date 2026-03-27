import { cn } from "@/src/lib/utils"

export interface PropRow {
  prop: string
  type: string
  default?: string
  description: string
  required?: boolean
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="w-full space-y-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gradient">Props</h2>
        <p className="text-muted-foreground">All available props for this component.</p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Prop", "Type", "Default", "Description"].map((h) => (
                  <th key={h} className="h-11 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.prop}
                  className={cn(
                    "border-b border-border/60 last:border-0 transition-colors hover:bg-muted/20",
                    i % 2 !== 0 && "bg-muted/5"
                  )}
                >
                  <td className="px-4 py-3 align-top whitespace-nowrap">
                    <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    {row.required && <span className="ml-1 text-[10px] font-bold text-danger">*</span>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <code className="font-mono text-xs text-info/90 whitespace-pre-wrap">{row.type}</code>
                  </td>
                  <td className="px-4 py-3 align-top whitespace-nowrap">
                    {row.default
                      ? <code className="font-mono text-xs text-muted-foreground">{row.default}</code>
                      : <span className="text-muted-foreground/40 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-muted-foreground leading-relaxed">
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        <span className="text-danger font-bold">*</span> Required prop
      </p>
    </div>
  )
}
