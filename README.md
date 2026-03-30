# @juv/codego-react-ui

A collection of reusable React UI components built with Tailwind CSS, Motion, and Lucide icons.

**Author:** Codego https://avatars.githubusercontent.com/u/101083976?v=4&size=64
**License:** MIT  

---

## Prerequisites

Before installing this package, make sure the following are set up in your project:

### 1. React 18+

```bash
npm install react react-dom
```

### 2. Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

Add the plugin to your `vite.config.ts`:

```ts
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [tailwindcss()],
})
```

Then import Tailwind in your main CSS file:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
@import "tailwindcss";
@source "../node_modules/@juv/codego-react-ui/dist/index.js";

@theme {
  --font-sans: "Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-hover: var(--secondary-hover);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-info: var(--info);
  --color-info-hover: var(--info-hover);
  --color-info-foreground: var(--info-foreground);
  --color-warning: var(--warning);
  --color-warning-hover: var(--warning-hover);
  --color-warning-foreground: var(--warning-foreground);
  --color-danger: var(--danger);
  --color-danger-hover: var(--danger-hover);
  --color-danger-foreground: var(--danger-foreground);
  --color-success: var(--success);
  --color-success-hover: var(--success-hover);
  --color-success-foreground: var(--success-foreground);
  --radius: var(--radius);
}

@layer base {
  :root {
    --background: #ffffff;
    --foreground: #09090b;
    --card: #ffffff;
    --card-foreground: #09090b;
    --popover: #ffffff;
    --popover-foreground: #09090b;
    --primary: #6366f1; /* Indigo 500 */
    --primary-hover: #4f46e5;
    --primary-foreground: #ffffff;
    --secondary: #f4f4f5;
    --secondary-hover: #e4e4e7;
    --secondary-foreground: #18181b;
    --info: #3b82f6; /* Blue 500 */
    --info-hover: #2563eb;
    --info-foreground: #ffffff;
    --warning: #f59e0b; /* Amber 500 */
    --warning-hover: #d97706;
    --warning-foreground: #ffffff;
  --danger: #ef4444; /* Red 500 */
  --danger-hover: #dc2626;
  --danger-foreground: #ffffff;
  --success: #22c55e; /* Green 500 */
  --success-hover: #16a34a;
  --success-foreground: #ffffff;
  --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --accent: #f4f4f5;
    --accent-foreground: #18181b;
    --destructive: #ef4444;
    --destructive-foreground: #ffffff;
    --border: #e4e4e7;
    --input: #e4e4e7;
    --ring: var(--primary);
    --radius: 0.75rem;
  }

  .dark {
    --background: #030303; /* Deep black */
    --foreground: #ededed;
    --card: #0a0a0a; /* Slightly lighter black */
    --card-foreground: #ededed;
    --popover: #0a0a0a;
    --popover-foreground: #ededed;
    --primary: #8b5cf6; /* Neon Violet */
    --primary-hover: #7c3aed;
    --primary-foreground: #ffffff;
    --secondary: #171717;
    --secondary-hover: #262626;
    --secondary-foreground: #ededed;
    --info: #3b82f6;
    --info-hover: #2563eb;
    --info-foreground: #ffffff;
    --warning: #f59e0b;
    --warning-hover: #d97706;
    --warning-foreground: #ffffff;
  --danger: #ef4444;
  --danger-hover: #dc2626;
  --danger-foreground: #ffffff;
  --success: #22c55e;
  --success-hover: #16a34a;
  --success-foreground: #ffffff;
  --muted: #171717;
    --muted-foreground: #a1a1aa;
    --accent: #1f1f2e; /* Subtle purple tint */
    --accent-foreground: #c4b5fd;
    --destructive: #7f1d1d;
    --destructive-foreground: #ededed;
    --border: #1f1f1f;
    --input: #1f1f1f;
    --ring: var(--primary);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  .glass {
    @apply bg-background/60 backdrop-blur-xl border border-white/10;
  }
  .dark .glass {
    @apply bg-black/40 border-white/5;
  }
  .text-gradient {
    background: linear-gradient(to right, var(--primary), var(--info));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .glow {
    box-shadow: 0 0 20px -5px var(--primary);
  }
}
/* Hide calendar icon (Chrome, Edge, Safari) */
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

/* Optional: remove clear (X) button */
input[type="datetime-local"]::-webkit-clear-button {
  display: none;
}

/* Optional: remove spin buttons */
input[type="datetime-local"]::-webkit-inner-spin-button {
  display: none;
}
```

## in LARAVEL "resources\css\app.css"
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
@import "tailwindcss";

@source "../../resources/js";
@source "../../node_modules/@juv/codego-react-ui/dist";

@theme {
  --font-sans: "Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-hover: var(--secondary-hover);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-info: var(--info);
  --color-info-hover: var(--info-hover);
  --color-info-foreground: var(--info-foreground);
  --color-warning: var(--warning);
  --color-warning-hover: var(--warning-hover);
  --color-warning-foreground: var(--warning-foreground);
  --color-danger: var(--danger);
  --color-danger-hover: var(--danger-hover);
  --color-danger-foreground: var(--danger-foreground);
  --color-success: var(--success);
  --color-success-hover: var(--success-hover);
  --color-success-foreground: var(--success-foreground);
  --radius: var(--radius);
}

@layer base {
  :root {
    --background: #ffffff;
    --foreground: #09090b;
    --card: #ffffff;
    --card-foreground: #09090b;
    --popover: #ffffff;
    --popover-foreground: #09090b;
    --primary: #6366f1; /* Indigo 500 */
    --primary-hover: #4f46e5;
    --primary-foreground: #ffffff;
    --secondary: #f4f4f5;
    --secondary-hover: #e4e4e7;
    --secondary-foreground: #18181b;
    --info: #3b82f6; /* Blue 500 */
    --info-hover: #2563eb;
    --info-foreground: #ffffff;
    --warning: #f59e0b; /* Amber 500 */
    --warning-hover: #d97706;
    --warning-foreground: #ffffff;
  --danger: #ef4444; /* Red 500 */
  --danger-hover: #dc2626;
  --danger-foreground: #ffffff;
  --success: #22c55e; /* Green 500 */
  --success-hover: #16a34a;
  --success-foreground: #ffffff;
  --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --accent: #f4f4f5;
    --accent-foreground: #18181b;
    --destructive: #ef4444;
    --destructive-foreground: #ffffff;
    --border: #e4e4e7;
    --input: #e4e4e7;
    --ring: var(--primary);
    --radius: 0.75rem;
  }

  .dark {
    --background: #030303; /* Deep black */
    --foreground: #ededed;
    --card: #0a0a0a; /* Slightly lighter black */
    --card-foreground: #ededed;
    --popover: #0a0a0a;
    --popover-foreground: #ededed;
    --primary: #8b5cf6; /* Neon Violet */
    --primary-hover: #7c3aed;
    --primary-foreground: #ffffff;
    --secondary: #171717;
    --secondary-hover: #262626;
    --secondary-foreground: #ededed;
    --info: #3b82f6;
    --info-hover: #2563eb;
    --info-foreground: #ffffff;
    --warning: #f59e0b;
    --warning-hover: #d97706;
    --warning-foreground: #ffffff;
  --danger: #ef4444;
  --danger-hover: #dc2626;
  --danger-foreground: #ffffff;
  --success: #22c55e;
  --success-hover: #16a34a;
  --success-foreground: #ffffff;
  --muted: #171717;
    --muted-foreground: #a1a1aa;
    --accent: #1f1f2e; /* Subtle purple tint */
    --accent-foreground: #c4b5fd;
    --destructive: #7f1d1d;
    --destructive-foreground: #ededed;
    --border: #1f1f1f;
    --input: #1f1f1f;
    --ring: var(--primary);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  .glass {
    @apply bg-background/60 backdrop-blur-xl border border-white/10;
  }
  .dark .glass {
    @apply bg-black/40 border-white/5;
  }
  .text-gradient {
    background: linear-gradient(to right, var(--primary), var(--info));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .glow {
    box-shadow: 0 0 20px -5px var(--primary);
  }
}
/* Hide calendar icon (Chrome, Edge, Safari) */
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

/* Optional: remove clear (X) button */
input[type="datetime-local"]::-webkit-clear-button {
  display: none;
}

/* Optional: remove spin buttons */
input[type="datetime-local"]::-webkit-inner-spin-button {
  display: none;
}

```
### 3. Lucide React (icons)

```bash
npm install lucide-react
```

### 4. Motion (animations)

```bash
npm install motion
```

### 5. date-fns (date utilities — required by Calendar, Date Picker, Date Range Picker)

```bash
npm install date-fns
```

### 6. tailwind-merge + clsx (utility — used internally)

```bash
npm install tailwind-merge clsx
```

---
### 7. Leaflet

```bash
npm install leaflet react-leaflet @types/leaflet
```

### 8. MapLibre GL

```bash
npm install maplibre-gl
```

---
## Installation

Once all prerequisites are installed:

```bash
npm install @juv/codego-react-ui
```

---

## Usage

```tsx
import { Button, Card, Modal } from "@juv/codego-react-ui"
```

---

## Form Validation Props

All form input components support two shared validation props:

| Prop | Type | Description |
|---|---|---|
| `required` | `boolean` | Marks the field as required. Shows a `*` indicator next to the label. Also sets `aria-required` on the underlying input. |
| `error` | `string` | External error message rendered below the field in destructive color. Also sets `aria-invalid` on the underlying input. |

Applies to: `Input`, `Select`, `Textarea`, `Checkbox`, `ToggleSwitch`, `RadioGroup`, `Combobox`, `TagInput`, `OtpInput`, `ColorPicker`, `Slider`, `RangeSlider`, `FileUpload`.

```tsx
// Required field with * indicator
<Input label="Email" required placeholder="you@example.com" />

// External error message (e.g. from server validation)
<Input label="Email" required error="Email is already taken" />

// Works on all form components
<Select label="Role" required error="Please select a role" options={options} />
<Checkbox inline label="Accept terms" required error="You must accept the terms" />
<ToggleSwitch inline label="Enable 2FA" required />
<Textarea label="Bio" required error="Bio is required" />
<RadioGroup options={plans} required error="Please select a plan" />
<Combobox options={frameworks} required error="Please select a framework" />
<TagInput required error="At least one tag is required" />
<OtpInput length={6} required error="Please enter the code" />
<ColorPicker required error="Please select a color" />
<Slider label="Volume" required error="Please set a value" />
<FileUpload label="Avatar" required error="Please upload a file" />
```

---

## Components

| Component | Export(s) |
|---|---|
| Accordion | `Accordion` |
| Avatar Stack | `AvatarStack` |
| Badge | `Badge` |
| Breadcrumb | `Breadcrumb` |
| Bulletin Board | `BulletinBoard`, `BulletinPreview`, `useServerBulletin` |
| Button | `Button` |
| Calendar | `Calendar` |
| Card | `Card` |
| Checkbox | `Checkbox` |
| Color Picker | `ColorPicker` |
| Combobox | `Combobox` |
| Command Palette | `CommandPalette` |
| Context Menu | `ContextMenu` |
| Dashboard Widget | `StatsWidget`, `ChartWidget`, `TableWidget`, `ComposableWidget`, `MetricRow` |
| Data Grid | `DataGrid` |
| Date Picker | `DatePickerPopup` |
| Date Range Picker | `DateRangePicker`, `CalendarDateRangePicker` |
| Drawer | `Drawer` |
| Dropdown | `Dropdown` |
| File Upload | `FileUpload` |
| Flex Layout | `FlexLayout` |
| Grid Layout | `GridLayout` |
| Input | `Input` |
| Kanban Board | `KanbanBoard` |
| Label | `Label` |
| Leaflet Map | `LeafletMap` |
| MapLibre Map | `MapLibreMap` |
| Modal | `Modal` |
| Modal Variants | `ModalUnchange`, `ModalConfirmation`, `ModalWithForms` |
| Navigation | `Navigation`, `Topbar`, `LeftSidebar`, `RightSidebar`, `GroupNavigation` |
| Notification | `NotificationPanel`, `NotificationBanner`, `useToast`, `ToastProvider` |
| OTP Input | `OtpInput` |
| Pagination | `Pagination` |
| Panel | `Panel` |
| Popover | `Popover` |
| Progress | `Progress`, `CircularProgress` |
| Radio Group | `RadioGroup` |
| Repeater | `Repeater` |
| Resizable Panels | `ResizablePanels` |
| Rich Text Editor | `RichTextEditor` |
| Scroll Area | `ScrollArea` |
| Section Block | `SectionBlock` |
| Select | `Select` |
| Skeleton | `Skeleton` |
| Slider | `Slider`, `RangeSlider` |
| Stat Card | `StatCard` |
| Stepper | `Stepper` |
| Table | `Table` |
| Tabs | `Tabs` |
| Tag Input | `TagInput` |
| Textarea | `Textarea` |
| Timeline | `Timeline` |
| Toggle Switch | `ToggleSwitch` |
| Tooltip | `Tooltip` |
| Tree View | `TreeView` |
| Widget | `Widget` |
| Wizard | `Wizard` |

---

## BulletinBoard Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `BulletinItem[]` | — | ✓ Array of bulletin post items. |
| `layout` | `"grid" \| "list" \| "masonry"` | `"grid"` | Board layout mode. |
| `columns` | `1 \| 2 \| 3 \| 4` | `3` | Number of grid columns (responsive). |
| `variant` | `"card" \| "minimal" \| "bordered"` | `"card"` | Visual style of each post card. |
| `searchable` | `boolean` | `false` | Show a search input above the board. |
| `filterable` | `boolean` | `false` | Show category filter chips above the board. |
| `categories` | `string[]` | | Explicit category list. Auto-derived from items if omitted. |
| `title` | `ReactNode` | `"Bulletin Board"` | Board header title. |
| `headerAction` | `ReactNode` | | Trailing element in the board header (e.g. a New Post button). |
| `showHeader` | `boolean` | `true` | Show or hide the board header bar. |
| `emptyMessage` | `ReactNode` | `"No posts found."` | Content shown when the filtered list is empty. |
| `loading` | `boolean` | `false` | Show skeleton cards instead of real content. |
| `loadingCount` | `number` | `6` | Number of skeleton cards to render while loading. |
| `preview` | `boolean` | `false` | Open a `BulletinPreview` modal when a card is clicked. |
| `onEdit` | `(item: BulletinItem) => void` | | Called when the Edit button is clicked inside the preview. |
| `onDelete` | `(item: BulletinItem) => void` | | Called after a successful delete (or when no `deleteBaseUrl` is set). |
| `deleteBaseUrl` | `string` | | Base URL for built-in `DELETE {baseUrl}/{id}/delete` request. |
| `deleteIdKey` | `string` | `"id"` | Item key used as the id segment in the delete URL. |
| `serverPagination` | `BulletinServerPaginationProp \| null` | | Pass the `serverPagination` from `useServerBulletin` to enable server-driven pagination. |
| `onItemClick` | `(item: BulletinItem) => void` | | Fired when a card is clicked (ignored when `preview=true`). |
| `className` | `string` | | Additional CSS classes on the outer wrapper. |

### BulletinPreview Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `item` | `BulletinItem` | ✓ | The bulletin item to display. |
| `onClose` | `() => void` | ✓ | Called when the modal is dismissed. |
| `onEdit` | `(item: BulletinItem) => void` | | Show an Edit button; called when clicked. |
| `onDelete` | `(item: BulletinItem) => void` | | Show a Delete button; called when clicked. |

### useServerBulletin Options

| Option | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | ✓ | API endpoint. `?page=N` appended automatically. |
| `params` | `Record<string, string \| number>` | | Extra query params merged on every request. |
| `encrypt` | `boolean` | | Expect a Laravel-encrypted response payload. |
| `key` | `string` | | Laravel `APP_KEY` for decryption. |
| `decryptPayloadLog` | `boolean` | | Log the decrypted payload to the console. |
| `transform` | `(row: any) => BulletinItem` | | Map a raw API row to a `BulletinItem`. |

### useServerBulletin Return

| Field | Type | Description |
|---|---|---|
| `items` | `BulletinItem[]` | Fetched (and optionally transformed) items. |
| `loading` | `boolean` | `true` while the request is in-flight. |
| `error` | `string \| null` | Error message if the request failed. |
| `pagination` | `ServerPagination \| null` | Raw pagination metadata. |
| `serverPagination` | `BulletinServerPaginationProp \| null` | Pass directly as `<BulletinBoard serverPagination={...} />`. |
| `goToPage` | `(page: number) => void` | Navigate to a specific page. |
| `reload` | `() => void` | Re-fetch the current page (e.g. after a delete). |

### useServerBulletin Example

```tsx
import { BulletinBoard, useServerBulletin } from "@juv/codego-react-ui"

function AnnouncementsPage() {
  const { items, loading, serverPagination, reload } = useServerBulletin({
    url: "/api/bulletins",
    params: { per_page: 9 },
    transform: (row) => ({
      id: row.id,
      title: row.subject,
      body: row.content,
      author: row.posted_by,
      date: row.created_at,
      category: row.department,
      priority: row.level,
      pinned: row.is_pinned,
      tags: row.tags ?? [],
    }),
  })

  return (
    <BulletinBoard
      items={items}
      loading={loading}
      serverPagination={serverPagination}
      columns={3}
      searchable
      filterable
      preview
      onEdit={(item) => openEditModal(item)}
      deleteBaseUrl="/api/bulletins"
      onDelete={() => reload()}
    />
  )
}
```

> **Note:** `useServerBulletin` uses the internal `codego` api client which automatically attaches the Bearer token from `localStorage.getItem("token")`. For encrypted Laravel responses, pass `encrypt: true` and set `VITE_LARAVEL_KEY` in your `.env`:
>
> ```
> VITE_LARAVEL_KEY=base64:your_app_key_here
> ```
>
> Or pass the key directly: `key: "base64:..."`. The response can be a plain array `[...]` or a paginated object `{ data: [...], total, per_page, ... }` — both are handled automatically.

---

## LeafletMap Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `center` | `[number, number]` | `[51.505, -0.09]` | Map center `[lat, lng]`. |
| `zoom` | `number` | `13` | Initial zoom level. |
| `height` | `string \| number` | `480` | Map height in px or CSS string. |
| `markers` | `MapMarker[]` | `[]` | Array of markers to render. |
| `routes` | `MapRoute[]` | `[]` | Array of routes to draw via OSRM. |
| `cluster` | `boolean` | `false` | Enable marker clustering. |
| `clusterVariant` | `"default" \| "bubble" \| "donut"` | `"default"` | Cluster icon style. |
| `tileUrl` | `string` | OSM tiles | Custom tile URL template. |
| `tileAttribution` | `string` | OSM attribution | Custom tile attribution. |
| `darkTile` | `boolean` | `false` | Use CartoDB dark tile preset. |
| `className` | `string` | | Additional CSS classes on the wrapper. |
| `onMarkerClick` | `(marker: MapMarker) => void` | | Fired when a marker is clicked. |

### MapMarker

| Prop | Type | Required | Description |
|---|---|---|---|
| `id` | `string \| number` | ✓ | Unique marker identifier. |
| `lat` | `number` | ✓ | Latitude. |
| `lng` | `number` | ✓ | Longitude. |
| `label` | `string` | | Text shown in default popup. |
| `color` | `MarkerColor` | | Pin color: `primary` \| `info` \| `success` \| `warning` \| `danger` \| any hex. |
| `icon` | `string` | | Emoji or character rendered inside the pin. |
| `image` | `string` | | Image URL — renders a circular avatar pin. |
| `popup` | `React.ReactNode` | | Custom popup content. Overrides `label`. |

### MapRoute

| Prop | Type | Required | Description |
|---|---|---|---|
| `start` | `{ lat: number; lng: number }` | ✓ | Route start point. |
| `end` | `{ lat: number; lng: number }` | ✓ | Route end point. |
| `waypoints` | `{ lat: number; lng: number }[]` | | Intermediate waypoints. |
| `routeType` | `"drive" \| "walk"` | | Routing profile. Default `"drive"`. |
| `color` | `string` | | Line color hex. |
| `weight` | `number` | | Line weight in px. Default `5`. |
| `label` | `string` | | Label shown in start/end popups. |

---

## MapLibreMap Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | `MapLibreStyle` | `"street"` | Map style: `globe` \| `3d` \| `3d-globe` \| `street` \| `satellite` \| `dark` \| `light`. |
| `center` | `[number, number]` | `[0, 20]` | Initial center `[lng, lat]` (MapLibre order). |
| `zoom` | `number` | `2` | Initial zoom level. |
| `minZoom` | `number` | `0` | Minimum zoom level. |
| `maxZoom` | `number` | `22` | Maximum zoom level. |
| `pitch` | `number` | `0` | Camera pitch in degrees (0–85). Reactive. Auto `55` for `3d`/`3d-globe`. |
| `minPitch` | `number` | `0` | Minimum pitch constraint. |
| `maxPitch` | `number` | `85` | Maximum pitch constraint. |
| `bearing` | `number` | `0` | Camera bearing in degrees (-180–180). Reactive. Auto `-20` for `3d`/`3d-globe`. |
| `minBearing` | `number` | `-180` | Minimum bearing constraint. |
| `maxBearing` | `number` | `180` | Maximum bearing constraint. |
| `flyTo` | `FlyToOptions` | | Triggers animated camera flight when reference changes. |
| `markers` | `MapLibreMarker[]` | `[]` | Array of markers to render. |
| `routes` | `MapLibreRoute[]` | `[]` | Array of routes to draw via OSRM. |
| `cluster` | `boolean` | `false` | Enable marker clustering. |
| `clusterVariant` | `"default" \| "bubble" \| "donut"` | `"default"` | Cluster icon style. |
| `height` | `string \| number` | `480` | Map height in px or CSS string. |
| `showControls` | `boolean` | `true` | Show navigation, scale, and fullscreen controls. |
| `showStyleSwitcher` | `boolean` | `true` | Show the bottom style switcher bar. |
| `showCameraControls` | `boolean` | `false` | Always show pitch/bearing slider panel. |
| `className` | `string` | | Additional CSS classes on the wrapper. |
| `onMarkerClick` | `(marker: MapLibreMarker) => void` | | Fired when a marker is clicked. |

### MapLibreRoute

| Prop | Type | Required | Description |
|---|---|---|---|
| `start` | `{ lat: number; lng: number }` | ✓ | Route start coordinate. |
| `end` | `{ lat: number; lng: number }` | ✓ | Route end coordinate. |
| `waypoints` | `{ lat: number; lng: number }[]` | | Optional intermediate stops. |
| `routeType` | `"drive" \| "walk"` | | OSRM routing profile. Default `"drive"`. |
| `color` | `string` | | Line color hex. Defaults to `#6366f1` (drive) or `#22c55e` (walk). |
| `weight` | `number` | | Line weight in px. Default `5`. |
| `label` | `string` | | Label shown in start/end popups. |

### MapLibreMarker

| Prop | Type | Required | Description |
|---|---|---|---|
| `id` | `string \| number` | ✓ | Unique marker identifier. |
| `lat` | `number` | ✓ | Latitude. |
| `lng` | `number` | ✓ | Longitude. |
| `label` | `string` | | Text shown in default popup. |
| `color` | `string` | | Pin color: `primary` \| `info` \| `success` \| `warning` \| `danger` \| any hex. |
| `icon` | `string` | | Emoji or character rendered inside the pin. |
| `image` | `string` | | Image URL — renders a circular avatar pin. |
| `popup` | `string \| HTMLElement` | | Custom popup — HTML string or DOM element. Overrides `label`. |

### FlyToOptions

| Prop | Type | Default | Description |
|---|---|---|---|
| `center` | `[number, number]` | | Target center `[lng, lat]`. |
| `zoom` | `number` | | Target zoom level. |
| `pitch` | `number` | | Target pitch in degrees. Clamped to `minPitch`/`maxPitch`. |
| `bearing` | `number` | | Target bearing in degrees. Clamped to `minBearing`/`maxBearing`. |
| `duration` | `number` | `1500` | Animation duration in milliseconds. |
| `curve` | `number` | `1.42` | Zoom curve during flight. Higher = more zoom-out arc. |
| `essential` | `boolean` | `true` | If `true`, bypasses `prefers-reduced-motion`. |

---

## Laravel Response Decryption

Use `decryptResponse` to decrypt Laravel-encrypted API responses (AES-256-CBC).

### Setup

Add your Laravel `APP_KEY` to `.env`:

```env
VITE_LARAVEL_KEY=base64:your_laravel_app_key_here
```

### Usage

```tsx
import { api, decryptResponse } from "@juv/codego-react-ui"

type Certificate = { id: number; name: string }

const fetchCertificates = async () => {
  const data = await api.get<string>('/certificate')
  const decoded = decryptResponse<Certificate[]>(data)
  console.log(decoded)
}
```

> `api.get` should be typed as `string` since the raw response is an encrypted payload. `decryptResponse` reads `VITE_LARAVEL_KEY` automatically.

You can also pass the key explicitly:

```tsx
const decoded = decryptResponse<Certificate[]>(data, "base64:your_key_here")
```

### API

| Export | Description |
|---|---|
| `decryptResponse(response, key?)` | Decrypts a Laravel-encrypted string or `{ data: string }` object. |
| `decryptLaravelPayload(payload, key?)` | Low-level decryption of a raw encrypted payload string. |
| `getLaravelSecretKey()` | Reads the key from `VITE_LARAVEL_KEY`, `REACT_APP_LARAVEL_KEY`, or `window.__LARAVEL_KEY__`. |
| `parseLaravelKey(secretKey)` | Parses a `base64:...` or raw key string into a `CryptoJS.WordArray`. |
| `parseLaravelEncryptedPayload(payload)` | Parses a base64-encoded Laravel encrypted payload into `{ iv, value, mac }`. |
| `LaravelEncryptedPayload` | Type for the parsed payload object. |

---

## Run Locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev        # dev server at http://localhost:3000
```

---

## Build

```bash
npm run build      # outputs ESM + CJS + types to /dist
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build library with tsup |
| `npm run lint` | Type-check with TypeScript |
| `npm run preview` | Preview production build |
| `npm run clean` | Remove dist folder |
