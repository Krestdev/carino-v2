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
import { LuX } from "react-icons/lu";
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
import { CalendarDays, Check, CheckCheck, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { normalizeReservationStatus, reservationStatusBadgeClass, reservationStatusLabel, type ReservationStatus } from "@/lib/reservation-status";

const ITEMS_PER_PAGE = 10;

interface Props {
    title: string;
    data?: ReservationData[];
}

const HistoryBooking = ({ title, data }: Props) => {
    const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
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

    type StatusCode = ReservationStatus;

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

    const rows = data ?? [];
    const totalPages = Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE));
    const page = Math.min(currentPage, totalPages);
    const pageRows = rows.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col gap-4 w-full">
            {title && (
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <Badge variant="secondary">{rows.length} résultat(s)</Badge>
                </div>
            )}

            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-primary text-white">
                        <TableRow className="hover:bg-primary/90">
                            <TableHead className="font-bold text-white">Référence</TableHead>
                            <TableHead className="font-bold text-white">Client</TableHead>
                            <TableHead className="font-bold text-white">Statut</TableHead>
                            <TableHead className="font-bold text-white">Date réservation</TableHead>
                            <TableHead className="font-bold text-white text-center">Places</TableHead>
                            <TableHead className="font-bold text-white">Commentaire</TableHead>
                            <TableHead className="font-bold text-white text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pageRows.map((reservation, id) => {
                            const statusCode = normalizeReservationStatus(reservation.status) as StatusCode;
                            const availableActions = getAvailableActions(statusCode);

                            return (
                                <TableRow key={reservation.id || id} className="even:bg-gray-50 hover:bg-gray-100">
                                    <TableCell className="font-medium text-gray-900">
                                        {`Ref-${reservation.uuid?.slice(0, 8)}`}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">{reservation.customer?.name || "N/A"}</span>
                                            {reservation.customer?.phone && (
                                                <span className="text-xs text-gray-500">{reservation.customer.phone}</span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={reservationStatusBadgeClass(statusCode)}>
                                            {reservationStatusLabel(statusCode)}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-sm text-gray-700">
                                        {formatRelative(new Date(reservation.booking_for), new Date(), { locale: fr })}
                                    </TableCell>

                                    <TableCell className="text-center text-sm text-gray-700">
                                        <span className="font-semibold text-gray-900">{reservation.places}</span> place(s)
                                    </TableCell>

                                    <TableCell className="max-w-[200px] truncate text-sm text-gray-600" title={reservation.comment || undefined}>
                                        {reservation.comment || "—"}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                title="Voir le détail"
                                                onClick={() => handleViewReservation(reservation)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {availableActions.length > 0 && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="icon" className="h-8 w-8" title="Actions">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {availableActions.map((action) => (
                                                            <DropdownMenuItem
                                                                key={action.key}
                                                                title={action.label}
                                                                onClick={() => handleActionClick(action.key as any, reservation)}
                                                                className={`w-full ${action.color}`}
                                                            >
                                                                <action.Icon className={action.color} />
                                                                <span>{action.label}</span>
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {rows.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Page {page} sur {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={page === 1}>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(Math.max(1, page - 1))} disabled={page === 1}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={page === totalPages}>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {rows.length === 0 && (
                    <div className="text-center py-12">
                        <CalendarDays className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">Aucune réservation trouvée</h3>
                        <p className="text-gray-500">Il n&apos;y a pas encore de réservations à afficher</p>
                    </div>
                )}
            </div>

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