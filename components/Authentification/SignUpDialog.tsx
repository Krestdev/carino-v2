"use client";

import { useAppContext } from "@/providers/appContext";
import UserQuery from "@/queries/userQueries";
import { UserRegistration } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ArrowLeft } from "lucide-react";

const formSchema = z
    .object({
        mail: z.string().email({ message: "Adresse mail invalide" }),
        phoneNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
            message: "Le numéro de téléphone doit comporter 9 chiffres",
        }),
        username: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
        password: z.string().refine((value) => /^\d{6}$/.test(value), {
            message: "Le mot de passe doit comporter 6 chiffres",
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Vos mots de passe ne sont pas identiques",
        path: ["confirmPassword"],
    });

interface SignupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setOpenLogSign: (open: boolean) => void;
}

const SignupDialog = ({ open, onOpenChange, setOpenLogSign }: SignupDialogProps) => {
    const userQuery = new UserQuery();

    const { mutate, isError, isSuccess, error, isPending } = useMutation({
        mutationFn: ({
            mail,
            password,
            fname,
            phone,
        }: UserRegistration) => {
            return userQuery.register({
                mail,
                password,
                fname,
                phone,
            });
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mail: "",
            username: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({
            mail: values.mail,
            fname: values.username,
            phone: values.phoneNumber,
            password: values.password,
        });
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success("Inscription réussie !");
            onOpenChange(false);
            form.reset();
        }
    }, [isSuccess, onOpenChange, form]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{"connexion / inscription"}</DialogTitle>
                    <DialogDescription>
                        {"Créez votre compte pour profiter de toutes nos services."}
                    </DialogDescription>
                </DialogHeader>

                <Button onClick={() => {
                    onOpenChange(false);
                    setOpenLogSign(true);
                }} variant={"outline"} className="w-fit">
                    <ArrowLeft />
                    {"Précédent"}
                </Button>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {isError && (
                            <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                                {error?.message === "Request failed with status code 400"
                                    ? "Cette adresse mail est déjà utilisée"
                                    : "Une erreur est survenue lors de l'inscription"}
                            </div>
                        )}
                        <div className="flex flex-col gap-5 max-w-[360px] w-full">

                            <FormField
                                control={form.control}
                                name="mail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse mail</FormLabel>
                                        <FormControl>
                                            <Input placeholder="exemple@mail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom complet</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jean Dupont" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="6 chiffres" {...field} />
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
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numéro de téléphone</FormLabel>
                                        <div className="relative">
                                            <span className="absolute left-0 top-0 px-3 h-full inline-flex items-center rounded-l-md bg-muted text-sm border border-r-0 border-input">
                                                +237
                                            </span>
                                            <FormControl>
                                                <Input placeholder="699999999" {...field} className="pl-16" />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <div className="flex flex-row gap-2 items-center ml-auto">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-fit"
                            >
                                {isPending ? "Inscription en cours..." : "S'inscrire"}
                            </Button>
                            <Button type="button" variant={"outline"} onClick={() => onOpenChange(false)} className="w-fit">{"Fermer"}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default SignupDialog;