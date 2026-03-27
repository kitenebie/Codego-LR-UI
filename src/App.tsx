import { Routes, Route, NavLink, useLocation, Navigate } from "react-router-dom"
import { Layout, SidebarGroup, useSidebarCollapsed } from "./components/layout/layout"
import { ThemeProvider } from "./components/theme-provider"
import { TocProvider, TableOfContents, useToc } from "./components/ui/toc"
import { Tooltip } from "./components/ui/tooltip"
import {
  Component,
  LayoutDashboard,
  Type,
  ToggleLeft,
  CheckSquare,
  FormInput,
  MousePointerClick,
  Table as TableIcon,
  Box,
  UploadCloud,
  ListPlus,
  Ghost,
  Settings,
  Tag,
  BarChart2,
  Navigation2,
  Layers,
  SlidersHorizontal,
  Palette,
  Map,
  CalendarDays,
  AlignLeft,
  GitBranch,
  TrendingUp,
  FolderTree,
  Grid3x3,
  Kanban,
  PanelLeftClose,
  PanelRightClose,
  MousePointer2,
  Footprints,
  Terminal,
  Circle,
  Globe2Icon,
  RouteIcon,
  Database,
} from "lucide-react"
import { cn } from "./lib/utils"

import { Dashboard } from "./pages/dashboard"
import { ButtonDocs } from "./pages/button-docs"
import { InputDocs } from "./pages/input-docs"
import { SelectDocs } from "./pages/select-docs"
import { ToggleDocs } from "./pages/toggle-docs"
import { CheckboxDocs } from "./pages/checkbox-docs"
import { TextareaDocs } from "./pages/textarea-docs"
import { WidgetDocs } from "./pages/widget-docs"
import { TableDocs } from "./pages/table-docs"
import { CardDocs } from "./pages/card-docs"
import { ModalDocs } from "./pages/modal-docs"
import { FileUploadDocs } from "./pages/file-upload-docs"
import { RepeaterDocs } from "./pages/repeater-docs"
import { DropdownDocs } from "./pages/dropdown-docs"
import { PlaceholderDocs } from "./pages/placeholder-docs"
import { SettingsDocs } from "./pages/settings-docs"
import { AvatarStackDocs } from "./pages/avatar-stack-docs"
import { TabDocs } from "./pages/tab-docs"
import { SectionDocs } from "./pages/section-docs"
import { GridLayoutDocs } from "./pages/grid-layout-docs"
import { FlexLayoutDocs } from "./pages/flex-layout-docs"
import { NavigationDocs } from "./pages/navigation-docs"
import { ModalVariantsDocs } from "./pages/modal-variants-docs"
import { NotificationDocs } from "./pages/notification-docs"
import { BadgeDocs } from "./pages/badge-docs"
import { ProgressDocs } from "./pages/progress-docs"
import { BreadcrumbDocs } from "./pages/breadcrumb-docs"
import { PaginationDocs } from "./pages/pagination-docs"
import { AccordionDocs } from "./pages/accordion-docs"
import { ScrollAreaDocs } from "./pages/scroll-area-docs"
import { RadioGroupDocs } from "./pages/radio-group-docs"
import { SliderDocs } from "./pages/slider-docs"
import { TagInputDocs } from "./pages/tag-input-docs"
import { OtpInputDocs } from "./pages/otp-input-docs"
import { ComboboxDocs } from "./pages/combobox-docs"
import { ColorPickerDocs } from "./pages/color-picker-docs"
import { DateRangePickerDocs } from "./pages/date-range-picker-docs"
import { RichTextEditorDocs } from "./pages/rich-text-editor-docs"
import { TimelineDocs } from "./pages/timeline-docs"
import { StatCardDocs } from "./pages/stat-card-docs"
import { TreeViewDocs } from "./pages/tree-view-docs"
import { CalendarDocs } from "./pages/calendar-docs"
import { DataGridDocs } from "./pages/data-grid-docs"
import { KanbanDocs } from "./pages/kanban-docs"
import { DrawerDocs } from "./pages/drawer-docs"
import { PopoverDocs } from "./pages/popover-docs"
import { ContextMenuDocs } from "./pages/context-menu-docs"
import { StepperDocs } from "./pages/stepper-docs"
import { CommandPaletteDocs } from "./pages/command-palette-docs"
import { ResizablePanelsDocs } from "./pages/resizable-panels-docs"
import { PanelDocs } from "./pages/panel-docs"
import { BulletinBoardDocs } from "./pages/bulletin-board-docs"
import { WizardDocs } from "./pages/wizard-docs"
import { LeafletMapDocs } from "./pages/leaflet-map-docs"
import { MapLibreMapDocs } from "./pages/maplibre-map-docs"
import { UIBuilder } from "./pages/ui-builder"
import { PackagesDocs } from "./pages/packages-docs"
import { AuthenticationDocs } from "./pages/authentication-docs"
import { APIDocs } from "./pages/API-doc"
import { StorageStoreDocs } from "./pages/storage-docs"

