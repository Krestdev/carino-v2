"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarDays } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ placeholder, value, onChangeValue }: { placeholder: string, value: Date, onChangeValue: (value: Date) => void }) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    className="bg-gray-50 hover:bg-gray-50 border-b border-[#4B5563] text-black justify-between text-left font-normal w-full"
                >
                    {value ? format(value, "PPP") : <span className="text-muted-foreground">{placeholder}</span>}
                    <CalendarDays opacity={50} className="ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(date) => {
                        if (date) {
                            onChangeValue(date)
                            setOpen(false)
                        }
                    }}
                    defaultMonth={value}
                />
            </PopoverContent>
        </Popover>
    )
}