import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string
  maxWidth?: string
  orientation?: "vertical" | "horizontal" | "both"
}

export function ScrollArea({
  maxHeight,
  maxWidth,
  orientation = "vertical",
  className,
  children,
  style,
  ...props
}: ScrollAreaProps) {
  const overflowClass = {
    vertical:   "overflow-y-auto overflow-x-hidden",
    horizontal: "overflow-x-auto overflow-y-hidden",
    both:       "overflow-auto",
  }[orientation]

  return (
    <div
      className={cn(
        "relative",
        overflowClass,
        // Custom scrollbar styling
        "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40",
        className
      )}
      style={{ maxHeight, maxWidth, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}