const ROUTE_LABELS: Record<string, string> = {
  "/bulletin-board":        "Bulletin Board",
  "/tab":                   "Tab",
  "/section":               "Section",
  "/grid-layout":           "Grid Layout",
  "/flex-layout":           "Flexbox Layout",
  "/navigation":            "Navigation",
  "/modal-variants":        "Modal Variants",
  "/notification":          "Notification & Toast",
  "/badge":                 "Badge",
  "/progress":              "Progress",
  "/breadcrumb":            "Breadcrumb",
  "/pagination":            "Pagination",
  "/accordion":             "Accordion",
  "/scroll-area":           "Scroll Area",
  "/radio-group":           "Radio Group",
  "/slider":                "Slider",
  "/tag-input":             "Tag Input",
  "/otp-input":             "OTP Input",
  "/combobox":              "Combobox",
  "/color-picker":          "Color Picker",
  "/date-range-picker":     "Date Range Picker",
  "/rich-text-editor":      "Rich Text Editor",
  "/timeline":              "Timeline",
  "/stat-card":             "Stat Card",
  "/tree-view":             "Tree View",
  "/Map":          "Flat Map",
  "/Globe":         "Globe Map",
  "/calendar":              "Calendar",
  "/data-grid":             "Data Grid",
  "/kanban":                "Kanban Board",
  "/drawer":                "Drawer / Sheet",
  "/popover":               "Popover",
  "/context-menu":          "Context Menu",
  "/stepper":               "Stepper",
  "/command-palette":       "Command Palette",
  "/resizable-panels":      "Resizable Panels",
  "/panel":                  "Panel",
  "/wizard":                 "Wizard",
  "/ui-builder":            "UI Builder",
  "/packages":              "Packages",
  "/authentication":        "Authentication",
  "/":                      "Dashboard",
  "/buttons":               "Buttons",
  "/inputs":                "Inputs",
  "/textarea":              "Textarea",
  "/checkbox":              "Checkbox",
  "/toggle":                "Toggle Switch",
  "/select":                "Select",
  "/fileupload":            "File Upload",
  "/repeater":              "Repeater",
  "/table":                 "Table",
  "/widget":                "Widget",
  "/card":                  "Card",
  "/avatarstack":           "Avatar Stack",
  "/modal":                 "Modal",
  "/dropdown":              "Dropdown",
  "/placeholder":           "Placeholder",
  "/settings":              "Settings",
  "/api":              "api",
  "/storage":              "storage",
}

function SidebarNavItem({
  to,
  icon: Icon,
  label,
}: {
  to: string
  icon?: React.ElementType
  label: string
}) {
  const collapsed = useSidebarCollapsed()
  return (
    <Tooltip content={label} side="right" enabled={collapsed}>
      <NavLink
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          cn(
            "flex w-full items-center rounded-md text-sm font-medium transition-colors",
            collapsed ? "justify-center h-10 w-10 mx-auto px-0" : "px-3 py-2",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/20 hover:text-primary cursor-pointer"
          )
        }
      >
        {Icon && <Icon className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3")} />}
        {!collapsed && <span className="truncate">{label}</span>}
      </NavLink>
    </Tooltip>
  )
}

