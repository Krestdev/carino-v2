import { receiptBuffer } from "@/components/receipt";
import { config } from "@/data/config";
import { generateReceiptEmail } from "@/lib/emailTemplate";
import { ReceiptProps } from "@/types/types";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Adresse du restaurant qui reçoit chaque commande payée
const RESTAURANT_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || config.contact.email;

const isEmail = (value?: string) => !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/**
 * Envoie le reçu d'une commande payée :
 * - au restaurant, toujours ;
 * - au client, s'il a une adresse email (compte ou champ invité).
 */
export async function POST(request: Request) {
  try {
    const body: ReceiptProps = await request.json();

    if (!body.client_name || !body.commande?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pdfBuffer = await receiptBuffer(body);

    const transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const attachments = [
      {
        filename: "ticket.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ];
    const from = `"Le Carino Pizzeria" <${process.env.EMAIL}>`;

    const sends: Array<{ to: "restaurant" | "client"; promise: Promise<unknown> }> = [
      {
        to: "restaurant",
        promise: transporter.sendMail({
          from,
          to: RESTAURANT_EMAIL,
          // Répondre au mail répond directement au client
          replyTo: isEmail(body.client_mail) ? body.client_mail : undefined,
          subject: `Nouvelle commande en ligne – ${body.client_name}`,
          html: generateReceiptEmail(body, "restaurant"),
          attachments,
        }),
      },
    ];

    if (isEmail(body.client_mail)) {
      sends.push({
        to: "client",
        promise: transporter.sendMail({
          from,
          to: body.client_mail,
          subject: "Commande sur Le Carino Pizzeria",
          html: generateReceiptEmail(body, "client"),
          attachments,
        }),
      });
    }

    // Un échec côté client ne doit pas empêcher la notification du restaurant (et inversement)
    const results = await Promise.allSettled(sends.map((s) => s.promise));
    const sent = sends.filter((_, i) => results[i].status === "fulfilled").map((s) => s.to);
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(`Error sending email to ${sends[i].to}:`, result.reason);
      }
    });

    if (sent.length === 0) {
      return NextResponse.json({ error: "Failed to send Receipt" }, { status: 500 });
    }
    return NextResponse.json({ message: "Receipt sent", sent });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send Receipt" },
      { status: 500 }
    );
  }
}
