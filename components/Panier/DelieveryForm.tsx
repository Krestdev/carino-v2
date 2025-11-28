import useStore from "@/context/store";
import { cn, isDeliveryOpen } from "@/lib/utils";
import { useAppContext } from "@/providers/appContext";
import TownQuery from "@/queries/townQuery";
import UserQuery from "@/queries/userQueries";
import { City, Order, OrderTypeProps } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";
import { ApplyDeliveryPromo } from "@/app/panier/fees-promotion";

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

const DelieveryForm = ({
  fees,
  setFees,
  setPostOrderStatus,
}: OrderTypeProps) => {
  const router = useRouter();
  const {
    cart,
    totalPrice,
    user,
    setTransaction,
    transactionRef,
    setReceiptData,
  } = useStore();

  const [cartIsEmpty, setCartIsEmpty] = useState(true);
  const [addresses, setAddresses] = useState<City[]>([]);
  const [viewAddresses, setViewAddresses] = useState(false);

  useEffect(() => {
    if (cart.length > 0) {
      setCartIsEmpty(false);
    } else {
      setCartIsEmpty(true);
    }
  }, [cart]);

  const { baseURL } = useAppContext();

  const townQuery = new TownQuery(baseURL);
  const { data, isSuccess } = useQuery({
    queryKey: ["cities"],
    queryFn: () => townQuery.getTowns(),
  });

  useEffect(() => {
    if (isSuccess) {
      setAddresses(data.data);
    }
  }, [isSuccess, data?.data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "yaounde",
      locality: "",
      district: "",
      phoneNumber:
        user?.phone.slice(user?.phone.length - 9, user?.phone.length) ?? "",
      deliveryNumber:
        user?.phone.slice(user?.phone.length - 9, user?.phone.length) ?? "",
      operator: "orange",
    },
  });

  const userQuery = new UserQuery(baseURL);

  const postOrder = useMutation({
    mutationFn: async (data: Order) => userQuery.PlaceOrder(data),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const realFees = Number(addresses.find(x=>x.quartier === values.district)?.prix ?? "0");
    setFees(ApplyDeliveryPromo(realFees, values.district, cart));
    if (user !== null) {
      if (isDeliveryOpen()) {
        postOrder.mutate({
          phone: values.phoneNumber,
          total_amount: totalPrice() + ApplyDeliveryPromo(realFees, values.district, cart),
          user: user.id,
          Address: values.city,
          commande: cart,
        });
        setReceiptData({
          fees: ApplyDeliveryPromo(realFees, values.district, cart),
          commande: cart,
          client_name: user.name,
          loyalty: user.loyalty,
          Address: {
            name: values.district,
            street: values.locality.concat(" - ", values.deliveryNumber),
            zip_code: "237",
            city: "yaounde",
          },
          client_mail: user.email,

        });
      } else {
        toast({
          title: "Livraison  fermée.",
          description:
            "La livraison est disponible uniquement entre 10h30 et 20h30.",
          variant: "info",
        });
      }
    } else {
      toast({
        title: "Connectez-vous pour terminer l'opération",
        description:
          "Pour finaliser votre commande vous devez avoir un compte et être connecté sur notre plateforme.",
        variant: "destructive",
      });
      router.push("/connexion");
    }
  }

  useEffect(() => {
    if (postOrder.isPending) {
      setPostOrderStatus(true);
    }
    if (!postOrder.isPending) {
      setPostOrderStatus(false);
    }
    if (postOrder.isSuccess) {
      setTransaction(postOrder.data.data.ref);
    }
    if (postOrder.isError) {
      //setReceiptData();
    }
  }, [
    postOrder.isError,
    postOrder.isSuccess,
    postOrder.isPending,
    postOrder.data?.data.ref,
    setTransaction,
    setPostOrderStatus,
  ]);

  function isDisable() {
    if (
      cartIsEmpty ||
      totalPrice() + fees <
      Number(process.env.NEXT_PUBLIC_MINIMUM_AMOUNT || 4999) ||
      postOrder.isPending ||
      !!transactionRef
    ) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          // className="grid gap-y-7 gap-x-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 max-w-2xl items-baseline"
          className="flex flex-col gap-10 w-full items-end"
        >
          <div className="w-full grid grid-cols-1 @min-[460px]:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 w-full">
                  <FormLabel className="customFormLabel">
                    {"Quartier"}
                  </FormLabel>
                  <Popover open={viewAddresses} onOpenChange={setViewAddresses}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("rounded-md border-input justify-between",
                            !field.value ? "text-muted-foreground" : "text-slate-900"
                          )}
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
                        <CommandEmpty>{"Aucun quartier trouvé"}</CommandEmpty>
                        <CommandGroup>
                          <div className="max-h-72 overflow-y-auto">
                            {addresses.map((item, id) => (
                              <CommandItem
                                value={item.quartier}
                                key={id}
                                onSelect={() => {
                                  form.setValue("district", item.quartier);
                                  setFees(ApplyDeliveryPromo(Number(item.prix), item.quartier, cart));
                                  setViewAddresses(false);
                                }}
                                className="capitalize"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    item.quartier === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
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
                <FormItem className="flex flex-col gap-1 w-full">
                  <FormLabel className="customFormLabel">
                    {"Lieu dit"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="ex. Rue de la paix"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="operator"
            render={({ field }) => (
              <FormItem className="max-w-[495px] w-full">
                <FormLabel className="customFormLabel">
                  {"Operateur de Paiement"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choisissez un opérateur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"orange"}>{"Orange"}</SelectItem>
                    <SelectItem value={"mtn"}>{"MTN"}</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 max-w-[495px] w-full gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 w-full">
                  <FormLabel className="customFormLabel">
                    {"Numéro de payement"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="ex. 6 77..."
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
                <FormItem className="flex flex-col gap-1 w-full">
                  <FormLabel className="customFormLabel">
                    {"Numéro à appeler"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="ex. 6 77..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-2 items-center flex-wrap">
              <span className="inline-flex">
                <img src="/images/momo.webp" alt="mobile money" className="size-10" />
                <img src="/images/om.webp" alt="orange money" className="size-10" />
              </span>
              <Button disabled={isDisable()} size={"lg"} type="submit">
                {"Procéder au paiement"}
              </Button>
            </div>
            {totalPrice() < 5000 && <p className="text-[14px] text-red-500">{"Le montant minimum pour soumettre une commande est de 5000 Fcfa"}</p>}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DelieveryForm;
