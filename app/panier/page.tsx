"use client"

import { ApplyPromotion, sendPackPromotion } from '@/components/universal/promotions';
import useStore from '@/context/store';
import { cartItem } from '@/types/types';
import React, { useEffect, useState } from 'react'
import Loading from '../loading';
import Panier from '@/components/Panier/Panier';

const Page = () => {
  const { user, cart } = useStore();
  const [cartItems, setCartItems] = useState<cartItem[]>(cart);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setCartItems(sendPackPromotion(ApplyPromotion(cart)))
    setIsLoading(false);
  }, [cart]);

  console.log(cartItems);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div>
      <Panier items={cartItems} />
    </div>
  )
}

export default Page
