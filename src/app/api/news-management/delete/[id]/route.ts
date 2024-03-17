import { NextResponse } from 'next/server'

// DELETE
export async function DELETE(req: Request, {params} : {params: {id: string}}) {
  const id = params.id
  const url = `${process.env.NEXT_PUBLIC_API_URL}api/Blog/delete/${id}`
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      return NextResponse.json({
        ok: true,
        status: 'success',
        message: 'Delete news successfully'
      })
    }

    return NextResponse.json({
      ok: false,
      status: 'server error',
      message: 'Fail to delete news'
    })
  } catch (error) {
    return console.log('Error edit news: ', error)
  }
}