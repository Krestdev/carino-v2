"use client"

import axiosConfig from '@/api';
import useStore from '@/context/store';
import { UserRegistration } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod';
import { toast } from '../ui/use-toast';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription } from '../ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';

const formSchema = z
    .object({
        email: z.string().email({ message: "Adresse mail invalide" }),
        phoneNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
            message: "Le numéro de téléphone doit comporter 9 chiffres",
        }),
        username: z.string().min(3, { message: "Trop court" }),
        password: z.string().refine((value) => /^\d{4}$/.test(value), {
            message: "Le mot de passe doit comporter 4 chiffres",
        }),
        confirmPassword: z.string(),
        dob: z.any(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Vos mots de passe ne sont pas identiques",
        path: ["confirmPassword"],
    })
    .refine(() => {
        return true;
    }
    );

const SignupComp = () => {

    const axiosClient = axiosConfig();
    // const [displayError, setDisplayError] = useState(false);
    const { token } = useStore();
    const { mutate, isError, isSuccess, error, isPending } = useMutation({
        mutationFn: ({
            email,
            password,
            name,
            confirm_password,
            phone,
        }: UserRegistration) => {
            return axiosClient.post("/auth/register", {
                email,
                password,
                name,
                confirm_password,
                phone,
            });
        },
    });
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        //console.log(values);
        mutate({
            email: values.email,
            name: values.username,
            phone: values.phoneNumber,
            password: values.password,
            confirm_password: values.confirmPassword,
        });
    }

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Inscription réussie !",
                variant: "success",
            });
            redirect("/connexion");
        }
        if (isError) {
            // setDisplayError(true);
        }
    }, [isSuccess, isError]);

    if (token) {
        redirect("/");
    }
    
    return (
        <div className='border border-[#848484] px-[32px] py-8 flex flex-col items-center gap-[60px]'>
            <h3 className='w-full text-center'>{"Inscription"}</h3>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex gap-5 flex-col items-center p-8"
                >
                    {isError && (
                        <Alert variant={"destructive"} className="max-w-sm mx-auto">
                            <AlertDescription>
                                {error.message === "Request failed with status code 400"
                                    ? "Cette adresse mail est utilisée"
                                    : "Une erreur est survenue"}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 gap-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="inputFormCustom">
                                    <FormLabel className="customFormLabel">
                                        {"Adresse mail"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="inputFormCustom relative">
                                    <FormLabel className="customFormLabel">
                                        {"Numéro de téléphone"}
                                    </FormLabel>
                                    <span className="absolute top-[24px] left-0 px-2 h-10 inline-flex items-center rounded-l-md bg-muted text-sm">{"+237"}</span>
                                    <FormControl>
                                        <Input placeholder="Numéro de téléphone" {...field} className="pl-16 z-10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="inputFormCustom">
                                    <FormLabel className="customFormLabel">{"Nom"}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Votre nom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="inputFormCustom">
                                    <FormLabel className="customFormLabel">
                                        {"Mot de passe"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Créez un mot de passe à 4 chiffres"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="inputFormCustom">
                                    <FormLabel className="customFormLabel">
                                        {"Confirmez le mot de passe"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirmez votre mot de passe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="inputFormCustom">
                                    <FormLabel className="customFormLabel">
                                        {"Date de naissance"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full mx-auto flex flex-col items-center gap-2">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className='w-full rounded-[12px]'
                        >
                            {"S'inscrire"}
                        </Button>
                        <Link href={"/connexion"} className='w-full'>
                            <Button
                                type="button"
                                disabled={isPending}
                                className='w-full rounded-[12px] text-black border-black'
                                variant={"outline"}
                            >
                                {"Se connecter"}
                            </Button>
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default SignupComp
