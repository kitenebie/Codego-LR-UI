import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import {
  useToast,
  NotificationPanel,
  NotificationBanner,
  type NotificationItem,
  type ToastPosition,
} from "../components/ui/notification"
import { Button } from "../components/ui/button"
import { Star, MessageSquare, UserPlus, ShieldAlert } from "lucide-react"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "toast-variants",   label: "Toast Variants" },
  { id: "toast-position",   label: "Toast Position" },
  { id: "toast-duration",   label: "Toast Duration" },
  { id: "toast-progress",   label: "Toast Progress" },
  { id: "toast-action",     label: "Toast with Action" },
  { id: "toast-custom",     label: "Toast Custom Icon" },
  { id: "toast-persistent", label: "Toast Persistent" },
  { id: "notif-panel",      label: "Notification Panel" },
  { id: "notif-unread",     label: "Notification Unread" },
  { id: "notif-actions",    label: "Notification Actions" },
  { id: "notif-empty",      label: "Notification Empty" },
  { id: "banner-variants",  label: "Banner Variants" },
  { id: "banner-action",    label: "Banner with Action" },
  { id: "props-toast",      label: "Toast Props" },
  { id: "props-panel",      label: "NotificationPanel Props" },
  { id: "props-banner",     label: "NotificationBanner Props" },
  { id: "dataformat",       label: "Data Format" },
]

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "New comment on your post",
    description: "Alice left a comment: great work on the new dashboard!",
    variant: "default",
    time: "2m ago",
    read: false,
    avatar: <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">A</div>,
  },
  {
    id: "2",
    title: "Deployment succeeded",
    description: "Production build v2.4.1 deployed successfully.",
    variant: "success",
    time: "15m ago",
    read: false,
  },
  {
    id: "3",
    title: "Disk usage warning",
    description: "Your storage is at 87% capacity. Consider cleaning up old files.",
    variant: "warning",
    time: "1h ago",
    read: true,
  },
  {
    id: "4",
    title: "Payment failed",
    description: "Your subscription renewal failed. Please update your payment method.",
    variant: "error",
    time: "3h ago",
    read: true,
  },
  {
    id: "5",
    title: "New team member",
    description: "Bob joined your workspace as a developer.",
    variant: "info",
    time: "1d ago",
    read: true,
    avatar: <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info/20 text-info font-bold text-sm">B</div>,
  },
]

const ACTION_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "a1",
    title: "Team invite from Carol",
    description: "Carol invited you to join the Design team.",
    variant: "info",
    time: "5m ago",
    read: false,
    avatar: <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info/20"><UserPlus className="h-4 w-4 text-info" /></div>,
    actions: [
      { label: "Accept", onClick: () => {} },
      { label: "Decline", onClick: () => {}, variant: "ghost" },
    ],
  },
  {
    id: "a2",
    title: "Pull request review requested",
    description: "Dave requested your review on PR #142.",
    variant: "default",
    time: "20m ago",
    read: false,
    actions: [
      { label: "Review now", onClick: () => {} },
    ],
  },
  {
    id: "a3",
    title: "Scheduled maintenance",
    description: "System maintenance is scheduled for Sunday 2am UTC.",
    variant: "warning",
    time: "2h ago",
    read: true,
    actions: [
      { label: "View details", onClick: () => {} },
      { label: "Dismiss", onClick: () => {}, variant: "ghost" },
    ],
  },
]

