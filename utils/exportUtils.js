import { jsPDF } from "jspdf"
import "jspdf-autotable"

export function exportToCSV(rows) {
  try {
    const headers = ["Label 1", "Label 2", "Created At"]
    const data = rows.map((row) => [
      row.column1?.label || "",
      row.column2.map((o) => o.label).join(", ") || "",
      new Date(row.createdAt).toLocaleString(),
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `table-export-${new Date().toISOString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error exporting CSV:", error)
    throw new Error("Failed to export CSV: " + error.message)
  }
}

export function exportToPDF(rows) {
  try {
    const doc = new jsPDF()
    const headers = ["Label 1", "Label 2", "Created At"]
    const data = rows.map((row) => [
      row.column1?.label || "",
      row.column2.map((o) => o.label).join(", ") || "",
      new Date(row.createdAt).toLocaleString(),
    ])

    doc.autoTable({
      head: [headers],
      body: data,
    })

    doc.save(`table-export-${new Date().toISOString()}.pdf`)
  } catch (error) {
    console.error("Error exporting PDF:", error)
    throw new Error("Failed to export PDF: " + error.message)
  }
}

