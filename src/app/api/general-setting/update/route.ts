import { NextResponse } from 'next/server'

// PUT
export async function PUT(req: Request) {
  const settings = await req.json()
  const url = `${process.env.NEXT_PUBLIC_API_URL}/GeneralSetting/updateSetting`
  const transformedSettings = {
    settings: Object.entries(settings).map(([settingName, settingValue]) => ({
      settingName,
      settingValue
    }))
  }
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transformedSettings)
    })
    if (res.ok) {
      return NextResponse.json({
        ok: true,
        status: 'success',
        message: 'Edit settings successfully'
      })
    }

    return NextResponse.json({
      ok: false,
      status: 'server error',
      message: 'Fail to edit settings'
    })
  } catch (error) {
    console.log('Error edit settings: ', error)
  }
}