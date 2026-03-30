import * as React from "react"
import { animate } from "animejs"
import { cn } from "@/src/lib/utils"

export type AnimationType =
  | "fade-in"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "zoom-out"
  | "flip-x"
  | "flip-y"
  | "bounce"
  | "rotate-in"
  | "none"

export interface AnimateProps extends React.HTMLAttributes<HTMLDivElement> {
  animationType?: AnimationType
  duration?: number
  delay?: number
  easing?: string
  once?: boolean
  children: React.ReactNode
}

const PRESETS: Record<AnimationType, { from: Record<string, any>; to: Record<string, any> }> = {
  "fade-in":    { from: { opacity: 0 },                          to: { opacity: 1 } },
  "slide-up":   { from: { opacity: 0, translateY: 24 },          to: { opacity: 1, translateY: 0 } },
  "slide-down": { from: { opacity: 0, translateY: -24 },         to: { opacity: 1, translateY: 0 } },
  "slide-left": { from: { opacity: 0, translateX: 24 },          to: { opacity: 1, translateX: 0 } },
  "slide-right":{ from: { opacity: 0, translateX: -24 },         to: { opacity: 1, translateX: 0 } },
  "zoom-in":    { from: { opacity: 0, scale: 0.85 },             to: { opacity: 1, scale: 1 } },
  "zoom-out":   { from: { opacity: 0, scale: 1.15 },             to: { opacity: 1, scale: 1 } },
  "flip-x":     { from: { opacity: 0, rotateX: 90 },             to: { opacity: 1, rotateX: 0 } },
  "flip-y":     { from: { opacity: 0, rotateY: 90 },             to: { opacity: 1, rotateY: 0 } },
  "bounce":     { from: { opacity: 0, translateY: -32, scale: 0.9 }, to: { opacity: 1, translateY: 0, scale: 1 } },
  "rotate-in":  { from: { opacity: 0, rotate: -15, scale: 0.9 }, to: { opacity: 1, rotate: 0, scale: 1 } },
  "none":       { from: {},                                       to: {} },
}

export function Animate({
  animationType = "fade-in",
  duration = 500,
  delay = 0,
  easing = "easeOutQuart",
  once = true,
  className,
  children,
  ...props
}: AnimateProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const played = React.useRef(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el || animationType === "none") return

    const preset = PRESETS[animationType]

    // Apply initial state immediately
    Object.assign(el.style, toInlineStyle(preset.from))

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        if (once && played.current) return
        played.current = true

        animate(el, {
          ...preset.to,
          duration,
          delay,
          easing,
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animationType, duration, delay, easing, once])

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function toInlineStyle(from: Record<string, any>): Partial<CSSStyleDeclaration> {
  const style: Record<string, string> = {}
  if ("opacity" in from) style.opacity = String(from.opacity)
  const transforms: string[] = []
  if ("translateY" in from) transforms.push(`translateY(${from.translateY}px)`)
  if ("translateX" in from) transforms.push(`translateX(${from.translateX}px)`)
  if ("scale" in from) transforms.push(`scale(${from.scale})`)
  if ("rotate" in from) transforms.push(`rotate(${from.rotate}deg)`)
  if ("rotateX" in from) transforms.push(`rotateX(${from.rotateX}deg)`)
  if ("rotateY" in from) transforms.push(`rotateY(${from.rotateY}deg)`)
  if (transforms.length) style.transform = transforms.join(" ")
  return style as Partial<CSSStyleDeclaration>
}
