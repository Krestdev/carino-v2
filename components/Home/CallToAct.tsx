"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

const CallToAct = () => {

    return (
        <div className=" w-screen">
            <div
                style={{
                    backgroundImage: `url('callt.webp')`,
                    backgroundSize: "",
                    backgroundPosition: "center",
                }}
                className="relative overflow-hidden flex flex-col item-center justify-center py-24 px-7 gap-6 mx-auto w-full"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-[#29235CE5] from-90% to-50% to-[#29235C]" />
                <div className="flex flex-col items-center gap-1 z-10">
                    <h4 className="uppercase text-[#FFC336]">{"réservations"}</h4>
                    <h2 className="text-white">{"Réserver une table"}</h2>
                </div>
                <p className="mx-auto text-center text-white max-w-[768px] z-10">{"Choisissez votre moment, installez-vous confortablement et laissez-nous nous occuper du reste. Que vous souhaitez réserver une table ou privatiser le restaurant pour votre évènement, nous sommes ouvert."}</p>
                <Button className="mx-auto text-black hover: bg-[#FFC336]/90 w-fit z-10">{"Réserver une table"}</Button>
            </div>
        </div>
    )
}

export default CallToAct