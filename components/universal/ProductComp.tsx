import { ProductData } from '@/types/types'
import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { LuPlus } from 'react-icons/lu'

type Props = {
    produit: ProductData
}

const ProductComp = ({ produit }: Props) => {
    return (
        <div className='relative grid grid-cols-2 md:flex md:flex-col gap-3 md:gap-[22px] max-w-[350px] md:max-w-full w-full h-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] border p-4'>
            {produit.disable &&
                <Badge variant={"destructive"} className='absolute top-[25px] right-[25px] z-10'>{"Indisponible"}</Badge>}
            {<img src={produit.image ? produit.image : "/images/imagePlaceholder.svg"} alt={produit.name} className='md:max-w-[351px] aspect-[149/162] md:aspect-[4/3] md:h-auto object-cover' />}
            <div className='flex flex-col md:justify-between h-full justify-end'>
                <div className='flex flex-col gap-2'>
                    <p className='text-[14px] font-bold uppercase'>{produit.name}</p>
                    <p className='text-[24px] font-bold'>{`${produit.price} FCFA`}</p>
                </div>
                <Button disabled={produit.disable} className={`${produit.disable ? 'bg-gray-300 cursor-not-allowed' : ""}`}>
                    <LuPlus />
                    {"Ajouter au panier"}
                </Button>
            </div>
        </div>
    )
}

export default ProductComp
