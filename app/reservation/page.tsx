"use client"

import ReservationForm from '@/components/Reservation/ReservationForm'
import { Button } from '@/components/ui/button'
import Head from '@/components/universal/Head'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {

  const router = useRouter();
  return (
    <div>
      <Head image={'/images/reservation1.webp'} title='Réservation' />
      <div className='max-w-[1440px] w-full mx-auto'>
        <Button onClick={() => router.push('/')} className='m-8'><ArrowLeft />{"Retour a l'accueil"}</Button>
      </div>
      <ReservationForm />
    </div>
  )
}

export default Page
