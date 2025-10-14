import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Change these to whatever you want
  const VALID_EMAIL = 'admin';
  const VALID_PASSWORD = '1234';

  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    return NextResponse.json({ success: true, message: 'Login successful' });
  }

  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
