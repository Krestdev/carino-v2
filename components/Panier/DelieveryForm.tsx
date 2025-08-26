import useStore from '@/context/store';
import { CitiesResponse, City, orderMutation, OrderTypeProps, PostOrderProps } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ApplyPromotion, sendPackPromotion } from '../universal/promotions';
import { toast } from '../ui/use-toast';
import axiosConfig from '@/api';
import { cn, isDeliveryOpen } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
    city: z.string().min(3, { message: "Selectionnez une ville" }),
    locality: z.string().min(3, { message: "Entrez une adresse valide" }),
    district: z.string().min(3, { message: "Selectionnez un quartier" }),
    phoneNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
        message: "Le numéro de téléphone doit comporter 9 chiffres",
    }),
    deliveryNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
        message: "Le numéro de téléphone doit comporter 9 chiffres",
    }),
    operator: z.string(),
});

const DelieveryForm = ({ fees, setFees, setPostOrderStatus }: OrderTypeProps) => {

    const router = useRouter();
    const axiosClient = axiosConfig();
    const { cart, totalPrice, user, setTransaction, transactionRef, setReceiptData } = useStore();

    const [cartIsEmpty, setCartIsEmpty] = useState(true);
    const [addresses, setAddresses] = useState<City[]>([]);

    useEffect(() => {
        if (cart.length > 0) {
            setCartIsEmpty(false);
        } else {
            setCartIsEmpty(true);
        }
    }, [cart]); //check if there's something in the cart to disable or not the button

    const { data, isSuccess } = useQuery({
        queryKey: ["cities"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<CitiesResponse>>("/villes");
        },
    });

    useEffect(() => {
        if (isSuccess) {
            setAddresses(data.data.data);
        }
    }, [isSuccess, data?.data.data]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            city: "yaounde",
            locality: "",
            district: "",
            phoneNumber:
                user?.phone.slice(user?.phone.length - 9, user?.phone.length) ?? "",
            deliveryNumber:
                user?.phone.slice(user?.phone.length - 9, user?.phone.length) ?? "",
            operator: "orange",
        },
    });

    const postOrder = useMutation({
        mutationFn: ({
            phone,
            total_amount,
            user,
            Address,
            commande,
        }: PostOrderProps) => {
            return axiosClient.post<any, AxiosResponse<orderMutation>>(
                "/auth/orders",
                {
                    phone,
                    total_amount,
                    user,
                    Address,
                    commande,
                }
            );
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (user !== null) {
            if (isDeliveryOpen()) {
                postOrder.mutate({
                    phone: values.phoneNumber,
                    total_amount: totalPrice() + fees,
                    user: user.id,
                    Address: {
                        name: values.district,
                        street: values.locality.concat(" - ", values.deliveryNumber),
                        zip_code: "237",
                        city: "yaounde",
                    },
                    commande: sendPackPromotion(ApplyPromotion(cart)),
                });
                setReceiptData({
                    fees: fees, commande: cart, client_name: user.name, loyalty: user.loyalty, Address: {
                        name: values.district,
                        street: values.locality.concat(" - ", values.deliveryNumber),
                        zip_code: "237",
                        city: "yaounde",
                    },
                    client_mail: user.email
                })
            } else {
                toast({
                    title: "Livraison  fermée.",
                    description:
                        "La livraison est disponible uniquement entre 10h30 et 20h30.",
                    variant: "info",
                });
            }
        } else {
            toast({
                title: "Connectez-vous pour terminer l'opération",
                description:
                    "Pour finaliser votre commande vous devez avoir un compte et être connecté sur notre plateforme.",
                variant: "destructive",
            });
            router.push("/connexion");
        }
    }

    useEffect(() => {
        if (postOrder.isPending) {
            setPostOrderStatus(true);
        }
        if (!postOrder.isPending) {
            setPostOrderStatus(false);
        }
        if (postOrder.isSuccess) {
            setTransaction(postOrder.data.data.data.ref);
        }
        if (postOrder.isError) {
            //console.log(postOrder.error);
            //setReceiptData();
        }
    }, [
        postOrder.isError,
        postOrder.isSuccess,
        postOrder.isPending,
        postOrder.data?.data.data.ref,
        setTransaction,
    ]);

    function isDisable() {
        if (
            cartIsEmpty ||
            totalPrice() + fees < Number(process.env.NEXT_PUBLIC_MINIMUM_AMOUNT || 4999) ||
            postOrder.isPending ||
            !!transactionRef
        ) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className='flex flex-col gap-6 w-full'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    // className="grid gap-y-7 gap-x-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 max-w-2xl items-baseline"
                    className='flex flex-col gap-10 w-full items-end'
                >
                    <div className='grid grid-cols-2 gap-4 max-w-[495px] w-full'>
                        <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1 w-full">
                                    <FormLabel className="customFormLabel">{"Quartier"}</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between max-w-[290px] w-full  rounded-[12px] text-black text-[12px]",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? addresses.find(
                                                            (item) => item.quartier === field.value
                                                        )?.quartier
                                                        : "Choisissez un quartier"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[290px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Sélectionner un quartier..." />
                                                <CommandEmpty>{"Aucun quartier trouvé"}</CommandEmpty>
                                                <CommandGroup>
                                                    <div className="max-h-72 overflow-y-auto">
                                                        {addresses.map((item, id) => (
                                                            <CommandItem
                                                                value={item.quartier}
                                                                key={id}
                                                                onSelect={() => {
                                                                    form.setValue("district", item.quartier);
                                                                    setFees(Number(item.prix));
                                                                }}
                                                                className="capitalize"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        item.quartier === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {item.quartier}
                                                            </CommandItem>
                                                        ))}
                                                    </div>
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="locality"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1 w-full">
                                    <FormLabel className="customFormLabel">{"Lieu dit"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='w-full' placeholder='ex. Rue de la paix' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="operator"
                        render={({ field }) => (
                            <FormItem className="max-w-[495px] w-full">
                                <FormLabel className="customFormLabel">
                                    {"Operateur de Paiement"}
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Choisissez un opérateur" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={"orange"}>{"Orange"}</SelectItem>
                                        <SelectItem value={"mtn"}>{"MTN"}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-2 max-w-[495px] w-full gap-4'>
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1 w-full">
                                    <FormLabel className="customFormLabel">{"Numéro de payement"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='w-full' placeholder='ex. 6 77...' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deliveryNumber"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1 w-full">
                                    <FormLabel className="customFormLabel">{"Numéro à appeler"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='w-full' placeholder='ex. 6 77...' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex gap-2 items-center'>
                        <Button disabled={isDisable()} className='h-[54px]' type='submit'>{"Proceder au paiement"}</Button>
                        <img src="/images/momo.webp" alt="" className='w-[54px] h-[54px]' />
                        <img src="/images/om.webp" alt="" className='w-[54px] h-[54px]' />
                    </div>

                </form>
            </Form>
        </div>
    )
}

export default DelieveryForm
