import { NextResponse } from "next/server";
export async function POST(req: Request) {
    const { postalCodeFrom, postalCodeTo , weight } = await req.json();
    console.log("Data:",postalCodeFrom, postalCodeTo, weight);
    try {
        const data = [
            {
                serviceId: 1,
                serviceName: "Fast Shipping",
                serviceDescription: "Fast Shipping",
                weighFrom: 1000,
                weighTo: 999999999,
                feeCharge: 50000,
                timeProcess: 18,
                overWeightCharge: 2000,
                status: 1,
            },
            {
                serviceId: 2,
                serviceName: "Normal Shipping",
                serviceDescription: "Normal Shipping",
                weighFrom: 1000,
                weighTo: 999999999,
                feeCharge: 30000,
                timeProcess: 30,
                overWeightCharge: 1000,
                status: 1,
            },
            {
                serviceId: 3,
                serviceName: "Slow Shipping",
                serviceDescription: "Slow Shipping",
                weighFrom: 1000,
                weighTo: 999999999,
                feeCharge: 20000,
                timeProcess: 72,
                overWeightCharge: 500,
                status: 1,
            },
        ]
        const dataEmpty: never[] = [];
        return NextResponse.json({ data : data.filter(f=>f.status===1) });
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
}