// Dans un composant de protection de route (ex: RouteGuard.tsx)
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useStore from '@/context/store';
import { toast } from 'react-toastify';

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useStore();

    useEffect(() => {
        // Vérifier si l'utilisateur est un Admin avec first login
        const isAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';
        const require_password_change = user?.require_password_change === true;
        const isOnEditPasswordPage = pathname === '/edit-password';

        if (isAdmin && require_password_change && !isOnEditPasswordPage) {
            toast.info('Veuillez changer votre mot de passe avant de continuer');
            router.push('/edit-password');
        }
    }, [user, pathname, router]);

    return <>{children}</>;
}