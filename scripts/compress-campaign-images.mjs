import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const campaignRoot = join(projectRoot, "public", "assets", "campaign");

const RASTER_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const PHOTO_QUALITY = 82;
const PNG_QUALITY = 85;

function walkRasterFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkRasterFiles(fullPath));
      continue;
    }
    if (RASTER_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressToWebp(sourcePath) {
  const extension = extname(sourcePath).toLowerCase();
  const targetPath = sourcePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  const quality = extension === ".png" ? PNG_QUALITY : PHOTO_QUALITY;

  await sharp(sourcePath)
    .webp({ quality, effort: 4 })
    .toFile(targetPath);

  const before = statSync(sourcePath).size;
  const after = statSync(targetPath).size;
  const relativePath = relative(projectRoot, sourcePath);

  return {
    source: relativePath,
    webp: relative(projectRoot, targetPath),
    before,
    after,
    savings: before - after,
    savingsPct: ((1 - after / before) * 100).toFixed(1),
  };
}

async function main() {
  if (!existsSync(campaignRoot)) {
    console.error(`Campaign assets folder not found: ${campaignRoot}`);
    process.exit(1);
  }

  const sources = walkRasterFiles(campaignRoot);
  if (!sources.length) {
    console.log("No raster campaign images found.");
    return;
  }

  const results = [];
  for (const sourcePath of sources) {
    results.push(await compressToWebp(sourcePath));
  }

  let totalBefore = 0;
  let totalAfter = 0;

  console.log("Campaign WebP compression complete:\n");
  for (const result of results) {
    totalBefore += result.before;
    totalAfter += result.after;
    console.log(
      `${result.source}\n  → ${result.webp}\n  ${formatBytes(result.before)} → ${formatBytes(result.after)} (${result.savingsPct}% smaller)\n`,
    );
  }

  console.log(
    `Total: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% smaller)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
