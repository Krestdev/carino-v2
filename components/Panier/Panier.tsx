import { cartItem } from '@/types/types'
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewTag from '../newTag';
import DelieveryForm from './DelieveryForm';
import TakeawayForm from './TakeawayForm';

interface Props {
  items: cartItem[]
}

const Panier = ({ items }: Props) => {

  const [deliveryMode, setDeliveryMode] = useState<string>("");
  const [postOrderStatus, setPostOrderStatus] = useState<boolean>(false);
  const [fees, setFees] = useState<number>(0);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 items-center justify-center'>
      <div className='max-w-[1440px] w-full mx-auto flex flex-col items-end gap-10'>
        <div className="flex flex-col max-w-[495px] w-full gap-6">
          <h3>{"Paiement"}</h3>
          <div className='flex flex-col gap-2'>
            <label className="text-sm font-medium">{"Mode de livraison"}</label>
            <Select onValueChange={setDeliveryMode}>
              <SelectTrigger className='w-full h-[60px]'>
                <SelectValue placeholder="Selectionner un mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="takeAway"><NewTag endNew={new Date(2025, 2, 31)}>{"À Emporter"}</NewTag></SelectItem>
                <SelectItem value="homeDelivery">{"Livraison à domicile"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {
          deliveryMode === "takeAway" ?
            <TakeawayForm fees={fees} setFees={setFees} setPostOrderStatus={setPostOrderStatus} />
            :
            <DelieveryForm fees={fees} setFees={setFees} setPostOrderStatus={setPostOrderStatus} />
        }
      </div>
    </div>
  )
}

export default Panier