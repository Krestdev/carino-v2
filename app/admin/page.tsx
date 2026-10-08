"use client"

import HistoryBooking from "@/components/Historique/HistoryBooking";
import ReservationQuery from "@/queries/bookingsQuery";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Head from "@/components/universal/Head";
import { useState, useMemo } from "react";
import StatCards, { type StatCardItem } from "@/components/admin/StatCards";
import { CalendarDays, CheckCircle, Clock, XCircle } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import useStore from "@/context/store";
import { normalizeReservationStatus, RESERVATION_STATUSES, reservationStatusLabel } from "@/lib/reservation-status";

interface FilterState {
    status: string;
    searchTerm: string;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
}

const AdminPage = () => {

    const { user } = useStore();
    const router = useRouter();
    const reservation = new ReservationQuery();
    const reservationData = useQuery({
        queryKey: ["reservations"],
        queryFn: () => reservation.getReservations().then((res) => res.items),
        enabled: user?.role === "ADMIN" || user?.role === "MANAGER"
    });

    const [filters, setFilters] = useState<FilterState>({
        status: "all",
        searchTerm: "",
        dateFrom: undefined,
        dateTo: undefined,
    });

    // Filtrer les données
    const filteredData = useMemo(() => {
        if (!reservationData.data) return [];

        let filtered = [...reservationData.data];

        // Filtre par statut
        if (filters.status !== "all") {
            filtered = filtered.filter(item => normalizeReservationStatus(item.status) === filters.status);
        }
        return filtered;
    }, [reservationData.data, filters]);

    // Statistiques
    const statistics = useMemo(() => {
        if (!reservationData.data) return {
            total: 0,
            pending: 0,
            completed: 0,
            cancelled: 0,
        };

        const statuses = reservationData.data.map(item => normalizeReservationStatus(item.status));
        return {
            total: statuses.length,
            pending: statuses.filter(status => status === "Pending").length,
            completed: statuses.filter(status => status === "Complete").length,
            cancelled: statuses.filter(status => status === "Cancelled").length,
        };
    }, [reservationData.data]);

    if (user?.role === "WAITER") {
        router.push("/admin/utilisateurs");
        return null;
    }

    if (reservationData.isLoading) return <Loading />
    if (reservationData.isError) {
        if ((reservationData.error as AxiosError).response?.status === 403) {
            toast.error("Vous n'avez pas accès à cette page")
            router.back();
            return null;
        }
        toast.error("Une erreur s'est produite")
        router.back();
        return null;
    }

    const statItems: StatCardItem[] = [
        { title: "Total", value: statistics.total, description: "Toutes les réservations", icon: CalendarDays, iconClass: "bg-blue-100 text-blue-600" },
        { title: "En attente", value: statistics.pending, description: "Réservations à traiter", icon: Clock, iconClass: "bg-amber-100 text-amber-600" },
        { title: "Terminées", value: statistics.completed, description: "Réservations complétées", icon: CheckCircle, iconClass: "bg-emerald-100 text-emerald-600" },
        { title: "Annulées", value: statistics.cancelled, description: "Rejetées ou annulées", icon: XCircle, iconClass: "bg-rose-100 text-rose-600" },
    ];

    return (
        <div className="pb-8">
            <Head
                title="Réservations"
                image={"/reservation.webp"}
                subTitle={"Réservations reçues"}
            />

            <div className="container mx-auto flex flex-col gap-4 px-4 py-8">
                <StatCards items={statItems} />

                <div className="w-full md:w-56">
                    <Select
                        value={filters.status}
                        onValueChange={(value) => setFilters({ ...filters, status: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            {RESERVATION_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>{reservationStatusLabel(status)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <HistoryBooking
                    title={"Liste des réservations"}
                    data={filteredData}
                />
            </div>
        </div>
    );
}

export default AdminPage;