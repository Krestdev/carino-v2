"use client";

import useStore from "@/context/store";
import { useAppContext } from "@/providers/appContext";
import UserQuery from "@/queries/userQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  email: z.email({ message: "Adresse mail invalide" }),
  password: z.string(),
});

const LoginComp = () => {
  // const [displayError, setDisplayError] = useState(false);
  const [errorValue, setErrorValue] = useState<string | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { baseURL } = useAppContext();

  const { login } = useStore();
  const userLogIn = new UserQuery(baseURL);
  const userLoginData = useMutation({
    mutationFn: (values: { email: string; password: string }) =>
      userLogIn.login(values),
    onSuccess: (data)=>{
      login(data.data.user, data.data["bearer token"]);
      toast(`Connexion reussie ! Bon retour, ${data.data.user.name}`);
    },
     onError: (error) => {
      if((error as AxiosError).status === 400){
        console.log((error as AxiosError).status);
        
        setErrorValue("Adresse mail ou mot de passe incorrect !");
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    userLoginData.mutate(values);
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
          {errorValue && <p className="text-red-400">{errorValue}</p>}
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
            <Link className="bg-black text-white px-2 py-1 rounded-[8px]" href={"/recuperation-mot-de-passe"}>{"Réinitialiser"}</Link>
          </span>
        </form>
      </Form>
    </div>
  );
};

export default LoginComp;
