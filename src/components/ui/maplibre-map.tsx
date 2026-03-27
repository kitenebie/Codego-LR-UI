import * as React from "react"
import maplibregl from "maplibre-gl"
import { Globe, Building2, Map, Satellite, Moon, Sun, Sliders } from "lucide-react"
import { cn } from "@/src/lib/utils"
import "maplibre-gl/dist/maplibre-gl.css"

// ── Types ─────────────────────────────────────────────────────────────────────

export type MapLibreStyle = "globe" | "3d" | "3d-globe" | "street" | "satellite" | "dark" | "light"
export type MapLibreRouteType = "drive" | "walk"
export type MapLibreClusterVariant = "default" | "bubble" | "donut"

export interface MapLibreMarker {
  id: string | number
  lat: number
  lng: number
  label?: string
  color?: string
  icon?: string
  image?: string          // URL — renders circular avatar pin
  popup?: string | HTMLElement
}

export interface MapLibreRoute {
  start: { lat: number; lng: number }
  end: { lat: number; lng: number }
  waypoints?: { lat: number; lng: number }[]
  routeType?: MapLibreRouteType
  color?: string
  weight?: number
  label?: string
}

export interface FlyToOptions {
  center?: [number, number]   // [lng, lat]
  zoom?: number
  pitch?: number
  bearing?: number
  duration?: number           // ms, default 1500
  curve?: number              // zoom curve, default 1.42
  essential?: boolean         // bypass reduced-motion, default true
}

export interface MapLibreProps {
  style?: MapLibreStyle
  center?: [number, number]       // [lng, lat]
  zoom?: number
  minZoom?: number                // default 0
  maxZoom?: number                // default 22
  pitch?: number                  // 0–85, reactive
  minPitch?: number               // default 0
  maxPitch?: number               // default 85
  bearing?: number                // -180–180, reactive
  minBearing?: number             // default -180
  maxBearing?: number             // default 180
  flyTo?: FlyToOptions            // triggers flyTo animation when changed
  markers?: MapLibreMarker[]
  routes?: MapLibreRoute[]
  cluster?: boolean
  clusterVariant?: MapLibreClusterVariant
  height?: string | number
  showControls?: boolean
  showStyleSwitcher?: boolean
  showCameraControls?: boolean
  className?: string
  onMarkerClick?: (marker: MapLibreMarker) => void
}

// ── Style config ──────────────────────────────────────────────────────────────

const STYLE_URLS: Record<MapLibreStyle, string> = {
  street:      "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  light:       "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark:        "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  satellite:   "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  globe:       "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  "3d":        "https://tiles.openfreemap.org/styles/liberty",
  "3d-globe":  "https://tiles.openfreemap.org/styles/liberty",
}

const STYLE_LABELS: Record<MapLibreStyle, string> = {
  globe:      "Globe",
  "3d":       "3D",
  "3d-globe": "3D Globe",
  street:     "Street",
  satellite:  "Satellite",
  dark:       "Dark",
  light:      "Light",
}

const STYLE_ICONS: Record<MapLibreStyle, React.ElementType> = {
  globe:      Globe,
  "3d":       Building2,
  "3d-globe": Globe,
  street:     Map,
  satellite:  Satellite,
  dark:       Moon,
  light:      Sun,
}

const SATELLITE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      attribution: "© Esri",
      maxzoom: 19,
    },
  },
  layers: [{ id: "satellite", type: "raster", source: "satellite" }],
}

// ── Color helper ──────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  primary: "#6366f1",
  info:    "#3b82f6",
  success: "#22c55e",
  warning: "#f59e0b",
  danger:  "#ef4444",
}

function resolveColor(c?: string) {
  if (!c) return "#6366f1"
  return COLOR_MAP[c] ?? c
}

// ── SVG pin HTML ──────────────────────────────────────────────────────────────

