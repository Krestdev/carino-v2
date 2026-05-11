import { ReceiptProps } from "@/types/types";
import { XAF } from "./functions";

export function generateReceiptEmail(order: ReceiptProps) {
    const total_amount = order.commande.reduce((accumulator, item) => {
        const price = item.price * item.quantity;
        return accumulator + price;
    }, 0);
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Validation de votre commande</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
  
        <h2 style="text-align: center; color: #000;">Validation de votre commande</h2>
  
        <p><strong>Bonjour ${order.client_name}</strong>,</p>
        <p>Vous venez de passer une commande chez <strong>Le Carino Pizzeria</strong>.</p>
  
        <p>Voici le récapitulatif de votre commande :</p>
  
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="border-bottom: 2px solid #000; padding: 5px; text-align: left;">Nom</th>
                <th style="border-bottom: 2px solid #000; padding: 5px; text-align: right;">P.U.</th>
                <th style="border-bottom: 2px solid #000; padding: 5px; text-align: right;">Prix</th>
            </tr>
            ${order.commande
            .map(
                (item) => `
            <tr>
                <td style="padding: 5px;">${item.quantity} x ${item.name}</td>
                <td style="padding: 5px; text-align: right;">${XAF.format(item.price)}</td>
                <td style="padding: 5px; text-align: right;">${XAF.format(
                    item.price * item.quantity
                )}</td>
            </tr>
            `
            )
            .join("")}
              ${order.fees > 0 && `
              <tr>
              <td style="padding:5px;">Frais de livraison</td>
              <td style="padding: 5px; text-align: right;"></td>
              <td style="padding: 5px; text-align: right;">${XAF.format(order.fees)}</td>
              </tr>`}
        </table>
  
        <p style="text-align: right; font-size: 18px; margin-top: 10px;">
            <strong>Total TTC : ${XAF.format(total_amount + order.fees)}</strong> 
        </p>
  
        <div style="border: 2px solid #000; padding: 10px; margin-top: 20px;">
            <p style="text-align: center;"><strong>Le Carino Pizzeria</strong></p>
            <p style="text-align: center;">Playce Warda, Yaoundé, Cameroun</p>
            <p style="text-align: center;">Tél : +237696541055</p>
            <p><strong>Client :</strong> ${order.client_name}</p>
            <p><strong>Adresse :</strong> ${order.Address}</p>
            ${order.due_date && `<p><strong>Prévision :</strong> ${order.due_date}</p>`}
        </div>
  
        <p style="text-align: center; margin-top: 15px;">
            Présentez ce reçu au ${order.fees > 0 ? "Livreur pour récupérer" : "restaurant pour retirer"} votre commande.
        </p>
  
        <p>Bonne dégustation et à bientôt.</p>
  
    </body>
    </html>
    `;
}
