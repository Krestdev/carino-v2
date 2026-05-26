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
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";

const formSchema = z
  .object({
    mail: z.string().email({ message: "Adresse mail invalide" }),
    phoneNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
      message: "Le numéro de téléphone doit comporter 9 chiffres",
    }),
    username: z
      .string()
      .min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
    password: z.string().refine((value) => /^\d{4}$/.test(value), {
      message: "Le mot de passe doit comporter 4 chiffres",
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
  setOpenLogin: (open: boolean) => void;
}

const SignupDialog = ({
  open,
  onOpenChange,
  setOpenLogSign,
  setOpenLogin,
}: SignupDialogProps) => {
  const userQuery = new UserQuery();

  const { mutate, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: ({ mail, password, fname, phone }: UserRegistration) => {
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

  const switchToLogin = () => {
    onOpenChange(false);
    setOpenLogSign(false);
    setOpenLogin(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] overflow-hidden p-0 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl shadow-2xl">
        {/* Decorative background gradients */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col max-h-[90vh]">
          {/* Header Section - Fixed */}
          <div className="shrink-0 p-8 pb-0">
            {/* Header Row with Back Button */}
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  setOpenLogSign(true);
                }}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-slate-800 px-2 h-8"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Précédent
              </Button>
            </div>

            {/* Icon & Dialog Header */}
            <div className="flex flex-col items-center text-center sm:text-left mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl mb-3 shadow-sm">
                <UserPlus className="h-6 w-6" />
              </div>
              <DialogHeader className="text-center sm:text-left p-0">
                <DialogTitle className="text-xl md:text-2xl font-bold text-center text-gray-950 dark:text-white font-serif uppercase tracking-wide">
                  Inscription
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm text-center">
                  Créez votre compte pour profiter de tous nos services
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {/* Scrollable Form Section */}
          <div className="flex-1 overflow-y-auto! px-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col"
              >
                <div className="space-y-4">
                  {isError && (
                    <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 text-sm font-medium">
                      {error?.message === "Request failed with status code 400"
                        ? "Cette adresse mail est déjà utilisée"
                        : "Une erreur est survenue lors de l'inscription"}
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="mail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Adresse mail
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="exemple@mail.com"
                            {...field}
                            className="bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-lg transition-colors"
                          />
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Nom complet
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jean Dupont"
                            {...field}
                            className="bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-lg transition-colors"
                          />
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Mot de passe
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="4 chiffres"
                            {...field}
                            className="bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-lg transition-colors"
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Confirmer le mot de passe
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirmez votre mot de passe"
                            {...field}
                            className="bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-lg transition-colors"
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Numéro de téléphone
                        </FormLabel>
                        <div className="relative">
                          <span className="absolute left-0 top-0 px-3 h-full inline-flex items-center rounded-l-md bg-muted text-sm border border-r-0 border-input select-none">
                            +237
                          </span>
                          <FormControl>
                            <Input
                              placeholder="699999999"
                              {...field}
                              className="pl-16 bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-lg transition-colors"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>

          {/* Fixed Footer with Buttons */}
          <div className="shrink-0 p-6 pt-4 mt-2 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl">
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="flex-1 bg-primary hover:bg-primary/95 text-white order-1 sm:order-2"
            >
              {isPending ? "Inscription en cours..." : "S'inscrire"}
            </Button>

            <Button
              type="button"
              variant="link"
              onClick={switchToLogin}
              className="flex-1 text-gray-700 dark:text-white hover:text-primary order-3"
            >
              J'ai déjà un compte
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;
