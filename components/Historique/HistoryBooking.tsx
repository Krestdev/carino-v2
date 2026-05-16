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
import { CheckCheck, MoreVertical } from "lucide-react";

interface Props {
    title: string;
    data?: ReservationData[];
}

const HistoryBooking = ({ title, data }: Props) => {
    const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmationDialog, setConfirmationDialog] = useState<{
        open: boolean;
        action: 'validate' | 'reject' | 'cancel' | 'complete' | null;
        reservationId: string | null;
        reservationRef: string;
    }>({
        open: false,
        action: null,
        reservationId: null,
        reservationRef: '',
    });

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

    const cancel = useMutation({
        mutationKey: ["cancel-bookings"],
        mutationFn: (id: string) => bookingQuery.cancelReservation(id),
        onSuccess: () => {
            toast.success("Réservation annulée");
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            setConfirmationDialog({ open: false, action: null, reservationId: null, reservationRef: '' });
        },
        onError: () => {
            toast.error("Erreur lors de l'annulation de la réservation");
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

    const handleActionClick = (action: 'validate' | 'reject' | 'cancel' | 'complete', reservation: ReservationData) => {
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
            case 'cancel':
                cancel.mutate(confirmationDialog.reservationId);
                break;
            case 'complete':
                complete.mutate(confirmationDialog.reservationId);
                break;
        }
    };

    // Fonction pour obtenir le libellé du statut
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Pending': return 'En attente';
            case 'Confirmed': return 'Confirmée';
            case 'Complete': return 'Terminée';
            case 'Cancelled': return 'Annulée';
            case 'Rejected': return 'Rejetée';
            default: return status;
        }
    };

    // Fonction pour obtenir la couleur du statut
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-orange-500';
            case 'Confirmed': return 'bg-blue-500';
            case 'Complete': return 'bg-green-500';
            case 'Cancelled': return 'bg-red-500';
            case 'Rejected': return 'bg-purple-500';
            default: return 'bg-gray-500';
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
                    confirmClass: 'bg-green-600 hover:bg-green-700'
                };
            case 'reject':
                return {
                    title: 'Rejeter la réservation',
                    description: `Êtes-vous sûr de vouloir rejeter la réservation ${confirmationDialog.reservationRef} ? Cette action est irréversible.`,
                    confirmText: 'Rejeter',
                    confirmClass: 'bg-red-600 hover:bg-red-700'
                };
            case 'cancel':
                return {
                    title: 'Annuler la réservation',
                    description: `Êtes-vous sûr de vouloir annuler votre réservation ${confirmationDialog.reservationRef} ? Cette action est irréversible.`,
                    confirmText: 'Annuler',
                    confirmClass: 'bg-red-600 hover:bg-red-700'
                };
            case 'complete':
                return {
                    title: 'Compléter la réservation',
                    description: `Êtes-vous sûr de vouloir marquer comme terminée la réservation ${confirmationDialog.reservationRef} ?`,
                    confirmText: 'Compléter',
                    confirmClass: 'bg-blue-600 hover:bg-blue-700'
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
    const getAvailableActions = (status: string) => {
        const actions = [];
        if (status === 'Pending') {
            actions.push({ key: 'validate', label: 'Confirmer', icon: LuCheck, color: 'text-green-600' });
            actions.push({ key: 'reject', label: 'Rejeter', icon: LuX, color: 'text-red-600' });
        }
        if (status === 'Confirmed') {
            actions.push({ key: 'complete', label: 'Compléter', icon: CheckCheck, color: 'text-blue-600' });
            actions.push({ key: 'cancel', label: 'Annuler', icon: LuX, color: 'text-red-600' });
        }
        if (status === 'Pending' && user?.role !== "ADMIN" && user?.role !== "MANAGER") {
            return [{ key: 'cancel', label: 'Annuler', icon: LuX, color: 'text-red-600' }];
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
                            const availableActions = getAvailableActions(reservation.status);

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
                                            <span className={`${getStatusColor(reservation.status)} h-2 w-2 rounded-full`} />
                                            <span>{getStatusLabel(reservation.status)}</span>
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
                                                            const Icon = action.icon;
                                                            return (
                                                                <DropdownMenuItem
                                                                    key={action.key}
                                                                    className="cursor-pointer"
                                                                    onClick={() => handleActionClick(action.key as any, reservation)}
                                                                >
                                                                    <Icon className={`mr-2 h-4 w-4 ${action.color}`} />
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