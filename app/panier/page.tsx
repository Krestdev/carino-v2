"use client"

import { ApplyPromotion, sendPackPromotion } from '@/components/universal/promotions';
import useStore from '@/context/store';
import { cartItem } from '@/types/types';
import React, { useEffect, useState } from 'react'
import Loading from '../loading';
import Panier from '@/components/Panier/Panier';
import Head from '@/components/universal/Head';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const Page = () => {
  const { cart } = useStore();
  const [cartItems, setCartItems] = useState<cartItem[]>(cart);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setCartItems(sendPackPromotion(ApplyPromotion(cart)))
    setIsLoading(false);
  }, [cart]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div className=''>
      <Head image={'/tempo/pub1.webp'} title='Panier' />
      <div className='max-w-[1440px] w-full mx-auto'>
        <Button onClick={() => router.push('/produits')} className='m-8'><ArrowLeft />{"Continuer mes achats"}</Button>
      </div>
      <Panier items={cartItems} />
    </div>
  )
}

export default Page
