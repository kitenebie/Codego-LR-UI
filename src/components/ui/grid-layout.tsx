import * as React from "react"
import { cn } from "@/src/lib/utils"

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12
export type GridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl"
export type GridAlign = "start" | "center" | "end" | "stretch"

export interface GridLayoutProps {
  cols?: GridCols
  smCols?: GridCols
  mdCols?: GridCols
  lgCols?: GridCols
  gap?: GridGap
  rowGap?: GridGap
  colGap?: GridGap
  align?: GridAlign
  justify?: GridAlign
  children: React.ReactNode
  className?: string
}

export interface GridItemProps {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | "full"
  rowSpan?: 1 | 2 | 3
  children: React.ReactNode
  className?: string
}

const colsMap: Record<GridCols, string> = {
  1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3",
  4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6", 12: "grid-cols-12",
}
const smColsMap: Record<GridCols, string> = {
  1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3",
  4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6", 12: "sm:grid-cols-12",
}
const mdColsMap: Record<GridCols, string> = {
  1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3",
  4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6", 12: "md:grid-cols-12",
}
const lgColsMap: Record<GridCols, string> = {
  1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3",
  4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6", 12: "lg:grid-cols-12",
}
const gapMap: Record<GridGap, string> = {
  none: "gap-0", xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8",
}
const rowGapMap: Record<GridGap, string> = {
  none: "gap-y-0", xs: "gap-y-1", sm: "gap-y-2", md: "gap-y-4", lg: "gap-y-6", xl: "gap-y-8",
}
const colGapMap: Record<GridGap, string> = {
  none: "gap-x-0", xs: "gap-x-1", sm: "gap-x-2", md: "gap-x-4", lg: "gap-x-6", xl: "gap-x-8",
}
const alignMap: Record<GridAlign, string> = {
  start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch",
}
const justifyMap: Record<GridAlign, string> = {
  start: "justify-items-start", center: "justify-items-center",
  end: "justify-items-end", stretch: "justify-items-stretch",
}
const spanMap: Record<string, string> = {
  1: "col-span-1", 2: "col-span-2", 3: "col-span-3", 4: "col-span-4",
  5: "col-span-5", 6: "col-span-6", 12: "col-span-12", full: "col-span-full",
}
const rowSpanMap: Record<number, string> = { 1: "row-span-1", 2: "row-span-2", 3: "row-span-3" }

export function GridLayout({
  cols = 3, smCols, mdCols, lgCols,
  gap = "md", rowGap, colGap,
  align = "stretch", justify = "stretch",
  children, className,
}: GridLayoutProps) {
  return (
    <div className={cn(
      "grid",
      colsMap[cols],
      smCols && smColsMap[smCols],
      mdCols && mdColsMap[mdCols],
      lgCols && lgColsMap[lgCols],
      rowGap ? rowGapMap[rowGap] : colGap ? "" : gapMap[gap],
      rowGap && rowGapMap[rowGap],
      colGap && colGapMap[colGap],
      alignMap[align],
      justifyMap[justify],
      className
    )}>
      {children}
    </div>
  )
}

export function GridItem({ span, rowSpan, children, className }: GridItemProps) {
  return (
    <div className={cn(
      span && spanMap[String(span)],
      rowSpan && rowSpanMap[rowSpan],
      className
    )}>
      {children}
    </div>
  )
}
