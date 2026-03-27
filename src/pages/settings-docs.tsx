import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { PropsTable } from "../components/ui/props-table"
import { PanelSettings } from "../components/ui/PanelSettings"
import { Panel, PanelSidebarItem, PanelSidebarGroup } from "../components/ui/panel"
import {
  LayoutDashboard,
  Settings as SettingsIcon,
  Users,
  FileText,
  Palette,
  Type,
} from "lucide-react"

const TOC = [
  { id: "theme-provider",  label: "ThemeProvider Setup" },
  { id: "use-theme",       label: "useTheme Hook" },
  { id: "setting-config",  label: "settingConfig.json" },
  { id: "standalone",      label: "Standalone" },
  { id: "in-panel",        label: "Inside Panel" },
  { id: "default-tab",     label: "Default Tab" },
  { id: "callbacks",       label: "Callbacks" },
  { id: "props",           label: "Props" },
]

// ─── Code snippets ────────────────────────────────────────────────────────────

const CODE_THEME_PROVIDER = [
  'import { ThemeProvider } from "@juv/codego-react-ui"',
  "",
  "// Wrap your app root:",
  "export function App() {",
  "  return (",
  "    <ThemeProvider>",
  "      <YourApp />",
  "    </ThemeProvider>",
  "  )",
  "}",
  "",
  "// Optional props:",
  '<ThemeProvider storageKey="my-app-theme">',
  "  <YourApp />",
  "</ThemeProvider>",
].join("\n")

const CODE_USE_THEME = [
  'import { useTheme } from "@juv/codego-react-ui"',
  "",
  "function MyComponent() {",
  "  const {",
  "    theme,        // 'light' | 'dark' | 'system'",
  "    colors,       // ThemeColors object",
  "    fontSize,     // e.g. '16px'",
  "    fontFamily,   // e.g. '\"Space Grotesk\", sans-serif'",
  "    setTheme,",
  "    setColors,",
  "    setFontSize,",
  "    setFontFamily,",
  "    resetSettings,",
  "  } = useTheme()",
  "",
  "  return (",
  "    <button onClick={() => setTheme('dark')}>",
  "      Current: {theme}",
  "    </button>",
  "  )",
  "}",
].join("\n")

const CODE_SETTING_CONFIG = [
  "// src/components/conf/settingConfig.json",
  "{",
  '  "theme": "dark",',
  '  "fontSize": "16px",',
  '  "fontFamily": "\\"Space Grotesk\\", \\"Inter\\", sans-serif",',
  '  "colors": {',
  '    "primary": "#8b5cf6",',
  '    "primaryHover": "#7c3aed",',
  '    "secondary": "#171717",',
  '    "secondaryHover": "#262626",',
  '    "info": "#3b82f6",',
  '    "infoHover": "#2563eb",',
  '    "warning": "#f59e0b",',
  '    "warningHover": "#d97706",',
  '    "danger": "#ef4444",',
  '    "dangerHover": "#dc2626"',
  "  }",
  "}",
  "",
  "// ThemeProvider reads this as the default.",
  "// User changes are persisted to localStorage on top of these defaults.",
  "// resetSettings() reverts back to this config.",
].join("\n")

const CODE_STANDALONE = [
  'import { PanelSettings } from "@juv/codego-react-ui"',
  "",
  "<PanelSettings />",
].join("\n")

const CODE_IN_PANEL = [
  'const [active, setActive] = useState("settings")',
  "",
  "<Panel",
  "  showThemeToggle",
  "  collapsible",
  '  defaultPage="settings"',
  '  topbar={<span className="font-semibold">My App</span>}',
  "  sidebar={",
  "    <>",
  '      <PanelSidebarGroup title="Main">',
  '        <PanelSidebarItem icon={LayoutDashboard} label="Dashboard"',
  '          active={active === "dashboard"} onClick={() => setActive("dashboard")} />',
  '        <PanelSidebarItem icon={Users} label="Users"',
  '          active={active === "users"} onClick={() => setActive("users")} />',
  '        <PanelSidebarItem icon={FileText} label="Files"',
  '          active={active === "files"} onClick={() => setActive("files")} />',
  "      </PanelSidebarGroup>",
  '      <PanelSidebarGroup title="Config">',
  '        <PanelSidebarItem icon={SettingsIcon} label="Settings"',
  '          active={active === "settings"} onClick={() => setActive("settings")} />',
  "      </PanelSidebarGroup>",
  "    </>",
  "  }",
  ">",
  '  {active === "settings" ? <PanelSettings /> : <p>{active}</p>}',
  "</Panel>",
].join("\n")

