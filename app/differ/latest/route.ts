import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { XMLParser } from 'fast-xml-parser';

interface AppcastItem {
  title: string;
  'sparkle:version': string;
  enclosure: {
    '@_url': string;
  };
}

interface AppcastChannel {
  item: AppcastItem | AppcastItem[];
}

interface AppcastXML {
  rss: {
    channel: AppcastChannel;
  };
}

export async function GET(request: Request) {
  try {
    // Read appcast.xml from the differ directory
    const appcastPath = join(process.cwd(), 'differ', 'appcast.xml');
    const appcastContent = readFileSync(appcastPath, 'utf-8');

    // Parse the XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const appcast = parser.parse(appcastContent) as AppcastXML;

    // Get all items (handle both single item and array of items)
    const items = Array.isArray(appcast.rss.channel.item)
      ? appcast.rss.channel.item
      : [appcast.rss.channel.item];

    // Find the item with the highest sparkle:version number
    const latestItem = items.reduce((latest, current) => {
      const latestVersion = parseInt(latest['sparkle:version'], 10);
      const currentVersion = parseInt(current['sparkle:version'], 10);
      return currentVersion > latestVersion ? current : latest;
    });

    // Extract the download URL from the enclosure
    const downloadUrl = latestItem.enclosure['@_url'];

    // Extract just the filename from the URL and convert to DMG
    // URL format: https://source.skyvalley.ac/differ/Differ-1.0.3.2.zip
    // Website downloads use DMG (drag-to-Applications), Sparkle updates use ZIP
    const zipFilename = downloadUrl.split('/').pop();

    if (!zipFilename) {
      console.error('[Latest] Could not extract filename from URL:', downloadUrl);
      return new NextResponse('Invalid appcast format', { status: 500 });
    }

    // Serve DMG for website downloads instead of ZIP
    const filename = zipFilename.replace('.zip', '.dmg');

    console.log('[Latest] Found latest version:', latestItem.title);
    console.log('[Latest] Redirecting to DMG:', filename);

    // Redirect to the version-specific route which will handle the blob lookup
    // DMGs are stored in the dmg/ subdirectory to avoid conflicts with Sparkle's appcast generation
    const requestUrl = new URL(request.url);
    const redirectUrl = new URL(`/differ/dmg/${filename}`, requestUrl.origin);

    return NextResponse.redirect(redirectUrl.toString(), {
      status: 302,
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('[Latest] Error finding latest version:', error);
    return new NextResponse('Error finding latest version', { status: 500 });
  }
}
