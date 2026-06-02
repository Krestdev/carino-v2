"use client";

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
import useStore from "@/context/store";
import UserQuery from "@/queries/userQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const formSchema = z
    .object({
        token: z.string(),
        newPassword: z
            .string()
            .min(4, "Le mot de passe doit contenir au moins 4 caractères")
            .max(4, "Le mot de passe doit contenir au plus 4 caractères"),
        confirmPassword: z
            .string()
            .min(4, "Le mot de passe doit contenir au moins 4 caractères")
            .max(4, "Le mot de passe doit contenir au plus 4 caractères"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const router = useRouter();
    const { login } = useStore();

    const userQuery = new UserQuery();

    const loginUser = useMutation({
        mutationKey: ["login"],
        mutationFn: async (data: {
            mail: string;
            password: string;
        }) => {
            return userQuery.login(data);
        },
        onSuccess: async (data: { access_token: string }) => {
            try {
                // Enregistrer le token immédiatement
                localStorage.setItem("token", data.access_token);

                // Décoder le token pour vérifier require_password_change
                let decodedToken: JwtPayload | null = null;
                try {
                    decodedToken = jwtDecode<JwtPayload>(data.access_token);
                    console.log("Token décodé:", decodedToken);
                } catch (error) {
                    console.error("Erreur lors du décodage du token:", error);
                }

                // Récupérer le profil complet de l'utilisateur depuis le serveur
                const userData = await userQuery.profile();

                const user = {
                    id: Number(userData.id),
                    email: userData.mail,
                    name:
                        userData.fname ||
                        userData.name,
                    isFirstOrder: userData.isFirstOrder,
                    phone: userData.phone,
                    loyalty: userData.loyalty,
                    role: userData.role,
                    require_password_change:
                        userData.require_password_change ||
                        false,
                };

                // Vérifier si c'est un admin avec require_password_change = true
                const isAdmin = user.role === "MANAGER" || user.role === "ADMIN";
                const require_password_change = user.require_password_change === false;

                if (isAdmin && require_password_change) {
                    // Rediriger vers la page edit-password
                    toast.info("Veuillez changer votre mot de passe avant de continuer");
                    router.push("/edit-password");
                }

                login(user, data.access_token);
                router.push("/");
            } catch (error) {
                console.error("Erreur lors du traitement du profil:", error);
            }
        },
    });

    const resetPassword = useMutation({
        mutationKey: ["reset-password"],
        mutationFn: async (data: {
            token: string;
            newPassword: string;
        }) => {
            return userQuery.resetPassword(data);
        },
        onSuccess: (data: { message: string, mail: string }) => {
            toast.success("Mot de passe réinitialisé avec succès");
            // login 
            loginUser.mutate({
                mail: data.mail,
                password: form.getValues('confirmPassword'),
            });
        },
        onError: (error: any) => {
            if (error?.response?.status === 400) {
                toast.error("Token invalide ou expiré");
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
            token,
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        resetPassword.mutate({
            token: data.token,
            newPassword: data.newPassword,
        });
    };

    if (!token) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Token manquant ou invalide.</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-32">
            <div className="w-full max-w-md p-6 shadow-sm">
                <h1 className="text-2xl font-bold mb-10 text-center text-white">
                    Réinitialisation du mot de passe
                </h1>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Nouveau mot de passe
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Entrez votre nouveau mot de passe"
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
                                <FormItem>
                                    <FormLabel>
                                        Confirmer le mot de passe
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

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={resetPassword.isPending}
                        >
                            {resetPassword.isPending
                                ? "Réinitialisation..."
                                : "Réinitialiser le mot de passe"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}