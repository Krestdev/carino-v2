"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn, UserRound } from "lucide-react";

interface GuestCheckoutChoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChooseLogin: () => void;
  onContinueAsGuest: () => void;
}

const GuestCheckoutChoiceDialog = ({
  open,
  onOpenChange,
  onChooseLogin,
  onContinueAsGuest,
}: GuestCheckoutChoiceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105 rounded-2xl">
        <DialogHeader>
          <DialogTitle>Comment souhaitez-vous continuer ?</DialogTitle>
          <DialogDescription>
            Connectez-vous pour retrouver votre historique et vos points de
            fidélité, ou continuez sans créer de compte.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onContinueAsGuest}
          >
            <UserRound className="w-4 h-4 mr-2" />
            Continuer sans compte
          </Button>
          <Button className="flex-1" onClick={onChooseLogin}>
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuestCheckoutChoiceDialog;
