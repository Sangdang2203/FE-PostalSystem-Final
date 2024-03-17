import {NextResponse} from 'next/server'

export async function GET(req: Request, {params}: { params: { packageId: string } }) {
    const {packageId} = params
    const url = `${process.env.NEXT_PUBLIC_API_URL}/Package/getbyid/${packageId}`
    try {
        const res = await fetch(url, {cache: 'no-store'})
        if (res.ok) {
            return NextResponse.json({
                data: await res.json(),
                ok:true
            })
        }
        if(res.status === 404) {
            return NextResponse.json({
                error: 'Not found data',
                ok: false
            })
        }
        return NextResponse.json({
            error: 'Something went wrong',
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