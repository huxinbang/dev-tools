"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Copy, Clock, Globe, Check, ChevronsUpDown, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

// Comprehensive timezone list
const timezones = [
  // UTC
  { value: "UTC", label: "UTC - Coordinated Universal Time", region: "UTC" },

  // Americas
  { value: "America/New_York", label: "America/New_York - Eastern Time", region: "Americas" },
  { value: "America/Chicago", label: "America/Chicago - Central Time", region: "Americas" },
  { value: "America/Denver", label: "America/Denver - Mountain Time", region: "Americas" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles - Pacific Time", region: "Americas" },
  { value: "America/Anchorage", label: "America/Anchorage - Alaska Time", region: "Americas" },
  { value: "Pacific/Honolulu", label: "Pacific/Honolulu - Hawaii Time", region: "Americas" },
  { value: "America/Toronto", label: "America/Toronto - Eastern Time (Canada)", region: "Americas" },
  { value: "America/Vancouver", label: "America/Vancouver - Pacific Time (Canada)", region: "Americas" },
  { value: "America/Mexico_City", label: "America/Mexico_City - Central Time (Mexico)", region: "Americas" },
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo - Brazil Time", region: "Americas" },
  {
    value: "America/Argentina/Buenos_Aires",
    label: "America/Argentina/Buenos_Aires - Argentina Time",
    region: "Americas",
  },
  { value: "America/Lima", label: "America/Lima - Peru Time", region: "Americas" },
  { value: "America/Bogota", label: "America/Bogota - Colombia Time", region: "Americas" },

  // Europe
  { value: "Europe/London", label: "Europe/London - Greenwich Mean Time", region: "Europe" },
  { value: "Europe/Paris", label: "Europe/Paris - Central European Time", region: "Europe" },
  { value: "Europe/Berlin", label: "Europe/Berlin - Central European Time", region: "Europe" },
  { value: "Europe/Rome", label: "Europe/Rome - Central European Time", region: "Europe" },
  { value: "Europe/Madrid", label: "Europe/Madrid - Central European Time", region: "Europe" },
  { value: "Europe/Amsterdam", label: "Europe/Amsterdam - Central European Time", region: "Europe" },
  { value: "Europe/Brussels", label: "Europe/Brussels - Central European Time", region: "Europe" },
  { value: "Europe/Zurich", label: "Europe/Zurich - Central European Time", region: "Europe" },
  { value: "Europe/Vienna", label: "Europe/Vienna - Central European Time", region: "Europe" },
  { value: "Europe/Prague", label: "Europe/Prague - Central European Time", region: "Europe" },
  { value: "Europe/Warsaw", label: "Europe/Warsaw - Central European Time", region: "Europe" },
  { value: "Europe/Stockholm", label: "Europe/Stockholm - Central European Time", region: "Europe" },
  { value: "Europe/Helsinki", label: "Europe/Helsinki - Eastern European Time", region: "Europe" },
  { value: "Europe/Athens", label: "Europe/Athens - Eastern European Time", region: "Europe" },
  { value: "Europe/Moscow", label: "Europe/Moscow - Moscow Standard Time", region: "Europe" },
  { value: "Europe/Istanbul", label: "Europe/Istanbul - Turkey Time", region: "Europe" },

  // Asia
  { value: "Asia/Tokyo", label: "Asia/Tokyo - Japan Standard Time", region: "Asia" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai - China Standard Time", region: "Asia" },
  { value: "Asia/Hong_Kong", label: "Asia/Hong_Kong - Hong Kong Time", region: "Asia" },
  { value: "Asia/Singapore", label: "Asia/Singapore - Singapore Time", region: "Asia" },
  { value: "Asia/Seoul", label: "Asia/Seoul - Korea Standard Time", region: "Asia" },
  { value: "Asia/Taipei", label: "Asia/Taipei - Taipei Time", region: "Asia" },
  { value: "Asia/Bangkok", label: "Asia/Bangkok - Indochina Time", region: "Asia" },
  { value: "Asia/Jakarta", label: "Asia/Jakarta - Western Indonesia Time", region: "Asia" },
  { value: "Asia/Manila", label: "Asia/Manila - Philippine Time", region: "Asia" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata - India Standard Time", region: "Asia" },
  { value: "Asia/Dubai", label: "Asia/Dubai - Gulf Standard Time", region: "Asia" },
  { value: "Asia/Riyadh", label: "Asia/Riyadh - Arabia Standard Time", region: "Asia" },
  { value: "Asia/Tehran", label: "Asia/Tehran - Iran Standard Time", region: "Asia" },
  { value: "Asia/Karachi", label: "Asia/Karachi - Pakistan Standard Time", region: "Asia" },
  { value: "Asia/Dhaka", label: "Asia/Dhaka - Bangladesh Standard Time", region: "Asia" },
  { value: "Asia/Kathmandu", label: "Asia/Kathmandu - Nepal Time", region: "Asia" },
  { value: "Asia/Colombo", label: "Asia/Colombo - Sri Lanka Time", region: "Asia" },

  // Africa
  { value: "Africa/Cairo", label: "Africa/Cairo - Eastern European Time", region: "Africa" },
  { value: "Africa/Lagos", label: "Africa/Lagos - West Africa Time", region: "Africa" },
  { value: "Africa/Johannesburg", label: "Africa/Johannesburg - South Africa Standard Time", region: "Africa" },
  { value: "Africa/Nairobi", label: "Africa/Nairobi - East Africa Time", region: "Africa" },
  { value: "Africa/Casablanca", label: "Africa/Casablanca - Western European Time", region: "Africa" },

  // Oceania
  { value: "Australia/Sydney", label: "Australia/Sydney - Australian Eastern Time", region: "Oceania" },
  { value: "Australia/Melbourne", label: "Australia/Melbourne - Australian Eastern Time", region: "Oceania" },
  { value: "Australia/Brisbane", label: "Australia/Brisbane - Australian Eastern Time", region: "Oceania" },
  { value: "Australia/Perth", label: "Australia/Perth - Australian Western Time", region: "Oceania" },
  { value: "Australia/Adelaide", label: "Australia/Adelaide - Australian Central Time", region: "Oceania" },
  { value: "Pacific/Auckland", label: "Pacific/Auckland - New Zealand Time", region: "Oceania" },
  { value: "Pacific/Fiji", label: "Pacific/Fiji - Fiji Time", region: "Oceania" },
]

interface TimestampToolState {
  timestamp: string
  datetime: string
  timezone: string
  convertedTimes: Array<{ timezone: string; time: string }>
}

const initialState: TimestampToolState = {
  timestamp: "",
  datetime: "",
  timezone: "UTC",
  convertedTimes: [],
}

export function TimestampTool() {
  const [state, setState] = useLocalStorage<TimestampToolState>("timestamp-tool-state", initialState)
  const [open, setOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { toast } = useToast()
  const { t } = useTranslation()

  const updateState = (updates: Partial<TimestampToolState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDateInTimezone = (date: Date, tz: string): string => {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
        .format(date)
        .replace(", ", "T")
    } catch (error) {
      return "Invalid timezone"
    }
  }

  const getTimezoneOffset = (date: Date, tz: string): string => {
    try {
      const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
      const tzDate = new Date(date.toLocaleString("en-US", { timeZone: tz }))
      const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60)
      const hours = Math.floor(Math.abs(offset) / 60)
      const minutes = Math.abs(offset) % 60
      const sign = offset >= 0 ? "+" : "-"
      return `${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    } catch (error) {
      return "+00:00"
    }
  }

  const handleTimestampToDate = () => {
    try {
      const ts = Number.parseInt(state.timestamp)
      if (isNaN(ts)) {
        throw new Error("Invalid timestamp")
      }

      // Handle both seconds and milliseconds
      const date = new Date(ts.toString().length === 10 ? ts * 1000 : ts)
      const formattedDate = formatDateInTimezone(date, state.timezone)

      // Show conversions in multiple timezones
      const conversions = [
        { timezone: "UTC", time: formatDateInTimezone(date, "UTC") },
        { timezone: "America/New_York", time: formatDateInTimezone(date, "America/New_York") },
        { timezone: "Europe/London", time: formatDateInTimezone(date, "Europe/London") },
        { timezone: "Asia/Tokyo", time: formatDateInTimezone(date, "Asia/Tokyo") },
      ].filter((conv) => conv.timezone !== state.timezone)

      updateState({ datetime: formattedDate, convertedTimes: conversions })
    } catch (error) {
      toast({
        title: t.messages.error,
        description: t.timestamp.invalidTimestampFormat,
        variant: "destructive",
      })
    }
  }

  const handleDateToTimestamp = () => {
    try {
      if (!state.datetime) {
        throw new Error("Invalid date")
      }

      // Parse the datetime string and convert to timestamp
      // The datetime input is in the selected timezone
      const date = new Date(state.datetime + (state.timezone === "UTC" ? "Z" : ""))

      if (state.timezone !== "UTC") {
        // For non-UTC timezones, we need to adjust for the timezone offset
        const tempDate = new Date(state.datetime)
        const utcTime = tempDate.getTime() + tempDate.getTimezoneOffset() * 60000

        // Get the offset for the selected timezone
        const targetDate = new Date()
        const utcDate = new Date(targetDate.toLocaleString("en-US", { timeZone: "UTC" }))
        const tzDate = new Date(targetDate.toLocaleString("en-US", { timeZone: state.timezone }))
        const tzOffset = tzDate.getTime() - utcDate.getTime()

        const finalDate = new Date(utcTime - tzOffset)
        updateState({ timestamp: Math.floor(finalDate.getTime() / 1000).toString() })
      } else {
        updateState({ timestamp: Math.floor(date.getTime() / 1000).toString() })
      }
    } catch (error) {
      toast({
        title: t.messages.error,
        description: t.timestamp.invalidDateFormat,
        variant: "destructive",
      })
    }
  }

  const handleCopyTimestamp = async () => {
    try {
      await navigator.clipboard.writeText(state.timestamp)
      toast({
        title: t.messages.copied,
        description: t.timestamp.timestampCopied,
      })
    } catch (error) {
      toast({
        title: t.messages.error,
        description: t.messages.failedToCopy,
        variant: "destructive",
      })
    }
  }

  const handleCopyDatetime = async () => {
    try {
      await navigator.clipboard.writeText(state.datetime)
      toast({
        title: t.messages.copied,
        description: t.timestamp.datetimeCopied,
      })
    } catch (error) {
      toast({
        title: t.messages.error,
        description: t.messages.failedToCopy,
        variant: "destructive",
      })
    }
  }

  const handleClearHistory = () => {
    setState(initialState)
    toast({
      title: t.messages.historyCleared,
      description: t.messages.dataCleared,
    })
  }

  const setCurrentTimestamp = () => {
    updateState({ timestamp: Math.floor(currentTime.getTime() / 1000).toString() })
  }

  const setCurrentDatetime = () => {
    const formatted = formatDateInTimezone(currentTime, state.timezone)
    updateState({ datetime: formatted })
  }

  const currentTimeInTimezone = formatDateInTimezone(currentTime, state.timezone)
  const currentOffset = getTimezoneOffset(currentTime, state.timezone)
  const selectedTimezone = timezones.find((tz) => tz.value === state.timezone)

  // Group timezones by region for better organization
  const groupedTimezones = timezones.reduce(
    (acc, tz) => {
      if (!acc[tz.region]) {
        acc[tz.region] = []
      }
      acc[tz.region].push(tz)
      return acc
    },
    {} as Record<string, typeof timezones>,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{t.timestamp.title}</h1>
          <p className="text-muted-foreground mt-2">{t.timestamp.description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearHistory} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          {t.common.clearHistory}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t.timestamp.timezoneSettings}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="timezone">{t.timestamp.selectTimezone}</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {selectedTimezone ? selectedTimezone.label : t.timestamp.selectTimezonePlaceholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t.timestamp.searchTimezone} />
                    <CommandList>
                      <CommandEmpty>{t.timestamp.noTimezoneFound}</CommandEmpty>
                      {Object.entries(groupedTimezones).map(([region, tzList]) => (
                        <CommandGroup key={region} heading={region}>
                          {tzList.map((tz) => (
                            <CommandItem
                              key={tz.value}
                              value={tz.label}
                              onSelect={() => {
                                updateState({ timezone: tz.value })
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  state.timezone === tz.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {tz.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="text-sm text-muted-foreground">
              {t.timestamp.currentOffset}: {currentOffset}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t.timestamp.currentTime} ({state.timezone})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>{t.timestamp.currentUnixTimestamp}</Label>
              <div className="flex gap-2 mt-1">
                <Input value={Math.floor(currentTime.getTime() / 1000)} readOnly className="font-mono" />
                <Button variant="outline" onClick={setCurrentTimestamp}>
                  {t.common.use}
                </Button>
              </div>
            </div>
            <div>
              <Label>{t.timestamp.currentDateTime}</Label>
              <div className="flex gap-2 mt-1">
                <Input value={currentTimeInTimezone} readOnly className="font-mono" />
                <Button variant="outline" onClick={setCurrentDatetime}>
                  {t.common.use}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.timestamp.unixTimestamp}</CardTitle>
            <CardDescription>{t.timestamp.enterUnixTimestamp}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="1640995200"
              value={state.timestamp}
              onChange={(e) => updateState({ timestamp: e.target.value })}
              className="font-mono"
            />
            <div className="flex gap-2">
              <Button onClick={handleTimestampToDate} disabled={!state.timestamp.trim()} className="flex-1">
                {t.timestamp.convertToDate}
              </Button>
              <Button variant="outline" onClick={handleCopyTimestamp} disabled={!state.timestamp}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t.timestamp.dateTime} ({state.timezone})
            </CardTitle>
            <CardDescription>{t.timestamp.enterDateTime}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="datetime-local"
              value={state.datetime}
              onChange={(e) => updateState({ datetime: e.target.value })}
              className="font-mono"
            />
            <div className="flex gap-2">
              <Button onClick={handleDateToTimestamp} disabled={!state.datetime.trim()} className="flex-1">
                {t.timestamp.convertToTimestamp}
              </Button>
              <Button variant="outline" onClick={handleCopyDatetime} disabled={!state.datetime}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {state.convertedTimes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.timestamp.otherTimezones}</CardTitle>
            <CardDescription>{t.timestamp.sameTimestamp}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {state.convertedTimes.map((conv) => (
                <div key={conv.timezone} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm font-medium">{conv.timezone}</span>
                  <span className="font-mono text-sm">{conv.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
