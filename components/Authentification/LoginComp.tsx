"use client";

import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "@/context/store";
import { useMutation } from "@tanstack/react-query";
import { credentialsType, User } from "@/types/types";
import { redirect } from "next/navigation";
import { toast } from "../ui/use-toast";
import UserQuery from "@/queries/userQueries";

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
  // const [displayError, setDisplayError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login, token } = useStore();
  const userLogIn = new UserQuery();
  const userLoginData = useMutation({
    mutationFn: (values: { email: string; password: string }) =>
      userLogIn.login(values),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    userLoginData.mutate(values);
  }

  useEffect(() => {
    if (userLoginData.isSuccess) {
      login(
        userLoginData.data.data.user,
        userLoginData.data.data["bearer token"]
      );

      toast({
        title: "Connexion réussie !",
        variant: "success",
      });
    }
    if (userLoginData.isError) {
      // setDisplayError(true);
    }
  }, [
    userLoginData.isSuccess,
    userLoginData.isPending,
    userLoginData.data,
    login,
  ]);

  if (token) {
    redirect("/");
  }

  return (
    <div className="border border-[#848484] px-[86px] py-8 flex flex-col items-center gap-[60px]">
      <h3 className="w-full text-center">{"Connexion"}</h3>
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
              disabled={userLoginData.isPending}
              className="rounded-[12px]"
            >
              {"Se connecter"}
            </Button>
            <Link href="/inscription">
              <Button
                variant={"outline"}
                className="border-black text-black rounded-[12px] w-full"
              >
                {"Créer un compte"}
              </Button>
            </Link>
          </div>
          <span>
            {"Mot de passe oublié?"}{" "}
            <Link href={"/recuperation-mot-de-passe"}>{"Réinitialiser"}</Link>
          </span>
        </form>
      </Form>
    </div>
  );
};

export default LoginComp;
