import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { LeafletMap, type MapMarker, type MapRoute } from "../components/ui/leaflet-map"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "basic",    label: "Basic Markers" },
  { id: "colors",   label: "Colored Markers" },
  { id: "popup",    label: "Custom Popups" },
  { id: "drive",    label: "Route — Drive" },
  { id: "walk",     label: "Route — Walk" },
  { id: "multiroute", label: "Multi-Route" },
  { id: "cluster1", label: "Cluster — Default" },
  { id: "cluster2", label: "Cluster — Bubble" },
  { id: "cluster3", label: "Cluster — Donut" },
  { id: "dark",     label: "Dark Tile" },
  { id: "props",    label: "Props" },
  { id: "routetype", label: "MapRoute Type" },
  { id: "markertype", label: "MapMarker Type" },
]

// ── Shared data ───────────────────────────────────────────────────────────────

const LONDON_CENTER: [number, number] = [51.505, -0.09]

const BASIC_MARKERS: MapMarker[] = [
  { id: 1, lat: 51.5007, lng: -0.1246, label: "Big Ben" },
  { id: 2, lat: 51.5081, lng: -0.0759, label: "Tower of London" },
  { id: 3, lat: 51.5194, lng: -0.1270, label: "British Museum" },
]

const COLOR_MARKERS: MapMarker[] = [
  { id: 1, lat: 51.5007, lng: -0.1246, label: "Primary",  color: "primary",  icon: "★" },
  { id: 2, lat: 51.5081, lng: -0.0759, label: "Info",     color: "info",     icon: "ℹ" },
  { id: 3, lat: 51.5194, lng: -0.1270, label: "Success",  color: "success",  icon: "✓" },
  { id: 4, lat: 51.5145, lng: -0.0999, label: "Warning",  color: "warning",  icon: "!" },
  { id: 5, lat: 51.4994, lng: -0.1273, label: "Danger",   color: "danger",   icon: "✕" },
]

const POPUP_MARKERS: MapMarker[] = [
  {
    id: 1, lat: 51.5007, lng: -0.1246, label: "HQ Office", color: "primary", icon: "🏢",
    popup: (
      <div className="p-1 space-y-1 min-w-[160px]">
        <p className="font-semibold text-sm">HQ Office</p>
        <p className="text-xs text-muted-foreground">Westminster, London</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-green-600 font-medium">Open now</span>
        </div>
      </div>
    ),
  },
  {
    id: 2, lat: 51.5081, lng: -0.0759, label: "Branch", color: "info", icon: "🏪",
    popup: (
      <div className="p-1 space-y-1 min-w-[160px]">
        <p className="font-semibold text-sm">East Branch</p>
        <p className="text-xs text-muted-foreground">Tower Hill, London</p>
        <button className="mt-1 w-full text-xs bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600">
          Get Directions
        </button>
      </div>
    ),
  },
  {
    id: 3, lat: 51.5194, lng: -0.1270, label: "Warehouse", color: "warning", icon: "📦",
    popup: (
      <div className="p-1 space-y-1 min-w-[160px]">
        <p className="font-semibold text-sm">Warehouse</p>
        <p className="text-xs text-muted-foreground">Capacity: 85%</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "85%" }} />
        </div>
      </div>
    ),
  },
]

// Drive route: Big Ben → St Paul's Cathedral (real London roads)
const DRIVE_ROUTE: MapRoute[] = [
  {
    start:     { lat: 51.5007, lng: -0.1246 },  // Big Ben
    end:       { lat: 51.5138, lng: -0.0984 },  // St Paul's Cathedral
    waypoints: [{ lat: 51.5074, lng: -0.1278 }], // Trafalgar Square area
    routeType: "drive",
    color: "#6366f1",
    weight: 5,
    label: "Big Ben → St Paul's",
  },
]

// Walk route: London Eye → Tate Modern (short walkable distance)
const WALK_ROUTE: MapRoute[] = [
  {
    start:     { lat: 51.5033, lng: -0.1195 },  // London Eye
    end:       { lat: 51.5076, lng: -0.0994 },  // Tate Modern
    routeType: "walk",
    color: "#22c55e",
    weight: 4,
    label: "London Eye → Tate Modern",
  },
]

