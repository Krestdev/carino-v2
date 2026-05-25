"use client";

import useStore from "@/context/store";
import UserQuery from "@/queries/userQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
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
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const formSchema = z.object({
  email: z.string().email("Adresse mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

interface JwtPayload {
  sub: string;
  email: string;
  fname?: string;
  isFirstOrder: boolean;
  require_password_change?: boolean;
  phone: string;
  role?: string;
}

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setOpenLogSign: (open: boolean) => void;
  setOpenSignup: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange, setOpenLogSign, setOpenSignup }: LoginDialogProps) => {
  const [errorValue, setErrorValue] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { login } = useStore();
  const userLogIn = new UserQuery();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset();
      setErrorValue(undefined);
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: (values: any) =>
      userLogIn.login({
        mail: values.email,
        password: values.password,
      }),

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
        const userData = await userLogIn.profile();

        const user = {
          id: Number(userData.id),
          email: userData.mail,
          name: userData.fname || userData.name || form.getValues("email").split("@")[0],
          isFirstOrder: userData.isFirstOrder,
          phone: userData.phone,
          loyalty: userData.loyalty,
          role: userData.role,
          require_password_change: userData.require_password_change || decodedToken?.require_password_change || false,
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

        toast.success(`Bienvenue ${user.name}`);
        onOpenChange(false);

      } catch (error) {
        console.error("Erreur lors du traitement du profil:", error);
        setErrorValue("Erreur lors de la récupération de votre profil");
      }
    },

    onError: (error) => {
      const err = error as AxiosError;

      if (err.response?.status === 400) {
        setErrorValue("Email ou mot de passe incorrect");
      } else {
        setErrorValue("Erreur de connexion");
      }
    },
  });

  const onSubmit = (values: any) => {
    setErrorValue(undefined);
    mutation.mutate(values);
  };

  const switchToSignup = () => {
    onOpenChange(false);
    setOpenLogSign(false);
    setOpenSignup(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] overflow-hidden p-8 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl shadow-2xl">
        {/* Decorative background gradients */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col w-full">
          {/* Header Row with Back Button */}
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                setOpenSignup(true);
              }}
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-slate-800 px-2 h-8"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Retour
            </Button>
          </div>

          {/* Icon & Dialog Header */}
          <div className="flex flex-col items-center text-center sm:text-left mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl mb-3 shadow-sm">
              <LogIn className="h-6 w-6" />
            </div>
            <DialogHeader className="text-center sm:text-left p-0">
              <DialogTitle className="text-xl md:text-2xl font-bold text-gray-950 dark:text-white font-serif uppercase tracking-wide">
                Connexion
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
                Accédez à votre compte
              </DialogDescription>
            </DialogHeader>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={mutation.isPending}
                        className="bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-lg transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-700 dark:text-gray-300">Mot de passe</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          disabled={mutation.isPending}
                          className="bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-lg transition-colors pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="ml-auto w-full flex items-center justify-end">
                {/* FORGOT PASSWORD */}
                <Link href="/recuperation-mot-de-passe" className="text-xs text-primary hover:underline font-semibold mx-0">
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* ERROR */}
              {errorValue && (
                <p className="text-red-500 text-sm font-medium">{errorValue}</p>
              )}

              {/* ACTIONS */}
              <div className="flex w-full items justify-between pt-4 border-t border-gray-100 dark:border-slate-800 mt-6">
                <div className="flex flex-row items-center gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="border-gray-250 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 text-gray-700 dark:text-white"
                  >
                    Fermer
                  </Button>

                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-primary hover:bg-primary/95 text-white"
                  >
                    {mutation.isPending ? "Connexion..." : "Se connecter"}
                  </Button>
                </div>

                {/* S'inscrire */}
                <Button
                  variant="link"
                  onClick={switchToSignup}
                  className="border-gray-250 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 text-gray-700 dark:text-white"
                >
                  S'inscrire
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;