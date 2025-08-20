"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { ArrowUpRight, Divide, Menu, ShoppingCart } from 'lucide-react'
import { LuCircleUser } from 'react-icons/lu'

const Header = () => {

    const [isLogin, setIsLogin] = useState(false)
    return (
        <div className="sticky bg-white/30 backdrop-blur-lg top-[10px] left-1/2 transform -translate-x-1/2 max-w-[1039px] w-full h-[70px] rounded-full flex items-center justify-between px-[10px] z-50">
            <div className='flex flex-row items-center gap-8'>
                <Link href="/">
                    <img
                        src="Logo.svg"
                        alt="logo"
                        height={60}
                        width={60}
                        loading="eager"
                        className='rounded-full'
                    />
                </Link>
                <div className='hidden md:flex flex-row items-center gap-8'>
                    <Link href={"/catalogue"}>
                        <Button variant={'link'}>{"Catalogue"}</Button>
                    </Link>
                    <Link href={"/produits"}>
                        <Button variant={'link'}>{"À Emporter"}</Button>
                    </Link>
                    <Link target='_blank' href={"/telechargement/catalogue.pdf"}>
                        <Button variant={'link'}>
                            <ArrowUpRight />
                            {"Carte Menu"}
                        </Button>
                    </Link>
                </div>
            </div>
            {isLogin ? <div className='hidden md:flex flex-row gap-[2px] items-center'>
                <Link href={"/connexion"}>
                    <Button variant={'link'}>
                        {"Connexion"}
                    </Button>
                </Link>
                <Link href={"/inscription"}>
                    <Button variant={'link'}>
                        {"Inscription"}
                    </Button>
                </Link>
                <Link href={"/panier"}>
                    <Button className='bg-[#FFC336] hover:bg-[#FFC336]/90 text-black'>
                        <ShoppingCart />
                        {"Panier"}
                    </Button>
                </Link>
            </div> :
                <div className='hidden md:flex flex-row gap-[2px] items-center'>
                    <Button variant={'outline'}>
                        <LuCircleUser />
                        {"compte"}
                    </Button>
                    <Link href={"/panier"}>
                        <Button className='bg-[#FFC336] hover:bg-[#FFC336]/90 text-black'>
                            <ShoppingCart />
                            {"Panier"}
                        </Button>
                    </Link>
                </div>
            }
            <div className='md:hidden flex gap-2'>
                <Button variant={"outline"}>
                    <Menu />
                </Button>
                <Button>
                    <ShoppingCart />
                </Button>
            </div>
        </div>
    )
}

export default Header
