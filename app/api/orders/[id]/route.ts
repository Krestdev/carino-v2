// // app/api/orders/[id]/route.ts
// Get orders by user ID
import { NextResponse } from "next/server";
import { getOrdersByUserId } from "../../services/orders";
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const userId = params.id;
    try {
        const data = await getOrdersByUserId(userId);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des commandes" },
            { status: 500 }
        );
    }
}