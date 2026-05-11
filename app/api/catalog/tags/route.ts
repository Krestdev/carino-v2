// app/api/categories/routes.ts
import { getCategories } from "@/app/api/services/categories";
import { CategoriesData } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data: { tags: CategoriesData[] } = await getCategories();
        return NextResponse.json(data.tags);
    } catch (error) {
        console.log("Error getting categories:", error);

        return NextResponse.json(
            { error: "Erreur lors de la récupération des catégories" },
            { status: 500 }
        );
    }
}