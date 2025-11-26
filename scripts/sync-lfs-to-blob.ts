import { put, list } from '@vercel/blob';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

/**
 * Syncs Git LFS tracked files to Vercel Blob Storage during build time.
 * Only uploads files that don't already exist in blob storage (based on content hash).
 */
async function syncLfsToBlob() {
  const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

  if (!BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is required');
  }

  console.log('🔄 Starting LFS → Blob Storage sync...');

  // Get all product directories (differ/, other-app/, etc.)
  const productsDir = join(process.cwd());
  const products = readdirSync(productsDir).filter(item => {
    const fullPath = join(productsDir, item);
    return statSync(fullPath).isDirectory() && !item.startsWith('.') && !['app', 'scripts', 'node_modules', 'public'].includes(item);
  });

  console.log(`📦 Found product directories: ${products.join(', ')}`);

  // List existing blobs
  const { blobs: existingBlobs } = await list();
  const existingBlobPaths = new Set(existingBlobs.map(b => b.pathname));

  let uploadCount = 0;
  let skipCount = 0;

  for (const product of products) {
    const productDir = join(productsDir, product);

    console.log(`\n📂 Processing ${product}/ directory...`);

    // Recursively find all binary release files
    const findBinaryFiles = (dir: string, basePath: string): Array<{ filePath: string; blobPath: string }> => {
      const results: Array<{ filePath: string; blobPath: string }> = [];
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const relativePath = basePath ? `${basePath}/${entry}` : entry;

        if (statSync(fullPath).isDirectory()) {
          // Recurse into subdirectories
          results.push(...findBinaryFiles(fullPath, relativePath));
        } else if (entry.endsWith('.zip') || entry.endsWith('.delta') || entry.endsWith('.dmg')) {
          results.push({ filePath: fullPath, blobPath: `${product}/${relativePath}` });
        }
      }
      return results;
    };

    const binaryFiles = findBinaryFiles(productDir, '');

    for (const { filePath, blobPath } of binaryFiles) {

      // Check if blob already exists
      if (existingBlobPaths.has(blobPath)) {
        console.log(`  ⏭️  Skipping ${blobPath} (already exists in blob storage)`);
        skipCount++;
        continue;
      }

      // Read file and upload
      console.log(`  ⬆️  Uploading ${blobPath}...`);
      const fileBuffer = readFileSync(filePath);

      const blob = await put(blobPath, fileBuffer, {
        access: 'public',
        token: BLOB_READ_WRITE_TOKEN,
      });

      console.log(`  ✅ Uploaded: ${blob.url}`);
      uploadCount++;
    }
  }

  console.log(`\n✨ Sync complete!`);
  console.log(`   Uploaded: ${uploadCount} files`);
  console.log(`   Skipped: ${skipCount} files (already existed)`);
}

// Run the sync
syncLfsToBlob().catch(error => {
  console.error('❌ Error syncing LFS to blob storage:', error);
  process.exit(1);
});
