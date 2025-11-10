import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ version: string }> }
) {
  const { version } = await params;

  try {
    // Construct the blob path prefix (without hash suffix)
    const blobPathPrefix = `differ/${version}`;

    // List blobs with the prefix to find the file (with hash suffix)
    const { blobs } = await list({
      prefix: blobPathPrefix,
      limit: 1,
    });

    if (blobs.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Redirect to the blob URL (Vercel Blob CDN)
    return NextResponse.redirect(blobs[0].url);
  } catch (error) {
    console.error('Error fetching blob:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
