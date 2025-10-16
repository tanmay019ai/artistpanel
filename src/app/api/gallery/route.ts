// /app/api/gallery/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

// Local route used by admin panel
// It just forwards data to the main hosted API endpoint
export async function POST(req: Request) {
  try {
    // Read incoming FormData from admin panel
    const formData = await req.formData();

    // Destination API (main hosted route)
    const GALLERY_API =
      process.env.GALLERY_API_URL || 'https://arista-alpha.vercel.app/api/gallery';

    // Forward the FormData to the main API
    const response = await axios.post<{ success: boolean; message?: string }>(`${GALLERY_API}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return NextResponse.json({
      success: response.data.success,
      message: response.data.message || 'Data sent successfully.',
    });
  } catch (err) {
    console.error('❌ Error forwarding gallery data:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to send data to main gallery API.' },
      { status: 500 }
    );
  }
}
