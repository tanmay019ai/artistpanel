import { NextResponse } from 'next/server';

const PORTFOLIO_API = 'https://arista-alpha.vercel.app/api/about';

export async function GET() {
  try {
    const res = await fetch(PORTFOLIO_API);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching About data from portfolio:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch About data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      name: body.name,
      bio1: body.bio1,
      bio2: body.bio2,
      bio3: body.bio3,
      years: body.stats?.years,
      exhibitions: body.stats?.exhibitions,
      collectors: body.stats?.collectors,
    };

    const res = await fetch(PORTFOLIO_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error sending About data to portfolio:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send About data' },
      { status: 500 }
    );
  }
}
