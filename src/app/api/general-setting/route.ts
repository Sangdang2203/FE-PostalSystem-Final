import { SiteSetting } from "@/components/interfaces";
import { NextResponse } from "next/server";

function convertData(data) {
	const convertedData = {};

	data.forEach(item => {
		const { settingName, settingValue } = item;
		convertedData[settingName] = settingValue;
	});

	convertedData.site_language = "vi";
	convertedData.rateConvert = parseInt(convertedData.rateConvert);
	convertedData.limitSize = parseInt(convertedData.limitSize);
	convertedData.limitWeight = parseInt(convertedData.limitWeight);

	return convertedData;
}
export async function GET() {
	const url = `${process.env.NEXT_PUBLIC_API_URL}/GeneralSetting/getAllSettings`;
	try {
		const res = await fetch(url, { cache: "no-store" });
		const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				url: url,
				data: convertData(data),
			});
		} else {
			return NextResponse.json({
				url: url,
				error: "api backend error",
				status: 400,
			});
		}
	} catch {
		return NextResponse.json({
			url: url,
			error: "api backend error",
			status: 400,
		});
	}
	// return NextResponse.json({ url: url });
}
