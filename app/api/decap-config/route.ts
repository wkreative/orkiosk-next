import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clientId = process.env.DECAP_GITHUB_CLIENT_ID || null
    const repo = process.env.DECAP_GITHUB_REPO || null
    return NextResponse.json({ clientId, repo })
  } catch (err) {
    return NextResponse.json({ clientId: null, repo: null }, { status: 500 })
  }
}
