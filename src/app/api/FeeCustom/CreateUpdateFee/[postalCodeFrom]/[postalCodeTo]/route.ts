import { NextResponse } from "next/server";
// POST
export async function POST(req: Request,{ params }: { params: { postalCodeFrom: string, postalCodeTo: string } }) {
	const feeCustom = await req.json();
    const {postalCodeFrom, postalCodeTo} = params;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/FeeCustom/CreateUpdateFee/${postalCodeFrom}/${postalCodeTo}`;
	try {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(feeCustom),
		});

        // const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add FeeCustom successfully",
                // data: data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Fail to add FeeCustom",
		});
	} catch (error) {
		return console.log("Error add FeeCustom: ", error);
	}
}