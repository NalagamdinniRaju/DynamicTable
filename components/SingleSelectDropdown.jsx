import React, { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function SingleSelectDropdown({ options, selected, onSelect, usedOptions }) {
  const [open, setOpen] = useState(false)

  const availableOptions = options.filter(
    (option) => !usedOptions.some((used) => used.id === option.id) || selected?.id === option.id,
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-sm sm:text-base"
        >
          <span className="truncate">{selected ? selected.label : "Select option..."}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search options..." className="text-sm sm:text-base" />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {availableOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => {
                    onSelect(option)
                    setOpen(false)
                  }}
                  className="text-sm sm:text-base"
                >
                  <Check className={cn("mr-2 h-4 w-4", selected?.id === option.id ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

