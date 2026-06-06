"use client";

import UserQuery from "@/queries/userQueries";
import { UserRegistration } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useStore from "@/context/store";
import { toast } from "sonner";

const formSchema = z
    .object({
        email: z.string().email({
            message: "Adresse mail invalide",
        }),

        phoneNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
            message: "Le numéro de téléphone doit comporter 9 chiffres",
        }),

        username: z.string().min(3, {
            message: "Le nom doit contenir au moins 3 caractères",
        }),

        password: z.string().refine((value) => /^\d{4}$/.test(value), {
            message: "Le mot de passe doit comporter 4 chiffres",
        }),

        confirmPassword: z.string(),

        dob: z.string().optional(),

        role: z.enum(["USER", "MANAGER", "WAITER"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export default function CreateUserPage() {
    const userQuery = new UserQuery();
    const { user } = useStore()

    const createUser = useMutation({
        mutationKey: ["create-user"],
        mutationFn: async (data: UserRegistration) => {
            return userQuery.register(data);
        },
        onSuccess: () => {
            toast("L'utilisateur a été créé avec succès");
            form.reset({
                email: "",
                phoneNumber: "",
                username: "",
                password: "",
                confirmPassword: "",
                dob: "",
                role: "USER",
            });
        },
        onError: () => {
            toast("Une erreur est survenue");
        },
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

        defaultValues: {
            email: "",
            phoneNumber: "",
            username: "",
            password: "",
            confirmPassword: "",
            dob: "",
            role: "USER",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createUser.mutate({
            mail: values.email,
            fname: values.username,
            phone: values.phoneNumber,
            password: values.password,
            role: values.role,
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="border border-[#848484] rounded-xl px-8 py-8">
                <h2 className="text-center text-white text-2xl font-semibold mb-10">
                    Création d'un utilisateur
                </h2>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        {createUser.isError && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {createUser.error?.message ===
                                        "Request failed with status code 400"
                                        ? "Cette adresse email est déjà utilisée."
                                        : "Une erreur est survenue."}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse mail</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="email@gmail.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Téléphone */}
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numéro de téléphone</FormLabel>

                                        <div className="relative">
                                            <span className="absolute left-0 top-0 h-full px-3 flex items-center border-b border-primary text-white">
                                                +237
                                            </span>

                                            <FormControl>
                                                <Input
                                                    placeholder="690000000"
                                                    className="pl-16"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Nom */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nom de l'utilisateur"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date de naissance */}
                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date de naissance</FormLabel>

                                        <FormControl>
                                            <Input
                                                type="date"
                                                value={field.value}
                                                onChange={(e) =>
                                                    field.onChange(e.target.value)
                                                }
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Mot de passe */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>

                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="4 chiffres"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Confirmation */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Confirmer le mot de passe
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="4 chiffres"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Role */}
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rôle</FormLabel>

                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisir un rôle" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                <SelectItem value="USER">
                                                    Client
                                                </SelectItem>

                                                {(user?.role === "ADMIN" || user?.role === "MANAGER") &&
                                                    <SelectItem value="MANAGER">
                                                        Manager
                                                    </SelectItem>}

                                                {(user?.role === "ADMIN" || user?.role === "MANAGER") &&
                                                    <SelectItem value="WAITER">
                                                        Serveur
                                                    </SelectItem>}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={createUser.isPending}
                            className="w-full"
                        >
                            {createUser.isPending
                                ? "Création..."
                                : "Créer l'utilisateur"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}