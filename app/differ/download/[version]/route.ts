import { NextResponse } from 'next/server';
import { head } from '@vercel/blob';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ version: string }> }
) {
  const { version } = await params;

  try {
    // Construct the blob path
    const blobPath = `differ/${version}`;

    // Check if the blob exists
    const blob = await head(blobPath);

    if (!blob) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Redirect to the blob URL (Vercel Blob CDN)
    return NextResponse.redirect(blob.url);
  } catch (error) {
    console.error('Error fetching blob:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
