import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/src/lib/utils"

export interface PaginationProps {
  page: number
  total: number
  pageSize?: number
  siblingCount?: number
  showFirstLast?: boolean
  showPageSize?: boolean
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  className?: string
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function usePages(page: number, totalPages: number, siblingCount: number) {
  const DOTS = "..."
  if (totalPages <= 7) return range(1, totalPages)

  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, totalPages)

  const showLeft = leftSibling > 2
  const showRight = rightSibling < totalPages - 1

  if (!showLeft && showRight) return [...range(1, 3 + siblingCount * 2), DOTS, totalPages]
  if (showLeft && !showRight) return [1, DOTS, ...range(totalPages - 2 - siblingCount * 2, totalPages)]
  return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, totalPages]
}

const btnBase = "inline-flex items-center justify-center h-8 min-w-8 px-1 rounded-md text-sm font-medium transition-colors select-none"

export function Pagination({
  page,
  total,
  pageSize = 10,
  siblingCount = 1,
  showFirstLast = false,
  showPageSize = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pages = usePages(page, totalPages, siblingCount)

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {showFirstLast && (
        <button
          className={cn(btnBase, "text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:pointer-events-none")}
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      )}

      <button
        className={cn(btnBase, "text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:pointer-events-none")}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="flex items-center justify-center h-8 w-8 text-sm text-muted-foreground select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                btnBase,
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className={cn(btnBase, "text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:pointer-events-none")}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {showFirstLast && (
        <button
          className={cn(btnBase, "text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:pointer-events-none")}
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      )}

      {showPageSize && onPageSizeChange && (
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="ml-2 h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>{s} / page</option>
          ))}
        </select>
      )}

      <span className="text-xs text-muted-foreground ml-1">
        {total} total
      </span>
    </div>
  )
}
