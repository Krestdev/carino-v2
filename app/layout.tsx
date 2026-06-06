import type { Metadata } from "next";
import {
  Open_Sans,
  Oleo_Script_Swash_Caps,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import { config } from "../data/config";
import Footer from "../components/footer";
import Header from "../components/header";
import QueryProvider from "@/providers/queryProvider";
import { Toaster } from "@/components/ui/sonner";
import Transaction from "@/components/universal/Transaction";
import { AppProvider } from "@/providers/appContext";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeActivator } from "@/components/theme-selector";
import Snowfall from "@/components/snowfall";
import { UseOnTheme } from "@/hooks/useOnTheme";
import Auth from "./Auth";
import { ToastContainer } from "react-toastify";
import { RouteGuard } from "@/providers/RouteGuard"; // Import du nouveau composant
import LayoutWrapper from "@/components/LayoutWrapper";

// Polices (reste identique)
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-open-sans",
});

const oleo = Oleo_Script_Swash_Caps({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-oleo",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const generalSansVariable = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-general-sans",
});

export const metadata: Metadata = {
  title: `${config.siteName} - Commandez vos plats préférés Pizzas, burgers, glaces et bien d'autres`,
  description: "Commandez vos plats préférés du restaurant le Carino et faites-vous livrer directement chez vous. Burgers, pizzas, glaces et bien d'autres sont disponibles, il ne vous reste qu'à choisir !",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${openSans.variable} ${oleo.variable} ${playfair.variable} ${generalSansVariable.variable} antialiased`}
      >
        <ThemeProvider
          attribute={"class"}
          defaultTheme="default"
          enableSystem
          disableTransitionOnChange
          themes={["default", "christmas", "newyear"]}
        >
          <AppProvider>
            <QueryProvider>
              <ThemeActivator />
              <UseOnTheme selectedTheme="christmas">
                <Snowfall />
              </UseOnTheme>

              {/* Utilisation du wrapper client */}
              <LayoutWrapper>
                <RouteGuard>
                  <main>{children}</main>
                </RouteGuard>
              </LayoutWrapper>

              <Transaction />
              <Auth />
              <Toaster />
              <ToastContainer />
            </QueryProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}