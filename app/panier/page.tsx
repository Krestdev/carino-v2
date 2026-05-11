"use client"

import Panier from '@/components/Panier/Panier';
import { Button } from '@/components/ui/button';
import Head from '@/components/universal/Head';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  return (
    <div>
      <Head image={'/tempo/pub1.webp'} title='Panier' subTitle={'Finalisez votre commande'} />
      <div className='min-h-[calc(100vh-680px)] max-w-[1280px] w-full mx-auto px-7 flex flex-col items-center justify-center min-w-[1428px]:px-0 @container'>
        <Link className='mt-8' href={"/produits"}>
          <Button size={"lg"}><ArrowLeft />{"Continuer mes achats"}</Button>
        </Link>
        <Panier />
      </div>
    </div>
  )
}

export default Page