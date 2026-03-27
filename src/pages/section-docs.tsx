import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { SectionBlock } from "../components/ui/section"
import { Button } from "../components/ui/button"
import { Settings, Info, AlertTriangle, Plus, ChevronRight } from "lucide-react"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "default",    label: "Default" },
  { id: "card",       label: "Card Variant" },
  { id: "bordered",   label: "Bordered Variant" },
  { id: "ghost",      label: "Ghost Variant" },
  { id: "icon",       label: "With Icon" },
  { id: "action",     label: "With Action" },
  { id: "divider",    label: "With Divider" },
  { id: "collapsible",label: "Collapsible" },
  { id: "nested",     label: "Nested Sections" },
  { id: "props",      label: "Props" },
]

export function SectionDocs() {
  return (
    <DocsLayout toc={TOC}>

      <Section id="default">
        <Playground
          title="Default"
          description="Plain section with title and description — no background."
          code={`<SectionBlock title="Account Details" description="Manage your personal information.">
  <p>Content goes here.</p>
</SectionBlock>`}
        >
          <div className="w-full">
            <SectionBlock title="Account Details" description="Manage your personal information.">
              <p className="text-sm text-muted-foreground">Your name, email, and profile photo are shown here.</p>
            </SectionBlock>
          </div>
        </Playground>
      </Section>

      <Section id="card">
        <Playground
          title="Card Variant"
          description="Glass card with padding and shadow."
          code={`<SectionBlock variant="card" title="Billing" description="Your current plan and invoices.">
  <p>Content</p>
</SectionBlock>`}
        >
          <div className="w-full">
            <SectionBlock variant="card" title="Billing" description="Your current plan and invoices.">
              <p className="text-sm text-muted-foreground">Pro Plan · $29/month · Renews Jan 1, 2026</p>
            </SectionBlock>
          </div>
        </Playground>
      </Section>

      <Section id="bordered">
        <Playground
          title="Bordered Variant"
          description="Clean border with no background fill."
          code={`<SectionBlock variant="bordered" title="Notifications">
  <p>Content</p>
</SectionBlock>`}
        >
          <div className="w-full">
            <SectionBlock variant="bordered" title="Notifications" description="Choose what you want to be notified about.">
              <p className="text-sm text-muted-foreground">Email, push, and in-app notification settings.</p>
            </SectionBlock>
          </div>
        </Playground>
      </Section>

      <Section id="ghost">
        <Playground
          title="Ghost Variant"
          description="Subtle muted background — great for secondary content."
          code={`<SectionBlock variant="ghost" title="Tips">
  <p>Content</p>
</SectionBlock>`}
        >
          <div className="w-full">
            <SectionBlock variant="ghost" title="Tips & Shortcuts" description="Helpful hints to get the most out of the app.">
              <p className="text-sm text-muted-foreground">Press ⌘K to open the command palette at any time.</p>
            </SectionBlock>
          </div>
        </Playground>
      </Section>

      <Section id="icon">
        <Playground
          title="With Icon"
          description="Leading icon next to the title."
          code={`<SectionBlock variant="card" icon={<Settings />} title="Preferences">
  <p>Content</p>
</SectionBlock>`}
        >
          <div className="w-full space-y-4">
            <SectionBlock variant="card" icon={<Settings className="h-5 w-5" />} title="Preferences" description="Customize your experience.">
              <p className="text-sm text-muted-foreground">Theme, language, and display settings.</p>
            </SectionBlock>
            <SectionBlock variant="bordered" icon={<Info className="h-5 w-5 text-info" />} title="Information" description="Read-only system details.">
              <p className="text-sm text-muted-foreground">Version 2.4.1 · Build #1042</p>
            </SectionBlock>
            <SectionBlock variant="bordered" icon={<AlertTriangle className="h-5 w-5 text-warning" />} title="Danger Zone" description="Irreversible actions.">
              <p className="text-sm text-muted-foreground">Delete account, revoke tokens, reset data.</p>
            </SectionBlock>
          </div>
        </Playground>
      </Section>

      <Section id="action">
        <Playground
          title="With Action"
          description="Action slot in the top-right corner."
          code={`<SectionBlock
  variant="card"
  title="Team Members"
  action={<Button size="sm">Add Member</Button>}
>
  <p>Content</p>
</SectionBlock>`}
        >
          <div className="w-full">
            <SectionBlock
              variant="card"
              title="Team Members"
              description="People with access to this workspace."
              action={<Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Add Member</Button>}
            >
              <p className="text-sm text-muted-foreground">3 members · 1 pending invite</p>
            </SectionBlock>
          </div>
        </Playground>
      </Section>

      <Section id="divider">
        <Playground
          title="With Divider"
          description="A border separates the header from the body."
          code={`<SectionBlock variant="card" divider title="API Keys">
  <p>Content</p>
</SectionBlock>`}
        >
          <div className="w-full">
            <SectionBlock
              variant="card"
              divider
              title="API Keys"
              description="Manage your secret keys."
              action={<Button size="sm" variant="outline" rightIcon={<ChevronRight className="h-4 w-4" />}>View all</Button>}
            >
              <p className="text-sm text-muted-foreground">2 active keys · last used 3 hours ago</p>
            </SectionBlock>
          </div>
        </Playground>
      </Section>

      <Section id="collapsible">
        <Playground
          title="Collapsible"
          description="Click the header to expand or collapse the content."
          code={`<SectionBlock variant="bordered" collapsible title="Advanced Settings">
  <p>Hidden content</p>
</SectionBlock>`}
        >
          <div className="w-full space-y-3">
            <SectionBlock variant="bordered" collapsible defaultOpen title="General Settings" description="Click to collapse.">
              <p className="text-sm text-muted-foreground">Language, timezone, and date format preferences.</p>
            </SectionBlock>
            <SectionBlock variant="bordered" collapsible defaultOpen={false} title="Advanced Settings" description="Click to expand.">
              <p className="text-sm text-muted-foreground">Debug mode, experimental features, and developer tools.</p>
            </SectionBlock>
          </div>
        </Playground>
      </Section>

      <Section id="nested">
        <Playground
          title="Nested Sections"
          description="Sections can be nested inside each other."
          code={`<SectionBlock variant="card" title="Account">
  <SectionBlock variant="ghost" title="Profile" collapsible>
    <p>Profile content</p>
  </SectionBlock>
  <SectionBlock variant="ghost" title="Security" collapsible>
    <p>Security content</p>
  </SectionBlock>
</SectionBlock>`}
        >
          <div className="w-full">
            <SectionBlock variant="card" title="Account" description="All account-related settings.">
              <div className="space-y-3">
                <SectionBlock variant="ghost" collapsible title="Profile" description="Name, avatar, bio.">
                  <p className="text-sm text-muted-foreground">Edit your public profile information.</p>
                </SectionBlock>
                <SectionBlock variant="ghost" collapsible defaultOpen={false} title="Security" description="Password, 2FA, sessions.">
                  <p className="text-sm text-muted-foreground">Manage your login security settings.</p>
                </SectionBlock>
                <SectionBlock variant="ghost" collapsible defaultOpen={false} title="Integrations" description="Connected apps.">
                  <p className="text-sm text-muted-foreground">GitHub, Slack, Google — manage OAuth connections.</p>
                </SectionBlock>
              </div>
            </SectionBlock>
          </div>
        </Playground>
      </Section>

      <Section id="props"><PropsTable rows={[
        { prop: "title",            type: "ReactNode",                                                    description: "Section heading." },
        { prop: "description",      type: "ReactNode",                                                    description: "Subtitle shown below the title." },
        { prop: "icon",             type: "ReactNode",                                                    description: "Leading icon next to the title." },
        { prop: "action",           type: "ReactNode",                                                    description: "Action slot in the top-right corner." },
        { prop: "children",         type: "ReactNode",         required: true,                            description: "Section body content." },
        { prop: "variant",          type: '"default" | "card" | "bordered" | "ghost"', default: '"default"', description: "Visual style of the section wrapper." },
        { prop: "collapsible",      type: "boolean",           default: "false",                          description: "Allow the section to be toggled open/closed." },
        { prop: "defaultOpen",      type: "boolean",           default: "true",                           description: "Initial open state for collapsible sections." },
        { prop: "divider",          type: "boolean",           default: "false",                          description: "Add a border between the header and body." },
        { prop: "className",        type: "string",                                                       description: "Additional CSS classes on the wrapper." },
        { prop: "contentClassName", type: "string",                                                       description: "Additional CSS classes on the body container." },
      ]} /></Section>

    </DocsLayout>
  )
}
