"use client"

import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useState, useMemo } from "react";
import Head from "@/components/universal/Head";
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
    Users,
    UserCheck,
    Crown,
    ConciergeBell,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import UserQuery from "@/queries/userQueries";
import StatCards, { type StatCardItem } from "@/components/admin/StatCards";
import CreateUserDialog from "@/components/admin/CreateUserDialog";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import useStore from "@/context/store";

interface FilterState {
    role: string;
    searchTerm: string;
    vip: string;
}

const UsersPage = () => {
    const { user } = useStore();
    const router = useRouter();
    const userQuery = new UserQuery();
    const usersData = useQuery({
        queryKey: ["users"],
        queryFn: () => userQuery.getAllUsers(),
    });

    const [filters, setFilters] = useState<FilterState>({
        role: "all",
        searchTerm: "",
        vip: "all",
    });

    const [createOpen, setCreateOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filtrer les données
    const filteredData = useMemo(() => {
        if (!usersData.data) return [];

        let filtered = [...usersData.data];

        // Filtre par rôle
        if (filters.role !== "all") {
            // Un compte sans rôle est un client (USER)
            filtered = filtered.filter(user => (user.role || "USER") === filters.role);
        }

        // Filtre VIP
        if (filters.vip !== "all") {
            filtered = filtered.filter(user => user.vip === (filters.vip === "vip"));
        }

        // Affichage en fonction du role
        if (user?.role === "WAITER") {
            filtered = filtered.filter(user => (user.role || "USER") === "USER");
        }

        if (user?.role === "MANAGER") {
            filtered = filtered.filter(user => user.role === "WAITER" || (user.role || "USER") === "USER");
        }

        // Filtre par recherche (nom, email, téléphone)
        if (filters.searchTerm) {
            const search = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(search) ||
                user.fname?.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search) ||
                user.phone?.includes(search)
            );
        }

        return filtered;
    }, [usersData.data, filters, user?.role]);

    // Pagination des données
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Statistiques
    const statistics = useMemo(() => {
        if (!filteredData) return {
            total: 0,
            admins: 0,
            managers: 0,
            waiters: 0,
            clients: 0,
            vip: 0,
            totalSpent: 0,
            totalOrders: 0,
        };

        const data = filteredData;
        return {
            total: data.length,
            admins: data.filter(user => user.role === "ADMIN").length,
            managers: data.filter(user => user.role === "MANAGER").length,
            waiters: data.filter(user => user.role === "WAITER").length,
            clients: data.filter(user => !user.role || user.role === "USER").length,
            vip: data.filter(user => user.vip).length,
            totalSpent: data.reduce((sum, user) => sum + (user.turnover || 0), 0),
            totalOrders: data.reduce((sum, user) => sum + (user.nb_orders || 0), 0),
        };
    }, [filteredData]);

    if (usersData.isLoading) return <Loading />
    if (usersData.isError) {
        if ((usersData.error as AxiosError).response?.status === 403) {
            toast.error("Vous n'avez pas accès à cette page");
            router.back();
            return null;
        }
        toast.error("Une erreur s'est produite");
        router.back();
        return null;
    }

    // Fonction pour obtenir les initiales
    const getInitials = (name: string, fname: string) => {
        return `${name?.charAt(0) || ''}${fname?.charAt(0) || ''}`.toUpperCase();
    };

    // Fonction pour formater la date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "ADMIN":
                return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">Administrateur</Badge>;
            case "MANAGER":
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Manager</Badge>;
            case "WAITER":
                return <Badge className="bg-green-500/10 text-green-600 border-green-200">Serveur</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Client</Badge>;
        }
    };

    const statItems: StatCardItem[] = [
        { title: "Utilisateurs", value: statistics.total, description: "Comptes affichés", icon: Users, iconClass: "bg-blue-100 text-blue-600" },
        { title: "Clients", value: statistics.clients, description: "Comptes clients", icon: UserCheck, iconClass: "bg-emerald-100 text-emerald-600" },
        { title: "Serveurs", value: statistics.waiters, description: "Personnel en salle", icon: ConciergeBell, iconClass: "bg-amber-100 text-amber-600" },
        { title: "Administration", value: statistics.admins + statistics.managers, description: `${statistics.admins} admin(s), ${statistics.managers} manager(s)`, icon: Crown, iconClass: "bg-purple-100 text-purple-600" },
    ];

    return (
        <div className="pb-8">
            <Head
                title="Utilisateurs"
                image={"/about.webp"}
                subTitle={`${statistics.total} utilisateur(s) au total`}
            />

            <div className="container mx-auto flex flex-col gap-4 px-4 py-8">
                <StatCards items={statItems} />

                {/* Filtres */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:max-w-90">
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher par nom, email ou téléphone..."
                            value={filters.searchTerm}
                            onChange={(e) => {
                                setFilters({ ...filters, searchTerm: e.target.value });
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={filters.role}
                            onValueChange={(value) => {
                                setFilters({ ...filters, role: value });
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Tous les rôles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les rôles</SelectItem>
                                <SelectItem value="ADMIN">Administrateurs</SelectItem>
                                <SelectItem value="MANAGER">Managers</SelectItem>
                                <SelectItem value="WAITER">Serveurs</SelectItem>
                                <SelectItem value="USER">Clients</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full md:w-auto md:ml-auto" onClick={() => setCreateOpen(true)}>
                        Créer un utilisateur
                    </Button>
                </div>

                {/* Tableau des utilisateurs */}
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">Liste des utilisateurs</h2>
                    <Badge variant="secondary">{filteredData.length} résultat(s)</Badge>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-primary text-white">
                            <TableRow className="hover:bg-primary/90">
                                <TableHead className="font-bold text-white">Utilisateur</TableHead>
                                <TableHead className="font-bold text-white">Email</TableHead>
                                <TableHead className="font-bold text-white">Téléphone</TableHead>
                                <TableHead className="font-bold text-white">Rôle</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((user, id) => (
                                <TableRow key={id} className="even:bg-gray-50 hover:bg-gray-100">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                    {getInitials(user.name, user.fname)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium text-gray-900">
                                                {user.name} {user.fname}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-700">
                                        {user.email || user.mail}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-700">
                                        {user.phone || "—"}
                                    </TableCell>
                                    <TableCell>
                                        {getRoleBadge(user.role || "USER")}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {filteredData.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Page {currentPage} sur {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                size="icon"
                                                onClick={() => setCurrentPage(pageNum)}
                                                className="h-8 w-8"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {filteredData.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Aucun utilisateur trouvé</h3>
                            <p className="text-gray-500">Essayez de modifier vos filtres</p>
                        </div>
                    )}
                </div>
            </div>

            <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
        </div>
    );
}

export default UsersPage;