function makePinHTML(color: string, icon?: string, image?: string) {
  if (image) {
    return `<div style="position:relative;width:40px;height:50px;cursor:pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
        <path d="M20 0C8.954 0 0 8.954 0 20c0 13.125 20 30 20 30S40 33.125 40 20C40 8.954 31.046 0 20 0z"
          fill="${color}" stroke="white" stroke-width="2"/>
        <clipPath id="cp-${Math.random().toString(36).slice(2)}">
          <circle cx="20" cy="19" r="13"/>
        </clipPath>
      </svg>
      <img src="${image}" style="position:absolute;top:6px;left:6px;width:28px;height:28px;border-radius:50%;object-fit:cover;border:2px solid white;" />
    </div>`
  }
  return `<div style="position:relative;width:32px;height:42px;cursor:pointer">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 16 26 16 26S32 26.5 32 16C32 7.163 24.837 0 16 0z"
        fill="${color}" stroke="white" stroke-width="2"/>
      ${icon
        ? `<text x="16" y="21" text-anchor="middle" dominant-baseline="middle"
            font-size="13" fill="white" font-family="sans-serif">${icon}</text>`
        : `<circle cx="16" cy="16" r="5" fill="white" opacity="0.9"/>`
      }
    </svg>
  </div>`
}

// ── 3D buildings ──────────────────────────────────────────────────────────────

function add3DBuildings(map: maplibregl.Map) {
  if (map.getLayer("3d-buildings")) return
  const style = map.getStyle()
  const layers = style.layers ?? []
  const firstSymbol = layers.find(l => l.type === "symbol")?.id
  const sources = Object.keys(style.sources ?? {})
  const buildingSource = sources.find(s =>
    ["openmaptiles", "maplibre", "composite", "carto", "vectorTiles"].includes(s)
  ) ?? sources[0]
  if (!buildingSource) return
  try {
    map.addLayer(
      {
        id: "3d-buildings",
        source: buildingSource,
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 13,
        filter: [">", ["coalesce", ["get", "render_height"], ["get", "height"], 0], 0],
        paint: {
          "fill-extrusion-color": [
            "interpolate", ["linear"],
            ["coalesce", ["get", "render_height"], ["get", "height"], 5],
            0, "#d0dce8", 20, "#b0c4d8", 60, "#8899bb", 150, "#6677aa", 300, "#4455aa",
          ],
          "fill-extrusion-height": [
            "interpolate", ["linear"], ["zoom"],
            13, 0,
            14, ["coalesce", ["get", "render_height"], ["get", "height"], 5],
          ],
          "fill-extrusion-base": [
            "interpolate", ["linear"], ["zoom"],
            13, 0,
            14, ["coalesce", ["get", "render_min_height"], ["get", "min_height"], 0],
          ],
          "fill-extrusion-opacity": 0.85,
        },
      },
      firstSymbol
    )
  } catch { /* source-layer not present */ }
}

// ── Globe projection ──────────────────────────────────────────────────────────

function applyGlobe(map: maplibregl.Map) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(map as any).setProjection({ type: "globe" })
  } catch {
    map.setZoom(1.5)
  }
}

// ── Terrain ───────────────────────────────────────────────────────────────────

function addTerrain(map: maplibregl.Map) {
  if (map.getSource("terrain-dem")) return
  map.addSource("terrain-dem", {
    type: "raster-dem",
    url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
    tileSize: 256,
  })
  map.setTerrain({ source: "terrain-dem", exaggeration: 1.5 })
  if (!map.getLayer("hillshade")) {
    map.addLayer({
      id: "hillshade",
      type: "hillshade",
      source: "terrain-dem",
      paint: { "hillshade-exaggeration": 0.4 },
    })
  }
}

// ── OSRM routing ──────────────────────────────────────────────────────────────

const OSRM_PROFILE: Record<MapLibreRouteType, string> = { drive: "driving", walk: "foot" }

interface OsrmResult { coords: [number, number][]; distance: number; duration: number }

