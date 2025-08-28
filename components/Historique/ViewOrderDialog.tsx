import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrdersData } from "@/types/types";
import { PDFViewer } from "@react-pdf/renderer";
import { FileText, X } from "lucide-react";
import { useState } from "react";
import OrderInvoice from "./OrderInvoice";

interface ViewOrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: OrdersData | null;
}

const ViewOrderDialog = ({ open, onClose, order }: ViewOrderDialogProps) => {
  const [showPdf, setShowPdf] = useState(false);

  if (!order) return null;

  const orderData = {
    zelty_order_id: order.zelty_order_id,
    customerName: "ATANGANA CHARLES",
    phoneNumber: "+237 675757575",
    deliveryAddress: "POSTE CENTRALE",
    location: "À la monté de l'avenue Kenedy",
    products: order.items,
    deliveryFee: "2 000",
    itemsAmount: (Number(order.prix_total) - 2000).toString(),
    totalAmount: order.prix_total.toString(),
    is_paid: order.is_paid,
    is_delivred: order.is_delivred,
    created_at: order.created_at,
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="flex flex-row items-center justify-between bg-primary text-white px-4 py-2">
          <DialogTitle className="text-lg font-semibold">
            Détails de la commande #{order.zelty_order_id}
          </DialogTitle>
          <div className="flex flex-col">
            <DialogDescription>
              {`Statut payement : ${order.is_paid ? "Payé" : "Non payé"}`}
            </DialogDescription>
            <DialogDescription>
              {`Statut livraison : ${
                order.is_delivred ? "Livré" : "Non livré"
              }`}
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-primary/70"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="p-4">
          <Button
            variant="outline"
            onClick={() => setShowPdf(!showPdf)}
            className="mb-4 flex items-center gap-2 border-black text-black"
          >
            <FileText className="h-4 w-4" />
            {showPdf ? "Masquer la facture PDF" : "Afficher la facture PDF"}
          </Button>

          {!showPdf ? (
            <div className="h-[600px] overflow-auto">
              <div className="relative flex flex-col items-center justify-center max-w-[880px] w-full px-[10px] py-[62px] gap-[10px] bg-white">
                <img
                  src="Logo.svg"
                  alt="Carino"
                  className="absolute top-[-10px] h-[150px] max-w-[150px] w-full mx-auto left-[35%] z-10 object-cover rounded-full"
                />
                <div className="w-full flex flex-col items-center gap-6 border pt-[70px] pb-8 px-7">
                  <div className="flex flex-col items-center">
                    <h3 className="text-[30px]">{"Détails de la commande"}</h3>
                    <p className="text-[12px] font-normal w-[250px] text-center">
                      {
                        "Service de restauration – plats et boissons consommés sur place / à emporter / Livraison."
                      }
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 w-full border-b border-[#848484] pb-2">
                    <div className="flex justify-between">
                      <h4 className="font-normal">{"ID de transaction:"}</h4>
                      <h4>{"#" + orderData.zelty_order_id}</h4>
                    </div>
                    <div className="flex justify-between">
                      <h4 className="font-normal">{"Numéro de tel:"}</h4>
                      <h4>{orderData.phoneNumber}</h4>
                    </div>
                    <div className="flex justify-between">
                      <h4 className="font-normal">{"Adresse de livraison:"}</h4>
                      <h4>{orderData.deliveryAddress}</h4>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-normal">{"Lieu dit:"}</h4>
                      <h4 className="font-normal">{orderData.location}</h4>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-full border-b border-[#848484] pb-2">
                    {orderData.products.map(
                      (product: [string, number], index: number) => {
                        return (
                          <div key={index} className="flex justify-between">
                            <h4 className="font-normal w-[220px]">{`• ${product[0]}`}</h4>
                            <h4>{`${product[1]} FCFA`}</h4>
                          </div>
                        );
                      }
                    )}
                  </div>
                  <div className="flex flex-col gap-1 w-full border-b border-[#848484] pb-2">
                    <div className="flex justify-between">
                      <h4 className="font-normal">{"Commande"}</h4>
                      <h4>{orderData.itemsAmount} FCFA</h4>
                    </div>
                    <div className="flex justify-between">
                      <h4 className="font-normal">{"Frais de livraison:"}</h4>
                      <h4>{orderData.deliveryFee} FCFA</h4>
                    </div>
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{"Total:"}</h4>
                      <h4>{orderData.totalAmount} FCFA</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[500px]">
              <PDFViewer width="100%" height="100%">
                <OrderInvoice
                  order={{
                    ...orderData,
                    is_paid: Boolean(orderData.is_paid),
                    is_delivred: Boolean(orderData.is_delivred),
                  }}
                />
              </PDFViewer>
            </div>
          )}
        </div>

        <DialogFooter className="px-4 py-2">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDialog;
