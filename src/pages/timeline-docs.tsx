import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Timeline } from "../components/ui/timeline"
import { CheckCircle, XCircle, AlertTriangle, GitCommit, Rocket, Code } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",     label: "Basic" },
  { id: "variants",  label: "Variants" },
  { id: "icons",     label: "With Icons" },
  { id: "content",   label: "Rich Content" },
  { id: "alternate", label: "Alternate" },
  { id: "props",     label: "Props" },
  { id: "dataformat",label: "Data Format" },
]

export function TimelineDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Basic Timeline" description="Vertical event list with title, description, and time."
          code={`<Timeline items={[\n  { title: "Event 1", description: "...", time: "2m ago" },\n]} />`}>
          <div className="max-w-sm">
            <Timeline items={[
              { title: "Account created", description: "Welcome to Codego UI!", time: "Just now" },
              { title: "Profile updated", description: "You updated your display name.", time: "5m ago" },
              { title: "First project", description: "Created project Dashboard v2.", time: "1h ago" },
              { title: "Team invite sent", description: "Invited 3 members to your workspace.", time: "3h ago" },
            ]} />
          </div>
        </Playground>
      </Section>
      <Section id="variants">
        <Playground title="Timeline Variants" description="Color the dot by variant."
          code={`{ title: "Deployed", variant: "success", time: "1h ago" }`}>
          <div className="max-w-sm">
            <Timeline items={[
              { title: "Deployment succeeded", variant: "success", time: "1h ago", description: "v2.4.1 is live." },
              { title: "Build failed", variant: "error", time: "2h ago", description: "Check the logs for details." },
              { title: "High memory usage", variant: "warning", time: "3h ago", description: "Memory at 87%." },
              { title: "New PR opened", variant: "info", time: "4h ago", description: "PR #142 needs review." },
            ]} />
          </div>
        </Playground>
      </Section>
      <Section id="icons">
        <Playground title="Timeline with Icons" description="Replace the dot with a custom icon."
          code={`{ title: "Deployed", icon: <Rocket className="h-4 w-4" />, variant: "success" }`}>
          <div className="max-w-sm">
            <Timeline items={[
              { title: "Deployed to production", icon: <Rocket className="h-4 w-4" />, variant: "success", time: "1h ago" },
              { title: "Code review passed", icon: <CheckCircle className="h-4 w-4" />, variant: "success", time: "2h ago" },
              { title: "Tests failed", icon: <XCircle className="h-4 w-4" />, variant: "error", time: "3h ago" },
              { title: "Commit pushed", icon: <GitCommit className="h-4 w-4" />, variant: "default", time: "4h ago" },
            ]} />
          </div>
        </Playground>
      </Section>
      <Section id="content">
        <Playground title="Rich Content" description="Add any React node as content below the description."
          code={`{ title: "PR merged", content: <Badge variant="success">merged</Badge> }`}>
          <div className="max-w-sm">
            <Timeline items={[
              {
                title: "PR #142 merged",
                description: "Feature: Add dark mode support",
                time: "2h ago",
                variant: "success",
                icon: <Code className="h-4 w-4" />,
                content: <div className="flex gap-2 mt-1"><Badge variant="success" size="sm">merged</Badge><Badge variant="info" size="sm">feat</Badge></div>,
              },
              {
                title: "Security alert",
                description: "Dependency vulnerability detected",
                time: "5h ago",
                variant: "warning",
                icon: <AlertTriangle className="h-4 w-4" />,
                content: <div className="mt-1 text-xs bg-warning/10 text-warning rounded-lg px-3 py-2">Update lodash to 4.17.21 or later.</div>,
              },
            ]} />
          </div>
        </Playground>
      </Section>
      <Section id="alternate">
        <Playground title="Alternate Layout" description="Alternate items left and right."
          code={`<Timeline align="alternate" items={items} />`}>
          <Timeline align="alternate" items={[
            { title: "Project started", time: "Jan 2024", description: "Kicked off the new dashboard project." },
            { title: "Design complete", time: "Feb 2024", description: "Figma designs approved by stakeholders.", variant: "info" },
            { title: "Beta launch", time: "Mar 2024", description: "Launched to 100 beta users.", variant: "warning" },
            { title: "v1.0 released", time: "Apr 2024", description: "Full public release.", variant: "success" },
          ]} />
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "items",    type: "TimelineItem[]",              required: true, description: "Array of timeline events." },
        { prop: "align",    type: '"left" | "alternate"',        default: '"left"', description: "Layout alignment." },
        { prop: "className",type: "string",                                       description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "TimelineItem.title",       type: "ReactNode",    required: true, description: "Event heading." },
        { prop: "TimelineItem.description", type: "ReactNode",                    description: "Secondary text below the title." },
        { prop: "TimelineItem.time",        type: "ReactNode",                    description: "Timestamp label e.g. \"2m ago\"." },
        { prop: "TimelineItem.icon",        type: "ReactNode",                    description: "Custom icon replacing the default dot." },
        { prop: "TimelineItem.variant",     type: '"default" | "success" | "error" | "warning" | "info"', description: "Dot/icon color preset." },
        { prop: "TimelineItem.content",     type: "ReactNode",                    description: "Additional content rendered below the description." },
        { prop: "TimelineItem.id",          type: "string",                       description: "Optional key for the item." },
      ]} /></Section>
    </DocsLayout>
  )
}