async function fetchOsrmRoute(
  points: { lat: number; lng: number }[],
  routeType: MapLibreRouteType
): Promise<OsrmResult> {
  const profile = OSRM_PROFILE[routeType]
  const coords = points.map(p => `${p.lng},${p.lat}`).join(";")
  const res = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson`)
  if (!res.ok) throw new Error("OSRM failed")
  const data = await res.json()
  if (data.code !== "Ok" || !data.routes?.length) throw new Error("No route")
  const route = data.routes[0]
  return {
    coords: (route.geometry.coordinates as [number, number][]),  // already [lng, lat] for MapLibre
    distance: route.distance,
    duration: route.duration,
  }
}

function fmtDistance(m: number) { return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m` }
function fmtDuration(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}min` : `${m} min`
}

// ── Cluster icon HTML ─────────────────────────────────────────────────────────

function makeClusterHTML(variant: MapLibreClusterVariant, count: number, color: string): string {
  if (variant === "bubble") {
    const size = count > 99 ? 52 : count > 9 ? 44 : 36
    return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};color:#fff;font-weight:700;font-size:${count > 99 ? 11 : 13}px;font-family:sans-serif;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);">${count}</div>`
  }
  if (variant === "donut") {
    const r = 20, stroke = 5, circ = 2 * Math.PI * r
    const dash = Math.min(count / 50, 1) * circ
    return `<svg width="54" height="54" viewBox="0 0 54 54"><circle cx="27" cy="27" r="${r}" fill="none" stroke="${color}33" stroke-width="${stroke}"/><circle cx="27" cy="27" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${circ / 4}" stroke-linecap="round"/><circle cx="27" cy="27" r="${r - stroke - 2}" fill="${color}22"/><text x="27" y="27" text-anchor="middle" dominant-baseline="middle" font-size="12" font-weight="700" fill="${color}" font-family="sans-serif">${count}</text></svg>`
  }
  const w = count > 99 ? 52 : 40
  return `<div style="min-width:${w}px;height:28px;border-radius:14px;background:${color};color:#fff;font-weight:700;font-size:12px;font-family:sans-serif;display:flex;align-items:center;justify-content:center;padding:0 8px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25);">${count}</div>`
}

