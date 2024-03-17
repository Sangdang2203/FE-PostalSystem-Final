import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
    try {
      let api = process.env.API_URL;
      const jsonData = await req.json();
      const response = await fetch(`${api}/Branch/togglestatus/${jsonData.id}`, {
        cache: 'no-cache',
        method: 'PATCH',
      });
      if (response.status === 404) {
        return NextResponse.json({ data: false, error: await response.text(), status: response.status});
      }
      if(response.status === 200) {
        const data = await response.json();
        return NextResponse.json({ data, status: response.status});
      }
      return NextResponse.json({ data: false,error: 'Something wrong!!!', status: response.status});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ data: false, error: 'api backend error', status: 500});
    }
  }
    export async function GET(req: NextRequest) {
        return NextResponse.json({ error: 'api not found' });
    }