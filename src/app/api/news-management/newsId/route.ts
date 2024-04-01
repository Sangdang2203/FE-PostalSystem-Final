import { NextResponse } from "next/server";

// DELETE
export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	const url = `${process.env.NEXT_PUBLIC_API_URL}api/Blog/${id}`;
	try {
		const res = await fetch(url, {
			method: "DELETE",
			cache: "no-cache",
		});

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Delete news successfully.",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Fail to delete news.",
		});
	} catch (error) {
		return console.log("Error delete news: ", error);
	}
}

// UPDATE
export async function PUT(req: Request) {
	const news = await req.json();
	const url = `${process.env.NEXT_PUBLIC_API_URL}api/Blog/update/${news.id}`;
	try {
		const res = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(news),
		});

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Edit news successfully",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Fail to edit news",
		});
	} catch (error) {
		return console.log("Error edit news: ", error);
	}
}
