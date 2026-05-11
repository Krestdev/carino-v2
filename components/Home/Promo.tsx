"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

const Promo = () => {
    const promo = {
        title: "spécial champions league",
        description: "1 Pizza acheté = 1 Boisson offerte",
        period: "Jusqu’au 31 Mai",
        image: "CL.webp"
    }
    return (
        <div className="py-12 md:py-24 flex gap-10">
            <div
                style={{
                    backgroundImage: `url('${promo.image}')`,
                    backgroundSize: "",
                    backgroundPosition: "center",
                }}
                className="relative overflow-hidden flex flex-col gap-5 max-w-[1280px] w-full px-7 py-10 mx-auto"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-[#29235CE5] from-90% to-50% to-[#29235C]" />
                <div className="flex flex-col gap-1 items-center justify-center w-full z-10">
                    <p className="px-3 py-1.5 bg-primary text-[#FFC336] text-[14px]">{promo.title}</p>
                    <p className="text-[32px] font-medium text-white leading-[100%]">{promo.description}</p>
                    <p className="text-[16px] text-[#E5E7EB]">{promo.period}</p>
                </div>
                <Button className="w-fit mx-auto z-10 bg-[#FFC336] text-black hover:bg-[#FFC336]/90">
                    {"Profiter de l'offre"}
                    <ArrowRight />
                </Button>
            </div>
        </div>
    )
}

export default Promo