import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const rawDir = path.join(root, "raw/images");
const webpDir = path.join(root, "docs/assets/img");
const downloadsDir = path.join(root, "docs/assets/downloads");

const displayNames = ["key-visual", "message-board", "seat-map", "profile-mico", "profile-tsukaima"];
const downloadNames = ["profile-mico", "profile-tsukaima"];

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const resolveSource = async (name) => {
  const candidates = [".png", ".jpg", ".jpeg"].map((ext) => path.join(rawDir, `${name}${ext}`));
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // continue
    }
  }
  throw new Error(`Source image not found for '${name}' in raw/images`);
};

const buildDisplayWebp = async (name) => {
  const inputPath = await resolveSource(name);
  const outputPath = path.join(webpDir, `${name}.webp`);
  await sharp(inputPath).webp({ quality: 82 }).toFile(outputPath);
};

const buildDownloadPng = async (name) => {
  const inputPath = await resolveSource(name);
  const outputPath = path.join(downloadsDir, `${name}.png`);
  await sharp(inputPath).png({ compressionLevel: 9 }).toFile(outputPath);
};

const main = async () => {
  await Promise.all([ensureDir(webpDir), ensureDir(downloadsDir)]);

  for (const name of displayNames) {
    await buildDisplayWebp(name);
  }

  for (const name of downloadNames) {
    await buildDownloadPng(name);
  }

  console.log("Built optimized images:", displayNames.length, "webp +", downloadNames.length, "download png");
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
