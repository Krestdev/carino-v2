"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface LogSignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setOpenLogin: Dispatch<SetStateAction<boolean>>;
    setOpenSignup: Dispatch<SetStateAction<boolean>>;
}

const LogSignDialog = ({ open, onOpenChange, setOpenLogin, setOpenSignup }: LogSignDialogProps) => {

    const switchToLogin = () => {
        onOpenChange(false)
        setOpenSignup(false)
        setOpenLogin(true);
    };

    const switchToSignup = () => {
        onOpenChange(false)
        setOpenLogin(false);
        setOpenSignup(true)
    };

    const handleClose = () => {
        onOpenChange(false);
        setOpenLogin(false);
        setOpenSignup(false)
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[520px] overflow-hidden">
                {/* Header avec onglets */}
                <DialogHeader className="flex flex-col justify-center">
                    <DialogTitle>connexion / inscription</DialogTitle>
                    <DialogDescription className="te">
                        {"Créez un compte ou connectez-vous pour accéder à tous nos services"}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2 w-full">
                    <div onClick={switchToLogin} className="cursor-pointer flex flex-col items-center justify-center h-16 px-5 py-3 border border-[#818CF8] bg-[#E0E7FF] hover:bg-[#E0E7FF]/90">
                        <p className="text-[14px] font-semibold font-general text-[#312E81]">{"Se connecter"}</p>
                        <p className="text-[10px] font-general text-[#4B5563]">{"Vous avez déjà un compte"}</p>
                    </div>
                    <div onClick={switchToSignup} className="cursor-pointer flex flex-col items-center justify-center h-16 px-5 py-3 border border-[#FB923C] bg-[#FFEDD5] hover:bg-[#FFEDD5]/90">
                        <p className="text-[14px] font-semibold font-general text-[#7C2D12]">{"S'inscrire"}</p>
                        <p className="text-[10px] font-general text-[#4B5563]">{"Vous n'avez pas de compte"}</p>
                    </div>
                </div>
                <DialogFooter className="flex w-full justify-end">
                    <Button variant={"outline"} onClick={handleClose}>{"Fermer"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LogSignDialog;