// Multi-route: drive + walk on same map
const MULTI_ROUTES: MapRoute[] = [
  {
    start:     { lat: 51.5007, lng: -0.1246 },  // Big Ben
    end:       { lat: 51.5138, lng: -0.0984 },  // St Paul's
    routeType: "drive",
    color: "#6366f1",
    weight: 5,
    label: "Drive: Big Ben → St Paul's",
  },
  {
    start:     { lat: 51.5033, lng: -0.1195 },  // London Eye
    end:       { lat: 51.5076, lng: -0.0994 },  // Tate Modern
    routeType: "walk",
    color: "#22c55e",
    weight: 4,
    label: "Walk: London Eye → Tate Modern",
  },
]

// 30 clustered markers around London
const CLUSTER_MARKERS: MapMarker[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  lat: 51.505 + (Math.sin(i * 1.3) * 0.06),
  lng: -0.09  + (Math.cos(i * 1.1) * 0.09),
  label: `Location ${i + 1}`,
  color: ["primary", "info", "success", "warning", "danger"][i % 5] as MapMarker["color"],
}))

// ── Docs ──────────────────────────────────────────────────────────────────────

export function LeafletMapDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground title="Basic Markers" description="Drop markers with a label. Click a marker to open its popup." fullBleed
          code={`<LeafletMap center={[51.505, -0.09]} zoom={13} markers={markers} />`}>
          <LeafletMap center={LONDON_CENTER} zoom={13} markers={BASIC_MARKERS}
            className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="colors">
        <Playground title="Colored Markers" description="Use color presets (primary, info, success, warning, danger) or any hex/CSS color. Add an emoji or character as the pin icon." fullBleed
          code={`<LeafletMap markers={[
  { id: 1, lat: 51.505, lng: -0.09, color: "primary", icon: "★" },
  { id: 2, lat: 51.515, lng: -0.07, color: "success", icon: "✓" },
]} />`}>
          <LeafletMap center={LONDON_CENTER} zoom={13} markers={COLOR_MARKERS}
            className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="popup">
        <Playground title="Custom Popups" description="Pass any ReactNode as popup — cards, buttons, progress bars, anything." fullBleed
          code={`<LeafletMap markers={[{
  id: 1, lat: 51.505, lng: -0.09,
  popup: <div><p className="font-semibold">HQ Office</p><p>Open now</p></div>
}]} />`}>
          <LeafletMap center={LONDON_CENTER} zoom={13} markers={POPUP_MARKERS}
            className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="drive">
        <Playground
          title="Route — Drive"
          description="Real road route fetched from OSRM. Shows distance + drive time badge on the route. A/B endpoint markers with info popup."
          fullBleed
          code={`<LeafletMap routes={[{
  start: { lat: 51.5007, lng: -0.1246 },
  end:   { lat: 51.5138, lng: -0.0984 },
  routeType: "drive",
  color: "#6366f1",
  label: "Big Ben → St Paul's",
}]} />`}
        >
          <LeafletMap
            center={LONDON_CENTER} zoom={13}
            routes={DRIVE_ROUTE}
            className="rounded-none border-0 h-[480px]"
          />
        </Playground>
      </Section>

      <Section id="walk">
        <Playground
          title="Route — Walk"
          description="Walking route uses OSRM foot profile — follows pedestrian paths, bridges, and footways instead of roads."
          fullBleed
          code={`<LeafletMap routes={[{
  start: { lat: 51.5033, lng: -0.1195 },
  end:   { lat: 51.5076, lng: -0.0994 },
  routeType: "walk",
  color: "#22c55e",
  label: "London Eye → Tate Modern",
}]} />`}
        >
          <LeafletMap
            center={[51.505, -0.11]} zoom={14}
            routes={WALK_ROUTE}
            className="rounded-none border-0 h-[480px]"
          />
        </Playground>
      </Section>

      <Section id="multiroute">
        <Playground
          title="Multi-Route"
          description="Render multiple routes simultaneously — mix drive and walk on the same map. Each route has its own color and info badge."
          fullBleed
          code={`<LeafletMap routes={[
  { start: bigBen, end: stPauls, routeType: "drive", color: "#6366f1" },
  { start: londonEye, end: tateModern, routeType: "walk", color: "#22c55e" },
]} />`}
        >
          <LeafletMap
            center={LONDON_CENTER} zoom={13}
            routes={MULTI_ROUTES}
            className="rounded-none border-0 h-[480px]"
          />
        </Playground>
      </Section>

      <Section id="cluster1">
        <Playground title="Cluster — Default" description="Pill badge clusters. Click a cluster to zoom in, or open its popup to list all locations." fullBleed
          code={`<LeafletMap markers={markers} cluster clusterVariant="default" />`}>
          <LeafletMap center={LONDON_CENTER} zoom={12} markers={CLUSTER_MARKERS}
            cluster clusterVariant="default"
            className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="cluster2">
        <Playground title="Cluster — Bubble" description="Circular bubble clusters that grow in size with count." fullBleed
          code={`<LeafletMap markers={markers} cluster clusterVariant="bubble" />`}>
          <LeafletMap center={LONDON_CENTER} zoom={12} markers={CLUSTER_MARKERS}
            cluster clusterVariant="bubble"
            className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="cluster3">
        <Playground title="Cluster — Donut" description="SVG donut ring with an arc proportional to cluster density." fullBleed
          code={`<LeafletMap markers={markers} cluster clusterVariant="donut" />`}>
          <LeafletMap center={LONDON_CENTER} zoom={12} markers={CLUSTER_MARKERS}
            cluster clusterVariant="donut"
            className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="dark">
        <Playground title="Dark Tile" description="Switch to the CartoDB dark basemap with the darkTile prop." fullBleed
          code={`<LeafletMap darkTile markers={markers} />`}>
          <LeafletMap center={LONDON_CENTER} zoom={13} markers={COLOR_MARKERS}
            darkTile className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "center",          type: "[number, number]",           default: "[51.505, -0.09]", description: "Initial map center [lat, lng]." },
          { prop: "zoom",            type: "number",                     default: "13",              description: "Initial zoom level." },
          { prop: "height",          type: "string | number",            default: "480",             description: "Map height in px or CSS string." },
          { prop: "markers",         type: "MapMarker[]",                default: "[]",              description: "Array of map markers." },
          { prop: "routes",          type: "MapRoute[]",                 default: "[]",              description: "Array of routes. Each fetches a real road path from OSRM." },
          { prop: "cluster",         type: "boolean",                    default: "false",           description: "Enable marker clustering." },
          { prop: "clusterVariant",  type: "ClusterVariant",             default: "\"default\"",     description: "Cluster icon style: default | bubble | donut." },
          { prop: "darkTile",        type: "boolean",                    default: "false",           description: "Use CartoDB dark tile layer." },
          { prop: "tileUrl",         type: "string",                                                 description: "Custom tile URL template." },
          { prop: "tileAttribution", type: "string",                                                 description: "Custom tile attribution HTML." },
          { prop: "onMarkerClick",   type: "(marker: MapMarker) => void",                            description: "Fired when a marker is clicked." },
          { prop: "className",       type: "string",                                                 description: "Additional CSS classes on the wrapper." },
        ]} />
      </Section>

      <Section id="routetype">
        <PropsTable rows={[
          { prop: "start",      type: "{ lat: number; lng: number }",   required: true,  description: "Route start coordinate." },
          { prop: "end",        type: "{ lat: number; lng: number }",   required: true,  description: "Route end coordinate." },
          { prop: "waypoints",  type: "{ lat: number; lng: number }[]",                  description: "Optional intermediate stops along the route." },
          { prop: "routeType",  type: "\"drive\" | \"walk\"",           default: "\"drive\"", description: "OSRM routing profile. drive = road network, walk = pedestrian paths." },
          { prop: "color",      type: "string",                                          description: "Line color. Defaults to #6366f1 for drive, #22c55e for walk." },
          { prop: "weight",     type: "number",                         default: "5",    description: "Line stroke width in pixels." },
          { prop: "label",      type: "string",                                          description: "Label shown in the A/B endpoint popups." },
        ]} />
      </Section>

      <Section id="markertype">
        <PropsTable rows={[
          { prop: "id",    type: "string | number", required: true, description: "Unique marker identifier." },
          { prop: "lat",   type: "number",          required: true, description: "Latitude." },
          { prop: "lng",   type: "number",          required: true, description: "Longitude." },
          { prop: "label", type: "string",                          description: "Text shown in default popup." },
          { prop: "color", type: "MarkerColor",                     description: "Pin color: primary | info | success | warning | danger | any CSS color." },
          { prop: "icon",  type: "string",                          description: "Emoji or character rendered inside the pin." },
          { prop: "popup", type: "ReactNode",                       description: "Custom popup content. Overrides label popup." },
        ]} />
      </Section>
    </DocsLayout>
  )
}
