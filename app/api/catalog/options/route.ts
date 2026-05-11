// app/api/products/route.ts
import { NextResponse } from "next/server";
import { getOptions } from "@/app/api/services/options";

export async function GET() {
    try {
        const data = await getOptions();
        return NextResponse.json(data.options || []);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des options" },
            { status: 500 }
        );
    }
}