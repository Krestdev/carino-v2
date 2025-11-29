"use client"

import Panier from '@/components/Panier/Panier';
import { Button } from '@/components/ui/button';
import Head from '@/components/universal/Head';
import { ApplyPromotions } from '@/components/universal/promotions';
import useStore from '@/context/store';
import { cartItem } from '@/types/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Loading from '../loading';

const Page = () => {
  const cart = useStore((s)=>s.cartWithPromo());
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      <Head image={'/tempo/pub1.webp'} title='Panier' />
      <div className='min-h-[calc(100vh-680px)] max-w-[1440px] w-full mx-auto px-7 py-20 flex flex-col items-center justify-center min-w-[1428px]:px-0 @container'>
          <Link className='mt-8' href={"/produits"}>
            <Button size={"lg"}><ArrowLeft />{"Continuer mes achats"}</Button>
          </Link>
        <Panier items={cart} />
      </div>
    </div>
  )
}

export default Page
