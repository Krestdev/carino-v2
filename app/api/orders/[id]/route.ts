// app/api/orders/[id]/route.ts
// Get orders by user ID
import { NextResponse } from "next/server";
import { getOrdersByUserId } from "../../services/orders";

// For Next.js 15+, params is a Promise
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const data = await getOrdersByUserId(userId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}