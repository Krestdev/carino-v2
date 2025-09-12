import { receiptBuffer } from "@/components/receipt";
import { generateReceiptEmail } from "@/lib/emailTemplate";
import { ReceiptProps } from "@/types/types";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
//import Receipt from "@/components/receipt";

export async function POST(request: Request) {
  try {
    const body: ReceiptProps = await request.json();

    // Validate required fields
    if (!body.client_mail || !body.client_name || !body.commande) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Import Receipt dynamically to prevent server issues
    // Generate PDF Buffer
    const pdfBuffer = await receiptBuffer(body);

    // Create email transporter
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

    const htmlContent = generateReceiptEmail(body);
    // Calculate total amount
    //const total_amount = body.commande.reduce((acc, item) => acc + item.price * item.qte, 0);

    // Email content
    const mailOptions = {
      from: `"Le Carino Pizzeria" <${process.env.EMAIL}>`,
      to: body.client_mail,
      subject: `Commande sur LeCarino Pizzeria`,
      /* text: `Bonjour ${body.client_name},\n\nMerci pour votre commande !\n\nVotre ticket est joint au mail ci-contre.\n\nVotre commande:\n${body.commande
        .map((cartItem) => `${cartItem.nom} x ${cartItem.qte} -- ${cartItem.price * cartItem.qte} FCFA`)
        .join("\n")}\n\nFrais de livraison: ${body.fees} FCFA\nTotal: ${total_amount + body.fees} FCFA\n\nCordialement,\nLeCarino Pizzeria - Carrefour PlaYce Warda.`, */
      attachments: [
        {
          filename: "ticket.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
      html: htmlContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Receipt sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send Receipt" },
      { status: 500 }
    );
  }
}