function AppShell() {
  const { pathname } = useLocation()
  const { items: tocItems } = useToc()

  const collapsed = useSidebarCollapsed()

  const sidebarHeader = (
    <div className="flex items-center overflow-hidden">
      <Box className="h-6 w-6 text-primary shrink-0" />
      {!collapsed && <span className="ml-2 text-lg font-bold tracking-tight text-gradient truncate">Codego LR UI</span>}
    </div>
  )

  const sidebarContent = (
    <>
      <SidebarGroup title="Overview">
        <SidebarNavItem to="/" icon={LayoutDashboard} label="Dashboard" />
      </SidebarGroup>
      <SidebarGroup title="Layout">
        <SidebarNavItem to="/tab" icon={Component} label="Tab" />
        <SidebarNavItem to="/section" icon={Component} label="Section" />
        <SidebarNavItem to="/grid-layout" icon={LayoutDashboard} label="Grid Layout" />
        <SidebarNavItem to="/flex-layout" icon={LayoutDashboard} label="Flexbox Layout" />
        <SidebarNavItem to="/navigation" icon={Component} label="Navigation" />
        <SidebarNavItem to="/accordion" icon={Layers} label="Accordion" />
        <SidebarNavItem to="/scroll-area" icon={AlignLeft} label="Scroll Area" />
        <SidebarNavItem to="/resizable-panels" icon={PanelLeftClose} label="Resizable Panels" />
        <SidebarNavItem to="/panel" icon={PanelLeftClose} label="Panel" />
        <SidebarNavItem to="/wizard" icon={Layers} label="Wizard" />
      </SidebarGroup>
      <SidebarGroup title="Forms">
        <SidebarNavItem to="/authentication" icon={Component} label="Authentication" />
        <SidebarNavItem to="/buttons" icon={MousePointerClick} label="Buttons" />
        <SidebarNavItem to="/inputs" icon={FormInput} label="Inputs" />
        <SidebarNavItem to="/textarea" icon={Type} label="Textarea" />
        <SidebarNavItem to="/checkbox" icon={CheckSquare} label="Checkbox" />
        <SidebarNavItem to="/toggle" icon={ToggleLeft} label="Toggle Switch" />
        <SidebarNavItem to="/select" icon={ListPlus} label="Select" />
        <SidebarNavItem to="/radio-group" icon={Circle} label="Radio Group" />
        <SidebarNavItem to="/slider" icon={SlidersHorizontal} label="Slider" />
        <SidebarNavItem to="/tag-input" icon={Tag} label="Tag Input" />
        <SidebarNavItem to="/otp-input" icon={Grid3x3} label="OTP Input" />
        <SidebarNavItem to="/combobox" icon={ListPlus} label="Combobox" />
        <SidebarNavItem to="/color-picker" icon={Palette} label="Color Picker" />
        <SidebarNavItem to="/date-range-picker" icon={CalendarDays} label="Date Range Picker" />
        <SidebarNavItem to="/rich-text-editor" icon={AlignLeft} label="Rich Text Editor" />
        <SidebarNavItem to="/fileupload" icon={UploadCloud} label="File Upload" />
        <SidebarNavItem to="/repeater" icon={ListPlus} label="Repeater" />
      </SidebarGroup>
      <SidebarGroup title="Data Display">
        <SidebarNavItem to="/table" icon={TableIcon} label="Table" />
        <SidebarNavItem to="/data-grid" icon={Grid3x3} label="Data Grid" />
        <SidebarNavItem to="/widget" icon={LayoutDashboard} label="Widget" />
        <SidebarNavItem to="/card" icon={Box} label="Card" />
        <SidebarNavItem to="/badge" icon={Tag} label="Badge" />
        <SidebarNavItem to="/progress" icon={BarChart2} label="Progress" />
        <SidebarNavItem to="/stat-card" icon={TrendingUp} label="Stat Card" />
        <SidebarNavItem to="/timeline" icon={GitBranch} label="Timeline" />
        <SidebarNavItem to="/tree-view" icon={FolderTree} label="Tree View" />
        <SidebarNavItem to="/Map" icon={Map} label="Flat Map" />
        <SidebarNavItem to="/Globe" icon={Globe2Icon} label="Globe Map" />
        <SidebarNavItem to="/calendar" icon={CalendarDays} label="Calendar" />
        <SidebarNavItem to="/bulletin-board" icon={Box} label="Bulletin Board" />
        <SidebarNavItem to="/kanban" icon={Kanban} label="Kanban Board" />
        <SidebarNavItem to="/avatarstack" icon={Component} label="Avatar Stack" />
      </SidebarGroup>
      <SidebarGroup title="Navigation">
        <SidebarNavItem to="/breadcrumb" icon={Navigation2} label="Breadcrumb" />
        <SidebarNavItem to="/pagination" icon={Navigation2} label="Pagination" />
        <SidebarNavItem to="/stepper" icon={Footprints} label="Stepper" />
      </SidebarGroup>
      <SidebarGroup title="Overlays & Misc">
        <SidebarNavItem to="/modal" icon={Component} label="Modal" />
        <SidebarNavItem to="/modal-variants" icon={Component} label="Modal Variants" />
        <SidebarNavItem to="/notification" icon={Component} label="Notification & Toast" />
        <SidebarNavItem to="/drawer" icon={PanelRightClose} label="Drawer / Sheet" />
        <SidebarNavItem to="/popover" icon={MousePointer2} label="Popover" />
        <SidebarNavItem to="/context-menu" icon={MousePointer2} label="Context Menu" />
        <SidebarNavItem to="/command-palette" icon={Terminal} label="Command Palette" />
        <SidebarNavItem to="/dropdown" icon={Component} label="Dropdown" />
        <SidebarNavItem to="/placeholder" icon={Ghost} label="Placeholder" />
      </SidebarGroup>
      <SidebarGroup title="Tools">
        <SidebarNavItem to="/ui-builder" icon={Palette} label="UI Builder" />
        <SidebarNavItem to="/packages" icon={Box} label="Packages" />
      </SidebarGroup>
      <SidebarGroup title="Configuration">
        <SidebarNavItem to="/settings" icon={Settings} label="Settings" />
        <SidebarNavItem to="/api" icon={RouteIcon} label="api" />
        <SidebarNavItem to="/storage" icon={Database} label="storage" />
      </SidebarGroup>
    </>
  )

  const label = ROUTE_LABELS[pathname] ?? "Documentation"

  return (
    <Layout
      sidebar={sidebarContent}
      sidebarHeader={sidebarHeader}
      sidebarCollapsible
      topbar={<h1 className="text-xl font-semibold">{label}</h1>}
      rightSidebar={tocItems.length ? <TableOfContents items={tocItems} /> : undefined}
    >
      <div className="mx-auto max-w-full space-y-8 pb-12">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tab" element={<TabDocs />} />
          <Route path="/section" element={<SectionDocs />} />
          <Route path="/grid-layout" element={<GridLayoutDocs />} />
          <Route path="/flex-layout" element={<FlexLayoutDocs />} />
          <Route path="/navigation" element={<NavigationDocs />} />
          <Route path="/modal-variants" element={<ModalVariantsDocs />} />
          <Route path="/notification" element={<NotificationDocs />} />
          <Route path="/badge" element={<BadgeDocs />} />
          <Route path="/progress" element={<ProgressDocs />} />
          <Route path="/breadcrumb" element={<BreadcrumbDocs />} />
          <Route path="/pagination" element={<PaginationDocs />} />
          <Route path="/accordion" element={<AccordionDocs />} />
          <Route path="/scroll-area" element={<ScrollAreaDocs />} />
          <Route path="/radio-group" element={<RadioGroupDocs />} />
          <Route path="/slider" element={<SliderDocs />} />
          <Route path="/tag-input" element={<TagInputDocs />} />
          <Route path="/otp-input" element={<OtpInputDocs />} />
          <Route path="/combobox" element={<ComboboxDocs />} />
          <Route path="/color-picker" element={<ColorPickerDocs />} />
          <Route path="/date-range-picker" element={<DateRangePickerDocs />} />
          <Route path="/rich-text-editor" element={<RichTextEditorDocs />} />
          <Route path="/timeline" element={<TimelineDocs />} />
          <Route path="/stat-card" element={<StatCardDocs />} />
          <Route path="/tree-view" element={<TreeViewDocs />} />
          <Route path="/Map" element={<LeafletMapDocs />} />
          <Route path="/Globe" element={<MapLibreMapDocs />} />
          <Route path="/calendar" element={<CalendarDocs />} />
          <Route path="/data-grid" element={<DataGridDocs />} />
          <Route path="/bulletin-board" element={<BulletinBoardDocs />} />  
          <Route path="/kanban" element={<KanbanDocs />} />
          <Route path="/drawer" element={<DrawerDocs />} />
          <Route path="/popover" element={<PopoverDocs />} />
          <Route path="/context-menu" element={<ContextMenuDocs />} />
          <Route path="/stepper" element={<StepperDocs />} />
          <Route path="/command-palette" element={<CommandPaletteDocs />} />
          <Route path="/resizable-panels" element={<ResizablePanelsDocs />} />
          <Route path="/panel" element={<PanelDocs />} />
          <Route path="/wizard" element={<WizardDocs />} />
          <Route path="/authentication" element={<AuthenticationDocs />} />
          <Route path="/buttons" element={<ButtonDocs />} />
          <Route path="/inputs" element={<InputDocs />} />
          <Route path="/select" element={<SelectDocs />} />
          <Route path="/toggle" element={<ToggleDocs />} />
          <Route path="/checkbox" element={<CheckboxDocs />} />
          <Route path="/textarea" element={<TextareaDocs />} />
          <Route path="/widget" element={<WidgetDocs />} />
          <Route path="/table" element={<TableDocs />} />
          <Route path="/card" element={<CardDocs />} />
          <Route path="/modal" element={<ModalDocs />} />
          <Route path="/fileupload" element={<FileUploadDocs />} />
          <Route path="/repeater" element={<RepeaterDocs />} />
          <Route path="/dropdown" element={<DropdownDocs />} />
          <Route path="/placeholder" element={<PlaceholderDocs />} />
          <Route path="/settings" element={<SettingsDocs />} />
          <Route path="/api" element={<APIDocs />} />
          <Route path="/storage" element={<StorageStoreDocs />} />
          <Route path="/avatarstack" element={<AvatarStackDocs />} />
          <Route path="/ui-builder" element={<UIBuilder />} />
          <Route path="/packages" element={<PackagesDocs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Layout>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <TocProvider>
        <AppShell />
      </TocProvider>
    </ThemeProvider>
  )
}
