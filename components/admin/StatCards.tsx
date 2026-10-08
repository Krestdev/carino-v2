import type { LucideIcon } from "lucide-react";

export interface StatCardItem {
    title: string;
    value: number | string;
    description: string;
    icon: LucideIcon;
    /** Classes de la pastille d'icône, ex. "bg-amber-100 text-amber-600" */
    iconClass: string;
}

/** Cartes de statistiques du dashboard (thème clair Carino). */
const StatCards = ({ items }: { items: StatCardItem[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ title, value, description, icon: Icon, iconClass }) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <div className={`rounded-lg p-2 ${iconClass}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
                <p className="mt-1 text-xs text-gray-500">{description}</p>
            </div>
        ))}
    </div>
);

export default StatCards;
