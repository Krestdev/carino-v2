"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Phone, User, ReceiptText, Loader2 } from "lucide-react";
import { XAF } from "@/lib/functions";
import { useQuery } from "@tanstack/react-query";
import UserQuery from "@/queries/userQueries";
import { statusBadgeClass, statusLabel } from "./status";

interface OrderDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    uuid: string | null;
}

const OrderDetailsDialog = ({ open, onClose, uuid }: OrderDetailsDialogProps) => {
    const orders = new UserQuery();

    const orderData = useQuery({
        queryKey: ["order", "admin", uuid],
        queryFn: () => orders.getOne(uuid!),
        enabled: open && !!uuid,
    });

    const currentOrder = orderData.data;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] rounded-[24px] p-0 overflow-hidden shadow-2xl bg-white text-gray-800 border border-gray-200">
                <div className="w-full h-2 bg-primary" />

                {orderData.isLoading || !currentOrder ? (
                    <div className="flex justify-center p-10">
                        <DialogTitle className="sr-only">Chargement de la commande</DialogTitle>
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="px-8 pb-8 pt-6 flex flex-col items-center text-center gap-6">
                        <div className="flex flex-col items-center gap-4">
                            <Badge className={statusBadgeClass(currentOrder.status)}>
                                {statusLabel(currentOrder.status)}
                            </Badge>

                            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-primary/10">
                                <ReceiptText className="w-10 h-10 text-primary" />
                            </div>
                        </div>

                        <DialogHeader className="gap-3 items-center">
                            <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                                Commande #{currentOrder.display_id || currentOrder.uuid.split("-")[0]}
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 text-[15px] leading-relaxed max-w-[400px] mx-auto text-center">
                                ID Complet : {currentOrder.uuid}
                            </DialogDescription>
                        </DialogHeader>

                        <ScrollArea className="h-[400px] w-full pr-4">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-200 text-left">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Informations Client</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 p-2 rounded-full"><User className="h-4 w-4 text-primary" /></div>
                                                <span className="font-medium text-gray-900">{currentOrder.first_name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 p-2 rounded-full"><Phone className="h-4 w-4 text-primary" /></div>
                                                <span className="font-medium text-gray-900">{currentOrder.phone || currentOrder.address?.phone || "-"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            {currentOrder.mode === "delivery" ? "Livraison" : "À emporter"}
                                        </h4>
                                        <div className="flex items-start gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full shrink-0"><MapPin className="h-4 w-4 text-primary" /></div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{currentOrder.address?.quartier || "-"}</span>
                                                <span className="text-sm text-gray-500">{currentOrder.address?.ville || "-"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-left">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Articles Commandés</h4>
                                    <div className="space-y-4">
                                        {currentOrder.items.map((product, index) => (
                                            <div key={index} className="flex justify-between items-center gap-4">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="bg-white border-gray-300 w-8 justify-center rounded-md text-gray-900 font-bold">
                                                        x{product.quantity}
                                                    </Badge>
                                                    <span className="font-medium text-gray-700">{product.name}</span>
                                                </div>
                                                <span className="font-semibold text-gray-900 shrink-0">
                                                    {XAF.format(product.price * product.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-primary/10 p-5 rounded-xl border border-primary/30 text-left">
                                    <div className="space-y-3">
                                        <Separator className="my-2 bg-primary/30" />
                                        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                            <span>Total TTC</span>
                                            <span>{XAF.format(Number(currentOrder.total))}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>

                        <Button
                            variant="ghost"
                            className="w-full h-12 text-base font-medium rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                            onClick={onClose}
                        >
                            Fermer
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailsDialog;
