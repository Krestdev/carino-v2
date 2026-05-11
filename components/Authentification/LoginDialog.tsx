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
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

const formSchema = z.object({
  email: z.string().email("Adresse mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

interface JwtPayload {
  sub: string;
  email: string;
  fname?: string;
  isFirstOrder: boolean
  phone: string
}

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setOpenLogSign: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange, setOpenLogSign }: LoginDialogProps) => {
  const [errorValue, setErrorValue] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useStore();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL2 || "http://localhost:3000/api/";
  const userLogIn = new UserQuery(baseURL);

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

        // Récupérer le profil complet de l'utilisateur depuis le serveur
        const userData = await userLogIn.profile();

        const user = {
          id: Number(userData.id),
          email: userData.email,
          name: userData.fname || userData.name || form.getValues("email").split("@")[0],
          isFirstOrder: userData.isFirstOrder,
          phone: userData.phone,
          loyalty: userData.loyalty,
        };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0">

        {/* HEADER */}
        <div className="bg-primary p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Connexion</DialogTitle>
            <DialogDescription className="text-white/80">
              Accédez à votre compte
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setOpenLogSign(true);
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled={mutation.isPending} />
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
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          disabled={mutation.isPending}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2"
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

              {/* FORGOT PASSWORD */}
              <Link href="/mot-de-passe-oublie" className="text-sm text-primary">
                Mot de passe oublié ?
              </Link>

              {/* ERROR */}
              {errorValue && (
                <p className="text-red-500 text-sm">{errorValue}</p>
              )}

              {/* ACTIONS */}
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Connexion..." : "Se connecter"}
                </Button>

                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Fermer
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