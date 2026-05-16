"use client"

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Head from '@/components/universal/Head';
import useStore from '@/context/store';
import UserQuery from '@/queries/userQueries';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const formSchema = z.object({
    oldPassword: z.string().min(3, "L'ancien mot de passe doit contenir au moins 3 caractères"),
    newPassword: z.string().min(3, "Le nouveau mot de passe doit contenir au moins 3 caractères"),
    confirmPassword: z.string().min(3, "La confirmation du mot de passe doit contenir au moins 3 caractères"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

export default function EditPasswordPage() {
    const userQuery = new UserQuery();
    const router = useRouter();
    const { user } = useStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const changePassword = useMutation({
        mutationKey: ["change-password"],
        mutationFn: (data: { identifier: string, oldPassword: string, newPassword: string }) => userQuery.resetInitialPassword(data),
        onSuccess: () => {
            form.reset();
            toast.success("Mot de passe changé avec succès");
            router.replace("/");
        },
        onError: (error: AxiosError) => {
            if (error.response?.status === 401) {
                toast.error("Ancien mot de passe incorrect");
            } else {
                toast.error("Erreur lors du changement de mot de passe");
            }
        }
    })

    const handleSubmit = (data: Omit<z.infer<typeof formSchema>, "confirmPassword">) => {
        changePassword.mutate({
            identifier: user?.email || "",
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        });
    }

    return (
        <div>
            <Head title="Changer le mot de passe" image={'/mdp.webp'} subTitle={'Changer le mot de passe'} />
            <div className="max-w-[360px] mx-auto py-20">
                <Form {...form}>
                    <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ancien mot de passe</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nouveau mot de passe</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmer le mot de passe</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Change Password</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}