import React, { useState } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export function MultiSelectDropdown({ options, selected, onSelect, onRemove, onAdd }) {
  const [open, setOpen] = useState(false)
  const [newItem, setNewItem] = useState("")

  const handleAddItem = (e) => {
    e.preventDefault()
    if (newItem.trim()) {
      onAdd(newItem.trim())
      setNewItem("")
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-sm sm:text-base"
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((option) => (
                <Badge
                  key={option.id}
                  variant="secondary"
                  className="mr-1 text-xs sm:text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(option)
                  }}
                >
                  {option.label} ×
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">Select options...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search options..." className="text-sm sm:text-base" />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => {
                    if (selected.some((item) => item.id === option.id)) {
                      onRemove(option)
                    } else {
                      onSelect(option)
                    }
                  }}
                  className="text-sm sm:text-base"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.some((item) => item.id === option.id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
              <div className="flex items-center gap-2 p-2 border-t">
                <Input
                  placeholder="Add new item"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddItem(e)
                    }
                  }}
                  className="text-sm sm:text-base"
                />
                <Button size="sm" className="px-2" onClick={handleAddItem} disabled={!newItem.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

