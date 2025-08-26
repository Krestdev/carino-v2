/* eslint-disable react/no-unescaped-entities */
"use client";

import axiosConfig from "@/api";
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
import { checkTransactionStatus, ReceiptProps } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaRegCheckCircle } from "react-icons/fa";
/* import DownloadReceipt from "@/components/downloadReceipt";
 */
function Transaction() {
  const {
    transactionRef,
    setTransaction,
    emptyCart,
    receiptData,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const axiosClient = axiosConfig();
  const { data, isSuccess } = useQuery({
    queryKey: ["transaction", transactionRef],
    queryFn: () => {
      return axiosClient.get<any, AxiosResponse<checkTransactionStatus>>(
        `auth/${transactionRef}/check/status/transaction`
      );
    },
    enabled: !!transactionRef,
    refetchInterval: 10000,
    retry: true,
  });
  const sendReceipt = useMutation({
    mutationFn: (props: ReceiptProps) => {
      return axios.post("/api/ticket", props);
    },
  });

  useEffect(() => {
    if (transactionRef) {
      if (isSuccess) {
        if (data.data.data[0].status.toLocaleLowerCase().includes("success")) {
          //Sending the receipt ticket through email here !
          receiptData && sendReceipt.mutate(receiptData);
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
          setPaymentStatus("success");
          setOpen(true);
          emptyCart();
          setTimeout(() => setTransaction(null), 9000);
        } else if (data.data.data[0].status.toLocaleLowerCase().includes("fail")) {
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
          setPaymentStatus("failed");
          setOpen(true);
          setTimeout(() => setTransaction(null), 9000);
        } else {
          setPaymentStatus("pending");
          setOpen(true);
        }
      }
    } else {
      //setOpen(false);
    }
  }, [isSuccess, transactionRef, data?.data.data[0].status]);

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
            {paymentStatus === "pending"
              && "Un ordre de retrait a été émis. Validez le paiement pour finaliser votre commande."}
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
              <p>{"Si vous rencontrez cette erreur après avoir validé le paiement et que votre compte a été débité, merci de vous rapprocher de notre "}<a href={`mailto:${config.contact.email}`}>{"support"}</a></p>
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
