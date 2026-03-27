import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Skeleton } from "../components/ui/skeleton"
import { PropsTable } from "../components/ui/props-table"

export function PlaceholderDocs() {
  return (
    <DocsLayout toc={[
      { id: "skeleton", label: "Skeleton" },
      { id: "props",    label: "Props" },
    ]}>
      <Section id="skeleton"><Playground
        title="Hidden / Placeholder"
        description="A skeleton loader to show while content is loading."
        code={`<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>`}
      >
        <div className="flex items-center space-x-4 w-full max-w-md">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </Playground></Section>

      <Section id="props"><PropsTable rows={[
        { prop: "className", type: "string", description: "Tailwind classes that control the shape and size of the skeleton (e.g. h-4 w-48 rounded-full)." },
      ]} /></Section>
    </DocsLayout>
  )
}
