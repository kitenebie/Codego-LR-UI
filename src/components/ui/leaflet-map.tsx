import * as React from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, CircleMarker } from "react-leaflet"
import L from "leaflet"
import { cn } from "@/src/lib/utils"

L.Icon.Default.mergeOptions({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// ── Types ─────────────────────────────────────────────────────────────────────

export type MarkerColor = "primary" | "info" | "success" | "warning" | "danger" | string
export type ClusterVariant = "default" | "bubble" | "donut"
export type RouteType = "drive" | "walk"

export interface MapMarker {
  id: string | number
  lat: number
  lng: number
  label?: string
  color?: MarkerColor
  icon?: string
  image?: string          // URL — renders circular avatar pin
  popup?: React.ReactNode
}

export interface MapRoute {
  start: { lat: number; lng: number }
  end: { lat: number; lng: number }
  waypoints?: { lat: number; lng: number }[]
  routeType?: RouteType
  color?: string
  weight?: number
  label?: string
}

export interface LeafletMapProps {
  center?: [number, number]
  zoom?: number
  height?: string | number
  markers?: MapMarker[]
  routes?: MapRoute[]
  cluster?: boolean
  clusterVariant?: ClusterVariant
  tileUrl?: string
  tileAttribution?: string
  darkTile?: boolean
  className?: string
  onMarkerClick?: (marker: MapMarker) => void
}

// ── OSRM routing ──────────────────────────────────────────────────────────────

// OSRM profile mapping
const OSRM_PROFILE: Record<RouteType, string> = {
  drive: "driving",
  walk:  "foot",
}

interface OsrmResult {
  coords: [number, number][]
  distance: number   // metres
  duration: number   // seconds
}

async function fetchOsrmRoute(
  points: { lat: number; lng: number }[],
  routeType: RouteType
): Promise<OsrmResult> {
  const profile = OSRM_PROFILE[routeType]
  const coords = points.map(p => `${p.lng},${p.lat}`).join(";")
  const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson`
  const res = await fetch(url)
  if (!res.ok) throw new Error("OSRM request failed")
  const data = await res.json()
  if (data.code !== "Ok" || !data.routes?.length) throw new Error("No route found")
  const route = data.routes[0]
  const rawCoords: [number, number][] = (route.geometry.coordinates as [number, number][]).map(
    ([lng, lat]) => [lat, lng]
  )
  return { coords: rawCoords, distance: route.distance, duration: route.duration }
}

function fmtDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`
}

function fmtDuration(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m} min`
}

// ── Color resolver ────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  primary: "#6366f1",
  info:    "#3b82f6",
  success: "#22c55e",
  warning: "#f59e0b",
  danger:  "#ef4444",
}

function resolveColor(c?: MarkerColor) {
  if (!c) return COLOR_MAP.primary
  return COLOR_MAP[c] ?? c
}

// ── SVG pin icon ──────────────────────────────────────────────────────────────

function makePinIcon(color: string, icon?: string, image?: string) {
  if (image) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
        <path d="M20 0C8.954 0 0 8.954 0 20c0 13.125 20 30 20 30S40 33.125 40 20C40 8.954 31.046 0 20 0z"
          fill="${color}" stroke="white" stroke-width="2"/>
      </svg>
      <img src="${image}" style="position:absolute;top:6px;left:6px;width:28px;height:28px;border-radius:50%;object-fit:cover;border:2px solid white;" />`
    return L.divIcon({
      html: `<div style="position:relative;width:40px;height:50px">${svg}</div>`,
      className: "", iconSize: [40, 50], iconAnchor: [20, 50], popupAnchor: [0, -52],
    })
  }
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 16 26 16 26S32 26.5 32 16C32 7.163 24.837 0 16 0z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <text x="16" y="21" text-anchor="middle" dominant-baseline="middle"
        font-size="${icon ? 13 : 0}" fill="white" font-family="sans-serif">${icon ?? ""}</text>
      ${!icon ? `<circle cx="16" cy="16" r="5" fill="white" opacity="0.9"/>` : ""}
    </svg>`
  return L.divIcon({ html: svg, className: "", iconSize: [32, 42], iconAnchor: [16, 42], popupAnchor: [0, -44] })
}

// ── Endpoint circle icons ─────────────────────────────────────────────────────

function makeEndpointIcon(color: string, label: "A" | "B") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="12" fill="${color}" stroke="white" stroke-width="2.5"/>
      <text x="14" y="14" text-anchor="middle" dominant-baseline="middle"
        font-size="12" font-weight="700" fill="white" font-family="sans-serif">${label}</text>
    </svg>`
  return L.divIcon({ html: svg, className: "", iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16] })
}

