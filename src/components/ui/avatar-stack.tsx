import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface AvatarStackProps {
  images: string[]
  limit?: number
  stacked?: boolean
  shape?: "circle" | "square"
  size?: number
  className?: string
}

export function AvatarStack({
  images,
  limit = 3,
  stacked = true,
  shape = "square",
  size = 32,
  className,
}: AvatarStackProps) {
  const visible = images.slice(0, limit)
  const overflow = images.length - limit

  const radius = shape === "circle" ? "9999px" : "6px"
  const ring = "0 0 0 2px var(--background)"

  return (
    <div
      className={cn("flex items-center", stacked ? "" : "gap-1", className)}
    >
      {visible.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            boxShadow: stacked ? ring : undefined,
            marginLeft: stacked && i > 0 ? -(size * 0.3) : undefined,
            position: "relative",
            zIndex: visible.length - i,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      ))}

      {overflow > 0 && (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            boxShadow: stacked ? ring : undefined,
            marginLeft: stacked ? -(size * 0.3) : undefined,
            fontSize: size * 0.3,
            flexShrink: 0,
          }}
          className="flex items-center justify-center bg-muted border border-border text-muted-foreground font-semibold"
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
