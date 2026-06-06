"use client"

import useStore from "@/context/store";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, LogOut, Menu, X } from "lucide-react";
import Loading from "../loading";

const Layout = ({ children }: { children: React.ReactNode }) => {

    const router = useRouter();
    const { user, logout } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (user !== undefined) {
            setIsLoading(false);
        }
    }, [user]);

    // Fermer la sidebar sur mobile lors du changement de route
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (user?.role !== "ADMIN" && user?.role !== "MANAGER" && user?.role !== "WAITER") {
        redirect("/");
    }

    const navItems = [
        user?.role === "WAITER" ? null : { name: "Réservations", path: "/admin", icon: CalendarDays },
        { name: "Utilisateurs", path: "/admin/utilisateurs", icon: Users },
    ].filter(Boolean);

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">
                            Dashboard
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            {user?.role === "ADMIN" ? "Administrateur" : user?.role === "MANAGER" ? "Manager" : "Serveur"}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        if (!item) return null;
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                        ? "bg-primary text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="mb-4 px-4 py-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Connecté en tant que</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                </div>
                <button
                    onClick={() => logout?.()}
                    className="flex items-center space-x-3 px-4 py-2 w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Overlay pour mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 bg-white text-gray-800 flex flex-col border-r border-gray-200 shadow-sm">
                <SidebarContent />
            </aside>

            {/* Sidebar - Mobile */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-800 flex flex-col border-r border-gray-200 shadow-sm transform transition-transform duration-300 z-30 lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent />
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header mobile avec bouton menu */}
                <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Contenu principal avec padding responsive */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default Layout;