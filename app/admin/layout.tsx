"use client"

import useStore from "@/context/store";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user !== undefined) {
            setIsLoading(false);
        }
    }, [user]);

    if (isLoading) return <Loading />;

    if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
        redirect("/");
    }

    return <>{children}</>;
}

export default Layout;