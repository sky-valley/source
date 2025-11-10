import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ version: string }> }
) {
  const { version } = await params;

  console.log('[Download] Version requested:', version);

  try {
    // Construct the blob path prefix (without hash suffix or .zip extension)
    // The version param includes .zip, so we need to remove it for prefix matching
    const versionWithoutExt = version.replace(/\.zip$/, '');
    const blobPathPrefix = `differ/${versionWithoutExt}`;
    console.log('[Download] Looking for blob prefix:', blobPathPrefix);

    // List blobs with the prefix to find the file (with hash suffix)
    const { blobs } = await list({
      prefix: blobPathPrefix,
      limit: 1,
    });

    console.log('[Download] Found blobs:', blobs.length);
    if (blobs.length > 0) {
      console.log('[Download] Blob pathname:', blobs[0].pathname);
      console.log('[Download] Blob URL:', blobs[0].url);
    }

    if (blobs.length === 0) {
      console.log('[Download] No blobs found with prefix:', blobPathPrefix);
      return new NextResponse('File not found', { status: 404 });
    }

    // Redirect to the blob URL (Vercel Blob CDN)
    return NextResponse.redirect(blobs[0].url);
  } catch (error) {
    console.error('[Download] Error fetching blob:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
