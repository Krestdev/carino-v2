"use client"

import useStore from "@/context/store";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, LogOut } from "lucide-react";
import Loading from "../loading";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        if (user !== undefined) {
            setIsLoading(false);
        }
    }, [user]);

    if (isLoading) return <Loading />;

    if (user?.role !== "ADMIN" && user?.role !== "MANAGER" && user?.role !== "WAITER") {
        redirect("/");
    }

    const navItems = [
        user.role === "WAITER" ? null : { name: "Réservations", path: "/admin", icon: CalendarDays },
        { name: "Utilisateurs", path: "/admin/utilisateurs", icon: Users },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white text-gray-800 flex flex-col border-r border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-primary">
                        Dashboard
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        {user?.role === "ADMIN" ? "Administrateur" : user?.role === "MANAGER" ? "Manager" : user?.role === "WAITER" ? "Serveur" : ""}
                    </p>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navItems && navItems.map((item) => {
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
            </aside>

            {/* Main content */}
            <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

export default Layout;