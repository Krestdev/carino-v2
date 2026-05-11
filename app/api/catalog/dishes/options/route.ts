// Ici on va récupérer les ids des options liés aux plats

// on va prendre l'ids des plats et on va chercher les options liés

import { NextResponse } from "next/server";
import { getProducts } from "@/app/api/services/products";

export async function GET() {
    try {
        const res = await getProducts();
        const data = res.data;
        const ids = data.map((item: any) => item.id);
        return NextResponse.json(ids);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des produits" },
            { status: 500 }
        );
    }
}