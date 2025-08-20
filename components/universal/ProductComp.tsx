import { ProductData } from '@/types/types'
import React from 'react'
import { Button } from '../ui/button'

type Props = {
    produit: ProductData
}

const ProductComp = ({ produit }: Props) => {
    return (
        <div className='flex flex-col gap-3 md:flex-col md:gap-[22px] max-w-[350px] md:max-w-full w-full h-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] border p-4'>
            {produit.image && <img src={produit.image} alt={produit.name} className='md:max-w-[351px] aspect-[4/3] md:h-auto object-cover' />}
            <div>
                <p className='text-[14px] font-bold uppercase'>{produit.name}</p>
                <p className='text-[24px] font-bold'>{`${produit.price} FCFA`}</p>
            </div>
            <Button>{"Ajouter au panier"}</Button>
        </div>
    )
}

export default ProductComp
