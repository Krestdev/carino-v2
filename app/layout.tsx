import type { Metadata } from "next";
import { PT_Sans, Oleo_Script_Swash_Caps } from "next/font/google";
import "./globals.css";
import { config } from "../data/config";
import Footer from "../components/footer";
import Header from "../components/header";
import QueryProvider from "@/providers/queryProvider";

// Police principale
const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

// Police secondaire
const oleo = Oleo_Script_Swash_Caps({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-oleo",
});

export const metadata: Metadata = {
  title: `${config.siteName} - Commandez vos plats préférés Pizzas, burgers, glaces et bien d'autres`,
  description:
    "Commandez vos plats préférés du restaurant le Carino et faites-vous livrer directement chez vous. Burgers, pizzas, glaces et bien d'autres sont disponibles, il ne vous reste qu'à choisir !",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${ptSans.variable} ${oleo.variable} antialiased`}>
        <QueryProvider>
          <Header />
          <main className="mt-[80px]">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
