"use client";

import UserQuery from "@/queries/userQueries";
import { UserRegistration } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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

type FormValues = z.infer<typeof formSchema>;

const emptyValues: FormValues = {
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    dob: "",
    role: "USER",
};

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
    const userQuery = new UserQuery();
    const queryClient = useQueryClient();
    const { user } = useStore();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: emptyValues,
    });

    const createUser = useMutation({
        mutationKey: ["create-user"],
        mutationFn: async (data: UserRegistration) => {
            return userQuery.register(data);
        },
        onSuccess: () => {
            toast("L'utilisateur a été créé avec succès");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            handleOpenChange(false);
        },
        onError: () => {
            toast("Une erreur est survenue");
        },
    });

    // Repartir d'un formulaire vierge à chaque fermeture
    const handleOpenChange = (next: boolean) => {
        if (!next) {
            form.reset(emptyValues);
            createUser.reset();
        }
        onOpenChange(next);
    };

    const onSubmit = (values: FormValues) => {
        createUser.mutate({
            mail: values.email,
            fname: values.username,
            phone: values.phoneNumber,
            password: values.password,
            role: values.role,
        });
    };

    const canCreateStaff = user?.role === "ADMIN" || user?.role === "MANAGER";

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer un utilisateur</DialogTitle>
                    <DialogDescription>
                        Le compte pourra se connecter avec son adresse mail et son mot de passe à 4 chiffres.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {createUser.isError && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {createUser.error?.message === "Request failed with status code 400"
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
                                            <Input placeholder="email@gmail.com" {...field} />
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
                                            <span className="absolute left-0 top-0 h-full px-3 flex items-center text-muted-foreground">
                                                +237
                                            </span>
                                            <FormControl>
                                                <Input placeholder="690000000" className="pl-16" {...field} />
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
                                            <Input placeholder="Nom de l'utilisateur" {...field} />
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
                                                onChange={(e) => field.onChange(e.target.value)}
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
                                            <Input type="password" placeholder="4 chiffres" {...field} />
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
                                        <FormLabel>Confirmer le mot de passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="4 chiffres" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Rôle */}
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rôle</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisir un rôle" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="USER">Client</SelectItem>
                                                {canCreateStaff && <SelectItem value="MANAGER">Manager</SelectItem>}
                                                {canCreateStaff && <SelectItem value="WAITER">Serveur</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={createUser.isPending}>
                                {createUser.isPending ? "Création..." : "Créer l'utilisateur"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
