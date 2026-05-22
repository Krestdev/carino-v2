"use client"

import { XAF } from "@/lib/functions"
import { cartItem, ProductOption } from "@/types/types"
import { Button } from "../ui/button"
import { Edit, Minus, Plus, Trash } from "lucide-react"
import useStore from "@/context/store"
import { ProdData } from "@/types/types"

interface CartItemsProps {
    items: cartItem[]
    width?: string
    products?: ProdData[]
    options?: ProductOption[]
    title?: boolean
}

const CartItems = ({ items, width = "", products = [], options = [], title = true }: CartItemsProps) => {
    const { updateQuantity, removeFromCart } = useStore();
    const increase = (itemId: number, qte: number) => {
        if (qte === 0) {
            return;
        }
        updateQuantity(itemId, qte + 1)
    }
    const decrease = (itemId: number, qte: number) => {
        if (qte === 1) {
            removeFromCart(itemId)
        }
        updateQuantity(itemId, qte - 1)
    }

    return (
        <div className={`flex flex-col gap-3 ${width}`} >
            {title ? <p className="text-[20px] text-[#29235C] font-semibold font-general">{"Panier"}</p> : null}
            {
                items.length > 0 ?
                    <div className="flex flex-col gap-2">
                        {
                            items.map((item, ind) => {
                                const product = products.find(p => p.id === Number(item.id));
                                return (
                                    <div key={ind} className="flex flex-row items-center gap-2 w-full">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-[2px]" />
                                        <div className="flex flex-col gap-1 py-1 w-full">
                                            <div className="flex flex-row items-center justify-between w-full">
                                                <p className="text-[14px] font-semibold uppercase">{item.name}</p>
                                                {/* <Button size={"icon"} className="w-6 h-6" variant={"default"} >
                                                    <Edit size={16} />
                                                </Button> */}
                                            </div>
                                            <div className="flex flex-row items-center justify-between w-full">
                                                <p className="text-[14px] font-bold">{XAF.format(item.price)}</p>
                                                <div className="flex flex-row gap-2">
                                                    <Button disabled={item.quantity === 0} onClick={() => decrease(item.item_id, item.quantity)} variant={"outline"} className="px-0 w-6 h-6 hover:bg-transparent">
                                                        {item.quantity === 1 ? <Trash /> : <Minus />}
                                                    </Button>
                                                    <p>{item.quantity}</p>
                                                    <Button disabled={item.quantity === 0} onClick={() => increase(item.item_id, item.quantity)} variant={"secondary"} className="px-0 w-6 h-6 bg-[#FFC336] hover:bg-[#FFC336]/90 ">
                                                        <Plus />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div> :
                    <div className="flex flex-col gap-2 justify-center items-center">
                        <img src="/empty.webp" alt="Panier vide" className="w-[120px] h-[120px]" />
                        <p className="text-[14px] text-[#9CA3AF]">{"Votre panier est vide"}</p>
                    </div>
            }


        </div>
    )
}

export default CartItems