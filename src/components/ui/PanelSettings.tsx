import * as React from "react"
import { RotateCcw, Save } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { useTheme, COLOR_PALETTE, ThemeColors } from "../theme-provider"
import { Tabs } from "./tabs"
import { Select } from "./select"
import { Input } from "./input"
import { Button } from "./button"
import config from "../conf/settingConfig.json"

// ─── Types ────────────────────────────────────────────────────────────────────

export type PanelSettingsTab = "appearance" | "colors" | "typography"

export interface PanelSettingsProps {
  /** Initially active tab */
  defaultTab?: PanelSettingsTab
  /** Called when theme (light/dark/system) changes */
  onThemeChange?: (theme: "light" | "dark" | "system") => void
  /** Called when any color token changes */
  onColorsChange?: (colors: Partial<ThemeColors>) => void
  /** Called when font size changes */
  onFontSizeChange?: (size: string) => void
  /** Called when font family changes */
  onFontFamilyChange?: (family: string) => void
  /** Called when settings are saved */
  onSave?: () => void
  /** Called when the user resets all settings to defaults */
  onReset?: () => void
  /** Additional CSS classes on the root element */
  className?: string
}

// ─── Constants (sourced from settingConfig.json) ─────────────────────────────

const THEME_OPTIONS = config.themeOptions as import("./select").SelectOption[]
const FONT_SIZES = config.fontSizes as import("./select").SelectOption[]
const FONT_FAMILIES = config.fontFamilies as import("./select").SelectOption[]
const COLOR_PAIRS = config.colorPairs as { base: keyof ThemeColors; hover: keyof ThemeColors; label: string }[]

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/60 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 mt-1">
      {children}
    </p>
  )
}

// ─── Tab panels ───────────────────────────────────────────────────────────────

function AppearancePanel({ onThemeChange }: { onThemeChange?: PanelSettingsProps["onThemeChange"] }) {
  const { theme, setTheme } = useTheme()

  const handleTheme = (v: string) => {
    const t = v as "light" | "dark" | "system"
    setTheme(t)
    onThemeChange?.(t)
  }

  return (
    <div className="space-y-1">
      <SectionHeading>Display</SectionHeading>
      <SettingRow label="Theme" description="Choose between light, dark, or follow system preference.">
        <Select
          options={THEME_OPTIONS}
          value={theme}
          onChange={handleTheme}
          className="w-32"
        />
      </SettingRow>
    </div>
  )
}

function ColorsPanel({ onColorsChange }: { onColorsChange?: PanelSettingsProps["onColorsChange"] }) {
  const { colors, setColors } = useTheme()

  const handleColor = (key: keyof ThemeColors, value: string) => {
    setColors({ [key]: value })
    onColorsChange?.({ [key]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <SectionHeading>Quick Palette</SectionHeading>
        <div className="grid grid-cols-10 gap-1.5">
          {COLOR_PALETTE.map((c) => (
            <button
              key={c.base}
              type="button"
              title={c.base}
              onClick={() => {
                setColors({ primary: c.base, primaryHover: c.hover, info: c.info, infoHover: c.infoHover, accent: c.accent, accentHover: c.accentHover })
                onColorsChange?.({ primary: c.base, primaryHover: c.hover, info: c.info, infoHover: c.infoHover, accent: c.accent, accentHover: c.accentHover })
              }}
              className={cn(
                "h-7 w-full rounded-md border border-white/10 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
                colors.primary === c.base && "ring-2 ring-ring ring-offset-1"
              )}
              style={{ backgroundColor: c.base }}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionHeading>Custom Colors</SectionHeading>
        <div className="space-y-0">
          {COLOR_PAIRS.map((pair) => (
            <div key={pair.base} className="py-3 border-b border-border/60 last:border-0">
              <p className="text-xs font-semibold mb-2">{pair.label}</p>
              <div className="grid grid-cols-2 gap-3">
                {(["base", "hover"] as const).map((variant) => {
                  const key = variant === "base" ? pair.base : pair.hover
                  return (
                    <div key={variant} className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={colors[key]}
                        onChange={(e) => handleColor(key, e.target.value)}
                        className="h-7 w-12 cursor-pointer p-0.5 rounded"
                      />
                      <div>
                        <p className="text-[10px] text-muted-foreground capitalize">{variant}</p>
                        <p className="text-xs font-mono">{colors[key]}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TypographyPanel({
  onFontSizeChange,
  onFontFamilyChange,
}: Pick<PanelSettingsProps, "onFontSizeChange" | "onFontFamilyChange">) {
  const { fontSize, setFontSize, fontFamily, setFontFamily } = useTheme()

  const handleSize = (v: string) => { setFontSize(v); onFontSizeChange?.(v) }
  const handleFamily = (v: string) => { setFontFamily(v); onFontFamilyChange?.(v) }

  return (
    <div className="space-y-1">
      <SectionHeading>Font</SectionHeading>
      <SettingRow label="Font Size" description="Base font size applied across the UI.">
        <Select options={FONT_SIZES} value={fontSize} onChange={handleSize} className="w-44" />
      </SettingRow>
      <SettingRow label="Font Family" description="Primary typeface used for all text.">
        <Select options={FONT_FAMILIES} value={fontFamily} onChange={handleFamily} className="w-44" />
      </SettingRow>
      <div className="pt-4">
        <SectionHeading>Preview</SectionHeading>
        <div
          className="rounded-lg border border-border bg-muted/30 p-4 space-y-1"
          style={{ fontFamily, fontSize }}
        >
          <p className="font-bold text-foreground">The quick brown fox</p>
          <p className="text-muted-foreground">jumps over the lazy dog. 0123456789</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PanelSettings({
  defaultTab = "appearance",
  onThemeChange,
  onColorsChange,
  onFontSizeChange,
  onFontFamilyChange,
  onSave,
  onReset,
  className,
}: PanelSettingsProps) {
  const { saveConfig, resetSettings } = useTheme()
  const [saved, setSaved] = React.useState(false)

  const handleSave = () => {
    saveConfig()
    onSave?.()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    resetSettings()
    onReset?.()
  }

  const tabs = [
    {
      value: "appearance",
      label: "Appearance",
      content: <AppearancePanel onThemeChange={onThemeChange} />,
    },
    {
      value: "colors",
      label: "Colors",
      content: <ColorsPanel onColorsChange={onColorsChange} />,
    },
    {
      value: "typography",
      label: "Typography",
      content: <TypographyPanel onFontSizeChange={onFontSizeChange} onFontFamilyChange={onFontFamilyChange} />,
    },
  ]

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Tabs items={tabs} defaultValue={defaultTab} variant="pill" />
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Reset
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-3.5 w-3.5 mr-1.5" />
          {saved ? "Saved!" : "Save"}
        </Button>
      </div>
    </div>
  )
}
