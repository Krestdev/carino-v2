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
    totalProductPerTag: Array<{ category: CategoriesData, total: number }>;
    activeTab: number;
    setActiveTab: (tab: number) => void;
    firstTagId: number
}

const Categories = ({ activeTab, setActiveTab, categories, totalProductPerTag, firstTagId }: CategoriesProps) => {

    const totalAll = categories.reduce((acc, cat) => acc + cat.total, 0);
    const filteredCategories = categories.filter(x => x.total > 0);
    const getCategory = (id: number) => {
        const category = categories.find((cat) => cat.categories.id === id);
        return totalProductPerTag.find((tag) => tag.category.id === id);
    };



    return (
        <div className="flex flex-col gap-3">
            <p className="font-semibold font-general text-[15px] text-primary">
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
            <div className="hidden md:flex flex-col max-h-[80vh] overflow-y-auto gap-1">
                <div
                    onClick={() => setActiveTab(0)}
                    className={`cursor-pointer hover:bg-[#FFC336]/10 flex flex-row items-center justify-between p-1 gap-2 rounded transition-colors ${activeTab === 0 ? "bg-[#FFC336] hover:bg-[#FFC336]/90 text-black" : "text-gray-700"}`}
                >
                    <p className="font-medium text-[12px]">Tous les plats</p>
                    <p className={`text-[12px] ${activeTab === 0 ? "text-black" : "text-gray-400"}`}>{totalAll}</p>
                </div>

                <div
                    onClick={() => setActiveTab(firstTagId)}
                    className={`cursor-pointer hover:bg-[#FFC336]/10 flex flex-row items-center justify-between p-1 gap-2 rounded transition-colors ${activeTab === firstTagId ? "bg-[#FFC336] hover:bg-[#FFC336]/90 text-black" : "text-gray-700"}`}
                >
                    <p className="font-medium text-[12px]">{getCategory(firstTagId)?.category.name}</p>
                    <p className={`text-[12px] ${activeTab === firstTagId ? "text-black" : "text-gray-400"}`}>{getCategory(firstTagId)?.total}</p>
                </div>

                {filteredCategories.filter(x => x.categories.id !== firstTagId).map((cat) => (
                    <div
                        key={cat.categories.id}
                        onClick={() => setActiveTab(cat.categories.id)}
                        className={`cursor-pointer hover:bg-[#FFC336]/10 flex flex-row items-center justify-between p-1 gap-2 rounded transition-colors ${cat.categories.id === activeTab ? "bg-[#FFC336] hover:bg-[#FFC336]/90" : "text-gray-700"}`}
                    >
                        <p className="font-medium first-letter:uppercase lowercase text-[12px]">{cat.categories.name}</p>
                        <p className={`text-[12px] ${cat.categories.id === activeTab ? "text-black" : "text-gray-400"}`}>
                            {cat.total}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;