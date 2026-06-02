"use client";

import { ApplyDeliveryPromo } from "@/app/panier/fees-promotion";
import useStore from "@/context/store";
import { CartTotal, cn, isDeliveryOpen, zoneLivraisons } from "@/lib/utils";
import { useAppContext } from "@/providers/appContext";
import TownQuery from "@/queries/townQuery";
import UserQuery from "@/queries/userQueries";
import {
  AddressData,
  cartItem,
  City,
  deliveryMode,
  Order,
  OrderTypeProps,
  Retry,
} from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
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
import NewTag from "../newTag";
import PaiementStatus, { PaymentStatus } from "./PaiementStatus";
import ProductQuery from "@/queries/productQuery";

interface DelieveryProps {
  deliveryMode: deliveryMode;
  setDeliveryMode: Dispatch<SetStateAction<deliveryMode>>;
}

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

const DelieveryForm = ({
  deliveryMode,
  setDeliveryMode,
  fees,
  setFees,
  setPostOrderStatus,
  cart,
}: OrderTypeProps & DelieveryProps & { cart: Array<cartItem> }) => {
  const router = useRouter();

  // Store
  const { user, emptyCart } = useStore();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const transactionRef = useStore((s) => s.transactionRef);
  const setReceiptData = useStore((s) => s.setReceiptData);

  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [viewAddresses, setViewAddresses] = useState(false);
  const [retryData, setRetryData] = useState<Retry>();
  const [zoneId, setZoneId] = useState<number>(0);

  const productZone = zoneLivraisons.find(x => x.id === zoneId);

  // ── Payment status state ──
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const productService = useMemo(() => new ProductQuery(), [baseURL]);

  const townQuery = new TownQuery();
  const { data, isSuccess } = useQuery({
    queryKey: ["cities"],
    queryFn: () => townQuery.getTowns(),
  });

  useEffect(() => {
    if (isSuccess) setAddresses(data);
  }, [isSuccess, data]);

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
    const parsedStatus = normalizedStatus.includes("SUCCESS")
      ? "SUCCESS"
      : normalizedStatus.includes("FAILED") ||
        normalizedStatus.includes("NOT_FOUND")
        ? "FAILED"
        : "PENDING";

    return parsedStatus;
  };

  // Check payment status
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
        }, 20000);
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
      }, 20000);
    },
  });

  const postOrder = useMutation({
    mutationFn: async (data: Order) => userQuery.createOrder(data),
    onMutate: () => {
      setPaymentStatus("PENDING");
    },
    onSuccess: (data) => {
      const payload = data as any;
      const orderUuid =
        payload?.order?.uuid ?? payload?.data?.uuid ?? payload?.uuid;
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

    console.log("C'est ici");

    const dueDate = new Date();
    dueDate.setHours(
      Number(values.time.split(":")[0]),
      Number(values.time.split(":")[1]),
      0,
      0
    );

    const realFees = Number(
      addresses.find((x) => x.quartier === values.district)?.price ?? "0"
    );
    setFees(ApplyDeliveryPromo(realFees, values.district, cart));

    if (user !== null) {
      if (isDeliveryOpen()) {
        const address = addresses.find((x) => x.quartier === values.district);
        postOrder.mutate({
          payment: {
            network: values.operator,
            phone: values.phoneNumber,
          },
          total:
            CartTotal(cart) +
            ApplyDeliveryPromo(realFees, values.district, cart),
          first_name: user.name,
          address: {
            ville_id: address?.id!,
            street: values.locality,
            phone: values.deliveryNumber,
          },
          items: [...cart.map((item) => ({
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
          })), ...productZone ? [{
            item_id: Number(productZone.id),
            quantity: 1,
            name: productZone.name,
            price: productZone.price,
            type: "dish",
            modifiers: [],
          }] : []],
          due_date: dueDate.toISOString(),
          mode: deliveryMode,
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

  // Sync postOrder pending state with parent
  useEffect(() => {
    setPostOrderStatus(postOrder.isPending);
  }, [postOrder.isPending, setPostOrderStatus]);

  function isDisable() {
    return (
      cart.length === 0 ||
      CartTotal(cart) + fees <
      Number(process.env.NEXT_PUBLIC_MINIMUM_AMOUNT || 4999) ||
      postOrder.isPending ||
      !!transactionRef
    );
  }

  // ── Handlers for PaiementStatus ──
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

  return (
    <div className="flex flex-col gap-6 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-10 w-full items-end"
        >
          <div className="w-full grid grid-cols-2 md:grid-cols-1 @min-[460px]:grid-cols-2 gap-4">
            {/* Mode de livraison */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[12px] md:text-[14px]">Mode de livraison</label>
              <Select
                value={deliveryMode}
                onValueChange={(e: deliveryMode) => setDeliveryMode(e)}
              >
                <SelectTrigger className="w-full h-[60px]">
                  <SelectValue placeholder="Selectionner un mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="takeaway">
                    <NewTag endNew={new Date(2025, 2, 31)}>À Emporter</NewTag>
                  </SelectItem>
                  <SelectItem value="delivery">Livraison à domicile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quartier */}
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end w-full">
                  <FormLabel isRequired className="customFormLabel text-[12px] md:text-[14px]">
                    Quartier
                  </FormLabel>
                  <Popover open={viewAddresses} onOpenChange={setViewAddresses}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn(
                            "w-full pl-3 flex justify-between border-b border-[#4B5563] hover:border-[#4B5563] bg-[#F3F4F6] hover:bg-[#F3F4F6] text-left font-normal",
                            !field.value ? "text-muted-foreground" : "text-black"
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
                        <CommandEmpty>Aucun quartier trouvé</CommandEmpty>
                        <CommandGroup>
                          <div className="max-h-72 overflow-y-auto">
                            {addresses.map((item, id) => (
                              <CommandItem
                                value={item.quartier}
                                key={id}
                                onSelect={() => {
                                  field.onChange(item.quartier);

                                  setZoneId(item.id_delivery_zone);
                                  form.trigger("district");

                                  setFees(
                                    ApplyDeliveryPromo(
                                      Number(item.price),
                                      item.quartier,
                                      cart
                                    )
                                  );

                                  setViewAddresses(false);
                                }}
                                className="capitalize"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    item.quartier === field.value
                                      ? "opacity-100 text-black"
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

            {/* Lieu dit */}
            <FormField
              control={form.control}
              name="locality"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 w-full">
                  <FormLabel className="customFormLabel text-[12px] md:text-[14px]">Lieu dit</FormLabel>
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

            {/* Heure */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="customFormLabel">{"Heure"}</FormLabel>
                  <Input type="time" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Opérateur */}
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="customFormLabel text-[12px] md:text-[14px]">
                    Opérateur de Paiement
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
                      <SelectItem value="ORANGE_CM">Orange</SelectItem>
                      <SelectItem value="MTN_CM">MTN</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Numéro de paiement */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 w-full">
                  <FormLabel isRequired className="customFormLabel text-[12px] md:text-[14px]">
                    Numéro de paiement
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

            {/* Numéro à appeler */}
            <FormField
              control={form.control}
              name="deliveryNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 w-full">
                  <FormLabel isRequired className="customFormLabel text-[12px] md:text-[14px]">
                    Numéro à appeler
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

          {/* Submit */}
          <div className="flex flex-col items-start w-full gap-2">
            <div className="flex gap-2 items-center flex-wrap w-full">
              <Button className="ml-auto" disabled={isDisable()} size="lg" type="submit">
                Procéder au paiement
              </Button>
            </div>
            {/* {CartTotal(cart) < 5000 && (
              <p className="text-[14px] text-red-500">
                Le montant minimum pour soumettre une commande est de 5000 Fcfa
              </p>
            )} */}
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

export default DelieveryForm;