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
      {/* Je vais ajouter un texte pour notifier que la commande c'est pour aujourd'hui */}
      <div className='min-h-[calc(100vh-680px)] max-w-[1280px] w-full mx-auto px-7 flex flex-col items-center justify-center gap-2 md:gap-5 min-w-[1428px]:px-0 @container'>
        <Link className='mt-8' href={"/catalogue"}>
          <Button size={"lg"}><ArrowLeft />{"Revenir aux produits"}</Button>
        </Link>
        <p className="text-[12px] max-w-75 md:text-[15px] text-center font-general md:max-w-137.5 mx-auto">{"Cher client votre commande est pour aujourd'hui et sera livré dans les délais. Merci pour votre confiance"}</p>
        <Panier />
      </div>
    </div>
  )
}

export default Page