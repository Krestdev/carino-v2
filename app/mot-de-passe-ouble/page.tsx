'use client'

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useStore from '@/context/store';
import UserQuery from '@/queries/userQueries';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const formSchema = z.object({
    email: z.string().email({ message: "Adresse mail invalide" }),
});

function Page() {
    const [modalStatus, setModalStatus] = React.useState(false);
    const { token } = useStore();
    const router = useRouter();

    const userQuery = new UserQuery();
    const resetPassword = useMutation({
        mutationKey: ["forgot-password"],
        mutationFn: async (email: string) => {
            return userQuery.forgotPassword({ email });
        },
        onSuccess: () => {
            toast.success("Mot de passe réinitialisé avec succès");
        },
        onError: (error: any) => {
            if (error?.message === "Request failed with status code 400") {
                toast.error("Token invalide");
            } else {
                toast.error(
                    "Une erreur est survenue lors de la réinitialisation du mot de passe"
                );
            }
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    });

    React.useEffect(() => {
        if (resetPassword.isError || resetPassword.isSuccess) {
            setModalStatus(true);
        }
    }, [resetPassword.isError, resetPassword.isSuccess]);

    function onSubmit(data: z.infer<typeof formSchema>) {
        resetPassword.mutate(data.email);
    }

    if (token) {
        redirect("/");
    }
    return (
        <div className='py-32'>
            <Form {...form}>
                <h1 className="text-2xl font-bold mb-10 text-center text-black">
                    Réinitialisez votre mot de passe
                </h1>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3 items-center py-10'>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem className='max-w-[290px] w-full'>
                            <FormLabel>
                                {"Adresse mail"}
                            </FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='Votre adresse mail' />
                            </FormControl>
                        </FormItem>
                    )} />
                    <Button type="submit" className='w-full max-w-[290px]' disabled={resetPassword.isPending}>{"Soumettre"}</Button>
                </form>
            </Form>
            <Dialog open={modalStatus} onOpenChange={() => setModalStatus(false)}>
                <DialogContent>
                    <DialogHeader className={`text-white px-5 py-3 ${resetPassword.isSuccess ? "bg-green-600" : "bg-red-600"}`}>
                        <DialogTitle>{resetPassword.isSuccess ? "Opération réussie !" : "Echec !"}</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-5">
                        {resetPassword.isError && <p>{"Votre adresse mail ne figure pas dans la liste de nos utilisateurs enregistrés. Si vous ne disposez pas d'un compte, cliquez sur "}<Link href={"/inscription"} className='underline'>{"s'inscrire"}</Link></p>}
                        {resetPassword.isSuccess && <p>{"Un email a été envoyé à votre adresse mail muni d'un lien qui vous permettra de réinitialiser votre mot de passe."}</p>}
                        <DialogClose asChild><Button variant={"outline"} onClick={() => resetPassword.isSuccess ? router.push("/") : null}>{"Fermer"}</Button></DialogClose>
                    </div>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Page