import axiosConfig from '@/api';
import useStore from '@/context/store';
import { isDeliveryOpen } from '@/lib/utils';
import { orderMutation, OrderTypeProps, PostTakeAwayOrderProps } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ApplyPromotion, sendPackPromotion } from '../universal/promotions';
import { toast } from '../ui/use-toast';


const formSchema = z
    .object({
        phoneNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
            message: "Le numéro de téléphone doit comporter 9 chiffres",
        }),
        deliveryNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
            message: "Le numéro de téléphone doit comporter 9 chiffres",
        }),
        operator: z.string(),
        takeDate: z
            .date()
            .refine(
                (date) => !!date,
                { message: "Veuillez choisir une date" }
            )
            .refine(
                (date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Reset time for comparison

                    const maxDate = new Date(today);
                    maxDate.setDate(today.getDate() + 2); // Max 2 days from today

                    return date >= today && date <= maxDate;
                },
                {
                    message: "La date doit être entre aujourd'hui et les 2 prochains jours",
                }
            ),
        time: z.string().nonempty({ message: "Selectionnez une heure" }).refine(
            (value) => {
                const time = value.split(":");
                const open = (process.env.NEXT_PUBLIC_OPENTIME || "11:00").split(":");
                const close = (process.env.NEXT_PUBLIC_CLOSETIME || "22:00").split(":");
                return Number(time[0]) >= Number(open[0]) && Number(time[0]) < Number(close[0]);
            },
            { message: `Uniquement entre ${process.env.NEXT_PUBLIC_OPENTIME || "11:00"} et ${process.env.NEXT_PUBLIC_CLOSETIME || "22:00"}` }
        ),
    })
    .refine(
        (data) => {
            const [hours, mins] = data.time.split(":");
            const today = new Date();
            if (today.getDay() === data.takeDate.getDay()) {
                if (
                    Number(hours) >= today.getHours() + 2 ||
                    (Number(hours) >= today.getHours() + 1 &&
                        Number(mins) >= today.getMinutes())
                ) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        {
            message:
                "Veuillez définir une heure au moins une heure plus tard que l'heure actuelle",
            path: ["time"],
        }
    );

const TakeawayForm = ({ fees, setFees, setPostOrderStatus }: OrderTypeProps) => {

    const router = useRouter();
    const axiosClient = axiosConfig();
    const { cart, totalPrice, user, setTransaction, transactionRef, setReceiptData } = useStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phoneNumber:
                user?.phone.slice(user?.phone.length - 9, user?.phone.length) ?? "",
            deliveryNumber:
                user?.phone.slice(user?.phone.length - 9, user?.phone.length) ?? "",
            operator: "orange",
            time: `${String(new Date().getHours())}:${String(new Date().getMinutes())}`
        },
    });

    const postOrder = useMutation({
        mutationFn: ({
            phone,
            total_amount,
            user,
            commande,
            due_date
        }: PostTakeAwayOrderProps) => {
            return axiosClient.post<any, AxiosResponse<orderMutation>>(
                "/auth/orders",
                {
                    phone,
                    total_amount,
                    user,
                    commande,
                    due_date
                }
            );
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const dueDate = new Date(values.takeDate);
        dueDate.setHours(Number(values.time.split(":")[0]), Number(values.time.split(":")[1]), 0, 0);
        // console.log(values);
        if (user !== null) {
            if (isDeliveryOpen()) {
                postOrder.mutate({
                    phone: values.phoneNumber,
                    total_amount: totalPrice() + fees,
                    user: user.id,
                    commande: sendPackPromotion(ApplyPromotion(cart)),
                    due_date: dueDate
                });
                //receipt here !
                setReceiptData({
                    fees: fees, commande: cart, client_name: user.name, loyalty: user.loyalty, client_mail: user.email
                });
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
        setFees(0);
    }, [])

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
            cart.length === 0 ||
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
        <div>

        </div>
    )
}

export default TakeawayForm
