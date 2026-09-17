import useStore from "@/context/store";
import { CartTotal, cn, isDeliveryOpen } from "@/lib/utils";
import { useAppContext } from "@/providers/appContext";
import UserQuery from "@/queries/userQueries";
import { AuthUser, cartItem, deliveryMode, Order, OrderTypeProps, ReceiptProps, Retry } from "@/types/types";
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
import GuestCheckoutChoiceDialog from "./GuestCheckoutChoiceDialog";
import LoginDialog from "../Authentification/LoginDialog";
import {
  extractPaymentStatus,
  extractVendorReference,
  resolveOrderCreationOutcome,
} from "@/lib/orderPayment";

interface TakeawayProps {
  deliveryMode: deliveryMode;
  setDeliveryMode: Dispatch<SetStateAction<deliveryMode>>;
}

const formSchema = z
  .object({
    name: z.string().optional(),
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
  const setOpenLogSign = useStore((s) => s.setOpenLogSign);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [retryData, setRetryData] = useState<Retry>();
  const [sourceError, setSourceError] = useState<string | null>(null);

  // ── Checkout invité : commande en attente pendant le choix connexion/invité ──
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [pendingReceipt, setPendingReceipt] = useState<ReceiptProps | null>(null);
  const [showGuestChoice, setShowGuestChoice] = useState(false);
  const [showGuestLogin, setShowGuestLogin] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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

  // Marque le paiement réussi : point d'entrée unique pour vider le panier,
  // afin qu'aucun des chemins de succès (résolution immédiate, polling, retry)
  // n'oublie de le faire.
  function markPaymentSuccess() {
    setPaymentStatus("SUCCESS");
    emptyCart();
  }

  const checkPaymentStatus = useMutation({
    mutationFn: async (ref: string) => userQuery.status(ref),
    onSuccess: (data) => {
      const status = extractPaymentStatus(data);
      if (status === "SUCCESS") {
        markPaymentSuccess();
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

  // Gère la réponse de création de commande (invité ou connecté) : partagé
  // par postOrder et guestPostOrder pour que les deux flows restent alignés.
  function handleOrderCreated(data: unknown) {
    const payload = data as any;
    const orderUuid = payload?.order?.uuid;
    if (orderUuid) {
      setRetryData({
        orderUuid,
        phone: form.getValues().phoneNumber,
        network: form.getValues().operator,
      });
    }

    const { outcome, vendorReference } = resolveOrderCreationOutcome(payload);

    if (outcome === "SUCCESS") {
      markPaymentSuccess();
      return;
    }

    if (outcome === "FAILED") {
      setPaymentStatus("FAILED");
      setSourceError(vendorReference ? "payment" : "order");
      if (!vendorReference) {
        toast({
          title: "Référence de transaction introuvable",
          description:
            "La commande a été enregistrée, mais le suivi du paiement n'a pas pu démarrer.",
          variant: "destructive",
        });
      }
      return;
    }

    checkPaymentStatus.mutate(vendorReference!);
  }

  const postOrder = useMutation({
    mutationFn: async (data: Order) => userQuery.createOrder(data),
    onMutate: () => {
      setPaymentStatus("PENDING");
    },
    onSuccess: handleOrderCreated,
    onError: () => {
      setPaymentStatus("FAILED");
      setSourceError("order");
    },
  });

  const guestPostOrder = useMutation({
    mutationFn: async (data: Order) => userQuery.createGuestOrder(data),
    onMutate: () => {
      setPaymentStatus("PENDING");
    },
    onSuccess: handleOrderCreated,
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
        markPaymentSuccess();
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

    if (!isDeliveryOpen(values.time)) {
      toast({
        title: "Livraison fermée.",
        description:
          "La livraison est disponible uniquement entre 10h30 et 20h30.",
        variant: "info",
      });
      return;
    }

    const clientName = user ? user.name : values.name?.trim() || "Client";

    const orderPayload: Order = {
      payment: {
        network: values.operator,
        phone: values.phoneNumber,
      },
      total: CartTotal(cart),
      first_name: clientName,
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
    };

    const receipt: ReceiptProps = {
      fees: fees,
      commande: cart,
      client_name: clientName,
      loyalty: user?.loyalty ?? 0,
      client_mail: user?.email ?? "",
    };

    if (user) {
      setReceiptData(receipt);
      postOrder.mutate(orderPayload);
    } else {
      // Ne rien soumettre tout de suite : on garde la commande en attente
      // pendant que l'utilisateur choisit de se connecter ou de continuer sans compte.
      setPendingOrder(orderPayload);
      setPendingReceipt(receipt);
      setShowGuestChoice(true);
    }
  }

  function handleContinueAsGuest() {
    setShowGuestChoice(false);
    if (!pendingOrder) return;
    if (pendingReceipt) setReceiptData(pendingReceipt);
    guestPostOrder.mutate(pendingOrder);
    setPendingOrder(null);
    setPendingReceipt(null);
  }

  function handleChooseLogin() {
    setShowGuestChoice(false);
    setShowGuestLogin(true);
  }

  function handleGuestLoginSuccess(loggedInUser: AuthUser) {
    setShowGuestLogin(false);
    if (!pendingOrder) return;
    const finalOrder: Order = { ...pendingOrder, first_name: loggedInUser.name };
    if (pendingReceipt) {
      setReceiptData({
        ...pendingReceipt,
        client_name: loggedInUser.name,
        loyalty: loggedInUser.loyalty,
        client_mail: loggedInUser.email,
      });
    }
    postOrder.mutate(finalOrder);
    setPendingOrder(null);
    setPendingReceipt(null);
  }

  useEffect(() => {
    setFees(0);
  }, [setFees]);

  useEffect(() => {
    setPostOrderStatus(postOrder.isPending || guestPostOrder.isPending);
  }, [postOrder.isPending, guestPostOrder.isPending, setPostOrderStatus]);

  useEffect(() => {
    if (postOrder.isError) {
      setTransaction(null);
    }
  }, [postOrder.isError, setTransaction]);

  function handleCloseStatus() {
    if (paymentStatus === "SUCCESS") {
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
      guestPostOrder.isPending ||
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

            {/* Nom - uniquement pour les invités */}
            {!user && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 w-full">
                    <FormLabel className="customFormLabel text-[12px] md:text-[14px]">
                      {"Nom (facultatif)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="ex. Jean Dupont"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

      {/* ── Checkout invité : choix connexion / continuer sans compte ── */}
      <GuestCheckoutChoiceDialog
        open={showGuestChoice}
        onOpenChange={setShowGuestChoice}
        onChooseLogin={handleChooseLogin}
        onContinueAsGuest={handleContinueAsGuest}
      />

      {/* ── Connexion en surcouche, sans perdre le formulaire rempli ── */}
      <LoginDialog
        open={showGuestLogin}
        onOpenChange={setShowGuestLogin}
        setOpenLogSign={setOpenLogSign}
        setOpenSignup={(open) => {
          if (open) setOpenLogSign(true);
        }}
        skipRedirect
        onSuccess={handleGuestLoginSuccess}
      />
    </div>
  );
};

export default TakeawayForm;
