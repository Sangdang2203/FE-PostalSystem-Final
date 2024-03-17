import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { historyLogId: number } }
) {
	try {
		const id = params.historyLogId;

		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL + `/HistoryLog/${id}`,
			{
				method: "GET",
				cache: "no-cache",
			}
		);

		let data = null;
		if (res.ok) {
			data = await res.json();
		}

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Get historyLog successfully.",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to get historyLog.",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to get historyLog.",
		});
	}
}
