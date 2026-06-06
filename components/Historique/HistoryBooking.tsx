import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ReservationData } from "@/types/types";
import { useState } from "react";
import { LuCheck, LuEye, LuX } from "react-icons/lu";
import { Button } from "../ui/button";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import ViewReservationDialog from "./ViewReservationDialog";
import useStore from "@/context/store";
import ReservationQuery from "@/queries/bookingsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, CheckCheck, MoreVertical } from "lucide-react";

interface Props {
    title: string;
    data?: ReservationData[];
}

const HistoryBooking = ({ title, data }: Props) => {
    const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmationDialog, setConfirmationDialog] = useState<{
        open: boolean;
        action: 'validate' | 'reject' | 'settle' | 'cancel' | 'complete' | null;
        reservationId: string | null;
        reservationRef: string;
    }>({
        open: false,
        action: null,
        reservationId: null,
        reservationRef: '',
    });

    type StatusCode = "Pending" | "Confirmed" | "Customer Settled" | "Cancelled" | "Complete";

    const { user } = useStore();
    const queryClient = useQueryClient();

    const bookingQuery = new ReservationQuery();
    const validate = useMutation({
        mutationKey: ["validate-bookings"],
        mutationFn: (id: string) => bookingQuery.confirmReservation(id),
        onSuccess: () => {
            toast.success("Réservation confirmée");
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            setConfirmationDialog({ open: false, action: null, reservationId: null, reservationRef: '' });
        },
        onError: () => {
            toast.error("Erreur lors de la confirmation de la réservation");
        }
    })

    const reject = useMutation({
        mutationKey: ["reject-bookings"],
        mutationFn: (id: string) => bookingQuery.rejectReservation(id),
        onSuccess: () => {
            toast.success("Réservation rejetée");
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            setConfirmationDialog({ open: false, action: null, reservationId: null, reservationRef: '' });
        },
        onError: () => {
            toast.error("Erreur lors du rejet de la réservation");
        }
    })

    const settle = useMutation({
        mutationKey: ["settle-bookings"],
        mutationFn: (id: string) => bookingQuery.settleReservation(id),
        onSuccess: () => {
            toast.success("Client installé");
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            setConfirmationDialog({ open: false, action: null, reservationId: null, reservationRef: '' });
        },
        onError: () => {
            toast.error("Erreur lors de l'installation du client");
        }
    })

    const complete = useMutation({
        mutationKey: ["complete-bookings"],
        mutationFn: (id: string) => bookingQuery.completeReservation(id),
        onSuccess: () => {
            toast.success("Réservation complétée");
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            setConfirmationDialog({ open: false, action: null, reservationId: null, reservationRef: '' });
        },
        onError: () => {
            toast.error("Erreur lors du passage en complétée de la réservation");
        }
    })

    const handleViewReservation = (reservation: ReservationData) => {
        setSelectedReservation(reservation);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedReservation(null);
    };

    const handleActionClick = (action: 'validate' | 'reject' | 'settle' | 'cancel' | 'complete', reservation: ReservationData) => {
        setConfirmationDialog({
            open: true,
            action,
            reservationId: reservation.uuid.toString(),
            reservationRef: `Ref-${reservation.uuid?.slice(0, 15)}...`,
        });
    };

    const handleConfirmAction = () => {
        if (!confirmationDialog.reservationId || !confirmationDialog.action) return;

        switch (confirmationDialog.action) {
            case 'validate':
                validate.mutate(confirmationDialog.reservationId);
                break;
            case 'reject':
                reject.mutate(confirmationDialog.reservationId);
                break;
            case 'complete':
                complete.mutate(confirmationDialog.reservationId);
                break;
            case 'settle':
                settle.mutate(confirmationDialog.reservationId);
                break;
        }
    };

    // Fonction pour obtenir le libellé du statut
    const getStatusLabel = (status: StatusCode): string => {
        switch (status) {
            case "Pending": return 'En attente';
            case "Confirmed": return 'Confirmée';
            case "Customer Settled": return 'Client Installé';
            case "Cancelled": return 'Annulée';
            case "Complete": return 'Terminée';
            default: return 'Inconnu';
        }
    };

    // Fonction pour obtenir la couleur du statut
    const getStatusColor = (status: StatusCode): string => {
        switch (status) {
            case "Pending": return 'bg-amber-500 shadow-lg shadow-amber-500/20';
            case "Confirmed": return 'bg-blue-500 shadow-lg shadow-blue-500/20';
            case "Customer Settled": return 'bg-teal-500 shadow-lg shadow-teal-500/20';
            case "Cancelled": return 'bg-rose-500 shadow-lg shadow-rose-500/20';
            case "Complete": return 'bg-emerald-500 shadow-lg shadow-emerald-500/20';
            default: return 'bg-gray-500 shadow-lg shadow-gray-500/20';
        }
    };

    const getTitleColor = (status: StatusCode): string => {
        switch (status) {
            case "Pending": return 'text-amber-500 shadow-lg shadow-amber-500/20';
            case "Confirmed": return 'text-blue-500 shadow-lg shadow-blue-500/20';
            case "Customer Settled": return 'text-teal-500 shadow-lg shadow-teal-500/20';
            case "Cancelled": return 'text-rose-500 shadow-lg shadow-rose-500/20';
            case "Complete": return 'bg-emerald-500 shadow-lg shadow-emerald-500/20';
            default: return 'bg-gray-500 shadow-lg shadow-gray-500/20';
        }
    };

    // Obtenir le texte du dialogue de confirmation
    const getConfirmationText = () => {
        switch (confirmationDialog.action) {
            case 'validate':
                return {
                    title: 'Confirmer la réservation',
                    description: `Êtes-vous sûr de vouloir confirmer la réservation ${confirmationDialog.reservationRef} ?`,
                    confirmText: 'Confirmer',
                    confirmClass: 'bg-emerald-600 hover:bg-emerald-700 text-white'
                };
            case 'reject':
                return {
                    title: 'Rejeter la réservation',
                    description: `Êtes-vous sûr de vouloir rejeter la réservation ${confirmationDialog.reservationRef} ? Cette action est irréversible.`,
                    confirmText: 'Rejeter',
                    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white'
                };
            case 'cancel':
                return {
                    title: 'Annuler la réservation',
                    description: `Êtes-vous sûr de vouloir annuler votre réservation ${confirmationDialog.reservationRef} ? Cette action est irréversible.`,
                    confirmText: 'Annuler',
                    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white'
                };
            case 'complete':
                return {
                    title: 'Compléter la réservation',
                    description: `Êtes-vous sûr de vouloir marquer comme terminée la réservation ${confirmationDialog.reservationRef} ?`,
                    confirmText: 'Compléter',
                    confirmClass: 'bg-emerald-600 hover:bg-emerald-700 text-white'
                };
            case 'settle':
                return {
                    title: 'Règlement client',
                    description: `Êtes-vous sûr de vouloir marquer comme réglée par le client la réservation ${confirmationDialog.reservationRef} ?`,
                    confirmText: 'Marquer réglée',
                    confirmClass: 'bg-teal-600 hover:bg-teal-700 text-white'
                };
            default:
                return {
                    title: '',
                    description: '',
                    confirmText: '',
                    confirmClass: ''
                };
        }
    };

    const confirmationText = getConfirmationText();

    // Vérifier si une action est disponible pour le statut
    const getAvailableActions = (status: StatusCode) => {
        const actions = [];

        // En attente
        if (status === "Pending") {
            if (user?.role === "ADMIN" || user?.role === "MANAGER") {
                actions.push({ Icon: Check, key: 'validate', label: 'Confirmer', Text: "Confirmer", color: 'text-emerald-400' });
                actions.push({ Icon: LuX, key: 'reject', label: 'Rejeter', Text: "Rejetter", color: 'text-rose-400' });
            } else {
                actions.push({ Icon: LuX, key: 'cancel', label: 'Annuler', Text: "Rejetter", color: 'text-rose-400' });
            }
        }

        // Confirmée
        if (status === "Confirmed") {
            actions.push({ Icon: Check, key: 'settle', label: 'Installer client', Text: "Client Installé", color: 'text-teal-400' });
            actions.push({ Icon: LuX, key: 'cancel', label: 'Annuler', Text: "Rejetter", color: 'text-rose-400' });
        }

        // Réglée client
        if (status === "Customer Settled") {
            actions.push({ Icon: CheckCheck, key: 'complete', label: 'Terminer', Text: "Completer", color: 'text-emerald-400' });
        }

        return actions;
    };

    return (
        <div className="flex flex-col px-5 gap-5 w-full">
            <h3 className="text-xl font-bold">{title}</h3>
            <Table className="max-w-[1440px] w-full mx-auto border border-gray-300">
                <TableHeader className="bg-primary text-white">
                    <TableRow className="divide-x divide-gray-300 hover:bg-primary/90">
                        <TableHead className="font-bold text-white">{"Référence"}</TableHead>
                        <TableHead className="font-bold text-white">{"Statut"}</TableHead>
                        <TableHead className="font-bold text-white">{"Client"}</TableHead>
                        <TableHead className="font-bold text-white">{"Téléphone"}</TableHead>
                        <TableHead className="font-bold text-white">{"Date réservation"}</TableHead>
                        <TableHead className="font-bold text-white">{"Places"}</TableHead>
                        <TableHead className="font-bold text-white">{"Commentaire"}</TableHead>
                        <TableHead className="font-bold text-white">{"Actions"}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200">
                    {data?.length === 0 ? (
                        <TableRow className="divide-x divide-gray-200">
                            <TableCell colSpan={8} className="text-center h-24">
                                {"Aucune réservation à afficher."}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data?.map((reservation, id) => {
                            const availableActions = getAvailableActions(reservation.status as StatusCode);
                            const statusCode = reservation.status as StatusCode;

                            return (
                                <TableRow
                                    key={reservation.id || id}
                                    className={`divide-x divide-gray-200 ${id % 2 === 0 ? "bg-gray-100" : ""}`}
                                >
                                    <TableCell className="font-medium text-center">
                                        {`Ref-${reservation.uuid?.slice(0, 15)}...`}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex gap-2 items-center">
                                            <span className={`${getStatusColor(statusCode)} h-2.5 w-2.5 rounded-full`} />
                                            <span className={`${getTitleColor(statusCode)} text-gray-300 font-medium`}>
                                                {getStatusLabel(statusCode)}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-medium">{reservation.customer?.name || 'N/A'}</span>
                                    </TableCell>

                                    <TableCell>
                                        <span>{reservation.customer?.phone || 'N/A'}</span>
                                    </TableCell>

                                    <TableCell>
                                        {formatRelative(new Date(reservation.booking_for), new Date(), { locale: fr })}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <span className="font-semibold">{reservation.places}</span> place(s)
                                    </TableCell>

                                    <TableCell className="truncate max-w-[200px]">
                                        {reservation.comment ? (
                                            <span className="text-sm text-gray-600">
                                                {reservation.comment.length > 50
                                                    ? `${reservation.comment.slice(0, 50)}...`
                                                    : reservation.comment}
                                            </span>
                                        ) : "---"}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex gap-2 items-center">
                                            <Button
                                                variant={"outline"}
                                                className="text-black bg-gray-50 border-[#848484]"
                                                onClick={() => handleViewReservation(reservation)}
                                            >
                                                <LuEye />
                                                {user?.role !== "ADMIN" && user?.role !== "MANAGER" ? "Voir" : ""}
                                            </Button>

                                            {availableActions.length > 0 && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className="border-gray-300 bg-gray-50"
                                                        >
                                                            <MoreVertical />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {availableActions.map((action) => {
                                                            return (
                                                                <DropdownMenuItem
                                                                    key={action.key}
                                                                    title={action.label}
                                                                    onClick={() => handleActionClick(action.key as any, reservation)}
                                                                    className={`w-full ${action.color}`}
                                                                >
                                                                    <action.Icon className={action.color} />
                                                                    <span>{action.label}</span>
                                                                </DropdownMenuItem>
                                                            );
                                                        })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>

            {/* Dialog des détails de réservation */}
            {selectedReservation && (
                <ViewReservationDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    reservation={selectedReservation}
                />
            )}

            {/* Dialogue de confirmation */}
            <Dialog
                open={confirmationDialog.open}
                onOpenChange={(open) => !open && setConfirmationDialog({ ...confirmationDialog, open: false })}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{confirmationText.title}</DialogTitle>
                        <DialogDescription>
                            {confirmationText.description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmationDialog({ open: false, action: null, reservationId: null, reservationRef: '' })}
                        >
                            Annuler
                        </Button>
                        <Button
                            className={confirmationText.confirmClass}
                            onClick={handleConfirmAction}
                        >
                            {confirmationText.confirmText}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HistoryBooking;