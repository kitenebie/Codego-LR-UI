import * as React from "react"

// Global registry for table data that should be searchable
const tableSearchRegistry = new Map<string, any[]>()

// Hook for components to register their table data for global search
export function useTableSearchRegistration(tableId: string, data: any[], options?: {
  searchFields?: string[]
  displayField?: string
  descriptionField?: string
  brand?: string
}) {
  React.useEffect(() => {
    if (data && data.length > 0) {
      tableSearchRegistry.set(tableId, data)
    }

    return () => {
      tableSearchRegistry.delete(tableId)
    }
  }, [tableId, data])

  return {
    registerData: (newData: any[]) => {
      tableSearchRegistry.set(tableId, newData)
    },
    unregister: () => {
      tableSearchRegistry.delete(tableId)
    }
  }
}

// Function to get all registered table records for search
export function getRegisteredTableRecords() {
  const records: any[] = []

  tableSearchRegistry.forEach((data, tableId) => {
    data.forEach((item, index) => {
      records.push({
        objectID: `table-${tableId}-${index}`,
        name: item.name || item.title || `Record ${index + 1}`,
        description: item.description || item.email || JSON.stringify(item).slice(0, 100),
        path: item.path || `/${tableId}`,
        brand: item.brand || "Table Data",
        type: "table-record",
        tableId,
        data: item
      })
    })
  })

  return records
}

// Function to search within registered table data
export function searchTableRecords(query: string) {
  if (!query.trim()) return []

  const allRecords = getRegisteredTableRecords()
  const lowerQuery = query.toLowerCase()

  return allRecords.filter(record =>
    record.name?.toLowerCase().includes(lowerQuery) ||
    record.description?.toLowerCase().includes(lowerQuery) ||
    record.brand?.toLowerCase().includes(lowerQuery)
  )
}