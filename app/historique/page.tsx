"use client"

import axiosConfig from '@/api';
import HistoryTable from '@/components/Historique/HistoryTable';
import { Button } from '@/components/ui/button';
import useStore from '@/context/store';
import { PreviousOrders } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = () => {

    const { user, token } = useStore();
    const axiosClient = axiosConfig();
    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ['userInfo', user?.id],
        queryFn: async (): Promise<PreviousOrders> => {
            const res = await axiosClient.get<PreviousOrders>(
                `/auth/${user?.id}/all/user/orders`
            )
            return res.data
        },
        enabled: !!user,
    })


    if (!token) {
        redirect('/');
    }

    return (
        isSuccess ?
            <div className='pt-24 pb-10'>
                <div className='max-w-[1440px] w-full mx-auto flex flex-col gap-5'>
                    <Button onClick={() => redirect('/')} className='w-fit'>
                        <ArrowLeft />
                        {"Retour a l'accueil"}
                    </Button>
                    <HistoryTable title={'Historique des commandes'} data={data?.data} />
                </div>
            </div>
            : isLoading && null
    )
}

export default Page
