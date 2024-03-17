import {NextResponse} from "next/server";
import uploadFileS3 from "@/helper/uploadFileS3";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({error: "File is required."}, {status: 400});
        }
        const res = await uploadFileS3(file as File);
        const dataRes = JSON.parse(res);
        // @ts-ignore
        if (dataRes.status === "failed") {
            // @ts-ignore
            return NextResponse.json({error: dataRes.message});
        }
        // @ts-ignore
        return NextResponse.json({fileLink: dataRes.fileLink});
    } catch (error) {
        return NextResponse.json({error: "api backend error"});
    }
}