const CODE_DEFAULT_TAB = [
  '<PanelSettings defaultTab="colors" />',
  '<PanelSettings defaultTab="typography" />',
].join("\n")

const CODE_CALLBACKS = [
  "<PanelSettings",
  '  onThemeChange={(t) => console.log("theme:", t)}',
  '  onColorsChange={(c) => console.log("colors:", c)}',
  '  onFontSizeChange={(s) => console.log("size:", s)}',
  '  onFontFamilyChange={(f) => console.log("family:", f)}',
  '  onReset={() => console.log("reset")}',
  "/>",
].join("\n")

// ─── Shared panel nav ─────────────────────────────────────────────────────────

const PANEL_PAGES = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "users",     label: "Users",     icon: Users },
  { key: "files",     label: "Files",     icon: FileText },
]

function PanelPageContent({ active }: { active: string }) {
  if (active === "settings") return <PanelSettings />
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold capitalize">{active}</p>
      <p className="text-sm text-muted-foreground">
        {active === "dashboard" && "Welcome back! Here's an overview of your workspace."}
        {active === "users"     && "Manage team members, roles, and permissions."}
        {active === "files"     && "Browse, upload, and organise your project files."}
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SettingsDocs() {
  const [panelActive, setPanelActive] = useState("settings")
  const [callbackLog, setCallbackLog] = useState<string[]>([])

  const log = (msg: string) =>
    setCallbackLog((prev) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(0, 6))

  return (
    <DocsLayout toc={TOC}>

      <Section id="theme-provider">
        <Playground
          title="ThemeProvider Setup"
          description="Wrap your app root with ThemeProvider. It reads defaults from settingConfig.json, applies CSS variables to the document root, and persists user changes to localStorage."
          code={CODE_THEME_PROVIDER}
        >
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 w-full max-w-lg">
            <p className="text-sm font-semibold">ThemeProvider is already active</p>
            <p className="text-xs text-muted-foreground">
              This entire docs site is wrapped in <code className="font-mono bg-muted px-1 rounded">ThemeProvider</code>.
              All components on this page reflect the live theme state.
            </p>
          </div>
        </Playground>
      </Section>

      <Section id="use-theme">
        <Playground
          title="useTheme Hook"
          description="Access and mutate theme state from any component inside ThemeProvider. Returns the current settings and setter functions."
          code={CODE_USE_THEME}
        >
          <div className="rounded-lg border border-border bg-muted/30 p-4 w-full max-w-lg space-y-1 font-mono text-xs text-muted-foreground">
            <p><span className="text-foreground font-semibold">theme</span> — 'light' | 'dark' | 'system'</p>
            <p><span className="text-foreground font-semibold">colors</span> — ThemeColors (primary, info, warning, danger…)</p>
            <p><span className="text-foreground font-semibold">fontSize</span> — string e.g. '16px'</p>
            <p><span className="text-foreground font-semibold">fontFamily</span> — string e.g. '"Space Grotesk", sans-serif'</p>
            <p><span className="text-foreground font-semibold">setTheme / setColors / setFontSize / setFontFamily</span> — setters</p>
            <p><span className="text-foreground font-semibold">resetSettings()</span> — reverts to settingConfig.json defaults</p>
          </div>
        </Playground>
      </Section>

      <Section id="setting-config">
        <Playground
          title="settingConfig.json"
          description="The JSON file at src/components/conf/settingConfig.json is the single source of truth for default settings. It is bundled into dist at build time — no file system access needed at runtime. Edit this file to change the system-wide defaults."
          code={CODE_SETTING_CONFIG}
        >
          <div className="rounded-lg border border-border bg-muted/30 p-4 w-full max-w-lg space-y-2 text-xs">
            <p className="font-semibold text-sm">How it works</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>ThemeProvider imports <code className="font-mono bg-muted px-1 rounded">settingConfig.json</code> as compile-time defaults.</li>
              <li>On first load, those defaults are applied to the document root via CSS variables.</li>
              <li>User changes (via PanelSettings) are merged and saved to <code className="font-mono bg-muted px-1 rounded">localStorage</code>.</li>
              <li>On subsequent loads, localStorage is merged on top of the config defaults.</li>
              <li><code className="font-mono bg-muted px-1 rounded">resetSettings()</code> clears overrides and reverts to the JSON defaults.</li>
            </ol>
          </div>
        </Playground>
      </Section>

      <Section id="standalone">
        <Playground
          title="Standalone"
          description="Drop the Settings component anywhere — it manages theme state internally via useTheme."
          code={CODE_STANDALONE}
        >
          <div className="w-full max-w-lg">
            <PanelSettings />
          </div>
        </Playground>
      </Section>

      <Section id="in-panel">
        <Playground
          title="Inside Panel"
          description="Embed Settings as a dedicated page inside a Panel using defaultPage and conditional rendering."
          code={CODE_IN_PANEL}
        >
          <div className="w-full">
            <Panel
              showThemeToggle
              collapsible
              defaultPage="settings"
              height="h-[560px]"
              topbar={<span className="font-semibold text-sm">My App</span>}
              sidebar={
                <>
                  <PanelSidebarGroup title="Main">
                    {PANEL_PAGES.map((p) => (
                      <PanelSidebarItem
                        key={p.key}
                        icon={p.icon}
                        label={p.label}
                        active={panelActive === p.key}
                        onClick={() => setPanelActive(p.key)}
                      />
                    ))}
                  </PanelSidebarGroup>
                  <PanelSidebarGroup title="Config">
                    <PanelSidebarItem
                      icon={SettingsIcon}
                      label="Settings"
                      active={panelActive === "settings"}
                      onClick={() => setPanelActive("settings")}
                    />
                  </PanelSidebarGroup>
                </>
              }
            >
              <PanelPageContent active={panelActive} />
            </Panel>
          </div>
        </Playground>
      </Section>

      <Section id="default-tab">
        <Playground
          title="Default Tab"
          description="Open the Settings component on a specific tab using defaultTab."
          code={CODE_DEFAULT_TAB}
        >
          <div className="grid gap-8 md:grid-cols-2 w-full">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5" /> defaultTab="colors"
              </p>
              <PanelSettings defaultTab="colors" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5" /> defaultTab="typography"
              </p>
              <PanelSettings defaultTab="typography" />
            </div>
          </div>
        </Playground>
      </Section>

      <Section id="callbacks">
        <Playground
          title="Callbacks"
          description="Listen to individual setting changes via callback props."
          code={CODE_CALLBACKS}
        >
          <div className="w-full max-w-lg space-y-4">
            <PanelSettings
              onThemeChange={(t) => log(`onThemeChange → "${t}"`)}
              onColorsChange={(c) => log(`onColorsChange → ${JSON.stringify(c)}`)}
              onFontSizeChange={(s) => log(`onFontSizeChange → "${s}"`)}
              onFontFamilyChange={(f) => log(`onFontFamilyChange → "${f}"`)}
              onReset={() => log("onReset")}
            />
            {callbackLog.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
                {callbackLog.map((entry, i) => (
                  <p key={i} className="text-xs font-mono text-muted-foreground">{entry}</p>
                ))}
              </div>
            )}
          </div>
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "defaultTab",         type: '"appearance" | "colors" | "typography"',    default: '"appearance"', description: "Which tab is active when the component first mounts." },
          { prop: "onThemeChange",      type: "(theme: 'light' | 'dark' | 'system') => void", description: "Fired when the user changes the theme mode." },
          { prop: "onColorsChange",     type: "Partial<ThemeColors>) => void",    description: "Fired when any color token is updated (base or hover)." },
          { prop: "onFontSizeChange",   type: "(size: string) => void",                    description: "Fired when the font size selection changes." },
          { prop: "onFontFamilyChange", type: "(family: string) => void",                  description: "Fired when the font family selection changes." },
          { prop: "onReset",            type: "() => void",                                description: "Fired after the user clicks Reset to Defaults." },
          { prop: "className",          type: "string",                                    description: "Additional CSS classes on the root element." },
        ]} />

        <div className="mt-8">
          <p className="text-2xl font-bold tracking-tight text-gradient mb-3">ThemeProvider Props</p>
          <PropsTable rows={[
            { prop: "children",   type: "ReactNode", required: true, description: "App content to wrap." },
            { prop: "storageKey", type: "string",    default: '"codego-ui-theme-settings"', description: "localStorage key used to persist user settings." },
          ]} />
        </div>

        <div className="mt-8">
          <p className="text-2xl font-bold tracking-tight text-gradient mb-3">ThemeColors Type</p>
          <PropsTable rows={[
            { prop: "primary / primaryHover",     type: "string", description: "Primary action color and its hover state." },
            { prop: "secondary / secondaryHover", type: "string", description: "Secondary surface color and its hover state." },
            { prop: "info / infoHover",           type: "string", description: "Info semantic color and its hover state." },
            { prop: "warning / warningHover",     type: "string", description: "Warning semantic color and its hover state." },
            { prop: "danger / dangerHover",       type: "string", description: "Danger/error semantic color and its hover state." },
          ]} />
        </div>
      </Section>

    </DocsLayout>
  )
}
