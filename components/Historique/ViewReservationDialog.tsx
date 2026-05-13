// ViewReservationDialog.tsx
'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReservationData } from "@/types/types";
import { Printer, X, Calendar, Users, Clock, CreditCard, MapPin, MessageSquare, Building, Phone, User, Hash, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ViewReservationDialogProps {
    open: boolean;
    onClose: () => void;
    reservation: ReservationData;
}

const ViewReservationDialog = ({ open, onClose, reservation }: ViewReservationDialogProps) => {
    // Formater les dates
    const createdAt = format(new Date(reservation.created_at!), 'dd MMMM yyyy à HH:mm', { locale: fr });
    const bookingFor = format(new Date(reservation.booking_for), 'dd MMMM yyyy à HH:mm', { locale: fr });
    const updatedAt = format(new Date(reservation.updated_at!), 'dd MMMM yyyy à HH:mm', { locale: fr });

    // Statut de la réservation avec couleurs
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Pending':
                return { label: 'En attente', color: 'bg-orange-500', textColor: 'text-orange-600', icon: Clock };
            case 'Confirmed':
                return { label: 'Confirmée', color: 'bg-blue-500', textColor: 'text-blue-600', icon: Calendar };
            case 'Completed':
                return { label: 'Terminée', color: 'bg-green-500', textColor: 'text-green-600', icon: Clock };
            case 'Cancelled':
                return { label: 'Annulée', color: 'bg-red-500', textColor: 'text-red-600', icon: AlertCircle };
            default:
                return { label: status, color: 'bg-gray-500', textColor: 'text-gray-600', icon: Clock };
        }
    };

    const statusConfig = getStatusConfig(reservation.status);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[70vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex flex-col">
                        <span className="text-xl font-bold">
                            Détails de la réservation
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                    {/* En-tête avec référence */}
                    <div className="pb-4 border-b print:border-b-2">
                        <h2 className="text-2xl font-bold">Détail de la réservation</h2>
                        <p className="text-gray-600 mt-2">Référence: Ref-{reservation.uuid}</p>
                        <p className="text-gray-600">Créée le: {createdAt}</p>
                    </div>

                    {/* Statut principal */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 ${statusConfig.color} rounded-full animate-pulse`} />
                                <span className={`font-semibold text-lg ${statusConfig.textColor}`}>
                                    {statusConfig.label}
                                </span>
                            </div>
                            {reservation.cancel_reason && (
                                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                                    <AlertCircle className="w-4 h-4" />
                                    Raison: {reservation.cancel_reason}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informations client */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Informations client
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Nom du client</p>
                                        <p className="font-medium">{reservation.customer?.name || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Téléphone</p>
                                        <p className="font-medium">{reservation.customer?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Détails de la réservation */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Détails de la réservation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <p className="text-sm text-gray-500">Date et heure</p>
                                </div>
                                <p className="font-semibold">{bookingFor}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <p className="text-sm text-gray-500">Nombre de places</p>
                                </div>
                                <p className="font-semibold text-lg">{reservation.places} personne(s)</p>
                            </div>

                            {reservation.table && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <p className="text-sm text-gray-500">Table attribuée</p>
                                    </div>
                                    <p className="font-semibold">{reservation.table}</p>
                                </div>
                            )}

                            {reservation.final_price && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="w-4 h-4 text-gray-500" />
                                        <p className="text-sm text-gray-500">Prix final</p>
                                    </div>
                                    <p className="font-semibold text-lg text-green-600">
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(reservation.final_price)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Commentaire */}
                    {reservation.comment && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Commentaire
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 italic">{reservation.comment}</p>
                            </div>
                        </div>
                    )}

                    {/* Commande associée */}
                    {reservation.id_command && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Commande associée
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium">ID Commande: {reservation.id_command}</p>
                            </div>
                        </div>
                    )}

                    {/* Horodatage */}
                    <div className="space-y-2 text-sm text-gray-500 border-t pt-4">
                        {reservation.arrived_at && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Arrivé le: {format(new Date(reservation.arrived_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}</span>
                            </div>
                        )}
                        {reservation.closed_at && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Fermé le: {format(new Date(reservation.closed_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Dernière mise à jour: {updatedAt}</span>
                        </div>
                    </div>

                    {/* Pied de page */}
                    <div className="text-center text-sm text-gray-500 pt-4 border-t print:border-t-2">
                        <p>Merci de votre réservation !</p>
                        <p>Ce document fait office de confirmation de réservation.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewReservationDialog;