import React from 'react'

interface Category {
    nom: string,
    nbProduit: string
    image: string
}

const CategoryComp = ({ nom, nbProduit, image }: Category) => {
    return (
        <div
            style={{
                backgroundImage: `url("${image}")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
            className='relative md:max-w-[264px] w-full h-auto aspect-square rounded-[12px] flex flex-col justify-end'>
            <div className='absolute bg-black/50 top-0 left-0 rounded-[12px] w-full h-full' />
            <div className='flex flex-col gap-2 w-full items-end pr-7 pb-7 text-white z-10'>
                <p className='text-[32px] font-bold text-end w-[207px]'>{nom}</p>
                <p className='text-[20px]'>{`${nbProduit} Produits`}</p>
            </div>
        </div>
    )
}

export default CategoryComp
