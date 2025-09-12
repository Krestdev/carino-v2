/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import useStore from "@/context/store";
import { config } from "@/data/config";
import { useAppContext } from "@/providers/appContext";
import ProductQuery from "@/queries/productQuery";
import UserQuery from "@/queries/userQueries";
import { ReceiptProps } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaRegCheckCircle } from "react-icons/fa";

function Transaction() {
  const { transactionRef, setTransaction, emptyCart, receiptData } = useStore();
  const [open, setOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const { baseURL } = useAppContext();
  const userQuery = new UserQuery(baseURL);

  const producQuery = new ProductQuery(baseURL);

  const sendReceipt = useMutation({
    mutationFn: (props: ReceiptProps) => producQuery.postTicket(props),
  });

  const { data, isSuccess } = useQuery({
    queryKey: ["transaction", transactionRef],
    queryFn: async () => {
      return userQuery.status(transactionRef!).then((res) => {
        if (res.data[0].status === "FAILED") {
          setPaymentStatus("failed");
        }
        return res;
      });
    },
    enabled: !!transactionRef,
    refetchInterval: paymentStatus === "pending" ? 10000 : false, 
    retry: true,
  });

  useEffect(() => {
    if (!transactionRef) {
      setOpen(false);
      return;
    }

    if (!isSuccess) return;

    const status = data?.data[0]?.status?.toLowerCase();
    if (!status) return;

    // ✅ Empêcher plusieurs exécutions
    if (status.includes("success") && paymentStatus !== "success") {
      setPaymentStatus("success");
      setOpen(true);

      if (receiptData) sendReceipt.mutate(receiptData);

      toast({
        title: "Transaction réussie",
        variant: "success",
        description: (
          <p>
            Votre paiement a été validé avec succès, restez près de votre
            téléphone pour la livraison. Le Carino vous remercie pour votre
            confiance
          </p>
        ),
      });

      emptyCart();
      setTimeout(() => setTransaction(null), 9000);
    }

    if (status.includes("fail") && paymentStatus !== "failed") {
      setPaymentStatus("failed");
      setOpen(true);

      toast({
        title: "Transaction échouée",
        variant: "destructive",
        description: (
          <p>
            Aie ! Votre paiement a échoué. N'hésitez pas à contacter notre
            support si nécessaire.
          </p>
        ),
      });

      setTimeout(() => setTransaction(null), 9000);
    }

    if (!status.includes("success") && !status.includes("fail")) {
      setPaymentStatus("pending");
      setOpen(true);
    }
  }, [
    isSuccess,
    data?.data,
    transactionRef,
    emptyCart,
    receiptData,
    sendReceipt,
    setTransaction,
    paymentStatus,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            className={`py-5 min-h-[60px] justify-center flex items-center px-4 ${
              paymentStatus === "success"
                ? "bg-green-500 text-gray-900"
                : paymentStatus === "failed"
                ? "bg-red-700 text-white"
                : "bg-slate-200 text-slate-900"
            }`}
          >
            {paymentStatus === "success"
              ? "Paiement validé"
              : paymentStatus === "failed"
              ? "Echec de paiement"
              : "En attente de paiement"}
          </DialogTitle>
          <DialogDescription className="text-center px-4 py-1">
            {paymentStatus === "pending" &&
              "Un ordre de retrait a été émis. Validez le paiement pour finaliser votre commande."}
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === "success" ? (
          <div className="px-7 py-10 flex flex-col gap-5 items-center justify-center">
            <div className="flex flex-col gap-3 text-center items-center justify-center">
              <h3>{"Votre Commande est en prépapration !"}</h3>
              {/* <DownloadReceipt/> */}
            </div>
            <FaRegCheckCircle size={100} className="text-green-600" />
          </div>
        ) : paymentStatus === "failed" ? (
          <div className="px-7 flex flex-col items-center justify-center py-10 gap-6">
            <div className="grid grid-cols-1 gap-3 text-center">
              <h3>{"Le paiement de votre Commande a échoué"}</h3>
              <p>
                {
                  "Si vous rencontrez cette erreur après avoir validé le paiement et que votre compte a été débité, merci de vous rapprocher de notre "
                }
                <a href={`mailto:${config.contact.email}`}>{"support"}</a>
              </p>
            </div>
            <img src="/images/transaction_failed.gif" className="h-32 w-auto" />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center px-4 pt-5 pb-10 gap-5 w-full">
            <p className="text-base text-center">
              {
                "Si la fenêtre de paiement ne s'affiche pas sur votre téléphone, composez *126# chez MTN ou #150*50# chez Orange."
              }
            </p>
            <p className="text-base text-center font-bold px-2">
              {
                "Veuillez patienter après avoir effectué le paiement, cette fenêtre se fermera une fois le paiement validé"
              }
            </p>
            <CgSpinner size={40} className="text-indigo-600 animate-spin" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default Transaction;
