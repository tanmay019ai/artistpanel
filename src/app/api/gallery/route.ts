// /app/api/gallery/route.ts (Admin Panel)
import { NextResponse } from 'next/server';
import axios from 'axios';

// 🌐 Point this to your deployed portfolio API endpoint
const GALLERY_API =
  process.env.GALLERY_API_URL || 'https://arista-alpha.vercel.app/api/gallery';

/**
 * ✅ GET — Fetch gallery data from the main (portfolio) API
 */
export async function GET() {
  try {
    const response = await axios.get<{ success: boolean; data?: any[]; message?: string }>(
      GALLERY_API
    );

    return NextResponse.json({
      success: response.data?.success ?? false,
      data: response.data?.data || [],
      message: response.data?.message || 'Fetched successfully.',
    });
  } catch (err) {
    console.error('❌ Error fetching gallery data (admin):', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch gallery data from main API.' },
      { status: 500 }
    );
  }
}

/**
 * ✅ POST — Forward only real files and fields to the portfolio API
 * avoids sending blank or empty blobs for missing slots
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const cleanedFormData = new FormData();

    // Copy text fields (always include these)
    formData.getAll('title[]').forEach((v) => cleanedFormData.append('title[]', v));
    formData.getAll('medium[]').forEach((v) => cleanedFormData.append('medium[]', v));
    formData.getAll('year[]').forEach((v) => cleanedFormData.append('year[]', v));

    // Only append actual files (skip blanks)
    const files = formData.getAll('image[]') as File[];
    files.forEach((file) => {
      if (file && file.size > 0) {
        cleanedFormData.append('image[]', file);
      } else {
        // Empty slot — send a marker so portfolio knows not to overwrite
        cleanedFormData.append('image[]', new Blob([], { type: 'text/plain' }));
      }
    });

    // ✅ Forward to portfolio API
    const response = await axios.post<{ success: boolean; message?: string }>(
      GALLERY_API,
      cleanedFormData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return NextResponse.json({
      success: response.data?.success ?? false,
      message: response.data?.message || 'Data forwarded successfully.',
    });
  } catch (err) {
    console.error('❌ Error forwarding gallery data (admin → main):', err);
    return NextResponse.json(
      { success: false, message: 'Failed to send data to main gallery API.' },
      { status: 500 }
    );
  }
}
