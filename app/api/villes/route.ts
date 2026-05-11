// app/api/villes/route.ts
import { NextResponse } from "next/server";
import { getVilles } from "../services/villes";
import { AddtressData } from "@/types/types";

export async function GET() {
    try {
        const data: AddtressData[] = await getVilles();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des villes" },
            { status: 500 }
        );
    }
}