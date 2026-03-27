import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { MapLibreMap, type MapLibreMarker, type FlyToOptions, type MapLibreRoute } from "../components/ui/maplibre-map"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "globe",     label: "Globe" },
  { id: "3d",        label: "3D Buildings" },
  { id: "3d-globe",  label: "3D Globe" },
  { id: "satellite", label: "Satellite" },
  { id: "dark",      label: "Dark" },
  { id: "light",     label: "Light" },
  { id: "markers",   label: "Markers & Popups" },
  { id: "drive",     label: "Route — Drive" },
  { id: "walk",      label: "Route — Walk" },
  { id: "multiroute",label: "Multi-Route" },
  { id: "cluster1",  label: "Cluster — Default" },
  { id: "cluster2",  label: "Cluster — Bubble" },
  { id: "cluster3",  label: "Cluster — Donut" },
  { id: "flyto",     label: "FlyTo" },
  { id: "minmax",    label: "Min / Max Constraints" },
  { id: "switcher",  label: "Style Switcher" },
  { id: "props",     label: "Props" },
  { id: "flytype",   label: "FlyToOptions Type" },
  { id: "markertype",label: "MapLibreMarker Type" },
  { id: "routetype", label: "MapLibreRoute Type" },
]

const WORLD_MARKERS: MapLibreMarker[] = [
  { id: 1, lat: 48.8566,  lng:   2.3522, label: "Paris",    color: "primary", icon: "🗼" },
  { id: 2, lat: 35.6762,  lng: 139.6503, label: "Tokyo",    color: "danger",  icon: "🗾" },
  { id: 3, lat: 40.7128,  lng: -74.0060, label: "New York", color: "info",    icon: "🗽" },
  { id: 4, lat: -33.8688, lng: 151.2093, label: "Sydney",   color: "success", icon: "🦘" },
  { id: 5, lat: -22.9068, lng: -43.1729, label: "Rio",      color: "warning", icon: "🌴" },
]

const NYC_MARKERS: MapLibreMarker[] = [
  {
    id: 1, lat: 40.7484, lng: -73.9857, label: "Empire State", color: "primary", icon: "🏢",
    popup: `<div style="padding:4px 2px;min-width:140px">
      <p style="font-weight:700;font-size:13px;margin:0 0 2px">Empire State Building</p>
      <p style="font-size:11px;color:#888;margin:0">443 m · 102 floors</p>
    </div>`,
  },
  {
    id: 2, lat: 40.7580, lng: -73.9855, label: "Times Square", color: "danger", icon: "✨",
    popup: `<div style="padding:4px 2px;min-width:140px">
      <p style="font-weight:700;font-size:13px;margin:0 0 2px">Times Square</p>
      <p style="font-size:11px;color:#888;margin:0">Midtown Manhattan</p>
    </div>`,
  },
  {
    id: 3, lat: 40.7527, lng: -73.9772, label: "Chrysler", color: "warning", icon: "🏛️",
    popup: `<div style="padding:4px 2px;min-width:140px">
      <p style="font-weight:700;font-size:13px;margin:0 0 2px">Chrysler Building</p>
      <p style="font-size:11px;color:#888;margin:0">319 m · Art Deco</p>
    </div>`,
  },
]

// Routes
const DRIVE_ROUTE: MapLibreRoute[] = [
  {
    start:     { lat: 51.5007, lng: -0.1246 },
    end:       { lat: 51.5138, lng: -0.0984 },
    waypoints: [{ lat: 51.5074, lng: -0.1278 }],
    routeType: "drive",
    color: "#6366f1",
    weight: 5,
    label: "Big Ben → St Paul's",
  },
]

const WALK_ROUTE: MapLibreRoute[] = [
  {
    start:     { lat: 51.5033, lng: -0.1195 },
    end:       { lat: 51.5076, lng: -0.0994 },
    routeType: "walk",
    color: "#22c55e",
    weight: 4,
    label: "London Eye → Tate Modern",
  },
]