export function NotificationDocs() {
  const { toast } = useToast()
  const [notifItems, setNotifItems] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS)
  const [actionItems, setActionItems] = useState<NotificationItem[]>(ACTION_NOTIFICATIONS)
  const [emptyItems] = useState<NotificationItem[]>([])

  function markAllRead() {
    setNotifItems((prev) => prev.map((i) => ({ ...i, read: true })))
  }
  function clearAll() {
    setNotifItems([])
  }
  function dismiss(id: string) {
    setNotifItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <DocsLayout toc={TOC}>

      <Section id="toast-variants">

        <Playground
          title="Toast Variants"
          description="Five variants: default, success, error, warning, info."
          code={`const { toast } = useToast()

toast({ title: "Success!", description: "Your changes were saved.", variant: "success" })
toast({ title: "Error", description: "Something went wrong.", variant: "error" })
toast({ title: "Warning", description: "Disk space is low.", variant: "warning" })
toast({ title: "Info", description: "A new version is available.", variant: "info" })`}
        >
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast({ title: "Default", description: "This is a default toast.", variant: "default" })}>Default</Button>
            <Button onClick={() => toast({ title: "Success!", description: "Your changes were saved.", variant: "success" })}>Success</Button>
            <Button onClick={() => toast({ title: "Error", description: "Something went wrong.", variant: "error" })}>Error</Button>
            <Button onClick={() => toast({ title: "Warning", description: "Disk space is running low.", variant: "warning" })}>Warning</Button>
            <Button onClick={() => toast({ title: "Info", description: "A new version is available.", variant: "info" })}>Info</Button>
          </div>
        </Playground>
      </Section>

      <Section id="toast-position">
        <Playground
          title="Toast Position"
          description="Six positions: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right. Pass position per toast or set globally on ToastProvider."
          code={`toast({ title: "top-right", position: "top-right" })
toast({ title: "bottom-center", position: "bottom-center" })

// Or set globally:
<ToastProvider position="top-right">{children}</ToastProvider>`}
        >
          <div className="flex flex-wrap gap-2">
            {([
              "top-left", "top-center", "top-right",
              "bottom-left", "bottom-center", "bottom-right",
            ] as ToastPosition[]).map((pos) => (
              <Button
                key={pos}
                variant="outline"
                onClick={() => toast({ title: pos, description: "Toast from " + pos, variant: "default", duration: 3000, position: pos })}
              >
                {pos}
              </Button>
            ))}
          </div>
        </Playground>
      </Section>

      <Section id="toast-duration">
        <Playground
          title="Toast Duration"
          description="Control how long the toast stays visible with the duration prop (ms)."
          code={`toast({ title: "Quick", duration: 1500, variant: "info" })
toast({ title: "Slow", duration: 8000, variant: "warning" })`}
        >
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast({ title: "1.5s toast", description: "Gone quickly.", duration: 1500, variant: "info" })}>1.5s</Button>
            <Button onClick={() => toast({ title: "4s toast", description: "Default duration.", duration: 4000, variant: "default" })}>4s (default)</Button>
            <Button onClick={() => toast({ title: "8s toast", description: "Sticks around longer.", duration: 8000, variant: "warning" })}>8s</Button>
          </div>
        </Playground>
      </Section>

      <Section id="toast-progress">
        <Playground
          title="Toast Progress Bar"
          description="showProgress shows a countdown bar. Set to false to hide it."
          code={`toast({ title: "With progress", showProgress: true, duration: 5000 })
toast({ title: "No progress", showProgress: false, duration: 5000 })`}
        >
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast({ title: "With progress bar", description: "Watch the bar count down.", showProgress: true, duration: 5000, variant: "success" })}>With Progress</Button>
            <Button onClick={() => toast({ title: "No progress bar", description: "Clean look without the bar.", showProgress: false, duration: 5000, variant: "info" })}>No Progress</Button>
          </div>
        </Playground>
      </Section>

      <Section id="toast-action">
        <Playground
          title="Toast with Action"
          description="Pass an action object to render a clickable link inside the toast."
          code={`toast({
  title: "File deleted",
  description: "report.pdf was moved to trash.",
  variant: "default",
  action: { label: "Undo", onClick: () => console.log("undo") },
})`}
        >
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast({ title: "File deleted", description: "report.pdf was moved to trash.", variant: "default", action: { label: "Undo", onClick: () => toast({ title: "Restored!", variant: "success", duration: 2000 }) } })}>With Action</Button>
            <Button onClick={() => toast({ title: "Invite sent", description: "jane@example.com was invited.", variant: "success", action: { label: "View team", onClick: () => {} } })}>Invite Sent</Button>
          </div>
        </Playground>
      </Section>

      <Section id="toast-custom">
        <Playground
          title="Toast Custom Icon"
          description="Override the default variant icon with any React node."
          code={`toast({
  title: "New review",
  description: "You received a 5-star review.",
  icon: <Star className="h-4 w-4 text-warning" />,
  variant: "default",
})`}
        >
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast({ title: "New review", description: "You received a 5-star review.", icon: <Star className="h-4 w-4 text-warning" />, variant: "default" })}>Star Icon</Button>
            <Button onClick={() => toast({ title: "New message", description: "You have 3 unread messages.", icon: <MessageSquare className="h-4 w-4 text-info" />, variant: "default" })}>Message Icon</Button>
            <Button onClick={() => toast({ title: "Security alert", description: "Unusual login detected.", icon: <ShieldAlert className="h-4 w-4 text-danger" />, variant: "error" })}>Shield Icon</Button>
          </div>
        </Playground>
      </Section>

      <Section id="toast-persistent">
        <Playground
          title="Toast Persistent"
          description="Set duration to 0 to disable auto-dismiss. The user must close it manually."
          code={`toast({
  title: "Action required",
  description: "Please verify your email to continue.",
  variant: "warning",
  duration: 0,
  action: { label: "Verify now", onClick: () => {} },
})`}
        >
          <Button onClick={() => toast({ title: "Action required", description: "Please verify your email to continue.", variant: "warning", duration: 0, showProgress: false, action: { label: "Verify now", onClick: () => {} } })}>
            Persistent Toast
          </Button>
        </Playground>
      </Section>

      <Section id="notif-panel">
        <Playground
          title="Notification Panel"
          description="A bell icon trigger that opens a dropdown panel with notification items."
          code={`<NotificationPanel
  items={notifications}
  title="Notifications"
  onMarkAllRead={() => markAllRead()}
  onClearAll={() => clearAll()}
  onDismiss={(id) => dismiss(id)}
/>`}
        >
          <div className="flex items-center gap-4">
            <NotificationPanel
              items={notifItems}
              title="Notifications"
              onMarkAllRead={markAllRead}
              onClearAll={clearAll}
              onDismiss={dismiss}
            />
            <span className="text-sm text-muted-foreground">Click the bell icon</span>
          </div>
        </Playground>
      </Section>

      <Section id="notif-unread">
        <Playground
          title="Notification Unread Badge"
          description="Unread items show a colored dot and bold title. The bell shows a count badge."
          code={`// Items with read: false show unread styling
const items = [
  { id: "1", title: "New comment", read: false, variant: "default" },
  { id: "2", title: "Build passed", read: false, variant: "success" },
  { id: "3", title: "Old alert",   read: true,  variant: "warning" },
]`}
        >
          <div className="flex items-center gap-4">
            <NotificationPanel
              items={notifItems}
              title="Notifications"
              showBadge
              onMarkAllRead={markAllRead}
              onDismiss={dismiss}
            />
            <span className="text-sm text-muted-foreground">
              {notifItems.filter((i) => !i.read).length} unread
            </span>
            <Button variant="outline" onClick={() => setNotifItems(SAMPLE_NOTIFICATIONS)}>Reset</Button>
          </div>
        </Playground>
      </Section>

      <Section id="notif-actions">
        <Playground
          title="Notification with Actions"
          description="Each notification item can have inline action buttons."
          code={`{
  id: "1",
  title: "Team invite from Carol",
  variant: "info",
  read: false,
  actions: [
    { label: "Accept", onClick: () => {} },
    { label: "Decline", onClick: () => {}, variant: "ghost" },
  ],
}`}
        >
          <div className="flex items-center gap-4">
            <NotificationPanel
              items={actionItems}
              title="Notifications"
              onDismiss={(id) => setActionItems((p) => p.filter((i) => i.id !== id))}
              onMarkAllRead={() => setActionItems((p) => p.map((i) => ({ ...i, read: true })))}
            />
            <span className="text-sm text-muted-foreground">Click the bell icon</span>
          </div>
        </Playground>
      </Section>

      <Section id="notif-empty">
        <Playground
          title="Notification Empty State"
          description="When items is empty, a friendly empty state is shown."
          code={`<NotificationPanel
  items={[]}
  emptyMessage="You are all caught up!"
/>`}
        >
          <div className="flex items-center gap-4">
            <NotificationPanel
              items={emptyItems}
              title="Notifications"
              emptyMessage="You are all caught up!"
            />
            <span className="text-sm text-muted-foreground">Click the bell icon</span>
          </div>
        </Playground>
      </Section>

      <Section id="banner-variants">
        <Playground
          title="Notification Banner Variants"
          description="Inline banners for page-level alerts. All five variants supported."
          code={`<NotificationBanner variant="success" title="Changes saved" description="Your profile was updated." />
<NotificationBanner variant="error"   title="Error" description="Failed to connect to server." />
<NotificationBanner variant="warning" title="Warning" description="Your trial expires in 3 days." />
<NotificationBanner variant="info"    title="Info" description="A new version is available." />`}
        >
          <div className="w-full space-y-3">
            <NotificationBanner variant="success" title="Changes saved" description="Your profile was updated successfully." />
            <NotificationBanner variant="error"   title="Connection error" description="Failed to connect to the server. Please try again." />
            <NotificationBanner variant="warning" title="Trial expiring" description="Your free trial expires in 3 days." />
            <NotificationBanner variant="info"    title="Update available" description="Version 2.5.0 is ready to install." />
          </div>
        </Playground>
      </Section>

      <Section id="banner-action">
        <Playground
          title="Banner with Action"
          description="Add an action button and control closability."
          code={`<NotificationBanner
  variant="warning"
  title="Verify your email"
  description="Some features are locked until you verify."
  action={{ label: "Send verification email", onClick: () => {} }}
  closable
/>`}
        >
          <div className="w-full space-y-3">
            <NotificationBanner
              variant="warning"
              title="Verify your email"
              description="Some features are locked until you verify your email address."
              action={{ label: "Send verification email", onClick: () => toast({ title: "Email sent!", variant: "success", duration: 3000 }) }}
            />
            <NotificationBanner
              variant="info"
              title="New feature available"
              description="Try the new dashboard analytics view."
              action={{ label: "Try it now", onClick: () => {} }}
              closable={false}
            />
          </div>
        </Playground>
      </Section>

      <Section id="props-toast"><PropsTable rows={[
        { prop: "title",        type: "ReactNode",                                                    description: "Toast heading text." },
        { prop: "description",  type: "ReactNode",                                                    description: "Secondary body text." },
        { prop: "variant",      type: '"default" | "success" | "error" | "warning" | "info"', default: '"default"', description: "Color and icon preset." },
        { prop: "duration",     type: "number",                                          default: "4000",        description: "Auto-dismiss delay in ms. 0 = no auto-dismiss." },
        { prop: "showProgress", type: "boolean",                                         default: "true",        description: "Show countdown progress bar." },
        { prop: "icon",         type: "ReactNode",                                                    description: "Override the default variant icon." },
        { prop: "action",       type: "{ label: string; onClick: () => void }",                       description: "Inline action button rendered inside the toast." },
        { prop: "closable",     type: "boolean",                                         default: "true",        description: "Show the manual close button." },
        { prop: "position",     type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"', description: "Override the provider's default position for this toast." },
      ]} /></Section>

      <Section id="props-panel"><PropsTable rows={[
        { prop: "items",          type: "NotificationItem[]", required: true, description: "Array of notification items to display." },
        { prop: "title",          type: "string",             default: '"Notifications"', description: "Panel header title." },
        { prop: "showBadge",      type: "boolean",            default: "true",            description: "Show unread count badge on the bell icon." },
        { prop: "onMarkAllRead",  type: "() => void",                                    description: "Called when Mark all read is clicked." },
        { prop: "onClearAll",     type: "() => void",                                    description: "Called when Clear all is clicked." },
        { prop: "onDismiss",      type: "(id: string) => void",                          description: "Called when a single item is dismissed." },
        { prop: "emptyMessage",   type: "string",             default: '"No notifications"', description: "Text shown when items is empty." },
        { prop: "maxHeight",      type: "string",             default: '"max-h-[480px]"', description: "Max height of the notification list." },
        { prop: "className",      type: "string",                                        description: "Additional CSS classes on the wrapper." },
      ]} /></Section>

      <Section id="props-banner"><PropsTable rows={[
        { prop: "variant",     type: '"default" | "success" | "error" | "warning" | "info"', default: '"default"', description: "Color and icon preset." },
        { prop: "title",       type: "ReactNode",                                                    description: "Banner heading." },
        { prop: "description", type: "ReactNode",                                                    description: "Secondary body text." },
        { prop: "icon",        type: "ReactNode",                                                    description: "Override the default variant icon." },
        { prop: "closable",    type: "boolean",                                         default: "true", description: "Show the close button." },
        { prop: "onClose",     type: "() => void",                                                   description: "Called when the banner is closed." },
        { prop: "action",      type: "{ label: string; onClick: () => void }",                       description: "Action link rendered below the description." },
        { prop: "className",   type: "string",                                                       description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "NotificationItem.id",          type: "string",       required: true, description: "Unique identifier for the notification." },
        { prop: "NotificationItem.title",       type: "ReactNode",    required: true, description: "Notification heading." },
        { prop: "NotificationItem.description", type: "ReactNode",                    description: "Secondary body text." },
        { prop: "NotificationItem.variant",     type: '"default" | "success" | "error" | "warning" | "info"', description: "Color and icon preset." },
        { prop: "NotificationItem.time",        type: "string",                       description: "Timestamp label e.g. \"2m ago\"." },
        { prop: "NotificationItem.avatar",      type: "ReactNode",                    description: "Avatar or icon shown on the left." },
        { prop: "NotificationItem.read",        type: "boolean",                      description: "Whether the notification has been read." },
        { prop: "NotificationItem.onClick",     type: "() => void",                   description: "Click handler for the whole row." },
        { prop: "NotificationItem.actions",     type: "{ label: string; onClick: () => void; variant?: \"primary\" | \"ghost\" }[]", description: "Inline action buttons." },
      ]} /></Section>

    </DocsLayout>
  )
}
