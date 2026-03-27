import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card"
import { PropsTable } from "../components/ui/props-table"
import { Button } from "../components/ui/button"

const TOC = [
  { id: "basic",      label: "Basic Card" },
  { id: "props",      label: "Props" },
  { id: "dataformat", label: "Sub-component Props" },
]

export function CardDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="basic"><Playground
        title="Card UI"
        description="A flexible card component."
        code={`<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Create project</CardTitle>
    <CardDescription>Deploy your new project in one-click.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">
      This is the main content area of the card where you can put forms, text, or other components.
    </p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Deploy</Button>
  </CardFooter>
</Card>`}
      >
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Deploy your new project in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is the main content area of the card where you can put forms, text, or other components.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </Playground></Section>

      <Section id="props"><PropsTable rows={[
        { prop: "Card — className",        type: "string", description: "Additional CSS classes on the card wrapper." },
        { prop: "CardHeader — className",  type: "string", description: "Additional CSS classes on the header section." },
        { prop: "CardTitle — className",   type: "string", description: "Additional CSS classes on the title element." },
        { prop: "CardDescription — className", type: "string", description: "Additional CSS classes on the description element." },
        { prop: "CardContent — className", type: "string", description: "Additional CSS classes on the content section." },
        { prop: "CardFooter — className",  type: "string", description: "Additional CSS classes on the footer section." },
      ]} /></Section>
      <Section id="dataformat"><PropsTable rows={[
        { prop: "Card",            type: "HTMLDivElement", description: "Root card wrapper. Accepts all div props + className." },
        { prop: "CardHeader",      type: "HTMLDivElement", description: "Top section for title and description. Accepts className." },
        { prop: "CardTitle",       type: "HTMLHeadingElement", description: "Heading element inside CardHeader. Accepts className." },
        { prop: "CardDescription", type: "HTMLParagraphElement", description: "Subtitle element inside CardHeader. Accepts className." },
        { prop: "CardContent",     type: "HTMLDivElement", description: "Main body section. Accepts className." },
        { prop: "CardFooter",      type: "HTMLDivElement", description: "Bottom section for actions. Accepts className." },
      ]} /></Section>
    </DocsLayout>
  )
}
