import {NextResponse} from 'next/server'

export async function PUT(req: Request, {params}: { params: { packageId: string } }) {
    const {packageId} = params;
    const payload = await req.json();
    const url ={
        cancel: `${process.env.NEXT_PUBLIC_API_URL}/Package/cancel/${packageId}`,
        addPickup: `${process.env.NEXT_PUBLIC_API_URL}/Package/addPickup/${packageId}`,
        update: `${process.env.NEXT_PUBLIC_API_URL}/Package/update/${packageId}`
    }
    try {
        // @ts-ignore
        const res = await fetch(url[payload.action], {
            method: req.method,
            headers: req.headers,
            body: JSON.stringify(payload)
        })
        if (res.ok) {
            return NextResponse.json({
                ok: true,
                status: "success",
                message: "Package updated successfully",
            });
        }
        console.log("res", res)
        return NextResponse.json({
            message: 'Something went wrong',
            ok:false
        })
    } catch {
        return NextResponse.json({
            url: url,
            error: 'api backend error',
            status: 400,
            ok:false
        })
    }
}