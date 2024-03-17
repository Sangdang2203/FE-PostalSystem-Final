/*
import { NextResponse } from "next/server";
export async function GET(req: Request,  {params}: {params: {id: string}}) {
    try {
        const id = params.id;
        const data = [
            {
                id: 1,
                locationName: "Hà Nội"+id,
                postalCode: "100000",
                locationLevel: 0,
                locationOf: 0,
            },
            {
                id: 2,
                locationName: "Hồ Chí Minh"+id,
                postalCode: "700000",
                locationLevel: 0,
                locationOf: 0,
            },
            {
                id: 3,
                locationName: "Đà Nẵng"+id,
                postalCode: "550000",
                locationLevel: 0,
                locationOf: 0,
            },
            {
                id: 4,
                locationName: "Hải Phòng"+id,
                postalCode: "180000",
                locationLevel: 0,
                locationOf: 0,
            },
            {
                id: 5,
                locationName: "Cần Thơ"+id,
                postalCode: "900000",
                locationLevel: 0,
                locationOf: 0,
            },
            {
                id: 6,
                locationName: "An Giang"+id,
                postalCode: "880000",
                locationLevel: 0,
                locationOf: 0,
            },
        ];
        return NextResponse.json({ districts : data });
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
}*/
