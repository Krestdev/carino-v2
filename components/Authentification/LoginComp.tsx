"use client"

import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Link from 'next/link'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useStore from '@/context/store'
import { useMutation } from '@tanstack/react-query'
import { credentialsType, User } from '@/types/types'
import { AxiosResponse } from 'axios'
import axiosConfig from '@/api'
import { redirect } from 'next/navigation'
import { toast } from '../ui/use-toast'

const formSchema = z.object({
    email: z.string().email({ message: "Adresse mail invalide" }),
    password: z.string(),
});

interface loginData {
    "bearer token": string;
    user: User;
}

interface login {
    data: loginData;
    message: string;
}

const LoginComp = () => {

    const axiosClient = axiosConfig();
    const [displayError, setDisplayError] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { login, token, setToken } = useStore();
    const { mutate, isError, error, isPending, data, isSuccess } = useMutation({
        mutationFn: (credentials: credentialsType) => {
            //console.log(credentials);
            return axiosClient.post<any, AxiosResponse<login>>(
                "/auth/login",
                credentials
            );
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate(values);
    }

    useEffect(() => {
        if (isSuccess) {
            setToken(data.data.data["bearer token"]);
            login(data.data.data.user, data.data.data['bearer token']);
            
            toast({
                title: "Connexion réussie !",
                variant: "success",
            });
        }
        if (isError) {
            setDisplayError(true);
            //console.log(error);
        }
    }, [isSuccess, isError, data, error, login]);

    if (token) {
        redirect("/");
    }

    return (
        <div className='border border-[#848484] px-[86px] py-8 flex flex-col items-center gap-[60px]'>
            <h3 className='w-full text-center'>{"Connexion"}</h3>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex gap-5 flex-col items-center p-8"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="max-w-[299px] w-full">
                                <FormLabel className="customFormLabel">
                                    {"Adresse mail"}
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Adresse mail" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="max-w-[290px] w-full">
                                <FormLabel className="customFormLabel">
                                    {"Mot de passe"}
                                </FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="max-w-[290px] w-full flex flex-col gap-2 justify-center">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className='rounded-[12px]'
                        >
                            {"Se connecter"}
                        </Button>
                        <Link
                            href="/inscription"
                        >
                            <Button variant={'outline'} className='border-black text-black rounded-[12px] w-full'>
                                {"Créer un compte"}
                            </Button>
                        </Link>
                    </div>
                    <span>{"Mot de passe oublié?"} <Link href={"/recuperation-mot-de-passe"}>{"Réinitialiser"}</Link></span>
                </form>
            </Form>
        </div>
    )
}

export default LoginComp
