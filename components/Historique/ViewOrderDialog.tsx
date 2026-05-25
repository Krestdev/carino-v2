import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressData, MyOrdersResponse, OrdersData } from "@/types/types";
import { PDFViewer } from "@react-pdf/renderer";
import { FileText } from "lucide-react";
import { useState } from "react";
import Loading from "@/app/loading";
import { XAF } from "@/lib/functions";
import { useQuery } from "@tanstack/react-query";
import UserQuery from "@/queries/userQueries";
import OrderPDF from "./OrderInvoice";

interface ViewOrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: OrdersData | null;
  towns: AddressData[] | undefined;
}

const ViewOrderDialog = ({
  open,
  onClose,
  order,
  towns,
}: ViewOrderDialogProps) => {
  const [showPdf, setShowPdf] = useState(false);

  const orders = new UserQuery();

  const orderData = useQuery({
    queryKey: ["order", order?.uuid],
    queryFn: () => orders.getOne(order!.uuid!),
    enabled: open && !!order?.uuid,
  });

  const currentOrder: MyOrdersResponse | undefined =
    orderData.data;

  if (!order) return null;

  if (orderData.isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto w-full p-6 bg-white dark:bg-slate-900 rounded-lg">
          <DialogHeader className="flex flex-col gap-2 items-center py-6">
            <DialogTitle className="text-lg font-semibold text-primary dark:text-white">
              Chargement des détails...
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-500 text-sm">Veuillez patienter pendant la récupération des informations.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentOrder) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto w-full p-6 bg-white dark:bg-slate-900 rounded-lg">
          <DialogHeader className="flex flex-col gap-2 items-center py-6">
            <DialogTitle className="text-lg font-semibold text-destructive">
              Commande introuvable
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <p className="text-gray-500 text-sm text-center">Impossible de charger les détails de cette commande.</p>
            <Button onClick={onClose} variant="secondary" className="text-white">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const livraison = currentOrder.address?.quartier || "-";

  const frais =
    towns?.find((town) => town.quartier === livraison)?.price ?? 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-w-lg max-h-[85vh] overflow-y-auto w-full p-0 bg-white dark:bg-slate-950">
        <DialogHeader className="flex flex-col gap-2 py-6 justify-between bg-primary text-white px-6 rounded-t-lg">
          <DialogTitle className="text-lg font-semibold">
            Détails de la commande #{currentOrder.uuid}
          </DialogTitle>

          <div className="flex flex-col">
            <DialogDescription className="text-white/80">
              {`Statut : ${currentOrder.status}`}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="p-6">
          <Button
            variant="outline"
            onClick={() => setShowPdf(!showPdf)}
            className="mb-4 flex items-center gap-2 border-black text-black dark:border-white dark:text-white"
          >
            <FileText className="h-4 w-4" />

            {showPdf
              ? "Masquer la facture PDF"
              : "Afficher la facture PDF"}
          </Button>

          {!showPdf ? (
            <div className="max-h-[55vh] overflow-y-auto pr-1">
              <div className="relative flex flex-col items-center justify-center w-full px-4 py-16 gap-4 bg-white border rounded-lg">
                <img
                  src="/Logo.svg"
                  alt="Carino"
                  className="absolute top-[-30px] h-[90px] w-[90px] md:h-[110px] md:w-[110px] mx-auto left-1/2 -translate-x-1/2 z-10 object-contain rounded-full bg-white border p-1 shadow-sm"
                />

                <div className="w-full flex flex-col items-center gap-6 pt-8 pb-4">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Détails de la commande
                    </h3>

                    <p className="text-xs text-gray-500 font-normal w-full max-w-[300px] mt-1">
                      Service de restauration – plats et boissons
                      consommés sur place / à emporter / Livraison.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 w-full border-b border-gray-200 pb-4 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-500">ID de commande:</span>
                      <span className="font-mono text-xs text-gray-800">{currentOrder.uuid}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-500">Client:</span>
                      <span className="font-semibold text-gray-800">{currentOrder.first_name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-500">Téléphone:</span>
                      <span className="font-semibold text-gray-800">{currentOrder.phone || "-"}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-500">Adresse de livraison:</span>
                      <span className="font-semibold text-gray-800">{livraison}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-500">Ville:</span>
                      <span className="font-semibold text-gray-800">{currentOrder.address?.ville || "-"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full border-b border-gray-200 pb-4 text-sm text-gray-700">
                    {currentOrder.items.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start gap-2"
                      >
                        <span className="font-medium text-gray-800 flex-1">
                          {`• ${product.name} x${product.quantity}`}
                        </span>

                        <span className="font-semibold text-gray-900 shrink-0">
                          {XAF.format(product.price * product.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 w-full text-sm text-gray-750">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Commande:</span>
                      <span className="font-medium text-gray-800">
                        {XAF.format(
                          Number(currentOrder.total) -
                          Number(frais)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Frais de livraison:</span>
                      <span className="font-medium text-gray-800">
                        {XAF.format(Number(frais))}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                      <span className="font-bold text-gray-900 text-base">Total:</span>
                      <span className="font-bold text-primary text-base">
                        {XAF.format(
                          Number(currentOrder.total)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[500px]">
              <PDFViewer width="100%" height="100%">
                <OrderPDF
                  order={currentOrder}
                  deliveryAddress={towns?.find(
                    (town) => town.quartier === livraison
                  )}
                  orderDate={new Date(
                    currentOrder.registration
                  ).toDateString()}
                />
              </PDFViewer>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-b-lg border-t border-gray-150">
          <Button
            variant="secondary"
            onClick={onClose}
            className="text-white"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDialog;