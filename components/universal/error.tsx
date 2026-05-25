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
        <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-16">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Error Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-55 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-2xl mb-6 shadow-sm">
                        <AlertCircle className="h-10 w-10 animate-bounce" />
                    </div>

                    {/* Status Code / Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-950 dark:text-white mb-2 font-serif">
                        {title}
                    </h1>

                    {statusCode && (
                        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 mb-4">
                            Erreur {statusCode}
                        </span>
                    )}

                    {/* Message */}
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-8 max-w-sm">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mb-8">
                        {reset ? (
                            <Button
                                onClick={reset}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 px-6"
                            >
                                <RefreshCw className="h-4 w-4 shrink-0" />
                                Réessayer
                            </Button>
                        ) : (
                            <Button
                                onClick={() => window.location.reload()}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 px-6"
                            >
                                <RefreshCw className="h-4 w-4 shrink-0" />
                                Recharger la page
                            </Button>
                        )}

                        <Link href="/" passHref className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="w-full border-gray-250 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 text-gray-700 dark:text-white flex items-center justify-center gap-2 px-6"
                            >
                                <Home className="h-4 w-4 shrink-0" />
                                Page d'accueil
                            </Button>
                        </Link>
                    </div>

                    {/* Contact details */}
                    <div className="w-full pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
                        <p className="text-xs text-gray-450 uppercase font-bold tracking-wider mb-3">
                            Assistance Clientèle
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-semibold">
                            <a
                                href="tel:+237696541055"
                                className="flex items-center gap-1.5 text-primary hover:text-primary/90 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
                            >
                                <span>📞</span> +237 696 54 10 55
                            </a>
                            <a
                                href="mailto:info@le-carino.com"
                                className="flex items-center gap-1.5 text-primary hover:text-primary/90 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
                            >
                                <span>✉️</span> info@le-carino.com
                            </a>
                        </div>
                    </div>

                    {/* Technical developer details */}
                    {process.env.NODE_ENV === "development" && error && (
                        <div className="w-full mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-left">
                            <details className="text-xs group">
                                <summary className="text-gray-450 hover:text-gray-650 cursor-pointer font-medium select-none">
                                    Détails techniques
                                </summary>
                                <pre className="mt-2 text-[10px] bg-slate-50 dark:bg-slate-950 p-4 rounded-lg overflow-auto max-h-40 font-mono text-red-600 dark:text-red-400 border border-red-50/50 dark:border-red-950/20">
                                    {error.stack || error.message}
                                </pre>
                            </details>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Error;