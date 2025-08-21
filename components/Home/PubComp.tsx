import React from 'react'

interface Props {
    pub1: string
    pub2: string
    pub3: string
}

const PubComp = ({ pub1, pub2, pub3 }: Props) => {
    return (
        <div className='w-full flex gap-[10px] items-center justify-center py-8 bg-gradient-to-t from-57% from-[#29235C] to-100% to-transparent'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1200px] w-full h-fit'>
                <div className='flex flex-col gap-8 w-fit'>
                    <img src={pub1} alt="Publicité" className='w-full h-auto aspect-[3/1] object-cover rounded-[12px]' />
                    <img src={pub2} alt="Publicité" className='w-full h-auto aspect-[3/1] object-cover rounded-[12px]' />
                </div>
                <img src={pub3} alt="Publicité" className='w-full h-full aspect-[18/13] rounded-[12px] object-cover' />
            </div>
        </div>
    )
}

export default PubComp
