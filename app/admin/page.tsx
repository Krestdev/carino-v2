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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import useStore from "@/context/store";

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
            filtered = filtered.filter(item => item.status === filters.status);
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
            rejected: 0,
        };

        const data = reservationData.data;
        return {
            total: data.length,
            pending: data.filter(item => item.status === "Pending").length,
            completed: data.filter(item => item.status === "Completed").length,
            cancelled: data.filter(item => item.status === "Cancelled").length,
            rejected: data.filter(item => item.status === "Rejected").length,
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

    return (
        <div className="pb-8">
            <Head
                title="Réservations"
                image={"/reservation.webp"}
                subTitle={"Réservations reçues"}
            />

            <div className="container mx-auto flex flex-col gap-4 px-4 py-8">

                <div className="flex flex-row gap-2 items-center">
                    <Select
                        value={filters.status}
                        onValueChange={(value) => setFilters({ ...filters, status: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="Pending">En attente</SelectItem>
                            <SelectItem value="Completed">Terminées</SelectItem>
                            <SelectItem value="Cancelled">Annulées</SelectItem>
                            <SelectItem value="Rejected">Rejetées</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="border border-primary rounded-[8px]">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                            <p className="text-xs opacity-80">Toutes les réservations</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-primary rounded-[8px] bg-amber-50">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">En attente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.pending}</div>
                            <p className="text-xs opacity-80">Réservations à traiter</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-primary rounded-[8px] bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.completed}</div>
                            <p className="text-xs opacity-80">Réservations complétées</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-primary rounded-[8px] bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.rejected}</div>
                            <p className="text-xs opacity-80">Par l'administration</p>
                        </CardContent>
                    </Card>
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