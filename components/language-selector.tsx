"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Check, Languages } from "lucide-react"
import { useTranslation, type Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useState } from "react"

const languages = [
  { code: "en" as Language, name: "English" },
  { code: "zh" as Language, name: "中文" },
  { code: "fr" as Language, name: "Français" },
]

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation()
  const [open, setOpen] = useState(false)

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Languages className="mr-2 h-4 w-4" />
          {currentLanguage?.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.code}
                  value={lang.code}
                  onSelect={() => {
                    setLanguage(lang.code)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", language === lang.code ? "opacity-100" : "opacity-0")} />
                  {lang.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
