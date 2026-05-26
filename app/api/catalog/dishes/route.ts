// app/api/products/route.ts
import { NextResponse } from "next/server";
import { getProducts } from "@/app/api/services/products";
import { ProductsData } from "@/types/types";

export async function GET() {
    try {
        const data: { dishes: ProductsData[] } = await getProducts();
        return NextResponse.json(data.dishes.filter(x => x.price > 500));
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des produits" },
            { status: 500 }
        );
    }
}