"use client"

import { CategoriesData } from "@/types/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CategoriesProps {
    categories: Array<{ categories: CategoriesData, total: number }>;
    activeTab: number;
    setActiveTab: (tab: number) => void;
}

const Categories = ({ activeTab, setActiveTab, categories }: CategoriesProps) => {

    const totalAll = categories.reduce((acc, cat) => acc + cat.total, 0);
    const filteredCategories = categories.filter(x => x.total > 0);

    return (
        <div className="flex flex-col gap-3">
            <p className="font-semibold font-general text-[20px] text-primary">
                Catégories
            </p>

            {/* Version mobile : Shadcn Select */}
            <div className="block md:hidden w-full">
                <Select
                    value={activeTab.toString()}
                    onValueChange={(value) => setActiveTab(Number(value))}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">
                            Tous les plats <span className="text-gray-400 ml-1">({totalAll})</span>
                        </SelectItem>
                        {filteredCategories.map((cat) => (
                            <SelectItem key={cat.categories.id} value={cat.categories.id.toString()}>
                                {cat.categories.name} <span className="text-gray-400 ml-1">({cat.total})</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Version desktop : Liste verticale (inchangée pour l'UX) */}
            <div className="hidden md:flex flex-col gap-1">
                <div
                    onClick={() => setActiveTab(0)}
                    className={`cursor-pointer hover:bg-[#FFC336]/10 flex flex-row items-center justify-between p-2.5 gap-2 rounded transition-colors ${activeTab === 0 ? "bg-[#FFC336] hover:bg-[#FFC336]/90 text-black" : "text-gray-700"}`}
                >
                    <p className="font-medium">Tous les plats</p>
                    <p className={activeTab === 0 ? "text-black" : "text-gray-400"}>{totalAll}</p>
                </div>

                {filteredCategories.map((cat) => (
                    <div
                        key={cat.categories.id}
                        onClick={() => setActiveTab(cat.categories.id)}
                        className={`cursor-pointer hover:bg-[#FFC336]/10 flex flex-row items-center justify-between p-2.5 gap-2 rounded transition-colors ${cat.categories.id === activeTab ? "bg-[#FFC336] hover:bg-[#FFC336]/90" : "text-gray-700"}`}
                    >
                        <p className="font-medium uppercase">{cat.categories.name}</p>
                        <p className={cat.categories.id === activeTab ? "text-black" : "text-gray-400"}>
                            {cat.total}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;