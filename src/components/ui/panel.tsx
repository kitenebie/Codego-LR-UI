import * as React from "react"
import { PanelLeftClose, PanelLeftOpen, Sun, Moon, Loader2, Menu, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Tooltip } from "./tooltip"
import { useTheme } from "../theme-provider"

export interface PanelBrand {
  image?: string
  icon?: React.ReactNode
  title?: React.ReactNode
  trailing?: React.ReactNode
}

export interface PanelProfile {
  image?: string
  icon?: React.ReactNode
  content?: React.ReactNode
}

export interface MobileTab {
  key: string
  label: string
  icon: React.ElementType
}

export interface PanelProps {
  sidebar?: React.ReactNode
  sidebarBrand?: PanelBrand
  sidebarProfile?: PanelProfile
  sidebarHeader?: React.ReactNode
  sidebarFooter?: React.ReactNode
  sidebarWidth?: string
  topbar?: React.ReactNode
  topbarTrailing?: React.ReactNode
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  collapsible?: boolean
  showThemeToggle?: boolean
  defaultPage?: string
  currentPage?: string
  onPageChange?: (page: string) => void
  height?: string
  children?: React.ReactNode
  className?: string
  loading?: boolean
  emptyState?: React.ReactNode
  error?: string | null
  showGroupDividers?: boolean
  expandedGroups?: string[]
  onGroupToggle?: (groupTitle: string, expanded: boolean) => void
  theme?: "light" | "dark" | "auto"
  collapseIcon?: React.ReactNode
  expandIcon?: React.ReactNode
  meta?: Record<string, any>
  actions?: Record<string, () => void>
  keyboardNavigation?: boolean
  animationDuration?: number
  animationEasing?: string
  /** Tabs shown in mobile bottom-tab bar or drawer. Triggers responsive layout. */
  mobileTabs?: MobileTab[]
  /** Mobile nav style: "bottom-tabs" (default) or "drawer" */
  mobileVariant?: "bottom-tabs" | "drawer"
  /** Active tab key for mobile (controlled) */
  activeMobileTab?: string
  onMobileTabChange?: (key: string) => void
  /** px breakpoint below which mobile layout activates. Default 640 */
  mobileBreakpoint?: number
  /** px breakpoint below which tablet layout activates. Default 1024 */
  tabletBreakpoint?: number
}

const PanelCollapsedContext = React.createContext(false)
const PanelGroupsContext = React.createContext<{
  expandedGroups: Set<string>
  onGroupToggle: (title: string, expanded: boolean) => void
}>({ expandedGroups: new Set(), onGroupToggle: () => {} })

function PanelThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
}

type ScreenSize = "mobile" | "tablet" | "desktop"

