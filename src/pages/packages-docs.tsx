import * as React from "react"
import { useToast } from "@/src/components/ui/notification"

const UI_COMPONENTS = [
  { name: "Accordion",         file: "accordion",         exports: ["Accordion"] },
  { name: "Avatar Stack",      file: "avatar-stack",      exports: ["AvatarStack"] },
  { name: "Badge",             file: "badge",             exports: ["Badge"] },
  { name: "Breadcrumb",        file: "breadcrumb",        exports: ["Breadcrumb"] },
  { name: "Button",            file: "button",            exports: ["Button"] },
  { name: "Calendar",          file: "calendar",          exports: ["Calendar"] },
  { name: "Card",              file: "card",              exports: ["Card"] },
  { name: "Checkbox",          file: "checkbox",          exports: ["Checkbox"] },
  { name: "Color Picker",      file: "color-picker",      exports: ["ColorPicker"] },
  { name: "Combobox",          file: "combobox",          exports: ["Combobox"] },
  { name: "Command Palette",   file: "command-palette",   exports: ["CommandPalette"] },
  { name: "Context Menu",      file: "context-menu",      exports: ["ContextMenu"] },
  { name: "Dashboard Widget",  file: "dashboard-widget",  exports: ["StatsWidget", "ChartWidget", "TableWidget", "ComposableWidget"] },
  { name: "Data Grid",         file: "data-grid",         exports: ["DataGrid"] },
  { name: "Date Picker",       file: "date-picker",       exports: ["DatePickerPopup"] },
  { name: "Date Range Picker", file: "date-range-picker", exports: ["DateRangePicker"] },
  { name: "Drawer",            file: "drawer",            exports: ["Drawer"] },
  { name: "Dropdown",          file: "dropdown",          exports: ["Dropdown"] },
  { name: "File Upload",       file: "file-upload",       exports: ["FileUpload"] },
  { name: "Flex Layout",       file: "flex-layout",       exports: ["FlexLayout"] },
  { name: "Grid Layout",       file: "grid-layout",       exports: ["GridLayout"] },
  { name: "Input",             file: "input",             exports: ["Input"] },
  { name: "Kanban",            file: "kanban",            exports: ["KanbanBoard"] },
  { name: "Label",             file: "label",             exports: ["Label"] },
  { name: "Modal",             file: "modal",             exports: ["Modal"] },
  { name: "Modal Variants",    file: "modal-variants",    exports: ["ModalUnchange", "ModalConfirmation", "ModalWithForms"] },
  { name: "Navigation",        file: "navigation",        exports: ["Navigation"] },
  { name: "Notification",      file: "notification",      exports: ["NotificationPanel", "NotificationBanner", "useToast", "ToastProvider"] },
  { name: "OTP Input",         file: "otp-input",         exports: ["OtpInput"] },
  { name: "Pagination",        file: "pagination",        exports: ["Pagination"] },
  { name: "Popover",           file: "popover",           exports: ["Popover"] },
  { name: "Progress",          file: "progress",          exports: ["Progress"] },
  { name: "Radio Group",       file: "radio-group",       exports: ["RadioGroup"] },
  { name: "Repeater",          file: "repeater",          exports: ["Repeater"] },
  { name: "Resizable Panels",  file: "resizable-panels",  exports: ["ResizablePanels"] },
  { name: "Rich Text Editor",  file: "rich-text-editor",  exports: ["RichTextEditor"] },
  { name: "Scroll Area",       file: "scroll-area",       exports: ["ScrollArea"] },
  { name: "Section",           file: "section",           exports: ["SectionBlock"] },
  { name: "Select",            file: "select",            exports: ["Select"] },
  { name: "Skeleton",          file: "skeleton",          exports: ["Skeleton"] },
  { name: "Slider",            file: "slider",            exports: ["Slider"] },
  { name: "Stat Card",         file: "stat-card",         exports: ["StatCard"] },
  { name: "Stepper",           file: "stepper",           exports: ["Stepper"] },
  { name: "Table",             file: "table",             exports: ["Table"] },
  { name: "Tabs",              file: "tabs",              exports: ["Tabs"] },
  { name: "Tag Input",         file: "tag-input",         exports: ["TagInput"] },
  { name: "Textarea",          file: "textarea",          exports: ["Textarea"] },
  { name: "Timeline",          file: "timeline",          exports: ["Timeline"] },
  { name: "Toggle Switch",     file: "toggle-switch",     exports: ["ToggleSwitch"] },
  { name: "Tooltip",           file: "tooltip",           exports: ["Tooltip"] },
  { name: "Tree View",         file: "tree-view",         exports: ["TreeView"] },
  { name: "Widget",            file: "widget",            exports: ["Widget"] },
]

