"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bike, CalendarClock, Loader2, MapPin, MessageSquare, Phone, ShoppingBag, User } from "lucide-react";
import { XAF } from "@/lib/functions";
import { zoneLivraisons } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import UserQuery from "@/queries/userQueries";
import { statusBadgeClass, statusLabel } from "./status";

interface OrderDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    uuid: string | null;
}

// Les frais de livraison sont envoyés comme une ligne de commande (« Livraison 1 Yde »…)
const DELIVERY_ITEM_IDS = new Set(zoneLivraisons.map((zone) => zone.id));

const formatDate = (date?: string | null) =>
    date
        ? new Date(date).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : null;

/** Ligne icône + libellé + valeur des blocs d'information */
const InfoRow = ({ icon: Icon, label, children }: { icon: typeof User; label: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-lg shrink-0">
            <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-500">{label}</p>
            <div className="font-medium text-gray-900 wrap-break-word">{children}</div>
        </div>
    </div>
);

const OrderDetailsDialog = ({ open, onClose, uuid }: OrderDetailsDialogProps) => {
    const orders = new UserQuery();

    const orderData = useQuery({
        queryKey: ["order", "admin", uuid],
        queryFn: () => orders.getOne(uuid!),
        enabled: open && !!uuid,
    });

    const currentOrder = orderData.data;

    // Articles réels, sans les lignes de frais de livraison
    const articles = currentOrder?.items.filter((item) => !DELIVERY_ITEM_IDS.has(Number(item.item_id))) ?? [];
    const itemsSubtotal = articles.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsCount = articles.reduce((sum, item) => sum + item.quantity, 0);
    const isDelivery = currentOrder?.mode === "delivery";
    // Frais réellement facturés = total − articles (ligne de zone et promotions comprises)
    const deliveryFees = isDelivery ? Math.max(0, Number(currentOrder?.total ?? 0) - itemsSubtotal) : 0;
    const phone = currentOrder?.phone || currentOrder?.address?.phone;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-190 max-h-[90vh] flex flex-col gap-0 rounded-2xl border border-gray-200 p-0 overflow-hidden shadow-2xl bg-white text-gray-800">
                {orderData.isLoading || !currentOrder ? (
                    <div className="flex justify-center p-12">
                        <DialogTitle className="sr-only">Chargement de la commande</DialogTitle>
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* En-tête compact */}
                        <DialogHeader className="shrink-0 border-b border-gray-200 border-t-4 border-t-primary px-6 pt-5 pb-4 text-left sm:text-left">
                            <div className="flex flex-wrap items-center gap-3 pr-8">
                                <DialogTitle className="text-xl font-bold text-gray-900">
                                    Commande #{currentOrder.display_id || currentOrder.uuid.split("-")[0].toUpperCase()}
                                </DialogTitle>
                                <Badge className={statusBadgeClass(currentOrder.status)}>
                                    {statusLabel(currentOrder.status)}
                                </Badge>
                            </div>
                            <DialogDescription asChild>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <CalendarClock className="h-4 w-4 text-primary" />
                                        {formatDate(currentOrder.registration) ?? "Date inconnue"}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        {isDelivery ? <Bike className="h-4 w-4 text-primary" /> : <ShoppingBag className="h-4 w-4 text-primary" />}
                                        {isDelivery ? "Livraison" : "À emporter"}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">{currentOrder.uuid}</span>
                                </div>
                            </DialogDescription>
                        </DialogHeader>

                        {/* Contenu : seul ce bloc défile */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                            {/* Client et livraison */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="space-y-3">
                                    <InfoRow icon={User} label="Client">{currentOrder.first_name || "—"}</InfoRow>
                                    <InfoRow icon={Phone} label="Téléphone">
                                        {phone ? (
                                            <a href={`tel:${phone}`} className="hover:text-primary">{phone}</a>
                                        ) : "—"}
                                    </InfoRow>
                                </div>
                                <div className="space-y-3">
                                    <InfoRow icon={MapPin} label={isDelivery ? "Adresse de livraison" : "Retrait"}>
                                        {isDelivery
                                            ? [currentOrder.address?.quartier, currentOrder.address?.ville].filter(Boolean).join(", ") || "—"
                                            : "Au restaurant"}
                                    </InfoRow>
                                    {currentOrder.comment && (
                                        <InfoRow icon={MessageSquare} label="Commentaire">{currentOrder.comment}</InfoRow>
                                    )}
                                </div>
                            </div>

                            {/* Articles */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                                    <h4 className="text-sm font-semibold text-gray-900">Articles</h4>
                                    <span className="text-xs text-gray-500">{itemsCount} article(s)</span>
                                </div>
                                <ul className="divide-y divide-gray-100">
                                    {articles.map((product, index) => (
                                        <li key={index} className="flex items-start justify-between gap-4 px-4 py-3">
                                            <div className="flex items-start gap-3 min-w-0">
                                                <span className="shrink-0 rounded-md bg-primary/10 text-primary text-xs font-bold px-2 py-1">
                                                    x{product.quantity}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900">{product.name}</p>
                                                    {product.quantity > 1 && (
                                                        <p className="text-xs text-gray-500">{XAF.format(product.price)} l&apos;unité</p>
                                                    )}
                                                    {product.comment && (
                                                        <p className="text-xs text-gray-500 italic">« {product.comment} »</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-semibold text-gray-900 shrink-0">
                                                {XAF.format(product.price * product.quantity)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Récapitulatif */}
                                <div className="border-t border-gray-200 bg-primary/5 px-4 py-3 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Sous-total articles</span>
                                        <span className="text-gray-900">{XAF.format(itemsSubtotal)}</span>
                                    </div>
                                    {isDelivery && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>
                                                Frais de livraison
                                                {currentOrder.address?.quartier && (
                                                    <span className="text-gray-500"> ({currentOrder.address.quartier})</span>
                                                )}
                                            </span>
                                            <span className="text-gray-900">
                                                {deliveryFees === 0 ? "Offerts" : XAF.format(deliveryFees)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-2 border-t border-primary/20 text-lg font-bold text-gray-900">
                                        <span>Total TTC</span>
                                        <span className="text-primary">{XAF.format(Number(currentOrder.total))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pied */}
                        <div className="shrink-0 flex justify-end border-t border-gray-200 px-6 py-3">
                            <Button variant="outline" onClick={onClose}>
                                Fermer
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailsDialog;