function makeEndpointHTML(color: string, label: "A" | "B"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="${color}" stroke="white" stroke-width="2.5"/><text x="14" y="14" text-anchor="middle" dominant-baseline="middle" font-size="12" font-weight="700" fill="white" font-family="sans-serif">${label}</text></svg>`
}

// ── Main component ────────────────────────────────────────────────────────────

export function MapLibreMap({
  style: styleProp = "street",
  center = [0, 20],
  zoom = 2,
  minZoom = 0,
  maxZoom = 22,
  pitch: pitchProp = 0,
  minPitch = 0,
  maxPitch = 85,
  bearing: bearingProp = 0,
  minBearing = -180,
  maxBearing = 180,
  flyTo,
  markers = [],
  routes = [],
  cluster = false,
  clusterVariant = "default",
  height = 480,
  showControls = true,
  showStyleSwitcher = true,
  showCameraControls = false,
  className,
  onMarkerClick,
}: MapLibreProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const mapRef       = React.useRef<maplibregl.Map | null>(null)
  const markersRef   = React.useRef<maplibregl.Marker[]>([])
  const routeMarkersRef = React.useRef<maplibregl.Marker[]>([])
  const flyingRef     = React.useRef(false)
  const [routeLoading, setRouteLoading] = React.useState(false)

  const [activeStyle, setActiveStyle] = React.useState<MapLibreStyle>(styleProp)
  const [ready, setReady]             = React.useState(false)
  const [showCamera, setShowCamera]   = React.useState(false)

  // Clamp helpers
  const clampPitch   = (v: number) => Math.min(Math.max(v, minPitch),   maxPitch)
  const clampBearing = (v: number) => Math.min(Math.max(v, minBearing), maxBearing)

  const is3d = styleProp === "3d" || styleProp === "3d-globe"
  const [pitch,   setPitch]   = React.useState(clampPitch(is3d  ? (pitchProp   || 55)  : pitchProp))
  const [bearing, setBearing] = React.useState(clampBearing(is3d ? (bearingProp || -20) : bearingProp))

  const h = typeof height === "number" ? `${height}px` : height

  // ── Init ──────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const initZoom = (styleProp === "globe" || styleProp === "3d-globe") ? (zoom || 1.8) : styleProp === "3d" ? (zoom || 15) : zoom

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleProp === "satellite" ? SATELLITE_STYLE : STYLE_URLS[styleProp],
      center: center as [number, number],
      zoom: initZoom,
      minZoom,
      maxZoom,
      pitch,
      minPitch,
      maxPitch,
      bearing,
    })

    if (showControls) {
      map.addControl(new maplibregl.NavigationControl(), "top-right")
      map.addControl(new maplibregl.ScaleControl(), "bottom-left")
      map.addControl(new maplibregl.FullscreenControl(), "top-right")
    }

    // Keep slider state in sync when user drags/rotates the map manually
    map.on("pitchend",  () => setPitch(clampPitch(Math.round(map.getPitch()))))
    map.on("rotateend", () => setBearing(clampBearing(Math.round(map.getBearing()))))

    map.on("load", () => {
      if (styleProp === "globe" || styleProp === "3d-globe") applyGlobe(map)
      if (styleProp === "3d" || styleProp === "3d-globe") { add3DBuildings(map); addTerrain(map) }
      setReady(true)
    })

    mapRef.current = map
    return () => { map.remove(); mapRef.current = null; setReady(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Sync min/max zoom constraints ─────────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.setMinZoom(minZoom)
    map.setMaxZoom(maxZoom)
  }, [minZoom, maxZoom])

  // ── Sync min/max pitch constraints ────────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.setMinPitch(minPitch)
    map.setMaxPitch(maxPitch)
    // Re-clamp current pitch if it's now out of range
    setPitch(p => clampPitch(p))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPitch, maxPitch])

  // ── Pitch → map ───────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (flyingRef.current) return
    mapRef.current?.easeTo({ pitch: clampPitch(pitch), duration: 300 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pitch])

  // ── Bearing → map ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (flyingRef.current) return
    mapRef.current?.easeTo({ bearing: clampBearing(bearing), duration: 300 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bearing])

  // ── flyTo prop ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current
    if (!map || !flyTo) return
    const { center: ftCenter, zoom: ftZoom, pitch: ftPitch, bearing: ftBearing, duration = 1500, curve = 1.42, essential = true } = flyTo
    flyingRef.current = true
    map.flyTo({
      ...(ftCenter  !== undefined && { center:  ftCenter }),
      ...(ftZoom    !== undefined && { zoom:    ftZoom }),
      ...(ftPitch   !== undefined && { pitch:   clampPitch(ftPitch) }),
      ...(ftBearing !== undefined && { bearing: clampBearing(ftBearing) }),
      duration,
      curve,
      essential,
    })
    // Sync slider state after fly completes
    map.once("moveend", () => {
      flyingRef.current = false
      if (ftPitch   !== undefined) setPitch(clampPitch(ftPitch))
      if (ftBearing !== undefined) setBearing(clampBearing(ftBearing))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTo])

  // ── Routes ────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current
    if (!map || !ready || routes.length === 0) return

    // Clean up previous route layers/sources/markers
    function cleanRoutes() {
      routeMarkersRef.current.forEach(m => m.remove())
      routeMarkersRef.current = []
      if (!map || !map.loaded()) return
      const style = map.getStyle()
      if (!style) return
      ;(style.layers ?? []).forEach(l => {
        if (l.id.startsWith("route-")) try { map.removeLayer(l.id) } catch { /* noop */ }
      })
      Object.keys(style.sources ?? {}).forEach(s => {
        if (s.startsWith("route-")) try { map.removeSource(s) } catch { /* noop */ }
      })
    }

    cleanRoutes()
    setRouteLoading(true)

    Promise.all(
      routes.map(async (r, i) => {
        const points = [r.start, ...(r.waypoints ?? []), r.end]
        try {
          const result = await fetchOsrmRoute(points, r.routeType ?? "drive")
          return { route: r, idx: i, ...result, error: false }
        } catch {
          return { route: r, idx: i, coords: points.map(p => [p.lng, p.lat]) as [number, number][], distance: 0, duration: 0, error: true }
        }
      })
    ).then(results => {
      setRouteLoading(false)
      if (!mapRef.current) return
      const m = mapRef.current

      const allCoords: [number, number][] = []

      results.forEach(({ route, idx, coords, distance, duration }) => {
        const color = route.color ?? (route.routeType === "walk" ? "#22c55e" : "#6366f1")
        const srcId = `route-${idx}`
        const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: coords },
        }

        m.addSource(srcId, { type: "geojson", data: geojson })
        // White outline
        m.addLayer({ id: `${srcId}-outline`, type: "line", source: srcId,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#ffffff", "line-width": (route.weight ?? 5) + 4, "line-opacity": 0.3 } })
        // Colored line
        m.addLayer({ id: `${srcId}-line`, type: "line", source: srcId,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": color, "line-width": route.weight ?? 5, "line-opacity": 0.9 } })

        allCoords.push(...coords)

        // A/B endpoint markers
        const makeEndpointMarker = (lngLat: [number, number], label: "A" | "B", markerColor: string, popupHtml: string) => {
          const el = document.createElement("div")
          el.innerHTML = makeEndpointHTML(markerColor, label)
          el.style.cssText = "width:28px;height:28px"
          const popup = new maplibregl.Popup({ offset: [0, -16], closeButton: false }).setHTML(popupHtml)
          const marker = new maplibregl.Marker({ element: el, anchor: "center" })
            .setLngLat(lngLat).setPopup(popup).addTo(m)
          routeMarkersRef.current.push(marker)
        }

        const infoHtml = distance > 0
          ? `<p style="font-size:11px;color:#888;margin:2px 0 0">${fmtDistance(distance)} · ${fmtDuration(duration)} · ${route.routeType === "walk" ? "🚶 Walk" : "🚗 Drive"}</p>`
          : ""

        makeEndpointMarker(
          [route.start.lng, route.start.lat], "A", color,
          `<div style="padding:2px;min-width:120px"><p style="font-weight:700;font-size:13px;margin:0">${route.label ? `${route.label} — Start` : "Start"}</p>${infoHtml}</div>`
        )
        makeEndpointMarker(
          [route.end.lng, route.end.lat], "B", "#ef4444",
          `<div style="padding:2px;min-width:120px"><p style="font-weight:700;font-size:13px;margin:0">${route.label ? `${route.label} — End` : "End"}</p>${infoHtml}</div>`
        )

        // Mid-route badge
        if (distance > 0 && coords.length > 1) {
          const mid = coords[Math.floor(coords.length / 2)]
          const text = `${fmtDistance(distance)} · ${fmtDuration(duration)}`
          const estW = text.length * 7 + 16
          const el = document.createElement("div")
          el.innerHTML = `<div style="display:inline-flex;align-items:center;justify-content:center;background:${color};color:white;font-size:11px;font-weight:600;font-family:sans-serif;padding:3px 8px;border-radius:12px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.25);white-space:nowrap;">${text}</div>`
          el.style.cssText = `width:${estW}px;height:22px;pointer-events:none`
          const badge = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat(mid).addTo(m)
          routeMarkersRef.current.push(badge)
        }
      })

      // Fit bounds to all route coords
      if (allCoords.length > 1) {
        const lngs = allCoords.map(c => c[0]), lats = allCoords.map(c => c[1])
        m.fitBounds(
          [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
          { padding: 60, duration: 800 }
        )
      }
    })

    return cleanRoutes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes, ready])

  // ── Style switcher ────────────────────────────────────────────────────────
  function switchStyle(s: MapLibreStyle) {
    const map = mapRef.current
    if (!map) return
    setActiveStyle(s)
    setReady(false)

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    routeMarkersRef.current.forEach(m => m.remove())
    routeMarkersRef.current = []

    map.setStyle(s === "satellite" ? SATELLITE_STYLE as maplibregl.StyleSpecification : STYLE_URLS[s])

    map.once("style.load", () => {
      if (s === "globe") {
        applyGlobe(map)
        const p = clampPitch(0), b = clampBearing(0)
        setPitch(p); setBearing(b)
        map.flyTo({ zoom: 1.8, pitch: p, bearing: b, duration: 800 })
      } else if (s === "3d" || s === "3d-globe") {
        const p = clampPitch(pitchProp   !== 0 ? pitchProp   : 55)
        const b = clampBearing(bearingProp !== 0 ? bearingProp : -20)
        setPitch(p); setBearing(b)
        if (s === "3d-globe") applyGlobe(map)
        map.flyTo({ pitch: p, bearing: b, zoom: s === "3d-globe" ? 1.8 : Math.max(map.getZoom(), 15), duration: 1000 })
        add3DBuildings(map)
        addTerrain(map)
      } else {
        const p = clampPitch(pitchProp)
        const b = clampBearing(bearingProp)
        setPitch(p); setBearing(b)
        map.flyTo({ pitch: p, bearing: b, duration: 600 })
        try { map.setTerrain(null as unknown as maplibregl.TerrainSpecification) } catch { /* noop */ }
      }
      setReady(true)
    })
  }

  // ── Markers / Clustering ──────────────────────────────────────────────────
  const [mapZoom, setMapZoom] = React.useState(zoom)

  React.useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const h = () => setMapZoom(map.getZoom())
    map.on("zoomend", h)
    return () => { map.off("zoomend", h) }
  }, [ready])

  React.useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    if (cluster && markers.length > 0) {
      // Pixel-grid clustering
      const GRID = 80
      const used = new Set<number>()
      const groups: { center: { lng: number; lat: number }; items: MapLibreMarker[] }[] = []

      markers.forEach((m, i) => {
        if (used.has(i)) return
        const pt = map.project([m.lng, m.lat])
        const group: MapLibreMarker[] = [m]
        used.add(i)
        markers.forEach((m2, j) => {
          if (used.has(j)) return
          const pt2 = map.project([m2.lng, m2.lat])
          if (Math.abs(pt.x - pt2.x) < GRID && Math.abs(pt.y - pt2.y) < GRID) { group.push(m2); used.add(j) }
        })
        const lat = group.reduce((s, x) => s + x.lat, 0) / group.length
        const lng = group.reduce((s, x) => s + x.lng, 0) / group.length
        groups.push({ center: { lng, lat }, items: group })
      })

      groups.forEach((g, gi) => {
        if (g.items.length === 1) {
          const m = g.items[0]
          const color = resolveColor(m.color)
          const el = document.createElement("div")
          el.innerHTML = makePinHTML(color, m.icon, m.image)
          el.style.cssText = m.image ? "width:40px;height:50px" : "width:32px;height:42px"
          const popup = new maplibregl.Popup({ offset: m.image ? [0, -52] : [0, -44], closeButton: false })
          if (m.popup) { typeof m.popup === "string" ? popup.setHTML(m.popup) : popup.setDOMContent(m.popup) }
          else if (m.label) popup.setHTML(`<span style="font-size:13px;font-weight:600">${m.label}</span>`)
          const marker = new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([m.lng, m.lat])
          if (m.popup || m.label) marker.setPopup(popup)
          el.addEventListener("click", () => onMarkerClick?.(m))
          marker.addTo(map)
          markersRef.current.push(marker)
        } else {
          const color = resolveColor(g.items[0].color)
          const el = document.createElement("div")
          el.innerHTML = makeClusterHTML(clusterVariant, g.items.length, color)
          el.style.cssText = "cursor:pointer"
          const listItems = g.items.map(m =>
            `<div data-id="${m.id}" style="font-size:12px;padding:2px 0;cursor:pointer;">${m.label ?? `Marker ${m.id}`}</div>`
          ).join("")
          const popup = new maplibregl.Popup({ offset: [0, -8], closeButton: false })
            .setHTML(`<div style="max-height:160px;overflow-y:auto;padding:2px">${listItems}</div>`)
          el.addEventListener("click", () => {
            map.flyTo({ center: [g.center.lng, g.center.lat], zoom: map.getZoom() + 2, duration: 400 })
          })
          const marker = new maplibregl.Marker({ element: el, anchor: "center" })
            .setLngLat([g.center.lng, g.center.lat]).setPopup(popup).addTo(map)
          markersRef.current.push(marker)
          // Wire up item clicks inside popup after it opens
          marker.getPopup().on("open", () => {
            g.items.forEach(m => {
              const node = document.querySelector(`[data-id="${m.id}"]`) as HTMLElement | null
              node?.addEventListener("click", () => onMarkerClick?.(m))
            })
          })
        }
      })
    } else {
      markers.forEach(m => {
        const color = resolveColor(m.color)
        const el = document.createElement("div")
        el.innerHTML = makePinHTML(color, m.icon, m.image)
        el.style.cssText = m.image ? "width:40px;height:50px" : "width:32px;height:42px"

        const popup = new maplibregl.Popup({ offset: m.image ? [0, -52] : [0, -44], closeButton: false })
        if (m.popup) {
          if (typeof m.popup === "string") popup.setHTML(m.popup)
          else popup.setDOMContent(m.popup)
        } else if (m.label) {
          popup.setHTML(`<span style="font-size:13px;font-weight:600">${m.label}</span>`)
        }

        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([m.lng, m.lat])

        if (m.popup || m.label) marker.setPopup(popup)
        el.addEventListener("click", () => onMarkerClick?.(m))
        marker.addTo(map)
        markersRef.current.push(marker)
      })
    }
  }, [markers, ready, onMarkerClick, cluster, clusterVariant, mapZoom])

  // ── Render ────────────────────────────────────────────────────────────────
  const cameraOpen = showCameraControls || showCamera

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl border border-border", className)} style={{ height: h }}>
      {routeLoading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2 shadow-lg text-sm font-medium">
            <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Calculating route…
          </div>
        </div>
      )}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Camera controls panel */}
      {cameraOpen && (
        <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-3 shadow-xl space-y-3 w-52">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold">Camera</span>
            </div>
            {!showCameraControls && (
              <button type="button" onClick={() => setShowCamera(false)}
                className="text-muted-foreground hover:text-foreground text-xs leading-none">✕</button>
            )}
          </div>

          {/* Pitch slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-muted-foreground">Pitch <span className="opacity-50">({minPitch}–{maxPitch}°)</span></label>
              <span className="text-[11px] font-mono tabular-nums text-foreground">{pitch}°</span>
            </div>
            <input
              type="range" min={minPitch} max={maxPitch} step={1} value={pitch}
              onChange={e => setPitch(Number(e.target.value))}
              className="w-full h-1.5 rounded-full accent-primary cursor-pointer"
            />
          </div>

          {/* Bearing slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-muted-foreground">Bearing <span className="opacity-50">({minBearing}–{maxBearing}°)</span></label>
              <span className="text-[11px] font-mono tabular-nums text-foreground">{bearing}°</span>
            </div>
            <input
              type="range" min={minBearing} max={maxBearing} step={1} value={bearing}
              onChange={e => setBearing(Number(e.target.value))}
              className="w-full h-1.5 rounded-full accent-primary cursor-pointer"
            />
          </div>

          {/* Zoom info */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-2">
            <span>Zoom range</span>
            <span className="font-mono tabular-nums text-foreground">{minZoom} – {maxZoom}</span>
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={() => { setPitch(clampPitch(pitchProp)); setBearing(clampBearing(bearingProp)) }}
            className="w-full text-[11px] py-1 rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground"
          >
            Reset
          </button>
        </div>
      )}

      {/* Camera toggle button */}
      {!cameraOpen && (
        <button
          type="button"
          onClick={() => setShowCamera(true)}
          title="Camera controls"
          className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-xl shadow text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
        >
          <Sliders className="h-3.5 w-3.5" />
          Camera
        </button>
      )}

      {/* Style switcher */}
      {showStyleSwitcher && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-1 shadow-xl">
          {(Object.keys(STYLE_LABELS) as MapLibreStyle[]).map(s => {
            const Icon = STYLE_ICONS[s]
            return (
              <button
                key={s}
                type="button"
                onClick={() => switchStyle(s)}
                title={STYLE_LABELS[s]}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                  activeStyle === s
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {STYLE_LABELS[s]}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
