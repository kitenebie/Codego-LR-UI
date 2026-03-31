import * as React from "react"
import { Menu, Moon, Sun, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { useTheme } from "../theme-provider"
import { Button } from "../ui/button"
import { LeftSidebar, RightSidebar } from "../ui/navigation"
import { Tooltip } from "../ui/tooltip"
import { GlobalSearchInput } from "../ui/global-search-input"
import { GlobalSearchModal } from "../ui/global-search-modal"
import { getRegisteredTableRecords } from "../../hooks/use-table-search"
import { useNavigate } from "react-router-dom"

export interface GlobalSearchRecord {
  objectID: string
  name: string
  description?: string
  path: string
  brand?: string
  [key: string]: any
}

function GlobalSearchPanel({
  onInputFocus,
}: {
  onInputFocus?: () => void
}) {
  return (
    <div className="w-64">
      <GlobalSearchInput
        value=""
        onChange={() => {}}
        onFocus={onInputFocus}
        showClearButton={false}
        className="w-full cursor-pointer"
      />
    </div>
  )
}

const SidebarContext = React.createContext<{
  setSidebarOpen: (open: boolean) => void
  collapsed: boolean
}>({ setSidebarOpen: () => {}, collapsed: false })

export function useSidebarCollapsed() {
  return React.useContext(SidebarContext).collapsed
}

export interface LayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  sidebarHeader?: React.ReactNode
  sidebarFooter?: React.ReactNode
  /** Controlled collapsed state */
  sidebarCollapsed?: boolean
  /** Allow the user to toggle collapse via a button in the topbar */
  sidebarCollapsible?: boolean
  /** Called when the user toggles collapse */
  onSidebarCollapsedChange?: (collapsed: boolean) => void
  rightSidebar?: React.ReactNode
  rightSidebarHeader?: React.ReactNode
  rightSidebarFooter?: React.ReactNode
  rightSidebarWidth?: string
  rightSidebarSticky?: boolean
  topbar?: React.ReactNode
  /** Enable global search */
  allowGlobalSearch?: boolean
  /** Search records for local search */
  globalSearchRecords?: GlobalSearchRecord[]
  /** Record attribute used as the display title */
  recordTitleAttribute?: string
  /** Record attribute used as the description */
  globalSearchDescriptionAttribute?: string
  /** Max hits per page. Default 8 */
  globalSearchResultsLimit?: number
  /** Called when a result is selected */
  onGlobalSearchSelect?: (record: GlobalSearchRecord) => void
  /** Global search modal open state */
  globalSearchModalOpen?: boolean
  /** Called when global search modal should close */
  onGlobalSearchModalClose?: () => void
}

export function Layout({
  children,
  sidebar,
  sidebarHeader,
  sidebarFooter,
  sidebarCollapsed: collapsedProp,
  sidebarCollapsible = false,
  onSidebarCollapsedChange,
  rightSidebar,
  rightSidebarHeader,
  rightSidebarFooter,
  rightSidebarWidth = "w-52",
  rightSidebarSticky = true,
  topbar,
  allowGlobalSearch = false,
  globalSearchRecords = [],
  recordTitleAttribute = "name",
  globalSearchDescriptionAttribute = "description",
  globalSearchResultsLimit = 8,
  onGlobalSearchSelect,
  globalSearchModalOpen = false,
  onGlobalSearchModalClose,
}: LayoutProps) {
  const [searchModalOpen, setSearchModalOpen] = React.useState(false)

  const searchBox = allowGlobalSearch ? (
    <GlobalSearchPanel
      onInputFocus={() => setSearchModalOpen(true)}
    />
  ) : null
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [collapsedInternal, setCollapsedInternal] = React.useState(false)

  // Support both controlled and uncontrolled collapsed state
  const collapsed = collapsedProp !== undefined ? collapsedProp : collapsedInternal

  function toggleCollapsed() {
    const next = !collapsed
    setCollapsedInternal(next)
    onSidebarCollapsedChange?.(next)
  }

  return (
    <SidebarContext.Provider value={{ setSidebarOpen, collapsed }}>
      <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground relative">
        {/* Subtle Web3 Background Glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-info/10 blur-[120px]" />
        </div>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {sidebar && (
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 shrink-0 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <LeftSidebar
              header={sidebarHeader}
              footer={sidebarFooter}
              collapsed={collapsed}
              className="h-screen"
            >
              {sidebar}
            </LeftSidebar>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 w-full min-w-0 flex-col overflow-hidden relative z-10">
          {/* Topbar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b glass px-4 sm:px-6">
            <div className="flex items-center gap-2">
              {sidebar && (
                <Button
                  variant="ghost"
                  size="md"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              )}
              {sidebarCollapsible && sidebar && (
                <Button
                  variant="ghost"
                  size="md"
                  className="hidden md:flex"
                  onClick={toggleCollapsed}
                  title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {collapsed
                    ? <PanelLeftOpen className="h-5 w-5" />
                    : <PanelLeftClose className="h-5 w-5" />}
                </Button>
              )}
              {topbar}
              {searchBox}
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </header>

          {/* Main scrollable area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">

            {children}

            {/* Global Search Modal */}
            {allowGlobalSearch && (
              <GlobalSearchModal
                isOpen={searchModalOpen}
                onClose={() => setSearchModalOpen(false)}
                searchRecords={globalSearchRecords}
                recordTitleAttribute={recordTitleAttribute}
                globalSearchDescriptionAttribute={globalSearchDescriptionAttribute}
                globalSearchResultsLimit={globalSearchResultsLimit}
                onGlobalSearchSelect={onGlobalSearchSelect}
              />
            )}
          </main>
        </div>

        {/* Right Sidebar */}
        {rightSidebar && (
          <div className="hidden xl:flex shrink-0 h-screen">
            <RightSidebar
              sticky={false}
              width={rightSidebarWidth}
              header={rightSidebarHeader}
              footer={rightSidebarFooter}
              className="h-screen"
            >
              {rightSidebar}
            </RightSidebar>
          </div>
        )}
      </div>
    </SidebarContext.Provider>
  )
}

export function SidebarGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const { collapsed } = React.useContext(SidebarContext)
  return (
    <div className="py-2">
      {!collapsed && (
        <h4 className="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
          {title}
        </h4>
      )}
      {collapsed && <div className="mx-3 mb-1 h-px bg-border" />}
      <nav className="space-y-1 px-2">{children}</nav>
    </div>
  )
}

export function SidebarItem({
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
  const { setSidebarOpen, collapsed } = React.useContext(SidebarContext)

  return (
    <Tooltip content={label} side="right" enabled={collapsed}>
      <button
        onClick={() => {
          onClick?.()
          setSidebarOpen(false)
        }}
        className={cn(
          "flex w-full items-center rounded-md text-sm font-medium transition-colors",
          collapsed ? "justify-center h-10 w-10 mx-auto px-0" : "px-3 py-2",
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-primary/20 hover:text-primary cursor-pointer"
        )}
      >
        {Icon && <Icon className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3")} />}
        {!collapsed && <span className="truncate">{label}</span>}
      </button>
    </Tooltip>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="md"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
