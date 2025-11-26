import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  console.log('[DMG Download] Filename requested:', filename);

  try {
    // Construct the blob path prefix (without hash suffix or .dmg extension)
    const filenameWithoutExt = filename.replace(/\.dmg$/, '');
    const blobPathPrefix = `differ/dmg/${filenameWithoutExt}`;
    console.log('[DMG Download] Looking for blob prefix:', blobPathPrefix);

    // List blobs with the prefix to find the file (with hash suffix)
    const { blobs } = await list({
      prefix: blobPathPrefix,
      limit: 1,
    });

    console.log('[DMG Download] Found blobs:', blobs.length);
    if (blobs.length > 0) {
      console.log('[DMG Download] Blob pathname:', blobs[0].pathname);
      console.log('[DMG Download] Blob URL:', blobs[0].url);
    }

    if (blobs.length === 0) {
      console.log('[DMG Download] No blobs found with prefix:', blobPathPrefix);
      return new NextResponse('File not found', { status: 404 });
    }

    // Redirect to the blob URL (Vercel Blob CDN)
    return NextResponse.redirect(blobs[0].url);
  } catch (error) {
    console.error('[DMG Download] Error fetching blob:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