// ── Route layer with real OSRM routing ───────────────────────────────────────

interface ResolvedRoute {
  route: MapRoute
  coords: [number, number][]
  distance: number
  duration: number
  error?: string
}

function RouteLayer({ routes }: { routes: MapRoute[] }) {
  const map = useMap()
  const [resolved, setResolved] = React.useState<ResolvedRoute[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    Promise.all(
      routes.map(async (r): Promise<ResolvedRoute> => {
        const points = [r.start, ...(r.waypoints ?? []), r.end]
        try {
          const result = await fetchOsrmRoute(points, r.routeType ?? "drive")
          return { route: r, ...result }
        } catch {
          // fallback: straight line
          const coords: [number, number][] = points.map(p => [p.lat, p.lng])
          return { route: r, coords, distance: 0, duration: 0, error: "Routing unavailable" }
        }
      })
    ).then(results => {
      setResolved(results)
      setLoading(false)
      // fit bounds to all route coords
      const allPts = results.flatMap(r => r.coords)
      if (allPts.length > 1) {
        map.fitBounds(L.latLngBounds(allPts), { padding: [48, 48] })
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes])

  if (loading) return null

  return (
    <>
      {resolved.map((r, i) => {
        const color = r.route.color ?? (r.route.routeType === "walk" ? "#22c55e" : "#6366f1")
        const isDrive = (r.route.routeType ?? "drive") === "drive"
        const midIdx = Math.floor(r.coords.length / 2)
        const midPt = r.coords[midIdx]

        return (
          <React.Fragment key={i}>
            {/* Route line */}
            <Polyline
              positions={r.coords}
              pathOptions={{
                color,
                weight: r.route.weight ?? 5,
                lineCap: "round",
                lineJoin: "round",
                opacity: 0.9,
              }}
            />
            {/* Subtle outline for depth */}
            <Polyline
              positions={r.coords}
              pathOptions={{
                color: "white",
                weight: (r.route.weight ?? 5) + 4,
                lineCap: "round",
                lineJoin: "round",
                opacity: 0.3,
              }}
            />

            {/* Start marker A */}
            <Marker
              position={[r.route.start.lat, r.route.start.lng]}
              icon={makeEndpointIcon(color, "A")}
              zIndexOffset={100}
            >
              <Popup>
                <div className="text-xs space-y-0.5 min-w-[120px]">
                  <p className="font-semibold">{r.route.label ? `${r.route.label} — Start` : "Start"}</p>
                  {r.distance > 0 && (
                    <>
                      <p className="text-muted-foreground">{fmtDistance(r.distance)}</p>
                      <p className="text-muted-foreground">{fmtDuration(r.duration)} · {isDrive ? "🚗 Drive" : "🚶 Walk"}</p>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* End marker B */}
            <Marker
              position={[r.route.end.lat, r.route.end.lng]}
              icon={makeEndpointIcon("#ef4444", "B")}
              zIndexOffset={100}
            >
              <Popup>
                <div className="text-xs space-y-0.5 min-w-[120px]">
                  <p className="font-semibold">{r.route.label ? `${r.route.label} — End` : "End"}</p>
                  {r.distance > 0 && (
                    <>
                      <p className="text-muted-foreground">{fmtDistance(r.distance)}</p>
                      <p className="text-muted-foreground">{fmtDuration(r.duration)} · {isDrive ? "🚗 Drive" : "🚶 Walk"}</p>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* Waypoint markers */}
            {(r.route.waypoints ?? []).map((wp, wi) => (
              <CircleMarker key={wi} center={[wp.lat, wp.lng]} radius={5}
                pathOptions={{ color: "white", fillColor: color, fillOpacity: 1, weight: 2 }} />
            ))}

            {/* Mid-route info badge */}
            {r.distance > 0 && midPt && (() => {
              const text = `${fmtDistance(r.distance)} · ${fmtDuration(r.duration)}`
              // estimate width: ~7px per char + 16px padding
              const estW = text.length * 7 + 16
              const badgeIcon = L.divIcon({
                html: `<div style="
                  display:inline-flex;align-items:center;justify-content:center;
                  background:${color};color:white;font-size:11px;font-weight:600;
                  font-family:sans-serif;padding:3px 8px;border-radius:12px;
                  border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.25);
                  white-space:nowrap;max-width:160px;">${text}</div>`,
                className: "",
                iconSize: [estW, 22],
                iconAnchor: [estW / 2, 11],
              })
              return (
                <Marker key="badge" position={midPt} icon={badgeIcon} interactive={false} zIndexOffset={50} />
              )
            })()}
          </React.Fragment>
        )
      })}
    </>
  )
}

// ── Loading overlay ───────────────────────────────────────────────────────────

function RouteLoadingOverlay({ routes }: { routes: MapRoute[] }) {
  const [loading, setLoading] = React.useState(routes.length > 0)

  React.useEffect(() => {
    if (!routes.length) return
    setLoading(true)
    // mirror the fetch timing — just show spinner until routes resolve
    const t = setTimeout(() => setLoading(false), 4000)
    return () => clearTimeout(t)
  }, [routes])

  if (!loading) return null

  return (
    <div className="absolute inset-0 z-[1000] flex items-center justify-center pointer-events-none">
      <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2 shadow-lg text-sm font-medium">
        <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        Calculating route…
      </div>
    </div>
  )
}

// ── Cluster icon factories ────────────────────────────────────────────────────

function makeClusterIcon(variant: ClusterVariant, count: number, color: string) {
  if (variant === "bubble") {
    const size = count > 99 ? 52 : count > 9 ? 44 : 36
    const html = `<div style="width:${size}px;height:${size}px;border-radius:50%;
      background:${color};color:#fff;font-weight:700;font-size:${count > 99 ? 11 : 13}px;
      font-family:sans-serif;display:flex;align-items:center;justify-content:center;
      border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);">${count}</div>`
    return L.divIcon({ html, className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2] })
  }
  if (variant === "donut") {
    const r = 20, stroke = 5, circ = 2 * Math.PI * r
    const dash = Math.min(count / 50, 1) * circ
    const html = `<svg width="54" height="54" viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="${r}" fill="none" stroke="${color}33" stroke-width="${stroke}"/>
      <circle cx="27" cy="27" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
        stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${circ / 4}" stroke-linecap="round"/>
      <circle cx="27" cy="27" r="${r - stroke - 2}" fill="${color}22"/>
      <text x="27" y="27" text-anchor="middle" dominant-baseline="middle"
        font-size="12" font-weight="700" fill="${color}" font-family="sans-serif">${count}</text>
    </svg>`
    return L.divIcon({ html, className: "", iconSize: [54, 54], iconAnchor: [27, 27] })
  }
  // default pill
  const w = count > 99 ? 52 : 40
  const html = `<div style="min-width:${w}px;height:28px;border-radius:14px;
    background:${color};color:#fff;font-weight:700;font-size:12px;font-family:sans-serif;
    display:flex;align-items:center;justify-content:center;
    padding:0 8px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25);">${count}</div>`
  return L.divIcon({ html, className: "", iconSize: [w, 28], iconAnchor: [w / 2, 14] })
}

// ── Cluster layer ─────────────────────────────────────────────────────────────

function ClusterLayer({ markers, variant, onMarkerClick }: {
  markers: MapMarker[]; variant: ClusterVariant; onMarkerClick?: (m: MapMarker) => void
}) {
  const map = useMap()
  const [zoom, setZoom] = React.useState(map.getZoom())

  React.useEffect(() => {
    const h = () => setZoom(map.getZoom())
    map.on("zoomend", h)
    return () => { map.off("zoomend", h) }
  }, [map])

  const GRID = 80
  const clusters = React.useMemo(() => {
    const groups: { center: { lat: number; lng: number }; items: MapMarker[] }[] = []
    const used = new Set<number>()
    markers.forEach((m, i) => {
      if (used.has(i)) return
      const pt = map.latLngToContainerPoint([m.lat, m.lng])
      const group: MapMarker[] = [m]
      used.add(i)
      markers.forEach((m2, j) => {
        if (used.has(j)) return
        const pt2 = map.latLngToContainerPoint([m2.lat, m2.lng])
        if (Math.abs(pt.x - pt2.x) < GRID && Math.abs(pt.y - pt2.y) < GRID) { group.push(m2); used.add(j) }
      })
      const lat = group.reduce((s, x) => s + x.lat, 0) / group.length
      const lng = group.reduce((s, x) => s + x.lng, 0) / group.length
      groups.push({ center: { lat, lng }, items: group })
    })
    return groups
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, zoom, map])

  return (
    <>
      {clusters.map((g, gi) => {
        if (g.items.length === 1) {
          const m = g.items[0]
          const color = resolveColor(m.color)
          return (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={makePinIcon(color, m.icon, m.image)}
              eventHandlers={{ click: () => onMarkerClick?.(m) }}>
              {m.popup ? <Popup>{m.popup}</Popup> : m.label && <Popup><span className="text-sm font-medium">{m.label}</span></Popup>}
            </Marker>
          )
        }
        const color = resolveColor(g.items[0].color)
        return (
          <Marker key={`c-${gi}`} position={[g.center.lat, g.center.lng]}
            icon={makeClusterIcon(variant, g.items.length, color)}
            eventHandlers={{ click: () => map.setView([g.center.lat, g.center.lng], map.getZoom() + 2) }}>
            <Popup>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {g.items.map(m => (
                  <div key={m.id} className="text-xs cursor-pointer hover:text-primary"
                    onClick={() => onMarkerClick?.(m)}>{m.label ?? `Marker ${m.id}`}</div>
                ))}
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}

// ── Fit bounds (markers only, routes fit themselves after fetch) ───────────────

function FitMarkerBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap()
  React.useEffect(() => {
    if (markers.length > 1) {
      map.fitBounds(L.latLngBounds(markers.map(m => [m.lat, m.lng])), { padding: [40, 40] })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

// ── Tile presets ──────────────────────────────────────────────────────────────

const TILE_LIGHT = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const TILE_DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
const ATTR_OSM   = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const ATTR_CARTO = '&copy; <a href="https://carto.com/">CARTO</a>'

// ── Main component ────────────────────────────────────────────────────────────

export function LeafletMap({
  center = [51.505, -0.09],
  zoom = 13,
  height = 480,
  markers = [],
  routes = [],
  cluster = false,
  clusterVariant = "default",
  tileUrl,
  tileAttribution,
  darkTile = false,
  className,
  onMarkerClick,
}: LeafletMapProps) {
  const tile = tileUrl ?? (darkTile ? TILE_DARK : TILE_LIGHT)
  const attr = tileAttribution ?? (darkTile ? ATTR_CARTO : ATTR_OSM)
  const h = typeof height === "number" ? `${height}px` : height

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl border border-border", className)} style={{ height: h }}>
      {routes.length > 0 && <RouteLoadingOverlay routes={routes} />}
      <MapContainer center={center} zoom={zoom} style={{ width: "100%", height: "100%" }} scrollWheelZoom>
        <TileLayer url={tile} attribution={attr} />

        {routes.length > 0 && <RouteLayer routes={routes} />}

        {markers.length > 1 && routes.length === 0 && <FitMarkerBounds markers={markers} />}

        {cluster ? (
          <ClusterLayer markers={markers} variant={clusterVariant} onMarkerClick={onMarkerClick} />
        ) : (
          markers.map(m => {
            const color = resolveColor(m.color)
            return (
              <Marker key={m.id} position={[m.lat, m.lng]} icon={makePinIcon(color, m.icon, m.image)}
                eventHandlers={{ click: () => onMarkerClick?.(m) }}>
                {m.popup ? <Popup>{m.popup}</Popup> : m.label && <Popup><span className="text-sm font-medium">{m.label}</span></Popup>}
              </Marker>
            )
          })
        )}
      </MapContainer>
    </div>
  )
}
