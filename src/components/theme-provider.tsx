import React, { createContext, useContext, useEffect, useState } from 'react';
import defaultConfig from './conf/settingConfig.json';

type Theme = 'dark' | 'light' | 'system';

export type ThemeColors = {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  info: string;
  infoHover: string;
  warning: string;
  warningHover: string;
  danger: string;
  dangerHover: string;
  accent: string;
  accentHover: string;
};

export type ThemeSettings = {
  theme: Theme;
  colors: ThemeColors;
  fontSize: string;
  fontFamily: string;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
  savedConfigKey?: string;
};

type ThemeProviderState = ThemeSettings & {
  setTheme: (theme: Theme) => void;
  setColors: (colors: Partial<ThemeColors>) => void;
  setFontSize: (size: string) => void;
  setFontFamily: (family: string) => void;
  saveConfig: () => void;
  resetSettings: () => void;
};

// ── Factory defaults from JSON (never changes at runtime) ─────────────────────

const FACTORY_DEFAULTS: ThemeSettings = {
  theme:      defaultConfig.defaults.theme as Theme,
  fontSize:   defaultConfig.defaults.fontSize,
  fontFamily: defaultConfig.defaults.fontFamily,
  colors:     defaultConfig.defaults.colors as ThemeColors,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...fallback, ...JSON.parse(raw) } as T;
  } catch { /* ignore */ }
  return fallback;
}

function saveJSON(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

// ── Context ───────────────────────────────────────────────────────────────────

const initialState: ThemeProviderState = {
  ...FACTORY_DEFAULTS,
  setTheme:      () => null,
  setColors:     () => null,
  setFontSize:   () => null,
  setFontFamily: () => null,
  saveConfig:    () => null,
  resetSettings: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const COLOR_PALETTE = defaultConfig.colorPalette;

// ── Provider ──────────────────────────────────────────────────────────────────

export function ThemeProvider({
  children,
  storageKey     = 'codego-ui-theme-settings',
  savedConfigKey = 'codego-ui-saved-config',
  ...props
}: ThemeProviderProps) {

  // Saved config = user's persisted defaults (falls back to factory defaults)
  const [savedConfig, setSavedConfig] = useState<ThemeSettings>(() =>
    loadJSON(savedConfigKey, FACTORY_DEFAULTS)
  );

  // Live settings = current session (falls back to saved config)
  const [settings, setSettings] = useState<ThemeSettings>(() =>
    loadJSON(storageKey, savedConfig)
  );

  // Persist live settings on every change
  useEffect(() => { saveJSON(storageKey, settings); }, [settings, storageKey]);

  // Apply CSS variables whenever settings change
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    const resolved =
      settings.theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : settings.theme;

    root.classList.add(resolved);

    root.style.setProperty('--primary',           settings.colors.primary);
    root.style.setProperty('--primary-hover',     settings.colors.primaryHover);
    root.style.setProperty('--secondary',         settings.colors.secondary);
    root.style.setProperty('--secondary-hover',   settings.colors.secondaryHover);
    root.style.setProperty('--info',              settings.colors.info);
    root.style.setProperty('--info-hover',        settings.colors.infoHover);
    root.style.setProperty('--warning',           settings.colors.warning);
    root.style.setProperty('--warning-hover',     settings.colors.warningHover);
    root.style.setProperty('--danger',            settings.colors.danger);
    root.style.setProperty('--danger-hover',      settings.colors.dangerHover);
    root.style.setProperty('font-size',           settings.fontSize);
    root.style.setProperty('--font-sans',         settings.fontFamily);
  }, [settings]);

  const value: ThemeProviderState = {
    ...settings,
    setTheme:      (theme)      => setSettings(s => ({ ...s, theme })),
    setColors:     (colors)     => setSettings(s => ({ ...s, colors: { ...s.colors, ...colors } })),
    setFontSize:   (fontSize)   => setSettings(s => ({ ...s, fontSize })),
    setFontFamily: (fontFamily) => setSettings(s => ({ ...s, fontFamily })),
    // Save current live settings as the new persisted defaults
    saveConfig: () => {
      setSavedConfig(settings);
      saveJSON(savedConfigKey, settings);
    },
    // Reset live settings back to saved defaults
    resetSettings: () => setSettings(savedConfig),
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
