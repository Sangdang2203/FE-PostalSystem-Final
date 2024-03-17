import { NextResponse } from 'next/server'

// PUT
export async function PUT(req: Request) {
  const news = await req.json()
  const url = `${process.env.NEXT_PUBLIC_API_URL}api/Blog/update/${news.id}`
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(news)
    })

    if (res.ok) {
      return NextResponse.json({
        ok: true,
        status: 'success',
        message: 'Edit news successfully'
      })
    }

    return NextResponse.json({
      ok: false,
      status: 'server error',
      message: 'Fail to edit news'
    })
  } catch (error) {
    return console.log('Error edit news: ', error)
  }
}