const MULTI_ROUTES: MapLibreRoute[] = [
  { start: { lat: 51.5007, lng: -0.1246 }, end: { lat: 51.5138, lng: -0.0984 }, routeType: "drive", color: "#6366f1", weight: 5, label: "Drive: Big Ben → St Paul's" },
  { start: { lat: 51.5033, lng: -0.1195 }, end: { lat: 51.5076, lng: -0.0994 }, routeType: "walk",  color: "#22c55e", weight: 4, label: "Walk: London Eye → Tate Modern" },
]

// Cluster markers
const CLUSTER_MARKERS: MapLibreMarker[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  lat: 51.505 + (Math.sin(i * 1.3) * 0.06),
  lng: -0.09  + (Math.cos(i * 1.1) * 0.09),
  label: `Location ${i + 1}`,
  color: (["primary", "info", "success", "warning", "danger"] as const)[i % 5],
}))


const FLY_DESTINATIONS = [
  { label: "🗼 Paris",    flyTo: { center: [2.3522,   48.8566]  as [number,number], zoom: 13, pitch: 45,  bearing: 20,  duration: 2000 } },
  { label: "🗽 New York", flyTo: { center: [-74.006,  40.7128]  as [number,number], zoom: 13, pitch: 60,  bearing: -30, duration: 2000 } },
  { label: "🗾 Tokyo",    flyTo: { center: [139.6503, 35.6762]  as [number,number], zoom: 12, pitch: 30,  bearing: 0,   duration: 2000 } },
  { label: "🦘 Sydney",   flyTo: { center: [151.2093, -33.8688] as [number,number], zoom: 12, pitch: 50,  bearing: 45,  duration: 2000 } },
  { label: "🌍 World",    flyTo: { center: [0,        20]       as [number,number], zoom: 2,  pitch: 0,   bearing: 0,   duration: 2500 } },
]

