// app/api/products/route.ts
import { NextResponse } from "next/server";
import { getProducts } from "@/app/api/services/products";

export async function GET() {
    try {
        const data = await getProducts();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des produits" },
            { status: 500 }
        );
    }
}