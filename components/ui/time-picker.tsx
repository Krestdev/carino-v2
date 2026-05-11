"use client"

import * as React from "react"
import { format } from "date-fns"
import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function TimePicker({ placeholder, value, onChangeValue }: { placeholder: string, value: Date, onChangeValue: (value: Date) => void }) {
    const [open, setOpen] = React.useState(false)

    const hours = Array.from({ length: 24 }, (_, i) => i)
    const minutes = [0, 15, 30, 45]

    const handleTimeChange = (type: "hour" | "minute", val: number) => {
        const newDate = value ? new Date(value) : new Date()
        if (type === "hour") newDate.setHours(val)
        if (type === "minute") newDate.setHours(newDate.getHours(), val)

        onChangeValue(newDate)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        "bg-gray-50 hover:bg-gray-100 border-b border-[#4B5563] text-black justify-between text-left font-normal w-full h-11",
                        !value && "text-muted-foreground"
                    )}
                >
                    {value ? format(value, "HH:mm") : <span>{placeholder}</span>}
                    <Clock className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex h-64 divide-x">
                    {/* Colonne des Heures */}
                    <ScrollArea className="w-20 h-full">
                        <div className="flex flex-col p-2">
                            {hours.map((hour) => (
                                <Button
                                    key={hour}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "w-full justify-center font-normal",
                                        value?.getHours() === hour ? "bg-[#FFC336] text-white hover:bg-[#FFC336] hover:text-white" : "hover:bg-gray-100"
                                    )}
                                    onClick={() => handleTimeChange("hour", hour)}
                                >
                                    {hour.toString().padStart(2, '0')}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Colonne des Minutes */}
                    <ScrollArea className="w-20 h-full">
                        <div className="flex flex-col p-2">
                            {minutes.map((minute) => (
                                <Button
                                    key={minute}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "w-full justify-center font-normal",
                                        value?.getMinutes() === minute ? "bg-[#FFC336] text-white hover:bg-[#FFC336] hover:text-white" : "hover:bg-gray-100"
                                    )}
                                    onClick={() => handleTimeChange("minute", minute)}
                                >
                                    {minute.toString().padStart(2, '0')}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Footer optionnel pour fermer ou valider */}
                <div className="p-2 border-t border-border bg-gray-50">
                    <Button
                        variant="outline"
                        className="w-full h-8 text-xs"
                        onClick={() => setOpen(false)}
                    >
                        Valider
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}