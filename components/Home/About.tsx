"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { Phone } from "lucide-react"

const About = () => {
    return (
        <div className="w-full py-12 md:py-24 mx-auto flex gap-12 bg-[#FFFBF3]">
            <div className="px-7 mx-auto max-w-[1280px] w-full grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-12 ">
                <div className="max-w-[588px] flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h4>{"Là où le goût rencontre la convivialité"}</h4>
                        <h2>{"Le Carino Pizzeria"}</h2>
                    </div>
                    <p className="text-[18px]">{`
                    Nous vous accueillons dans un cadre chaleureux pour vous faire découvrir une cuisine généreuse, savoureuse et pensée pour toutes les envies. Que ce soit pour une pause déjeuner, un dîner entre proches ou une commande à emporter, nous mettons tout en œuvre pour vous offrir un moment gourmand inoubliable.
                    `}</p>
                    <div className="flex flex-row gap-2">
                        <Link target="_blank" href={"/telechargement/catalogue.pdf"} >
                            <Button className="bg-primary">{"Voir la Carte"}</Button>
                        </Link>
                        <Link href={"tel:+237696541055"}>
                            <Button variant={"outline"} className="hover:bg-transparent">
                                <Phone className="text-[#FFC336]" />
                                {"+273 696 54 10 55"}</Button>
                        </Link>

                    </div>
                    <div>
                        <p>Ouvert tous les jours de <span className="font-bold">08h à 22h.</span></p>
                        <p>Nous sommes situés à <span className="font-bold">Carrefour PlaYce à Yaoundé, </span>Cameroun.</p>
                    </div>
                </div>
                <img src="/about.webp" alt="about" />
            </div>
        </div>
    )
}

export default About
