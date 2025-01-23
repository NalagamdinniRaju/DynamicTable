"use client";

import React, { useState, useMemo } from "react"
import { ArrowUpDown, FileDown, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SingleSelectDropdown } from "./SingleSelectDropdown"
import { MultiSelectDropdown } from "./MultiSelectDropdown"
import { useTableState } from "../hooks/useTableState"
import { exportToCSV, exportToPDF } from "../utils/exportUtils"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const initialOptions1 = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
  { id: "4", label: "Option 4" },
]

export function DynamicTable() {
  const { state, dispatch } = useTableState()
  const [sortColumn1, setSortColumn1] = useState(null)
  const [sortColumn2, setSortColumn2] = useState(null)

  useHotkeys("ctrl+n", (e) => {
    e.preventDefault()
    handleAddRow()
    toast.success("New row added")
  })

  const handleAddRow = () => {
    dispatch({ type: "ADD_ROW" })
  }

  const handleDeleteRow = (id) => {
    dispatch({ type: "DELETE_ROW", payload: id })
    toast.success("Row deleted")
  }

  const handleColumn1Select = (rowId, option) => {
    dispatch({
      type: "UPDATE_ROW",
      payload: { id: rowId, updates: { column1: option } },
    })
  }

  const handleColumn2Select = (rowId, option) => {
    const row = state.rows.find((r) => r.id === rowId)
    if (row) {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          id: rowId,
          updates: { column2: [...row.column2, option] },
        },
      })
    }
  }

  const handleColumn2Remove = (rowId, option) => {
    const row = state.rows.find((r) => r.id === rowId)
    if (row) {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          id: rowId,
          updates: {
            column2: row.column2.filter((item) => item.id !== option.id),
          },
        },
      })
    }
  }

  const handleAddOption2 = (label) => {
    const newOption = {
      id: crypto.randomUUID(),
      label,
    }
    dispatch({ type: "ADD_OPTION", payload: newOption })
    toast.success("New option added")
  }

  const getUsedColumn1Options = () => state.rows.map((row) => row.column1).filter((option) => option !== null)

  const handleExport = (format) => {
    if (state.rows && state.rows.length > 0) {
      try {
        if (format === "csv") {
          exportToCSV(state.rows)
          toast.success("Table exported to CSV")
        } else if (format === "pdf") {
          exportToPDF(state.rows)
          toast.success("Table exported to PDF")
        }
      } catch (error) {
        console.error(`Error exporting ${format.toUpperCase()}:`, error)
        toast.error(`Failed to export ${format.toUpperCase()}: ${error.message}`)
      }
    } else {
      toast.error("No data to export")
    }
  }

  const toggleSort = (column) => {
    if (column === "column1") {
      setSortColumn1((prev) => (prev === "asc" ? "desc" : "asc"))
      setSortColumn2(null)
    } else {
      setSortColumn2((prev) => (prev === "asc" ? "desc" : "asc"))
      setSortColumn1(null)
    }
  }

  const sortedRows = useMemo(() => {
    if (!state.rows || state.rows.length === 0) return []

    const sorted = [...state.rows]
    if (sortColumn1) {
      sorted.sort((a, b) => {
        const aVal = a.column1?.label || ""
        const bVal = b.column1?.label || ""
        return sortColumn1 === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      })
    }
    if (sortColumn2) {
      sorted.sort((a, b) => {
        const aVal = a.column2.map((o) => o.label).join(",")
        const bVal = b.column2.map((o) => o.label).join(",")
        return sortColumn2 === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      })
    }
    return sorted
  }, [state.rows, sortColumn1, sortColumn2])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      <div className="rounded-md border overflow-x-auto dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button variant="ghost" onClick={() => toggleSort("column1")} className="h-8 flex items-center gap-1">
                  Label 1
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="min-w-[300px]">
                <Button variant="ghost" onClick={() => toggleSort("column2")} className="h-8 flex items-center gap-1">
                  Label 2
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.id} className="group">
                <TableCell className="p-2 sm:p-4">
                  <SingleSelectDropdown
                    options={initialOptions1}
                    selected={row.column1}
                    onSelect={(option) => handleColumn1Select(row.id, option)}
                    usedOptions={getUsedColumn1Options()}
                  />
                </TableCell>
                <TableCell className="p-2 sm:p-4">
                  <MultiSelectDropdown
                    options={state.options2}
                    selected={row.column2}
                    onSelect={(option) => handleColumn2Select(row.id, option)}
                    onRemove={(option) => handleColumn2Remove(row.id, option)}
                    onAdd={handleAddOption2}
                  />
                </TableCell>
                <TableCell className="p-2 sm:p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRow(row.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        onClick={handleAddRow}
        className="w-full sm:w-auto transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
      >
        <Plus className="mr-2 h-4 w-4" /> Add New Row
      </Button>
    </div>
  )
}

