"use client";
import React, { useState } from "react";
import CartContent from "./cartContent";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "@/context/store";
import ProductQuery from "@/queries/productQuery";
import { useMutation } from "@tanstack/react-query";
import UserQuery from "@/queries/userQueries";
import { cartItem, City } from "@/types/types";

const formSchema = z.object({
  city: z.string().min(3, { message: "Selectionnez une ville" }),
  locality: z.string().min(3, { message: "Entrez une adresse valide" }),
  district: z.string().min(3, { message: "Selectionnez un quartier" }),
  phoneNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
    message: "Le numéro de téléphone doit comporter 9 chiffres",
  }),
  deliveryNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
    message: "Le numéro de téléphone doit comporter 9 chiffres",
  }),
  operator: z.string(),
});

const Page = () => {
  const [cartIsEmpty, setCartIsEmpty] = useState(true);
  const [addresses, setAddresses] = useState<City[]>([]);

  const {
    cart,
    totalPrice,
    user,
    setFees,
    setTransaction,
    DeliveryFees,
    transactionRef,
  } = useStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "yaounde",
      locality: "",
      district: "",
      phoneNumber: user?.phone || "",
      deliveryNumber: user?.phone || "",
      operator: "orange",
    },
  });

  const order = new UserQuery();
  const postOrder = useMutation({
    mutationFn: (data: {
      phone: string;
      total_amount: number;
      user: number;
      Address: string;
      commande: cartItem[];
    }) => order.orders(data),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    //console.log(values);
    if (user !== null) {
      // "!isClosed()"
      if (true) {
        postOrder.mutate({
          phone: values.phoneNumber,
          total_amount: totalPrice() + DeliveryFees,
          user: user.id,
          Address: JSON.stringify({
            name: values.district,
            street: values.locality.concat(" - ", values.deliveryNumber),
            zip_code: "237",
            city: "yaounde",
          }),
          commande: cart,
        });
      } else {
        console.log({
          title: "Livraison  fermée.",
          description:
            "La livraison est disponible uniquement entre 10h30 et 20h30.",
          variant: "info",
        });
        // toast({
        //   title: "Livraison  fermée.",
        //   description:
        //     "La livraison est disponible uniquement entre 10h30 et 20h30.",
        //   variant: "info",
        // });
      }
    }
  }
  return (
    <div>
      <div className="bg-[url('/images/catalog.jpg')] bg-cover w-full h-[300px] flex  justify-center items-center  ">
        <h1 className="text-white text-center">Panier</h1>
      </div>
      <div className="flex flex-col md:flex-row-reverse gap-10 lg:gap-[60px] pt-6 sm:pt-8 lg:pt-10 container mx-auto">
        <CartContent />
        <div className="flex flex-col gap-8 w-full p-5">
          <h6 className="text-xl font-semibold">Paiement</h6>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-y-7 gap-x-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 max-w-2xl"
            >
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="customFormLabel">Quartier</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={`
                              "justify-between max-w-[290px] w-full",
                              ${!field.value && "text-muted-foreground"}
                            `}
                          >
                            {field.value
                              ? addresses.find(
                                  (item) => item.quartier === field.value
                                )?.quartier
                              : "Choisissez un quartier"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[290px] p-0">
                        <Command>
                          <CommandInput placeholder="Sélectionner un quartier..." />
                          <CommandEmpty>Aucun quartier trouvé</CommandEmpty>
                          <CommandGroup>
                            <div className="max-h-72 overflow-y-auto">
                              {addresses.map((item, id) => (
                                <CommandItem
                                  value={item.quartier}
                                  key={id}
                                  onSelect={() => {
                                    form.setValue("district", item.quartier);
                                    setFees(Number(item.prix));
                                    //setFees(0);
                                  }}
                                  className="capitalize"
                                >
                                  <Checkbox
                                    className={`
                                      "mr-2 h-4 w-4",
                                      ${
                                        item.quartier === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }
                                    `}
                                  />
                                  {item.quartier}
                                </CommandItem>
                              ))}
                            </div>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locality"
                render={({ field }) => (
                  <FormItem className="max-w-[290px] w-full">
                    <FormLabel className="customFormLabel">Lieu-dit</FormLabel>
                    <FormControl>
                      <Input placeholder="Montée Aurore" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operator"
                render={({ field }) => (
                  <FormItem className="max-w-[290px] w-full">
                    <FormLabel className="customFormLabel">
                      Operateur de Paiement
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez un opérateur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"orange"}>Orange</SelectItem>
                        <SelectItem value={"mtn"}>MTN</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="max-w-[290px] w-full">
                    <FormLabel className="customFormLabel">
                      Numéro de paiement
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="69654..."
                        {...field}
                        disabled={cartIsEmpty}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryNumber"
                render={({ field }) => (
                  <FormItem className="max-w-[290px] w-full">
                    <FormLabel className="customFormLabel">
                      Numéro à contacter
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Numero de contact"
                        {...field}
                        disabled={cartIsEmpty}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2 flex gap-1 items-center">
                <Button
                  type="submit"
                  variant={"default"}
                  disabled={true}
                  // isLoading={postOrder.isPending}
                  // loadingText={"Initiation du paiement"}
                  // icon={"arrow"}
                  //value={"Payer"}
                >
                  Payer
                </Button>
                <img
                  src="images/om.webp"
                  alt="orangemoney"
                  className="h-10 w-auto"
                />
                <img
                  src="images/momo.webp"
                  alt="mobile money"
                  className="h-10 w-auto"
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
