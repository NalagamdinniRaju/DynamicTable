import { DynamicTable } from "@/components/DynamicTable"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <h1 className="text-3xl font-bold mb-6">Dynamic Table</h1>
      <DynamicTable />
    </div>
  )
}

