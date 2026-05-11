"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ErrorProps {
    error?: Error & { digest?: string };
    reset?: () => void;
    statusCode?: number;
    title?: string;
    message?: string;
}

function Error({
    error,
    reset,
    statusCode = 500,
    title = "Quelque chose s'est mal passé",
    message = "Une erreur inattendue s'est produite.",
}: ErrorProps) {
    const router = useRouter();

    if (statusCode === 401) {
        router.replace("/tableau-de-bord");
        toast.error("Non autorisé");
        return null;
    }

    // Détection erreur réseau
    if (error?.message?.toLowerCase().includes("network")) {
        statusCode = 503;
        title = "Erreur de connexion";
        message = "Vérifiez votre connexion internet";
    }

    return (
        <div className="bg-gray-50 py-24">

            {/* Contenu en deux colonnes */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col items-center justify-center gap-12">
                    {/* Colonne gauche - Illustration */}
                    <div className="order-2 md:order-1">
                        <div className="px-12 bg-white rounded-2xl shadow-sm border p-8 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-2xl mb-6">
                                <AlertCircle className="h-10 w-10 text-red-500" />
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                {title}
                            </h1>

                            <p className="text-gray-600 mb-8">
                                {message}
                            </p>

                            <div className="space-y-3">
                                {reset ? (
                                    <Button onClick={reset} className="w-full">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Réessayer
                                    </Button>
                                ) : (
                                    <Button onClick={() => window.location.reload()} className="w-full">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Recharger la page
                                    </Button>
                                )}

                                <Link href="/">
                                    <Button variant="outline" className="w-full">
                                        <Home className="h-4 w-4 mr-2" />
                                        Page d'accueil
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-3 mt-3 text-sm flex flex-col items-center justify-center">
                                <p className="text-gray-600">
                                    Vous pouvez passer votre commande au
                                </p>
                                <div className="pt-2 space-y-2">
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">📞</span>
                                        <a href="tel:+237696541055" className="text-blue-600 hover:underline">
                                            +237 696 54 10 55
                                        </a>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">✉️</span>
                                        <a href="mailto:info@le-carino.com" className="text-blue-600 hover:underline">
                                            info@le-carino.com
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {process.env.NODE_ENV === "development" && error && (
                                <div className="mt-6 pt-6 border-t text-left">
                                    <details className="text-sm">
                                        <summary className="text-gray-500 cursor-pointer">
                                            Détails techniques
                                        </summary>
                                        <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-auto">
                                            {error.message}
                                        </pre>
                                    </details>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Error;