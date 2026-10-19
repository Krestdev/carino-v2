import useStore from "@/context/store";
import ProductQuery from "@/queries/productQuery";

/**
 * À appeler quand le paiement est confirmé : envoie le reçu au restaurant et au
 * client (route /api/ticket), à partir des données préparées par le formulaire.
 * Les données sont vidées aussitôt, pour ne jamais envoyer deux fois la même commande.
 */
export function sendOrderReceipt() {
  const { receiptData, setReceiptData } = useStore.getState();
  if (!receiptData) return;
  setReceiptData();
  new ProductQuery().postTicket(receiptData).catch((error) => {
    console.error("Envoi du reçu de commande impossible :", error);
  });
}