export function MapLibreMapDocs() {
  const [flyTo, setFlyTo] = useState<FlyToOptions | undefined>(undefined)

  return (
    <DocsLayout toc={TOC}>

      <Section id="globe">
        <Playground title="Globe" description="Spherical globe projection. Drag to rotate, scroll to zoom." fullBleed
          code={`<MapLibreMap style="globe" center={[0, 20]} zoom={1.8} />`}>
          <MapLibreMap style="globe" center={[0, 20]} zoom={1.8}
            markers={WORLD_MARKERS} showStyleSwitcher={false}
            className="rounded-none border-0 h-[520px]" />
        </Playground>
      </Section>

      <Section id="3d">
        <Playground title="3D Buildings"
          description="Extruded buildings from OpenFreeMap Liberty (OpenMapTiles). Pitched camera at 55° with bearing offset."
          fullBleed code={`<MapLibreMap style="3d" center={[-73.985, 40.752]} zoom={15} pitch={55} bearing={-20} />`}>
          <MapLibreMap style="3d" center={[-73.985, 40.752]} zoom={15} pitch={55} bearing={-20}
            markers={NYC_MARKERS} showStyleSwitcher={false}
            className="rounded-none border-0 h-[520px]" />
        </Playground>
      </Section>

      <Section id="3d-globe">
        <Playground title="3D Globe"
          description="Globe projection combined with OpenFreeMap Liberty tiles, extruded 3D buildings, and terrain. Drag to spin the globe."
          fullBleed code={`<MapLibreMap style="3d-globe" />`}>
          <MapLibreMap style="3d-globe" center={[0, 20]} zoom={1.8}
            markers={WORLD_MARKERS} showStyleSwitcher={false}
            className="rounded-none border-0 h-[520px]" />
        </Playground>
      </Section>

      <Section id="satellite">
        <Playground title="Satellite" description="Esri World Imagery raster tiles — no API key required." fullBleed
          code={`<MapLibreMap style="satellite" center={[-73.985, 40.752]} zoom={14} />`}>
          <MapLibreMap style="satellite" center={[-73.985, 40.752]} zoom={14}
            markers={NYC_MARKERS} showStyleSwitcher={false}
            className="rounded-none border-0 h-[520px]" />
        </Playground>
      </Section>

      <Section id="dark">
        <Playground title="Dark" description="CartoDB Dark Matter basemap." fullBleed
          code={`<MapLibreMap style="dark" center={[2.3522, 48.8566]} zoom={12} />`}>
          <MapLibreMap style="dark" center={[2.3522, 48.8566]} zoom={12}
            markers={[
              { id: 1, lat: 48.8584, lng: 2.2945, label: "Eiffel Tower", color: "warning", icon: "🗼" },
              { id: 2, lat: 48.8606, lng: 2.3376, label: "Louvre",       color: "info",    icon: "🏛️" },
              { id: 3, lat: 48.8530, lng: 2.3499, label: "Notre-Dame",   color: "danger",  icon: "⛪" },
            ]}
            showStyleSwitcher={false} className="rounded-none border-0 h-[520px]" />
        </Playground>
      </Section>

      <Section id="light">
        <Playground title="Light" description="CartoDB Positron — clean minimal basemap." fullBleed
          code={`<MapLibreMap style="light" center={[139.6503, 35.6762]} zoom={12} />`}>
          <MapLibreMap style="light" center={[139.6503, 35.6762]} zoom={12}
            markers={[
              { id: 1, lat: 35.6586, lng: 139.7454, label: "Tokyo Tower",   color: "danger",  icon: "📡" },
              { id: 2, lat: 35.6762, lng: 139.6503, label: "Shinjuku",      color: "primary", icon: "🏙️" },
              { id: 3, lat: 35.7101, lng: 139.8107, label: "Tokyo Skytree", color: "info",    icon: "🗼" },
            ]}
            showStyleSwitcher={false} className="rounded-none border-0 h-[520px]" />
        </Playground>
      </Section>

      <Section id="markers">
        <Playground title="Markers & Popups"
          description="Custom SVG pin markers with color presets, emoji icons, and HTML popup content."
          fullBleed code={`<MapLibreMap markers={[{ id:1, lat:40.748, lng:-73.985, color:"primary", icon:"🏢", popup:"<b>Empire State</b>" }]} />`}>
          <MapLibreMap style="street" center={[-73.985, 40.752]} zoom={14}
            markers={NYC_MARKERS} showStyleSwitcher={false}
            className="rounded-none border-0 h-[520px]" />
        </Playground>
      </Section>

      <Section id="drive">
        <Playground title="Route — Drive"
          description="Real road route fetched from OSRM. Shows distance + drive time badge on the route. A/B endpoint markers with info popup."
          fullBleed
          code={`<MapLibreMap routes={[{
  start: { lat: 51.5007, lng: -0.1246 },
  end:   { lat: 51.5138, lng: -0.0984 },
  routeType: "drive", color: "#6366f1",
  label: "Big Ben → St Paul's",
}]} />`}>
          <MapLibreMap style="street" center={[51.505, -0.09]} zoom={13}
            routes={DRIVE_ROUTE} showStyleSwitcher={false}
            className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="walk">
        <Playground title="Route — Walk"
          description="Walking route uses OSRM foot profile — follows pedestrian paths, bridges, and footways instead of roads."
          fullBleed
          code={`<MapLibreMap routes={[{
  start: { lat: 51.5033, lng: -0.1195 },
  end:   { lat: 51.5076, lng: -0.0994 },
  routeType: "walk", color: "#22c55e",
  label: "London Eye → Tate Modern",
}]} />`}>
          <MapLibreMap style="street" center={[51.505, -0.11]} zoom={14}
            routes={WALK_ROUTE} showStyleSwitcher={false}
            className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="multiroute">
        <Playground title="Multi-Route"
          description="Render multiple routes simultaneously — mix drive and walk on the same map."
          fullBleed
          code={`<MapLibreMap routes={[
  { start: bigBen, end: stPauls, routeType: "drive", color: "#6366f1" },
  { start: londonEye, end: tateModern, routeType: "walk", color: "#22c55e" },
]} />`}>
          <MapLibreMap style="street" center={[51.505, -0.09]} zoom={13}
            routes={MULTI_ROUTES} showStyleSwitcher={false}
            className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="cluster1">
        <Playground title="Cluster — Default" description="Pill badge clusters. Click a cluster to zoom in." fullBleed
          code={`<MapLibreMap markers={markers} cluster clusterVariant="default" />`}>
          <MapLibreMap style="street" center={[51.505, -0.09]} zoom={12}
            markers={CLUSTER_MARKERS} cluster clusterVariant="default"
            showStyleSwitcher={false} className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="cluster2">
        <Playground title="Cluster — Bubble" description="Circular bubble clusters that grow in size with count." fullBleed
          code={`<MapLibreMap markers={markers} cluster clusterVariant="bubble" />`}>
          <MapLibreMap style="street" center={[51.505, -0.09]} zoom={12}
            markers={CLUSTER_MARKERS} cluster clusterVariant="bubble"
            showStyleSwitcher={false} className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="cluster3">
        <Playground title="Cluster — Donut" description="SVG donut ring with an arc proportional to cluster density." fullBleed
          code={`<MapLibreMap markers={markers} cluster clusterVariant="donut" />`}>
          <MapLibreMap style="street" center={[51.505, -0.09]} zoom={12}
            markers={CLUSTER_MARKERS} cluster clusterVariant="donut"
            showStyleSwitcher={false} className="rounded-none border-0 h-[480px]" />
        </Playground>
      </Section>

      <Section id="flyto">
        <Playground title="FlyTo"
          description="Pass a flyTo prop to animate the camera to any location with custom zoom, pitch, bearing, and duration. Click a city to fly there."
          fullBleed
          code={`const [flyTo, setFlyTo] = useState()\n<MapLibreMap flyTo={flyTo} />\n<button onClick={() => setFlyTo({ center: [2.35, 48.85], zoom: 13, pitch: 45, duration: 2000 })}>Paris</button>`}>
          <div className="w-full">
            <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2 border-b border-border">
              {FLY_DESTINATIONS.map(d => (
                <button key={d.label} type="button"
                  onClick={() => setFlyTo({ ...d.flyTo })}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl border border-border hover:bg-accent hover:border-primary/40 transition-colors">
                  {d.label}
                </button>
              ))}
            </div>
            <MapLibreMap
              style="street"
              center={[0, 20]} zoom={2}
              flyTo={flyTo}
              markers={WORLD_MARKERS}
              showStyleSwitcher={false}
              showCameraControls
              className="rounded-none border-0 h-[520px]"
            />
          </div>
        </Playground>
      </Section>

      <Section id="minmax">
        <Playground title="Min / Max Constraints"
          description="Restrict zoom (5–16), pitch (0–45), and bearing (-90–90). The camera sliders and map interactions are clamped to these ranges."
          fullBleed
          code={`<MapLibreMap minZoom={5} maxZoom={16} minPitch={0} maxPitch={45} minBearing={-90} maxBearing={90} showCameraControls />`}>
          <MapLibreMap
            style="street"
            center={[-73.985, 40.752]} zoom={12}
            minZoom={5} maxZoom={16}
            minPitch={0} maxPitch={45}
            minBearing={-90} maxBearing={90}
            markers={NYC_MARKERS}
            showStyleSwitcher={false}
            showCameraControls
            className="rounded-none border-0 h-[520px]"
          />
        </Playground>
      </Section>

      <Section id="switcher">
        <Playground title="Style Switcher + Camera Controls"
          description="All 6 styles with Lucide icons. Camera panel shows pitch/bearing sliders with live range labels. Drag the map to see sliders update."
          fullBleed code={`<MapLibreMap showStyleSwitcher showCameraControls />`}>
          <MapLibreMap style="street" center={[0, 20]} zoom={2}
            markers={WORLD_MARKERS} showStyleSwitcher showCameraControls
            className="rounded-none border-0 h-[560px]" />
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "style",              type: "MapLibreStyle",             default: "\"street\"", description: "Map style: globe | 3d | 3d-globe | street | satellite | dark | light." },
          { prop: "center",             type: "[number, number]",          default: "[0, 20]",    description: "Initial center [lng, lat] (MapLibre order)." },
          { prop: "zoom",               type: "number",                    default: "2",          description: "Initial zoom level." },
          { prop: "minZoom",            type: "number",                    default: "0",          description: "Minimum zoom level the user can zoom out to." },
          { prop: "maxZoom",            type: "number",                    default: "22",         description: "Maximum zoom level the user can zoom in to." },
          { prop: "pitch",              type: "number",                    default: "0",          description: "Camera pitch in degrees. Reactive — animates map on change. Auto 55 for 3d." },
          { prop: "minPitch",           type: "number",                    default: "0",          description: "Minimum pitch. Clamps slider and map interactions." },
          { prop: "maxPitch",           type: "number",                    default: "85",         description: "Maximum pitch. Clamps slider and map interactions." },
          { prop: "bearing",            type: "number",                    default: "0",          description: "Camera bearing in degrees. Reactive — animates map on change. Auto -20 for 3d." },
          { prop: "minBearing",         type: "number",                    default: "-180",       description: "Minimum bearing. Clamps slider and map interactions." },
          { prop: "maxBearing",         type: "number",                    default: "180",        description: "Maximum bearing. Clamps slider and map interactions." },
          { prop: "flyTo",              type: "FlyToOptions",                                     description: "Triggers a flyTo animation when the value changes. Pass a new object reference to re-trigger." },
          { prop: "markers",            type: "MapLibreMarker[]",          default: "[]",         description: "Array of markers to render." },
          { prop: "routes",             type: "MapLibreRoute[]",           default: "[]",         description: "Array of routes. Each fetches a real road path from OSRM." },
          { prop: "cluster",            type: "boolean",                   default: "false",      description: "Enable marker clustering." },
          { prop: "clusterVariant",     type: "MapLibreClusterVariant",    default: "\"default\"",description: "Cluster icon style: default | bubble | donut." },
          { prop: "height",             type: "string | number",           default: "480",        description: "Map height in px or CSS string." },
          { prop: "showControls",       type: "boolean",                   default: "true",       description: "Show navigation, scale, and fullscreen controls." },
          { prop: "showStyleSwitcher",  type: "boolean",                   default: "true",       description: "Show the bottom style switcher bar." },
          { prop: "showCameraControls", type: "boolean",                   default: "false",      description: "Always show pitch/bearing slider panel. When false, a Camera toggle button is shown." },
          { prop: "onMarkerClick",      type: "(marker: MapLibreMarker) => void",                 description: "Fired when a marker is clicked." },
          { prop: "className",          type: "string",                                           description: "Additional CSS classes on the wrapper." },
        ]} />
      </Section>

      <Section id="flytype">
        <PropsTable rows={[
          { prop: "center",    type: "[number, number]", description: "Target center [lng, lat]." },
          { prop: "zoom",      type: "number",           description: "Target zoom level." },
          { prop: "pitch",     type: "number",           description: "Target pitch in degrees. Clamped to minPitch/maxPitch." },
          { prop: "bearing",   type: "number",           description: "Target bearing in degrees. Clamped to minBearing/maxBearing." },
          { prop: "duration",  type: "number",           default: "1500", description: "Animation duration in milliseconds." },
          { prop: "curve",     type: "number",           default: "1.42", description: "Zoom curve during flight. Higher = more zoom-out arc." },
          { prop: "essential", type: "boolean",          default: "true", description: "If true, bypasses prefers-reduced-motion." },
        ]} />
      </Section>

      <Section id="markertype">
        <PropsTable rows={[
          { prop: "id",    type: "string | number", required: true, description: "Unique marker identifier." },
          { prop: "lat",   type: "number",          required: true, description: "Latitude." },
          { prop: "lng",   type: "number",          required: true, description: "Longitude." },
          { prop: "label", type: "string",                          description: "Text shown in default popup." },
          { prop: "color", type: "string",                          description: "Pin color: primary | info | success | warning | danger | any hex." },
          { prop: "icon",  type: "string",                          description: "Emoji or character rendered inside the pin." },
          { prop: "image", type: "string",                          description: "Image URL — renders a circular avatar pin." },
          { prop: "popup", type: "string | HTMLElement",            description: "Custom popup — HTML string or DOM element. Overrides label." },
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

    </DocsLayout>
  )
}
