"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"

interface PupopProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
    title: string
    description: string
}

const Pupop = ({ open, onOpenChange, children, title, description }: PupopProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default Pupop