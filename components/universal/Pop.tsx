"use client"

import { useState } from "react"
import Pupop from "./pupop"

// Ce fichier doit souvre apres 7 seconde sur le site apres le chargemet de la page d'accueil

export default function Pop() {
    const [open, setOpen] = useState(false)
    setTimeout(() => {
        setOpen(true)
    }, 10000)
    return (
        <>
            <Pupop open={open} onOpenChange={setOpen} title="Test" description="Test" >
                <p>Test</p>
            </Pupop>
        </>
    )
}