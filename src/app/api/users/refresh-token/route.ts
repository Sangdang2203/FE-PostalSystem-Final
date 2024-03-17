import { parse } from "cookie";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
//import { getServerSession } from "next-auth/next";
//import { authOptions } from "../../auth/[...nextauth]/route";
//import { Session } from "next-auth";

export async function POST(req: NextRequest) {
	//const session = (await getServerSession(authOptions)) as Session | null;
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/Users/Refresh-token`,
		{
			// header must have access token
			headers: req.headers,
			method: req.method,
		}
	);
	try {
		const apiCookies = res.headers.getSetCookie();

		if (apiCookies && apiCookies.length > 0) {
			apiCookies.forEach(cookie => {
				const parsedCookie = parse(cookie);
				const [cookieName, cookieValue] = Object.entries(parsedCookie)[0];
				const httpOnly = cookie.includes("httponly");

				cookies().set({
					name: cookieName,
					value: cookieValue,
					httpOnly: httpOnly,
					expires: new Date(parsedCookie.expires),
				});
			});
		}

		const data = await res.json();

		// if ok call update token in nextauth front-end
		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to refresh token",
				data,
			});
		}

		if (res.status === 401) {
			return NextResponse.json({
				ok: false,
				status: data.code,
				message: data.message,
			});
		}

		if (res.status === 400) {
			return NextResponse.json({
				ok: false,
				status: data.code,
				message: data.errors[0].message,
			});
		}

		console.log("Unhandled server-side error in refresh token");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to refresh token",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in refresh token");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to refresh token",
		});
	}
}
