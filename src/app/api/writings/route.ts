import { NextResponse } from 'next/server';

const PORTFOLIO_API = process.env.PORTFOLIO_API_URL || 'https://arista-alpha.vercel.app/api/writings';

// GET — fetch writings from portfolio API
export async function GET() {
  try {
    const res = await fetch(PORTFOLIO_API);

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Portfolio API GET failed:', res.status, text);
      return NextResponse.json(
        { success: false, message: `Portfolio GET failed: ${res.status}` },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ Admin API GET error:', err);
    return NextResponse.json(
      { success: false, message: (err as Error).message || 'Failed to fetch writings' },
      { status: 500 }
    );
  }
}

// POST — send writings to portfolio API
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.writings || !Array.isArray(body.writings)) {
      return NextResponse.json(
        { success: false, message: 'Invalid writings array' },
        { status: 400 }
      );
    }

    const res = await fetch(PORTFOLIO_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writings: body.writings }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Portfolio API POST failed:', res.status, text);
      return NextResponse.json(
        { success: false, message: `Portfolio POST failed: ${res.status}` },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ Admin API POST error:', err);
    return NextResponse.json(
      { success: false, message: (err as Error).message || 'Failed to send writings' },
      { status: 500 }
    );
  }
}
