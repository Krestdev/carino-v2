import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddtressData, MyOrdersResponse, OrdersData } from "@/types/types";
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
  towns: AddtressData[] | undefined;
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
    return <Loading />;
  }

  if (!currentOrder) {
    return null;
  }

  const livraison = currentOrder.address?.quartier || "-";

  const frais =
    towns?.find((town) => town.quartier === livraison)?.prix ?? 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[50vw]! max-h-[85vh]! overflow-x-auto w-full p-0">
        <DialogHeader className="flex flex-col gap-2 py-10! justify-between bg-primary text-white px-4">
          <DialogTitle className="text-lg font-semibold">
            Détails de la commande #{currentOrder.uuid}
          </DialogTitle>

          <div className="flex flex-col">
            <DialogDescription className="text-white">
              {`Statut : ${currentOrder.status}`}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="p-4">
          <Button
            variant="outline"
            onClick={() => setShowPdf(!showPdf)}
            className="mb-4 flex items-center gap-2 border-black text-black"
          >
            <FileText className="h-4 w-4" />

            {showPdf
              ? "Masquer la facture PDF"
              : "Afficher la facture PDF"}
          </Button>

          {!showPdf ? (
            <div className="h-[600px] overflow-auto">
              <div className="relative flex flex-col items-center justify-center max-w-[880px] w-full px-[10px] py-[62px] gap-[10px] bg-white">
                <img
                  src="/Logo.svg"
                  alt="Carino"
                  className="absolute top-[-10px] h-[150px] max-w-[150px] w-full mx-auto left-[35%] z-10 object-cover rounded-full"
                />

                <div className="w-full flex flex-col items-center gap-6 border pt-[70px] pb-8 px-7">
                  <div className="flex flex-col items-center">
                    <h3 className="text-[30px]">
                      Détails de la commande
                    </h3>

                    <p className="text-[12px] font-normal w-[250px] text-center">
                      Service de restauration – plats et boissons
                      consommés sur place / à emporter / Livraison.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 w-full border-b border-[#848484] pb-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-normal">
                        ID de commande:
                      </h4>

                      <h4 className="text-[10.5px]">
                        {currentOrder.uuid}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="font-normal">
                        Client:
                      </h4>

                      <h4>{currentOrder.first_name}</h4>
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="font-normal">
                        Téléphone:
                      </h4>

                      <h4>{currentOrder.phone || "-"}</h4>
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="font-normal">
                        Adresse de livraison:
                      </h4>

                      <h4>{livraison}</h4>
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="font-normal">
                        Ville:
                      </h4>

                      <h4>
                        {currentOrder.address?.ville || "-"}
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full border-b border-[#848484] pb-2">
                    {currentOrder.items.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between"
                      >
                        <h4 className="font-normal w-[220px]">
                          {`• ${product.name} x${product.quantity}`}
                        </h4>

                        <h4>
                          {XAF.format(product.price * product.quantity)}
                        </h4>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1 w-full border-b border-[#848484] pb-2">
                    <div className="flex justify-between">
                      <h4 className="font-normal">
                        Commande
                      </h4>

                      <h4>
                        {XAF.format(
                          Number(currentOrder.total) -
                          Number(frais)
                        )}
                      </h4>
                    </div>

                    <div className="flex justify-between">
                      <h4 className="font-normal">
                        Frais de livraison:
                      </h4>

                      <h4>
                        {XAF.format(Number(frais))}
                      </h4>
                    </div>

                    <div className="flex justify-between">
                      <h4 className="font-semibold">
                        Total:
                      </h4>

                      <h4>
                        {XAF.format(
                          Number(currentOrder.total)
                        )}
                      </h4>
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

        <DialogFooter className="px-4 py-2">
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