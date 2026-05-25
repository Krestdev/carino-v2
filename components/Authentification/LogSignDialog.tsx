"use client";

import { Dispatch, SetStateAction } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { User, LogIn, UserPlus } from "lucide-react";

interface LogSignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setOpenLogin: Dispatch<SetStateAction<boolean>>;
    setOpenSignup: Dispatch<SetStateAction<boolean>>;
}

const LogSignDialog = ({ open, onOpenChange, setOpenLogin, setOpenSignup }: LogSignDialogProps) => {

    const switchToLogin = () => {
        onOpenChange(false);
        setOpenSignup(false);
        setOpenLogin(true);
    };

    const switchToSignup = () => {
        onOpenChange(false);
        setOpenLogin(false);
        setOpenSignup(true);
    };

    const handleClose = () => {
        onOpenChange(false);
        setOpenLogin(false);
        setOpenSignup(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] overflow-hidden p-8 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl shadow-2xl">
                {/* Decorative background gradients */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Header Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 text-amber-500 rounded-2xl mb-6 shadow-sm">
                        <User className="h-10 w-10" />
                    </div>

                    {/* Dialog Header */}
                    <DialogHeader className="flex flex-col items-center justify-center mb-6">
                        <DialogTitle className="text-xl md:text-2xl font-bold text-gray-950 dark:text-white mb-2 font-serif text-center uppercase tracking-wide">
                            Connexion / Inscription
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm max-w-[340px] text-center">
                            Créez un compte ou connectez-vous pour accéder à tous nos services
                        </DialogDescription>
                    </DialogHeader>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
                        {/* Se Connecter */}
                        <div
                            onClick={switchToLogin}
                            className="cursor-pointer flex flex-col items-center justify-center h-24 px-4 py-3 border border-indigo-200/60 dark:border-indigo-950/40 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40 rounded-xl transition-all group shadow-sm hover:shadow-md"
                        >
                            <LogIn className="h-5 w-5 text-[#312E81] dark:text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                            <p className="text-[14px] font-bold text-[#312E81] dark:text-indigo-300">
                                Se connecter
                            </p>
                            <p className="text-[10px] text-[#4B5563] dark:text-gray-400 mt-0.5">
                                Vous avez déjà un compte
                            </p>
                        </div>

                        {/* S'inscrire */}
                        <div
                            onClick={switchToSignup}
                            className="cursor-pointer flex flex-col items-center justify-center h-24 px-4 py-3 border border-amber-200/60 dark:border-amber-950/40 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 rounded-xl transition-all group shadow-sm hover:shadow-md"
                        >
                            <UserPlus className="h-5 w-5 text-[#7C2D12] dark:text-amber-450 mb-1.5 group-hover:scale-110 transition-transform" />
                            <p className="text-[14px] font-bold text-[#7C2D12] dark:text-amber-300">
                                S'inscrire
                            </p>
                            <p className="text-[10px] text-[#4B5563] dark:text-gray-400 mt-0.5">
                                Vous n'avez pas de compte
                            </p>
                        </div>
                    </div>

                    {/* Dialog Footer */}
                    <DialogFooter className="flex w-full justify-end">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="w-full sm:w-auto border-gray-250 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 text-gray-700 dark:text-white"
                        >
                            Fermer
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LogSignDialog;