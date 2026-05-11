// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { ReservationData } from "@/types/types";
import { getReservations, postReservation, putReservation } from "@/app/api/services/bookings";

// Get
export async function GET() {
    try {
        const data: ReservationData = await getReservations();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des réservations" },
            { status: 500 }
        );
    }
}

// Post
export async function POST(request: Request) {
    try {
        const data: ReservationData = await request.json();
        const res = await postReservation(data);
        return NextResponse.json(res);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erreur lors de la création de la réservation" },
            { status: 500 }
        );
    }
}

// Update
export async function PUT(request: Request) {
    try {
        const data: ReservationData = await request.json();
        const res = await putReservation(data);
        return NextResponse.json(res);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de la réservation" },
            { status: 500 }
        );
    }
}