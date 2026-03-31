import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { GlobalSearchInput } from "./global-search-input"
import { getRegisteredTableRecords } from "../../hooks/use-table-search"
import { useNavigate } from "react-router-dom"

export interface GlobalSearchRecord {
  objectID: string
  name: string
  description?: string
  path?: string
  brand?: string
  type?: string
  [key: string]: any
}

interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchRecords?: GlobalSearchRecord[]
  recordTitleAttribute?: string
  globalSearchDescriptionAttribute?: string
  globalSearchResultsLimit?: number
  onGlobalSearchSelect?: (record: GlobalSearchRecord) => void
  placeholder?: string
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  searchRecords = [],
  recordTitleAttribute = "name",
  globalSearchDescriptionAttribute = "description",
  globalSearchResultsLimit = 8,
  onGlobalSearchSelect,
  placeholder = "Search pages…",
}: GlobalSearchModalProps) {
  const [query, setQuery] = React.useState("")
  const modalRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setQuery("")
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Merge static records with dynamically registered table records
  const allSearchRecords = React.useMemo(() => {
    const tableRecords = getRegisteredTableRecords()
    return [...searchRecords, ...tableRecords]
  }, [searchRecords])

  // Filter records based on search query
  const filteredRecords = React.useMemo(() => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    return allSearchRecords
      .filter(record =>
        record[recordTitleAttribute]?.toLowerCase().includes(lowerQuery) ||
        record[globalSearchDescriptionAttribute]?.toLowerCase().includes(lowerQuery) ||
        record.brand?.toLowerCase().includes(lowerQuery) ||
        record.symbol?.toLowerCase().includes(lowerQuery) ||
        record.email?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, globalSearchResultsLimit)
  }, [query, allSearchRecords, recordTitleAttribute, globalSearchDescriptionAttribute, globalSearchResultsLimit])

  function handleSelect(record: GlobalSearchRecord) {
    onGlobalSearchSelect?.(record)
    if (record.path) {
      // Handle section links with anchors
      if (record.path.includes('#')) {
        const [path, hash] = record.path.split('#')
        navigate(path)
        // Scroll to section after navigation
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      } else {
        navigate(record.path)
      }
    }
    onClose()
  }

  function handleQueryChange(value: string) {
    setQuery(value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl z-[500] bg-background rounded-lg shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Search</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-accent transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <GlobalSearchInput
            ref={inputRef}
            value={query}
            onChange={handleQueryChange}
            placeholder={placeholder}
            className="w-full"
            showClearButton={false}
          />
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() ? (
            filteredRecords.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredRecords.map((record) => (
                  <article
                    key={record.objectID}
                    className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => handleSelect(record)}
                  >
                    <Search className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {record[recordTitleAttribute]}
                      </p>
                      {globalSearchDescriptionAttribute && record[globalSearchDescriptionAttribute] && (
                        <p className="truncate text-xs text-muted-foreground mt-1">
                          {record[globalSearchDescriptionAttribute]}
                        </p>
                      )}
                      {record.brand && (
                        <p className="text-xs text-primary mt-1">
                          {record.brand} {record.type && `• ${record.type}`}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            )
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Start typing to search...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}