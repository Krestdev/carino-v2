import { ReceiptProps } from "@/types/types";
import { XAF } from "./functions";

/** Destinataire du mail : le client (reçu) ou le restaurant (notification de commande) */
export type ReceiptAudience = "client" | "restaurant";

/** Le nom, l'adresse… sont saisis par le client : on les échappe avant de les mettre dans le HTML */
const escapeHtml = (value: unknown) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const formatAddress = (order: ReceiptProps) =>
    order.Address
        ? [order.Address.street, order.Address.name, order.Address.city].filter(Boolean).join(", ")
        : "";

const formatDueDate = (date?: Date | string) =>
    date
        ? new Date(date).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

export function generateReceiptEmail(order: ReceiptProps, audience: ReceiptAudience = "client") {
    const total_amount = order.commande.reduce((accumulator, item) => {
        const price = item.price * item.quantity;
        return accumulator + price;
    }, 0);
    const isRestaurant = audience === "restaurant";
    const isDelivery = order.mode ? order.mode === "delivery" : order.fees > 0;
    const address = formatAddress(order);
    const dueDate = formatDueDate(order.due_date);
    const title = isRestaurant ? "Nouvelle commande en ligne" : "Validation de votre commande";

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">

        <h2 style="text-align: center; color: #000;">${title}</h2>

        ${isRestaurant
            ? `<p>Une commande vient d'être <strong>payée</strong> sur le site.</p>
        <p><strong>Mode :</strong> ${isDelivery ? "Livraison à domicile" : "À emporter"}</p>`
            : `<p><strong>Bonjour ${escapeHtml(order.client_name)}</strong>,</p>
        <p>Vous venez de passer une commande chez <strong>Le Carino Pizzeria</strong>.</p>`}

        <p>${isRestaurant ? "Détail de la commande :" : "Voici le récapitulatif de votre commande :"}</p>

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
                <td style="padding: 5px;">${item.quantity} x ${escapeHtml(item.name)}</td>
                <td style="padding: 5px; text-align: right;">${XAF.format(item.price)}</td>
                <td style="padding: 5px; text-align: right;">${XAF.format(
                    item.price * item.quantity
                )}</td>
            </tr>
            `
            )
            .join("")}
            ${order.fees > 0 ? `
            <tr>
                <td style="padding:5px;">Frais de livraison</td>
                <td style="padding: 5px; text-align: right;"></td>
                <td style="padding: 5px; text-align: right;">${XAF.format(order.fees)}</td>
            </tr>` : ""}
        </table>

        <p style="text-align: right; font-size: 18px; margin-top: 10px;">
            <strong>Total TTC : ${XAF.format(total_amount + order.fees)}</strong>
        </p>

        <div style="border: 2px solid #000; padding: 10px; margin-top: 20px;">
            <p style="text-align: center;"><strong>Le Carino Pizzeria</strong></p>
            <p style="text-align: center;">Playce Warda, Yaoundé, Cameroun</p>
            <p style="text-align: center;">Tél : +237696541055</p>
            <p><strong>Client :</strong> ${escapeHtml(order.client_name)}</p>
            ${order.client_phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(order.client_phone)}</p>` : ""}
            ${isRestaurant && order.client_mail ? `<p><strong>Email :</strong> ${escapeHtml(order.client_mail)}</p>` : ""}
            ${address ? `<p><strong>Adresse :</strong> ${escapeHtml(address)}</p>` : ""}
            ${dueDate ? `<p><strong>Prévision :</strong> ${dueDate}</p>` : ""}
        </div>

        ${isRestaurant
            ? ""
            : `<p style="text-align: center; margin-top: 15px;">
            Présentez ce reçu au ${isDelivery ? "livreur pour récupérer" : "restaurant pour retirer"} votre commande.
        </p>

        <p>Bonne dégustation et à bientôt.</p>`}

    </body>
    </html>
    `;
}
