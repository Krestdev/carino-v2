import useStore from "@/context/store";
import { CartTotal, cn, isDeliveryOpen } from "@/lib/utils";
import { useAppContext } from "@/providers/appContext";
import UserQuery from "@/queries/userQueries";
import { cartItem, deliveryMode, Order, OrderTypeProps, Retry } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";
import NewTag from "../newTag";
import PaiementStatus, { PaymentStatus } from "./PaiementStatus";

interface TakeawayProps {
  deliveryMode: deliveryMode;
  setDeliveryMode: Dispatch<SetStateAction<deliveryMode>>;
}

const formSchema = z
  .object({
    phoneNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
      message: "Le numéro de téléphone doit comporter 9 chiffres",
    }),
    deliveryNumber: z.string().refine((value) => /^\d{9}$/.test(value), {
      message: "Le numéro de téléphone doit comporter 9 chiffres",
    }),
    operator: z.enum(["MTN_CM", "ORANGE_CM"]),
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
          message: `Uniquement entre ${process.env.NEXT_PUBLIC_OPENTIME || "11:00"
            } et ${process.env.NEXT_PUBLIC_CLOSETIME || "22:00"}`,
        }
      ),
  })
  .refine(
    (data) => {
      const [hours, mins] = data.time.split(":");
      const today = new Date();
      if (
        Number(hours) >= today.getHours() + 2 ||
        (Number(hours) >= today.getHours() + 1 &&
          Number(mins) >= today.getMinutes())
      ) {
        return true;
      } else {
        return false;
      }
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
  cart,
  deliveryMode,
  setDeliveryMode,
}: OrderTypeProps & TakeawayProps & { cart: Array<cartItem> }) => {
  const router = useRouter();
  const { user, emptyCart } = useStore();
  const setTransaction = useStore(s => s.setTransaction);
  const transactionRef = useStore(s => s.transactionRef);
  const setReceiptData = useStore(s => s.setReceiptData);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [retryData, setRetryData] = useState<Retry>();
  const [sourceError, setSourceError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber:
        user?.phone.slice(user?.phone.length - 9, user?.phone.length) ?? "",
      deliveryNumber:
        user?.phone.slice(user?.phone.length - 9, user?.phone.length) ?? "",
      operator: "ORANGE_CM",
      time: `${String(new Date().getHours())}:${String(
        new Date().getMinutes()
      )}`,
    },
  });

  const userQuery = new UserQuery();

  const findFirstValueByKeys = (
    payload: unknown,
    candidateKeys: string[]
  ): string | null => {
    if (!payload || typeof payload !== "object") return null;

    const normalized = new Set(candidateKeys.map((k) => k.toLowerCase()));
    const queue: unknown[] = [payload];
    const visited = new Set<unknown>();

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || typeof current !== "object" || visited.has(current)) {
        continue;
      }
      visited.add(current);

      if (Array.isArray(current)) {
        for (const item of current) queue.push(item);
        continue;
      }

      for (const [key, value] of Object.entries(
        current as Record<string, unknown>
      )) {
        if (normalized.has(key.toLowerCase())) {
          if (typeof value === "string" && value.trim()) {
            return value;
          }
          if (typeof value === "number" && Number.isFinite(value)) {
            return String(value);
          }
        }

        if (value && typeof value === "object") {
          queue.push(value);
        }
      }
    }

    return null;
  };

  const extractVendorReference = (payload: any): string | null => {
    const extractedRef =
      payload?.vendor_reference ??
      payload?.ref ??
      payload?.reference ??
      payload?.payment?.vendor_reference ??
      payload?.payment?.ref ??
      payload?.payment?.reference ??
      payload?.vendorReference ??
      payload?.transaction_ref ??
      payload?.transactionRef ??
      payload?.data?.vendor_reference ??
      payload?.data?.ref ??
      payload?.data?.reference ??
      payload?.data?.payment?.vendor_reference ??
      payload?.data?.payment?.ref ??
      payload?.data?.payment?.reference ??
      payload?.data?.vendorReference ??
      payload?.data?.transaction_ref ??
      payload?.data?.transactionRef ??
      payload?.data?.[0]?.vendor_reference ??
      payload?.data?.[0]?.ref ??
      payload?.data?.[0]?.reference ??
      payload?.data?.[0]?.payment?.vendor_reference ??
      payload?.data?.[0]?.payment?.ref ??
      payload?.data?.[0]?.payment?.reference ??
      payload?.data?.[0]?.vendorReference ??
      payload?.data?.[0]?.transaction_ref ??
      payload?.data?.[0]?.transactionRef ??
      findFirstValueByKeys(payload, [
        "vendor_reference",
        "vendorReference",
        "transaction_ref",
        "transactionRef",
        "payment_reference",
        "paymentReference",
        "ref",
        "reference",
      ]);

    const normalizedRef =
      extractedRef === null || extractedRef === undefined
        ? null
        : String(extractedRef).trim() || null;

    return normalizedRef;
  };

  const extractPaymentStatus = (
    payload: any
  ): "SUCCESS" | "FAILED" | "PENDING" | null => {
    const rawStatus =
      payload?.status ??
      payload?.payment_status ??
      payload?.paymentStatus ??
      payload?.transaction_status ??
      payload?.transactionStatus ??
      payload?.data?.status ??
      payload?.data?.payment_status ??
      payload?.data?.paymentStatus ??
      payload?.data?.transaction_status ??
      payload?.data?.transactionStatus ??
      payload?.data?.[0]?.status ??
      payload?.data?.[0]?.payment_status ??
      payload?.data?.[0]?.paymentStatus ??
      payload?.data?.[0]?.transaction_status ??
      payload?.data?.[0]?.transactionStatus ??
      findFirstValueByKeys(payload, [
        "status",
        "payment_status",
        "paymentStatus",
        "transaction_status",
        "transactionStatus",
      ]);
    if (!rawStatus) return null;

    const normalizedStatus = String(rawStatus).toUpperCase();
    if (normalizedStatus.includes("SUCCESS")) return "SUCCESS";
    if (
      normalizedStatus.includes("FAILED") ||
      normalizedStatus.includes("NOT_FOUND")
    ) {
      return "FAILED";
    }
    return "PENDING";
  };

  const checkPaymentStatus = useMutation({
    mutationFn: async (ref: string) => userQuery.status(ref),
    onSuccess: (data) => {
      const status = extractPaymentStatus(data);
      if (status === "SUCCESS") {
        setPaymentStatus("SUCCESS");
      } else if (status === "FAILED") {
        setPaymentStatus("FAILED");
        setSourceError("payment");
      } else {
        const nextVendorReference = extractVendorReference(data);
        if (!nextVendorReference) {
          setPaymentStatus("FAILED");
          setSourceError("payment");
          return;
        }
        setTimeout(() => {
          checkPaymentStatus.mutate(nextVendorReference);
        }, 3000);
      }
    },
    onError: (_error, currentVendorReference) => {
      setPaymentStatus("PENDING");
      setSourceError("payment");
      if (!currentVendorReference) {
        setPaymentStatus("FAILED");
        return;
      }
      setTimeout(() => {
        checkPaymentStatus.mutate(currentVendorReference);
      }, 3000);
    },
  });

  const postOrder = useMutation({
    mutationFn: async (data: Order) => userQuery.createOrder(data),
    onMutate: () => {
      setPaymentStatus("PENDING");
    },
    onSuccess: (data) => {
      const payload = data;
      const orderUuid = payload?.order?.uuid;
      if (orderUuid) {
        setRetryData({
          orderUuid,
          phone: form.getValues().phoneNumber,
          network: form.getValues().operator,
        });
      }
      const vendorReference = extractVendorReference(data);
      if (!vendorReference) {
        setPaymentStatus("FAILED");
        toast({
          title: "Référence de transaction introuvable",
          description:
            "La commande a été enregistrée, mais le suivi du paiement n'a pas pu démarrer.",
          variant: "destructive",
        });
        return;
      }
      checkPaymentStatus.mutate(vendorReference);
    },
    onError: () => {
      setPaymentStatus("FAILED");
      setSourceError("order");
    },
  });

  const retryPayment = useMutation({
    mutationKey: ["retry-paiement"],
    mutationFn: async (data: Retry) => userQuery.retryPaiement(data),
    onSuccess: (data) => {
      setPaymentStatus("PENDING");
      setSourceError(null);
      const vendorReference = extractVendorReference(data);
      if (vendorReference) {
        checkPaymentStatus.mutate(vendorReference);
        return;
      }

      const status = extractPaymentStatus(data);
      if (status === "SUCCESS") {
        setPaymentStatus("SUCCESS");
      } else if (status === "FAILED") {
        setPaymentStatus("FAILED");
      }
    },
    onError: () => {
      setPaymentStatus("FAILED");
      setSourceError("payment");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const dueDate = new Date();
    dueDate.setHours(
      Number(values.time.split(":")[0]),
      Number(values.time.split(":")[1]),
      0,
      0
    );
    if (user !== null) {
      if (isDeliveryOpen(values.time)) {
        postOrder.mutate({
          payment: {
            network: values.operator,
            phone: values.phoneNumber,
          },
          total: CartTotal(cart),
          first_name: user.name,
          items: cart.map((item) => ({
            item_id: Number(item.id),
            quantity: item.quantity,
            price: item.price,
            type: "dish",
            name: item.name,
            modifiers: item.options && item.options.length > 0 ? item.options.map((optionGroup) => ({
              name: optionGroup.name,
              id_zelty: optionGroup.id_zelty,
              details: optionGroup.details.map((detail) => ({
                id: detail.id,
                name: detail.name,
                qte: detail.qte,
                price: detail.price,
              })),
            })) : [],
          })),
          due_date: dueDate.toISOString(),
          mode: deliveryMode,
        });
        // receipt here !
        setReceiptData({
          fees: fees,
          commande: cart,
          client_name: user.name,
          loyalty: user.loyalty,
          client_mail: user.email,
        });
      } else {
        toast({
          title: "Livraison fermée.",
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
    if (postOrder.isError) {
      setTransaction(null);
    }
  }, [
    postOrder.isError,
    postOrder.isSuccess,
    postOrder.isPending,
    setTransaction,
    setPostOrderStatus,
  ]);

  function handleCloseStatus() {
    if (paymentStatus === "SUCCESS") {
      emptyCart();
      router.push("/historique");
    } else {
      setPaymentStatus(null);
    }
  }

  function handleRetry() {
    setPaymentStatus(null);
    form.handleSubmit(onSubmit)();
  }

  function isDisable() {
    if (
      cart.length === 0 ||
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
          className="flex flex-col gap-5 w-full items-end"
        >
          <div className="w-full grid grid-cols-2 md:grid-cols-1 @min-[460px]:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[12px] md:text-[14px]">{"Mode de livraison"}</label>
              <Select value={deliveryMode} onValueChange={(e: deliveryMode) => setDeliveryMode(e)}>
                <SelectTrigger className="w-full h-[60px]">
                  <SelectValue placeholder="Selectionner un mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="takeaway">
                    <NewTag endNew={new Date(2025, 2, 31)}>{"À Emporter"}</NewTag>
                  </SelectItem>
                  <SelectItem value="delivery">
                    {"Livraison à domicile"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="customFormLabel text-[12px] md:text-[14px]">
                    {"Heure"}
                  </FormLabel>
                  <Input type="time" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="customFormLabel text-[12px] md:text-[14px]">
                    {"Opérateur de Paiement"}
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
                      <SelectItem value={"ORANGE_CM"}>{"Orange"}</SelectItem>
                      <SelectItem value={"MTN_CM"}>{"MTN"}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 w-full">
                  <FormLabel className="customFormLabel text-[12px] md:text-[14px]">
                    {"Numéro de paiement"}
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
                  <FormLabel className="customFormLabel text-[12px] md:text-[14px]">
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

          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 items-center w-full">
              <Button className="ml-auto" type="submit" disabled={isDisable()}>
                {"Procéder au paiement"}
              </Button>
            </div>
            {CartTotal(cart) < 5000 && (
              <p className="text-[14px] text-red-500">
                {
                  "Le montant minimum pour soumettre une commande est de 5000 Fcfa"
                }
              </p>
            )}
          </div>
        </form>
      </Form>

      {/* ── PaiementStatus Dialog ── */}
      <PaiementStatus
        status={paymentStatus}
        onClose={handleCloseStatus}
        data={retryData}
        onRetry={handleRetry}
        sourceError={sourceError}
        retryPayment={retryPayment}
      />
    </div>
  );
};

export default TakeawayForm;