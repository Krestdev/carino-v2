import { OrderLog, PreviousOrders } from '@/types/types'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { XAF } from '@/lib/functions'
import { Button } from '../ui/button'
import { LuEye } from 'react-icons/lu'

interface Props {
    title: string
    data: OrderLog[]
}

const HistoryTable = ({ title, data }: Props) => {

    const jsonArray = (array: string) => {
        if (typeof array === 'string') {
            return JSON.parse(array.replace(/\n/g, ''));
        } else {
            return array;
        }
    }

    return (
        <div className='flex flex-col gap-5 w-full'>
            <h3>{title}</h3>
            <Table className="max-w-[1440px] w-full mx-auto border border-gray-300">
                <TableHeader>
                    <TableRow className="divide-x divide-gray-300">
                        {/* <TableHead className="w-[100px]">{"ID"}</TableHead> */}
                        <TableHead className='font-bold'>{"References"}</TableHead>
                        <TableHead className='font-bold'>{"Statuts"}</TableHead>
                        <TableHead className='font-bold'>{"Etats de paiement"}</TableHead>
                        <TableHead className='font-bold'>{"Commande"}</TableHead>
                        <TableHead className='font-bold'>{"Prix"}</TableHead>
                        <TableHead className='font-bold'>{"Date"}</TableHead>
                        <TableHead className='font-bold'>{"Actions"}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200">
                    {
                        data.length === 0 ? (
                            <TableRow className="divide-x divide-gray-200">
                                <TableCell></TableCell>
                                <TableCell>{"Aucune donnée à afficher."}</TableCell>
                            </TableRow>
                        ) : (
                            data.reverse().map((order, id) => (
                                <TableRow key={id} className="divide-x divide-gray-200">
                                    <TableCell className="font-medium text-center">{order.zelty_order_id}</TableCell>
                                    <TableCell>
                                        {!order.is_delivred ? order.is_paid ?
                                            (<div className="flex gap-1 items-center"><span className="bg-orange-600 h-2 w-2 rounded-full" />{"En cours"}</div>) :
                                            (<div className="flex gap-1 items-center">{"---"}</div>) :
                                            (<div className="flex gap-1 items-center"><span className="bg-green-600 h-2 w-2 rounded-full" />{"Livré"}</div>)
                                        }
                                    </TableCell>
                                    <TableCell>{order.is_paid ? "Payé" : "Non payé"}</TableCell>
                                    <TableCell className="truncate max-w-[200px]">
                                        {(() => {
                                            const items = jsonArray(order.items);
                                            const preview = items.slice(0, 3).join(", ");
                                            return items.length > 3 ? `${preview} ...` : preview;
                                        })()}
                                    </TableCell>

                                    <TableCell>{XAF.format(Number(order.prix_total))}</TableCell>
                                    <TableCell>{order.created_at.toString().slice(0, 10)}</TableCell>
                                    <TableCell>
                                        <Button variant={"outline"} className='text-black border-[#848484]'>
                                            <LuEye />
                                            {"voir"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default HistoryTable