const PACKAGES = [
  { name: "react",            version: "^19.0.0",   description: "Core React library for building UI components.",                                                       npm: "npm install react react-dom" },
  { name: "react-router-dom", version: "^7.13.1",   description: "Declarative routing for React apps — handles navigation, routes, and URL params.",                     npm: "npm install react-router-dom" },
  { name: "tailwindcss",      version: "^4.1.14",   description: "Utility-first CSS framework used for all component styling.",                                          npm: "npm install tailwindcss @tailwindcss/vite" },
  { name: "lucide-react",     version: "^0.546.0",  description: "Icon library — used throughout components for suffix icons, prefix icons, and UI chrome.",             npm: "npm install lucide-react" },
  { name: "clsx",             version: "^2.1.1",    description: "Utility for conditionally joining class names together.",                                               npm: "npm install clsx" },
  { name: "tailwind-merge",   version: "^3.5.0",    description: "Merges Tailwind CSS classes without style conflicts. Used in the cn() utility.",                      npm: "npm install tailwind-merge" },
  { name: "motion",           version: "^12.23.24", description: "Animation library (Framer Motion). Used for transitions in modals, drawers, notifications, and more.", npm: "npm install motion" },
  { name: "date-fns",         version: "^4.1.0",    description: "Date utility library used by the Calendar, Date Picker, and Date Range Picker components.",            npm: "npm install date-fns" },
  { name: "vite",             version: "^6.2.0",    description: "Build tool and dev server. Required to run and bundle the project.",                                   npm: "npm install -D vite @vitejs/plugin-react" },
  { name: "typescript",       version: "~5.8.2",    description: "TypeScript compiler. All components are fully typed.",                                                 npm: "npm install -D typescript" },
]

function copyText(text: string) {
  const el = document.createElement("textarea")
  el.value = text
  el.setAttribute("readonly", "")
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0"
  document.body.appendChild(el)
  el.focus()
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

export function PackagesDocs() {
  const { toast } = useToast()
  const [tab, setTab] = React.useState<"components" | "packages">("components")

  const allImports = UI_COMPONENTS.map(
    (c) => `import { ${c.exports.join(", ")} } from "@juv/codego-react-ui/${c.file}"`
  ).join("\n")

  function copy(text: string, label: string) {
    copyText(text)
    toast({ variant: "success", title: "Copied!", description: label, duration: 2000 })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Packages & Imports</h2>
        <p className="text-muted-foreground text-sm">All dependencies and UI component import paths for this project.</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-xl bg-muted p-1 w-fit">
        {(["components", "packages"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "components" ? "UI Components" : "NPM Packages"}
          </button>
        ))}
      </div>

      {tab === "components" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{UI_COMPONENTS.length} components</p>
            <button
              onClick={() => copy(allImports, "All component imports copied")}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <CopyIcon />
              Copy all imports
            </button>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Component</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Import</th>
                  <th className="px-4 py-2.5 w-10" />
                </tr>
              </thead>
              <tbody>
                {UI_COMPONENTS.map((c, i) => {
                  const importStr = `import { ${c.exports.join(", ")} } from "@juv/codego-react-ui/${c.file}"`
                  return (
                    <tr key={c.file} className={`border-b border-border/60 last:border-0 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
                      <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">{c.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{importStr}</td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => copy(importStr, `${c.name} import copied`)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="Copy import"
                        >
                          <CopyIcon />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "packages" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Install all dependencies at once:</p>
            <button
              onClick={() => copy("npm install", "npm install copied")}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <CopyIcon />
              Copy
            </button>
          </div>

          <div className="grid gap-3">
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-sm text-foreground">{pkg.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{pkg.version}</span>
                  </div>
                  <a
                    href={`https://www.npmjs.com/package/${pkg.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    npmjs.com ↗
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
                <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 font-mono text-xs">
                  <span className="text-foreground truncate">{pkg.npm}</span>
                  <button
                    onClick={() => copy(pkg.npm, `"${pkg.name}" install command copied`)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}
