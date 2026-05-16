"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { checkTransactionStatus, Retry } from "@/types/types";
import { UseMutationResult } from "@tanstack/react-query";
import { CheckCircle2, Loader2, RefreshCw, XCircle } from "lucide-react";

export type PaymentStatus = "PENDING" | "FAILED" | "COMPLETED" | null;

interface PaiementStatusProps {
  status: PaymentStatus;
  onClose: () => void;
  data: Retry | undefined;
  onRetry: () => void;
  sourceError: string | null;
  retryPayment: UseMutationResult<
    checkTransactionStatus,
    Error,
    Retry,
    unknown
  >;
}

const statusConfig = {
  PENDING: {
    icon: Loader2,
    iconClass: "text-orange-500 animate-spin",
    bgClass: "bg-orange-50",
    borderClass: "border-orange-100",
    title: "Paiement en cours...",
    description:
      "Votre paiement est en cours de traitement. Veuillez confirmer la demande sur votre téléphone et ne pas fermer cette fenêtre.",
    badge: "En attente",
    badgeClass: "bg-orange-100 text-orange-700",
  },
  COMPLETED: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-100",
    title: "Paiement confirmé !",
    description:
      "Votre commande a bien été enregistrée. Vous recevrez une confirmation par SMS. Merci pour votre confiance !",
    badge: "Succès",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  FAILED: {
    icon: XCircle,
    iconClass: "text-red-500",
    bgClass: "bg-red-50",
    borderClass: "border-red-100",
    title: "Paiement échoué",
    description:
      "Une erreur est survenue lors du traitement de votre paiement. Vérifiez votre solde ou réessayez avec un autre opérateur.",
    badge: "Échoué",
    badgeClass: "bg-red-100 text-red-700",
  },
};

export default function PaiementStatus({
  status,
  onClose,
  data,
  onRetry,
  sourceError,
  retryPayment,
}: PaiementStatusProps) {
  if (!status) return null;

  const config = statusConfig[status];
  const Icon = config.icon;
  const isPending = status === "PENDING";
  const isFailed = status === "FAILED";
  const isCompleted = status === "COMPLETED";
  const handleRetry = (data: Retry | undefined) => {
    if (!data) return;
    retryPayment.mutate(data);
  };

  return (
    <Dialog open={!!status} onOpenChange={isPending ? undefined : onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-md rounded-2xl border p-0 overflow-hidden",
          config.borderClass,
        )}
        // Prevent closing by clicking outside when pending
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        {/* Colored top band */}
        <div
          className={cn("w-full h-1.5", {
            "bg-orange-400": isPending,
            "bg-emerald-500": isCompleted,
            "bg-red-500": isFailed,
          })}
        />

        <div className="px-6 pb-6 pt-4 flex flex-col items-center text-center gap-5">
          {/* Badge */}
          <span
            className={cn(
              "text-xs font-semibold px-3 py-1 rounded-full",
              config.badgeClass,
            )}
          >
            {config.badge}
          </span>

          {/* Icon */}
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              config.bgClass,
            )}
          >
            <Icon className={cn("w-8 h-8", config.iconClass)} />
          </div>

          {/* Text */}
          <DialogHeader className="gap-2">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {config.title}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm leading-relaxed">
              {config.description}
            </DialogDescription>
          </DialogHeader>

          {/* PENDING — animated progress */}
          {isPending && (
            <div className="w-full bg-orange-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full animate-[progress_2s_ease-in-out_infinite]" />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-1">
            {isCompleted && (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={onClose}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Voir ma commande
              </Button>
            )}

            {isFailed && (
              <>
                {sourceError === "payment" ? (
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => handleRetry(data)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réessayer
                  </Button>
                ) : (
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={onRetry}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réessayer
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Fermer
                </Button>
              </>
            )}
            {isPending && (
              <p className="text-xs text-gray-400 w-full text-center">
                Ne fermez pas cette fenêtre
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
