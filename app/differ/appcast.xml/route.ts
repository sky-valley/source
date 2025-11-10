import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Read appcast.xml from the differ directory (checked into regular git)
    const appcastPath = join(process.cwd(), 'differ', 'appcast.xml');
    const appcastContent = readFileSync(appcastPath, 'utf-8');

    return new NextResponse(appcastContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error reading appcast.xml:', error);
    return new NextResponse('Appcast not found', { status: 404 });
  }
}
