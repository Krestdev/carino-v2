"use client"

import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
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
    TrendingUp,
    Search,
    Filter,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import UserQuery from "@/queries/userQueries";
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

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filtrer les données
    const filteredData = useMemo(() => {
        if (!usersData.data) return [];

        let filtered = [...usersData.data];

        // Filtre par rôle
        if (filters.role !== "all") {
            filtered = filtered.filter(user => user.role === filters.role);
        }

        // Filtre VIP
        if (filters.vip !== "all") {
            filtered = filtered.filter(user => user.vip === (filters.vip === "vip"));
        }

        // Affichage en fonction du role
        if (user?.role === "WAITER") {
            filtered = filtered.filter(user => user.role === "USER");
        }

        if (user?.role === "MANAGER") {
            filtered = filtered.filter(user => user.role === "WAITER" || user.role === "USER");
        }

        if (user?.role === "ADMIN") {
            filtered = filtered;
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
    }, [usersData.data, filters]);

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
            clients: data.filter(user => !user.role || user.role === "CLIENT").length,
            vip: data.filter(user => user.vip).length,
            totalSpent: data.reduce((sum, user) => sum + (user.turnover || 0), 0),
            totalOrders: data.reduce((sum, user) => sum + (user.nb_orders || 0), 0),
        };
    }, [usersData.data]);

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
                return <Badge variant="outline" className="text-black">Client</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
            {/* Header */}
            <div className="top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Gestion des utilisateurs
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Gérez et suivez tous les utilisateurs de votre plateforme
                            </p>
                        </div>
                        <Badge variant={"secondary"} className="px-4 py-2 text-white">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            {statistics.total} utilisateurs actifs
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 pb-10">
                {/* Section des filtres */}
                <div className="flex flex-col md:flex-row items-center gap-4 pt-4 pb-8">
                    <div className="max-w-90 w-full">
                        <div className="relative">
                            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom, email ou téléphone..."
                                value={filters.searchTerm}
                                onChange={(e) => {
                                    setFilters({ ...filters, searchTerm: e.target.value });
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
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
                                <SelectItem value="CLIENT">Clients</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => router.push("/admin/utilisateurs/create")}>
                        Créer un utilisateur
                    </Button>
                </div>

                {/* Tableau des utilisateurs */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-1 bg-primary rounded-full"></div>
                            <h2 className="text-xl font-semibold text-primary">Liste des utilisateurs</h2>
                            <Badge className="ml-2">
                                {filteredData.length} résultat(s)
                            </Badge>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted">
                                    <TableHead className="font-bold text-black">Utilisateur</TableHead>
                                    <TableHead className="font-bold text-black">Email</TableHead>
                                    <TableHead className="font-bold text-black">Téléphone</TableHead>
                                    <TableHead className="font-bold text-black">Rôle</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((user, id) => (
                                    <TableRow
                                        key={id}
                                        className={` ${id % 2 === 0 ? "" : "bg-muted/30 border-b border-border/30"}`}
                                    >
                                        <TableCell className="font-medium text-black">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                                                    <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-primary text-xs font-semibold">
                                                        {getInitials(user.name, user.fname)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-black">
                                                        {user.name} {user.fname}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-black">
                                                    {user.email || user.mail}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-black">
                                                {user.phone}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {getRoleBadge(user.role || "CLIENT")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {filteredData.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/20">
                            {/* <div className="text-sm text-white">
                                Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredData.length)} sur {filteredData.length} utilisateurs
                            </div> */}
                            <div className="ml-auto flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
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
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {filteredData.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 mx-auto text-white/50 mb-4" />
                            <h3 className="text-lg font-semibold text-foreground">Aucun utilisateur trouvé</h3>
                            <p className="text-white">Essayez de modifier vos filtres</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UsersPage;