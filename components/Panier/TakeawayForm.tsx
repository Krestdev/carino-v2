import axiosConfig from "@/api";
import useStore from "@/context/store";
import { cn, isDeliveryOpen } from "@/lib/utils";
import {
  orderMutation,
  OrderTypeProps,
  PostTakeAwayOrderProps,
} from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
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
import { ApplyPromotion, sendPackPromotion } from "../universal/promotions";

const formSchema = z
  .object({
    phoneNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
      message: "Le numéro de téléphone doit comporter 9 chiffres",
    }),
    deliveryNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
      message: "Le numéro de téléphone doit comporter 9 chiffres",
    }),
    operator: z.string(),
    takeDate: z
      .date()
      .refine((date) => !!date, { message: "Veuillez choisir une date" })
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const maxDate = new Date(today);
          maxDate.setDate(today.getDate() + 2); // Max 2 days from today

          return date >= today && date <= maxDate;
        },
        {
          message:
            "La date doit être entre aujourd'hui et les 2 prochains jours",
        }
      ),
    time: z
      .string()
      .nonempty({ message: "Selectionnez une heure" })
      .refine(
        (value) => {
          const time = value.split(":");
          const open = (process.env.NEXT_PUBLIC_OPENTIME || "11:00").split(":");
          const close = (process.env.NEXT_PUBLIC_CLOSETIME || "22:00").split(
            ":"
          );
          return (
            Number(time[0]) >= Number(open[0]) &&
            Number(time[0]) < Number(close[0])
          );
        },
        {
          message: `Uniquement entre ${
            process.env.NEXT_PUBLIC_OPENTIME || "11:00"
          } et ${process.env.NEXT_PUBLIC_CLOSETIME || "22:00"}`,
        }
      ),
  })
  .refine(
    (data) => {
      const [hours, mins] = data.time.split(":");
      const today = new Date();
      if (today.getDay() === data.takeDate.getDay()) {
        if (
          Number(hours) >= today.getHours() + 2 ||
          (Number(hours) >= today.getHours() + 1 &&
            Number(mins) >= today.getMinutes())
        ) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
    {
      message:
        "Veuillez définir une heure au moins une heure plus tard que l'heure actuelle",
      path: ["time"],
    }
  );

const TakeawayForm = ({
  fees,
  setFees,
  setPostOrderStatus,
}: OrderTypeProps) => {
  const router = useRouter();
  const axiosClient = axiosConfig();
  const {
    cart,
    totalPrice,
    user,
    setTransaction,
    transactionRef,
    setReceiptData,
  } = useStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber:
        user?.phone.slice(user?.phone.length - 9, user?.phone.length) ?? "",
      deliveryNumber:
        user?.phone.slice(user?.phone.length - 9, user?.phone.length) ?? "",
      operator: "orange",
      time: `${String(new Date().getHours())}:${String(
        new Date().getMinutes()
      )}`,
    },
  });

  const postOrder = useMutation({
    mutationFn: ({
      phone,
      total_amount,
      user,
      commande,
      due_date,
    }: PostTakeAwayOrderProps) => {
      return axiosClient.post<orderMutation>("/auth/orders", {
        phone,
        total_amount,
        user,
        commande,
        due_date,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const dueDate = new Date(values.takeDate);
    dueDate.setHours(
      Number(values.time.split(":")[0]),
      Number(values.time.split(":")[1]),
      0,
      0
    );
    // console.log(values);
    if (user !== null) {
      if (isDeliveryOpen()) {
        postOrder.mutate({
          phone: values.phoneNumber,
          total_amount: totalPrice() + fees,
          user: user.id,
          commande: sendPackPromotion(ApplyPromotion(cart)),
          due_date: dueDate,
        });
        //receipt here !
        setReceiptData({
          fees: fees,
          commande: cart,
          client_name: user.name,
          loyalty: user.loyalty,
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
    setFees(0);
  }, [setFees]);

  useEffect(() => {
    if (postOrder.isPending) {
      setPostOrderStatus(true);
    }
    if (!postOrder.isPending) {
      setPostOrderStatus(false);
    }
    if (postOrder.isSuccess) {
      setTransaction(postOrder.data.data.data.ref);
    }
    if (postOrder.isError) {
      //console.log(postOrder.error);
    }
  }, [
    postOrder.isError,
    postOrder.isSuccess,
    postOrder.isPending,
    postOrder.data?.data.data.ref,
    setTransaction,
  ]);

  function isDisable() {
    if (
      cart.length === 0 ||
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
          <div className="grid grid-cols-2 gap-4 max-w-[495px] w-full">
            <FormField
              control={form.control}
              name="takeDate"
              render={({ field }) => (
                <FormItem className="max-w-[290px] w-full">
                  <FormLabel>{"Date de collecte"}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 h-10 text-left font-normal normal-case tracking-normal border-input hover:bg-input text-current bg-background",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            field.value.toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",

                              day: "numeric",
                            })
                          ) : (
                            <span>{"Choisir une date"}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={
                          (date) => {
                            const today = new Date(
                              new Date().setHours(0, 0, 0, 0)
                            );
                            const maxDate = new Date();
                            maxDate.setDate(today.getDate() + 3);
                            return date < today || date > maxDate;
                          }
                          //date < new Date(new Date().setDate(new Date().getDate() + 14))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="max-w-[290px] w-full">
                  <FormLabel>{"Heure"}</FormLabel>
                  <Input type="time" {...field} />
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
              name="deliveryNumber"
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
              name="phoneNumber"
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
          <div className="flex gap-2 items-center">
            <Button disabled={isDisable()} className="h-[54px]" type="submit">
              {"Proceder au paiement"}
            </Button>
            <img src="/images/momo.webp" alt="" className="w-[54px] h-[54px]" />
            <img src="/images/om.webp" alt="" className="w-[54px] h-[54px]" />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TakeawayForm;
