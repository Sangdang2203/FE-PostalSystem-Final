import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        const data = [
            {
                phoneNumber: "0359901221",
                fullName: "Nguyễn Văn A",
                address: "1234 TARS Street, Ward: Bến Thành",
                province: "Hồ Chí Minh",
                district: "Quận 1",
                postalCode: "700000",
            },
            {
                phoneNumber: "0359901221",
                fullName: "Nguyễn Văn B",
                address: "1234 TARS Street, Ward: Bến Thành",
                province: "Hồ Chí Minh",
                district: "Quận 1",
                postalCode: "700000",
            },
            {
                phoneNumber: "0359901221",
                fullName: "Nguyễn Văn C",
                address: "1234 TARS Street, Ward: Bến Thành",
                province: "Hồ Chí Minh",
                district: "Quận 1",
                postalCode: "700000",
            },
            {
                phoneNumber: "0359901221",
                fullName: "Nguyễn Văn D",
                address: "1234 TARS Street, Ward: Bến Thành",
                province: "Hồ Chí Minh",
                district: "Quận 1",
                postalCode: "700000",
            },
            {
                phoneNumber: "0359901221",
                fullName: "Nguyễn Văn E",
                address: "1234 TARS Street, Ward: Bến Thành",
                province: "Hồ Chí Minh",
                district: "Quận 1",
                postalCode: "700000",
            },
        ]
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
}