export function Panel({
  sidebar,
  sidebarBrand,
  sidebarProfile,
  sidebarHeader,
  sidebarFooter,
  sidebarWidth = "w-56",
  topbar,
  topbarTrailing,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  collapsible = false,
  showThemeToggle = false,
  defaultPage,
  currentPage: controlledPage,
  onPageChange,
  height = "h-[520px]",
  children,
  className,
  loading = false,
  emptyState,
  error = null,
  showGroupDividers = false,
  expandedGroups: controlledExpandedGroups,
  onGroupToggle,
  collapseIcon,
  expandIcon,
  keyboardNavigation = false,
  animationDuration = 200,
  animationEasing = "ease-in-out",
  mobileTabs,
  mobileVariant = "bottom-tabs",
  activeMobileTab: controlledMobileTab,
  onMobileTabChange,
  mobileBreakpoint = 640,
  tabletBreakpoint = 1024,
}: PanelProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed)
  const [internalPage, setInternalPage] = React.useState(defaultPage || "")
  const [internalExpandedGroups, setInternalExpandedGroups] = React.useState<Set<string>>(
    new Set(controlledExpandedGroups)
  )
  const [screenSize, setScreenSize] = React.useState<ScreenSize>("desktop")
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [internalMobileTab, setInternalMobileTab] = React.useState(mobileTabs?.[0]?.key ?? "")

  const containerRef = React.useRef<HTMLDivElement>(null)

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed
  const activeMobileTab = controlledMobileTab !== undefined ? controlledMobileTab : internalMobileTab
  const expandedGroups =
    controlledExpandedGroups !== undefined ? new Set(controlledExpandedGroups) : internalExpandedGroups

  // Tablet auto-collapses sidebar to icon-only; desktop respects user setting
  const effectiveCollapsed =
    screenSize === "mobile"
      ? true
      : screenSize === "tablet"
      ? true
      : isCollapsed

  const handleCollapsedChange = (value: boolean) => {
    if (controlledCollapsed === undefined) setInternalCollapsed(value)
    onCollapsedChange?.(value)
  }

  const handleGroupToggle = (title: string, expanded: boolean) => {
    if (controlledExpandedGroups === undefined) {
      setInternalExpandedGroups((prev) => {
        const next = new Set(prev)
        if (expanded) next.add(title)
        else next.delete(title)
        return next
      })
    }
    onGroupToggle?.(title, expanded)
  }

  const handleMobileTabChange = (key: string) => {
    if (controlledMobileTab === undefined) setInternalMobileTab(key)
    onMobileTabChange?.(key)
    setDrawerOpen(false)
  }

  // Observe the container width (not window) so it works inside docs previews
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w < mobileBreakpoint) setScreenSize("mobile")
      else if (w < tabletBreakpoint) setScreenSize("tablet")
      else setScreenSize("desktop")
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [mobileBreakpoint, tabletBreakpoint])

  React.useEffect(() => {
    if (!keyboardNavigation) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCollapsed && collapsible) handleCollapsedChange(true)
      if (e.key === "Enter" && isCollapsed && collapsible) handleCollapsedChange(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [keyboardNavigation, isCollapsed, collapsible])

  const animStyle = {
    transitionDuration: `${animationDuration}ms`,
    transitionTimingFunction: animationEasing,
  }

  const hasContent = React.Children.count(children) > 0
  const showEmpty = !loading && !hasContent && emptyState

  const isMobile = screenSize === "mobile"
  const isTablet = screenSize === "tablet"

  // ─── Sidebar brand/profile helpers ───────────────────────────────────────
  function renderBrand(collapsed: boolean) {
    if (!sidebarBrand && !sidebarHeader) return null
    return (
      <div
        className={cn(
          "shrink-0 border-b border-border",
          collapsed ? "flex items-center justify-center py-3" : "flex items-center gap-2 px-4 py-3"
        )}
      >
        {sidebarBrand ? (
          collapsed ? (
            sidebarBrand.image ? (
              <img src={sidebarBrand.image} alt="logo" className="h-7 w-7 rounded-md object-cover shrink-0" />
            ) : (
              <span className="shrink-0">{sidebarBrand.icon}</span>
            )
          ) : (
            <>
              {sidebarBrand.image ? (
                <img src={sidebarBrand.image} alt="logo" className="h-7 w-7 rounded-md object-cover shrink-0" />
              ) : (
                sidebarBrand.icon && <span className="shrink-0">{sidebarBrand.icon}</span>
              )}
              {sidebarBrand.title && (
                <span className="flex-1 truncate text-sm font-semibold">{sidebarBrand.title}</span>
              )}
              {sidebarBrand.trailing && <span className="shrink-0">{sidebarBrand.trailing}</span>}
            </>
          )
        ) : (
          !collapsed && <div className="text-sm font-semibold">{sidebarHeader}</div>
        )}
      </div>
    )
  }

  function renderProfile(collapsed: boolean) {
    if (!sidebarProfile && !sidebarFooter) return null
    return (
      <div
        className={cn(
          "shrink-0 border-t border-border",
          collapsed ? "flex items-center justify-center py-3" : "px-4 py-3"
        )}
      >
        {sidebarProfile ? (
          collapsed ? (
            sidebarProfile.image ? (
              <img src={sidebarProfile.image} alt="profile" className="h-7 w-7 rounded-full object-cover shrink-0" />
            ) : (
              <span className="shrink-0">{sidebarProfile.icon}</span>
            )
          ) : (
            sidebarProfile.content ?? (
              <div className="flex items-center gap-2">
                {sidebarProfile.image ? (
                  <img src={sidebarProfile.image} alt="profile" className="h-7 w-7 rounded-full object-cover shrink-0" />
                ) : (
                  sidebarProfile.icon && <span className="shrink-0">{sidebarProfile.icon}</span>
                )}
              </div>
            )
          )
        ) : (
          !collapsed && sidebarFooter
        )}
      </div>
    )
  }

  // ─── Mobile layout ────────────────────────────────────────────────────────
  if (isMobile && mobileTabs) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lg",
          height,
          className
        )}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-info/10 blur-[120px]" />
        </div>

        {/* Topbar */}
        <header className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-border px-4 gap-2">
          <div className="flex items-center gap-2">
            {mobileVariant === "drawer" && mobileTabs && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            {topbar && <div className="flex items-center gap-2">{topbar}</div>}
          </div>
          <div className="flex items-center gap-2">
            {topbarTrailing}
            {showThemeToggle && <PanelThemeToggle />}
          </div>
        </header>

        {/* Content */}
        <main className="relative z-10 flex-1 overflow-y-auto p-4">
          {error && <div className="mb-4 rounded-md bg-destructive/50 p-3 text-sm text-destructive">{error}</div>}
          {loading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {showEmpty && <div className="flex h-full items-center justify-center text-muted-foreground">{emptyState}</div>}
          {!loading && !showEmpty && children}
        </main>

        {/* Bottom tab bar */}
        {mobileVariant === "bottom-tabs" && (
          <nav className="relative z-10 flex shrink-0 border-t border-border bg-background">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeMobileTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleMobileTabChange(tab.key)}
                  className={cn(
                    "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {isActive && <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary" />}
                </button>
              )
            })}
          </nav>
        )}

        {/* Drawer overlay */}
        {mobileVariant === "drawer" && drawerOpen && (
          <div className="absolute inset-0 z-20 bg-black/40" onClick={() => setDrawerOpen(false)} />
        )}

        {/* Slide-up drawer */}
        {mobileVariant === "drawer" && (
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-2xl border-t border-border bg-background transition-transform duration-300",
              drawerOpen ? "translate-y-0" : "translate-y-full"
            )}
            style={{ maxHeight: "75%" }}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              {sidebarBrand?.title
                ? <span className="text-sm font-semibold">{sidebarBrand.title}</span>
                : <span className="text-sm font-semibold">Menu</span>}
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {/* Render sidebar content (PanelSidebarGroup / PanelSidebarItem) in expanded mode */}
              <PanelCollapsedContext.Provider value={false}>
                <PanelGroupsContext.Provider value={{ expandedGroups, onGroupToggle: handleGroupToggle }}>
                  {sidebar ?? mobileTabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeMobileTab === tab.key
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => handleMobileTabChange(tab.key)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {tab.label}
                      </button>
                    )
                  })}
                </PanelGroupsContext.Provider>
              </PanelCollapsedContext.Provider>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── Tablet layout (icon-only sidebar, collapsible to full) ──────────────
  if (isTablet && sidebar) {
    const tabletCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed
    // On tablet, default to icon-only unless user explicitly expanded
    const tabletSidebarCollapsed = tabletCollapsed

    return (
      <PanelCollapsedContext.Provider value={tabletSidebarCollapsed}>
        <PanelGroupsContext.Provider value={{ expandedGroups, onGroupToggle: handleGroupToggle }}>
          <div
            ref={containerRef}
            className={cn(
              "relative flex overflow-hidden rounded-xl border border-border bg-background shadow-lg",
              height,
              className
            )}
            style={animStyle as React.CSSProperties}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
              <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-info/10 blur-[120px]" />
            </div>

            <aside
              className={cn(
                "relative z-10 flex flex-col shrink-0 border-r border-border transition-all",
                tabletSidebarCollapsed ? "w-14" : sidebarWidth
              )}
              style={{ transitionDuration: `${animationDuration}ms`, transitionTimingFunction: animationEasing }}
            >
              {renderBrand(tabletSidebarCollapsed)}
              <div className="flex-1 overflow-y-auto py-2">{sidebar}</div>
              {renderProfile(tabletSidebarCollapsed)}
            </aside>

            <div className="relative z-10 flex flex-1 min-w-0 flex-col">
              <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 gap-2">
                <div className="flex items-center gap-2">
                  {collapsible && (
                    <Tooltip content={tabletSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} side="bottom">
                      <button
                        type="button"
                        onClick={() => handleCollapsedChange(!tabletSidebarCollapsed)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={tabletSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                      >
                        {tabletSidebarCollapsed
                          ? (expandIcon || <PanelLeftOpen className="h-5 w-5" />)
                          : (collapseIcon || <PanelLeftClose className="h-5 w-5" />)}
                      </button>
                    </Tooltip>
                  )}
                  {topbar && <div className="flex items-center gap-2">{topbar}</div>}
                </div>
                <div className="flex items-center gap-2">
                  {topbarTrailing}
                  {showThemeToggle && <PanelThemeToggle />}
                </div>
              </header>
              <main className="flex-1 overflow-y-auto p-4">
                {error && <div className="mb-4 rounded-md bg-destructive/50 p-3 text-sm text-destructive">{error}</div>}
                {loading && (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                {showEmpty && <div className="flex h-full items-center justify-center text-muted-foreground">{emptyState}</div>}
                {!loading && !showEmpty && children}
              </main>
            </div>
          </div>
        </PanelGroupsContext.Provider>
      </PanelCollapsedContext.Provider>
    )
  }

  // ─── Desktop layout ───────────────────────────────────────────────────────
  return (
    <PanelCollapsedContext.Provider value={effectiveCollapsed}>
      <PanelGroupsContext.Provider value={{ expandedGroups, onGroupToggle: handleGroupToggle }}>
        <div
          ref={containerRef}
          className={cn(
            "relative flex overflow-hidden rounded-xl border border-border bg-background shadow-lg",
            height,
            className
          )}
          style={animStyle as React.CSSProperties}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-info/10 blur-[120px]" />
          </div>

          {sidebar && (
            <aside
              className={cn(
                "relative z-10 flex flex-col shrink-0 border-r border-border transition-all",
                effectiveCollapsed ? "w-14" : sidebarWidth
              )}
              style={{ transitionDuration: `${animationDuration}ms`, transitionTimingFunction: animationEasing }}
            >
              {renderBrand(effectiveCollapsed)}
              <div className="flex-1 overflow-y-auto py-2">{sidebar}</div>
              {renderProfile(effectiveCollapsed)}
            </aside>
          )}

          <div className="relative z-10 flex flex-1 min-w-0 flex-col">
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-b-slate-300/50 px-4 gap-2">
              <div className="flex items-center gap-2">
                {collapsible && sidebar && (
                  <Tooltip
                    content={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    side="bottom"
                  >
                    <button
                      type="button"
                      onClick={() => handleCollapsedChange(!isCollapsed)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                      {effectiveCollapsed
                        ? (expandIcon || <PanelLeftOpen className="h-5 w-5" />)
                        : (collapseIcon || <PanelLeftClose className="h-5 w-5" />)}
                    </button>
                  </Tooltip>
                )}
                {topbar && <div className="flex items-center gap-2">{topbar}</div>}
              </div>
              <div className="flex items-center gap-2">
                {topbarTrailing}
                {showThemeToggle && <PanelThemeToggle />}
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="mb-4 p-3 rounded-md bg-destructive/50 text-destructive text-sm">{error}</div>
              )}
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {showEmpty && <div className="flex items-center justify-center h-full text-muted-foreground">{emptyState}</div>}
              {!loading && !showEmpty && children}
            </main>
          </div>
        </div>
      </PanelGroupsContext.Provider>
    </PanelCollapsedContext.Provider>
  )
}

export function PanelSidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon?: React.ElementType
  label: string
  active?: boolean
  onClick?: () => void
}) {
  const collapsed = React.useContext(PanelCollapsedContext)

  return (
    <Tooltip content={label} side="right" enabled={collapsed}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center rounded-md text-sm font-medium transition-colors",
          collapsed ? "justify-center h-9 w-9 mx-auto px-0" : "gap-2 px-3 py-2",
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-primary/20 hover:text-primary cursor-pointer"
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        {!collapsed && <span className="truncate">{label}</span>}
      </button>
    </Tooltip>
  )
}

export function PanelSidebarGroup({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  const collapsed = React.useContext(PanelCollapsedContext)
  const { expandedGroups, onGroupToggle } = React.useContext(PanelGroupsContext)
  const isExpanded = title ? expandedGroups.has(title) : true

  return (
    <div className="px-2 py-1">
      {title && !collapsed && (
        <button
          type="button"
          onClick={() => onGroupToggle(title, !isExpanded)}
          className="mb-1 flex w-full items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>{title}</span>
          {isExpanded
            ? <ChevronDown className="h-3 w-3" />
            : <ChevronRight className="h-3 w-3" />}
        </button>
      )}
      {title && collapsed && <div className="mx-1 mb-1 h-px bg-border" />}
      {(!title || isExpanded) && <div className="space-y-0.5">{children}</div>}
    </div>
  )
}
