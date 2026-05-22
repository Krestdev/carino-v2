
import type { Metadata } from "next";
import { Open_Sans, Oleo_Script_Swash_Caps, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
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
import { RouteGuard } from "@/providers/RouteGuard";
import Pupop from "@/components/universal/pupop";
import Pop from "@/components/universal/Pop";

// Police principale
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-open-sans",
});

// Police secondaire
const oleo = Oleo_Script_Swash_Caps({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-oleo",
});

// Police pour les titres
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

// Police pour les petits titres
const generalSansVariable = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-general-sans",
});

// Méta-données
export const metadata: Metadata = {
  title: `${config.siteName} - Commandez vos plats préférés Pizzas, burgers, glaces et bien d'autres`,
  description:
    "Commandez vos plats préférés du restaurant le Carino et faites-vous livrer directement chez vous. Burgers, pizzas, glaces et bien d'autres sont disponibles, il ne vous reste qu'à choisir !",
};

// Layout principal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Définition de l'URL de base
  // const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.le-carino.com/api/";
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  console.log(baseURL);
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${openSans.variable} ${oleo.variable} ${playfair.variable} ${generalSansVariable.variable} antialiased`}>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="default"
          enableSystem
          disableTransitionOnChange
          themes={["default", "christmas", "newyear"]}>
          <AppProvider baseURL={baseURL ?? ""}>
            <QueryProvider>
              <ThemeActivator />
              <UseOnTheme selectedTheme="christmas">
                <Snowfall />
              </UseOnTheme>
              <Header />
              <RouteGuard>
                <main>{children}</main>
              </RouteGuard>
              <Transaction />
              <Auth />
              <Footer />
              <Toaster />
              <ToastContainer />
              {/* <Pop /> */}
            </QueryProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
