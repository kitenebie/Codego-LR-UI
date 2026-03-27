import * as React from "react"
import { cn } from "@/src/lib/utils"

export type FlexDirection = "row" | "row-reverse" | "col" | "col-reverse"
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse"
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline"
export type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly"
export type FlexGap = "none" | "xs" | "sm" | "md" | "lg" | "xl"

export interface FlexLayoutProps {
  direction?: FlexDirection
  wrap?: FlexWrap
  gap?: FlexGap
  align?: FlexAlign
  justify?: FlexJustify
  inline?: boolean
  children: React.ReactNode
  className?: string
}

export interface FlexItemProps {
  grow?: boolean | number
  shrink?: boolean | number
  basis?: string
  order?: number
  alignSelf?: FlexAlign
  children: React.ReactNode
  className?: string
}

const dirMap: Record<FlexDirection, string> = {
  row: "flex-row", "row-reverse": "flex-row-reverse",
  col: "flex-col", "col-reverse": "flex-col-reverse",
}
const wrapMap: Record<FlexWrap, string> = {
  nowrap: "flex-nowrap", wrap: "flex-wrap", "wrap-reverse": "flex-wrap-reverse",
}
const gapMap: Record<FlexGap, string> = {
  none: "gap-0", xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8",
}
const alignMap: Record<FlexAlign, string> = {
  start: "items-start", center: "items-center", end: "items-end",
  stretch: "items-stretch", baseline: "items-baseline",
}
const justifyMap: Record<FlexJustify, string> = {
  start: "justify-start", center: "justify-center", end: "justify-end",
  between: "justify-between", around: "justify-around", evenly: "justify-evenly",
}
const selfMap: Record<FlexAlign, string> = {
  start: "self-start", center: "self-center", end: "self-end",
  stretch: "self-stretch", baseline: "self-baseline",
}

export function FlexLayout({
  direction = "row", wrap = "nowrap", gap = "md",
  align = "start", justify = "start",
  inline = false, children, className,
}: FlexLayoutProps) {
  return (
    <div className={cn(
      inline ? "inline-flex" : "flex",
      dirMap[direction],
      wrapMap[wrap],
      gapMap[gap],
      alignMap[align],
      justifyMap[justify],
      className
    )}>
      {children}
    </div>
  )
}

export function FlexItem({
  grow, shrink, basis, order, alignSelf, children, className,
}: FlexItemProps) {
  const style: React.CSSProperties = {}
  if (grow !== undefined) style.flexGrow = grow === true ? 1 : grow === false ? 0 : grow
  if (shrink !== undefined) style.flexShrink = shrink === true ? 1 : shrink === false ? 0 : shrink
  if (basis) style.flexBasis = basis
  if (order !== undefined) style.order = order

  return (
    <div
      className={cn(alignSelf && selfMap[alignSelf], className)}
      style={style}
    >
      {children}
    </div>
  )
}
