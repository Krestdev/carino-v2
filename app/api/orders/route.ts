// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { getOrders } from "../services/orders";

export async function GET() {
    try {
        const data = await getOrders();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des commandes" },
            { status: 500 }
        );
    }
}