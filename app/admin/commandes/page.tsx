"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ShoppingBag,
    CheckCircle,
    Clock,
    Wallet,
    Search,
    Eye,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Head from "@/components/universal/Head";
import UserQuery from "@/queries/userQueries";
import Loading from "@/app/loading";
import useStore from "@/context/store";
import { XAF } from "@/lib/functions";
import { AdminOrderListItem } from "@/types/types";
import OrderDetailsDialog from "./OrderDetailsDialog";
import StatCards, { type StatCardItem } from "@/components/admin/StatCards";
import { computeOrderStats, ORDER_STATS_LIMIT } from "@/lib/order-stats";
import { statusBadgeClass, statusLabel } from "./status";

interface FilterState {
    status: string;
    mode: string;
    searchTerm: string;
}

const ITEMS_PER_PAGE = 10;

const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const canRetryZeltySync = (order: AdminOrderListItem) => {
    const isPaid = order.payments?.some((payment) => payment.status === "SUCCESS");
    return isPaid && order.status === "SYNC_FAILED";
};

const OrdersPage = () => {
    const { user } = useStore();
    const router = useRouter();
    const orderQuery = new UserQuery();
    const queryClient = useQueryClient();

    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<FilterState>({
        status: "all",
        mode: "all",
        searchTerm: "",
    });
    const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const isAllowed = user?.role === "ADMIN" || user?.role === "MANAGER";

    const ordersData = useQuery({
        queryKey: ["orders", "admin", currentPage],
        queryFn: () => orderQuery.getAllOrders(String(currentPage), String(ITEMS_PER_PAGE)),
        enabled: isAllowed,
    });

    // Statistiques : calculées sur les dernières commandes, indépendamment de la page affichée
    const statsData = useQuery({
        queryKey: ["orders", "admin", "stats"],
        queryFn: () => orderQuery.getAllOrders("1", String(ORDER_STATS_LIMIT)),
        enabled: isAllowed,
    });

    const retryZeltyMutation = useMutation({
        mutationFn: (uuid: string) => orderQuery.retryZeltySync(uuid),
        onSuccess: () => {
            toast.success("Commande renvoyée à Zelty avec succès");
            queryClient.invalidateQueries({ queryKey: ["orders", "admin"] });
        },
        onError: () => {
            toast.error("Échec de l'envoi de la commande vers Zelty");
        },
    });

    const orders: AdminOrderListItem[] = useMemo(() => ordersData.data?.data ?? [], [ordersData.data]);
    const meta = ordersData.data?.meta;
    const totalCount = meta?.total ?? orders.length;
    const totalPages = meta?.lastPage ?? 1;
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const statusOptions = useMemo(() => {
        return Array.from(new Set(orders.map((order) => order.status)));
    }, [orders]);

    // Filtrer les données de la page en cours
    const filteredData = useMemo(() => {
        let filtered = [...orders];

        if (filters.status !== "all") {
            filtered = filtered.filter((order) => order.status === filters.status);
        }

        if (filters.mode !== "all") {
            filtered = filtered.filter((order) => order.mode === filters.mode);
        }

        if (filters.searchTerm) {
            const search = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    order.first_name?.toLowerCase().includes(search) ||
                    order.phone?.toLowerCase().includes(search) ||
                    order.uuid?.toLowerCase().includes(search) ||
                    order.display_id?.toLowerCase().includes(search)
            );
        }

        return filtered;
    }, [orders, filters]);

    // Les serveurs (WAITER) ont accès à l'admin mais pas aux commandes
    useEffect(() => {
        if (user && !isAllowed) router.replace("/admin/utilisateurs");
    }, [user, isAllowed, router]);

    if (!isAllowed || ordersData.isLoading) return <Loading />;
    if (ordersData.isError) {
        if ((ordersData.error as AxiosError).response?.status === 403) {
            toast.error("Vous n'avez pas accès à cette page");
            router.back();
            return null;
        }
        toast.error("Une erreur s'est produite");
        router.back();
        return null;
    }

    const statsOrders = statsData.data?.data ?? [];
    const stats = computeOrderStats(statsOrders);
    const statsCount = statsOrders.length;
    // Si l'historique dépasse la limite, on précise sur combien de commandes porte le calcul
    const statsScope = (statsData.data?.meta?.total ?? 0) > statsCount ? ` (${statsCount} dernières)` : "";
    const statValue = (n: number) => (statsData.isLoading ? "…" : n);
    const statItems: StatCardItem[] = [
        { title: "Total des commandes", value: totalCount, description: "Commandes en ligne reçues", icon: ShoppingBag, iconClass: "bg-blue-100 text-blue-600" },
        { title: "Payées", value: statValue(stats.paid), description: `Payées ou confirmées${statsScope}`, icon: CheckCircle, iconClass: "bg-emerald-100 text-emerald-600" },
        { title: "En attente de paiement", value: statValue(stats.awaitingPayment), description: `Paiement non finalisé${statsScope}`, icon: Clock, iconClass: "bg-amber-100 text-amber-600" },
        { title: "Chiffre d'affaires", value: statsData.isLoading ? "…" : XAF.format(stats.revenue), description: `Commandes payées${statsScope}`, icon: Wallet, iconClass: "bg-purple-100 text-purple-600" },
    ];

    const handleViewOrder = (order: AdminOrderListItem) => {
        setSelectedUuid(order.uuid);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedUuid(null);
    };

    return (
        <div className="pb-8">
            <Head
                title="Commandes"
                image={"/pizza.webp"}
                subTitle={`${totalCount} commande(s) en ligne au total`}
            />

            <div className="container mx-auto flex flex-col gap-4 px-4 py-8">
                <StatCards items={statItems} />

                {/* Filtres */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:max-w-90">
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher par client ou référence (page actuelle)..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                        />
                    </div>
                    <div className="w-full md:w-56">
                        <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {statusLabel(status)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={filters.mode}
                            onValueChange={(value) => setFilters({ ...filters, mode: value })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les modes</SelectItem>
                                <SelectItem value="delivery">Livraison</SelectItem>
                                <SelectItem value="takeaway">À emporter</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Tableau des commandes */}
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">Liste des commandes</h2>
                    <Badge variant="secondary">{filteredData.length} résultat(s)</Badge>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-primary text-white">
                            <TableRow className="hover:bg-primary/90">
                                <TableHead className="font-bold text-white">Référence</TableHead>
                                <TableHead className="font-bold text-white">Client</TableHead>
                                <TableHead className="font-bold text-white">Mode</TableHead>
                                <TableHead className="font-bold text-white">Statut</TableHead>
                                <TableHead className="font-bold text-white text-right">Total</TableHead>
                                <TableHead className="font-bold text-white">Date</TableHead>
                                <TableHead className="font-bold text-white text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((order) => {
                                const retrying = retryZeltyMutation.isPending && retryZeltyMutation.variables === order.uuid;
                                return (
                                    <TableRow key={order.uuid} className="even:bg-gray-50 hover:bg-gray-100">
                                        <TableCell className="font-medium text-gray-900">
                                            {order.display_id || `Ref-${order.uuid.slice(0, 8)}`}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{order.first_name}</span>
                                                {order.phone && (
                                                    <span className="text-xs text-gray-500">{order.phone}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-700">
                                            {order.mode === "delivery" ? "Livraison" : "À emporter"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusBadgeClass(order.status)}>
                                                {statusLabel(order.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-gray-900">
                                            {XAF.format(Number(order.total))}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-700">
                                            {formatDate(order.registration)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    title="Voir le détail"
                                                    onClick={() => handleViewOrder(order)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {canRetryZeltySync(order) && (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        title="Renvoyer vers Zelty"
                                                        disabled={retrying}
                                                        onClick={() => retryZeltyMutation.mutate(order.uuid)}
                                                    >
                                                        <RefreshCw className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {/* Pagination (côté serveur) */}
                    {orders.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Page {currentPage} sur {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={!canGoPrev}>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={!canGoPrev}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={!canGoNext}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={!canGoNext}>
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {orders.length === 0 && (
                        <div className="text-center py-12">
                            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Aucune commande trouvée</h3>
                            <p className="text-gray-500">Il n&apos;y a pas encore de commandes à afficher</p>
                        </div>
                    )}
                </div>
            </div>

            <OrderDetailsDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                uuid={selectedUuid}
            />
        </div>
    );
}

export default OrdersPage;
