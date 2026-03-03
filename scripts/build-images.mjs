import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const rawDir = path.join(root, "raw/images");
const webpDir = path.join(root, "docs/assets/img");
const downloadsDir = path.join(root, "docs/assets/downloads");
const stickersDir = path.join(root, "docs/assets/effects/stickers");
const stickerLayoutPath = path.join(root, "docs/assets/effects/sticker-layout.json");
const stickerLayoutJsPath = path.join(root, "docs/assets/effects/sticker-layout.js");

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

const listStickerNames = async () => {
  const entries = await fs.readdir(rawDir);
  return entries
    .map((entry) => {
      const match = entry.match(/^sticker-(\d{2})\.(png|jpg|jpeg)$/i);
      if (!match) return null;
      return { name: `sticker-${match[1]}`, order: Number(match[1]), file: entry };
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order)
    .map((item) => item.name);
};

const cleanDirByExt = async (dir, ext) => {
  const entries = await fs.readdir(dir);
  await Promise.all(
    entries
      .filter((entry) => entry.toLowerCase().endsWith(ext.toLowerCase()))
      .map((entry) => fs.unlink(path.join(dir, entry)))
  );
};

const buildStickerWebp = async (name) => {
  const inputPath = await resolveSource(name);
  const outputPath = path.join(stickersDir, `${name}.webp`);
  await sharp(inputPath).webp({ quality: 82 }).toFile(outputPath);
};

const createSeededRng = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const shuffleWithSeed = (items, seed) => {
  const rand = createSeededRng(seed);
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateStickerLayout = (stickerNames, seed = 20260305) => {
  const shuffled = shuffleWithSeed(stickerNames, seed);
  const count = shuffled.length;
  const cols = Math.ceil(Math.sqrt(count * 1.8));
  const rows = Math.ceil(count / cols);
  const leftStart = 8;
  const leftEnd = 92;
  const topStart = 14;
  const topEnd = 88;
  const leftStep = cols > 1 ? (leftEnd - leftStart) / (cols - 1) : 0;
  const topStep = rows > 1 ? (topEnd - topStart) / (rows - 1) : 0;

  return shuffled.map((name, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      name,
      top: Number((topStart + topStep * row).toFixed(3)),
      left: Number((leftStart + leftStep * col).toFixed(3)),
      rotate: 0,
      scale: 1,
      opacity: 0.18,
    };
  });
};

const writeStickerLayout = async (layout) => {
  const payload = {
    seed: 20260305,
    generatedAt: new Date().toISOString(),
    items: layout,
  };
  await fs.writeFile(stickerLayoutPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  const jsPayload = `window.STICKER_LAYOUT = ${JSON.stringify(payload)};\n`;
  await fs.writeFile(stickerLayoutJsPath, jsPayload, "utf8");
};

const main = async () => {
  await Promise.all([ensureDir(webpDir), ensureDir(downloadsDir), ensureDir(stickersDir)]);

  for (const name of displayNames) {
    await buildDisplayWebp(name);
  }

  for (const name of downloadNames) {
    await buildDownloadPng(name);
  }

  const stickerNames = await listStickerNames();
  await cleanDirByExt(stickersDir, ".webp");
  for (const name of stickerNames) {
    await buildStickerWebp(name);
  }
  const layout = generateStickerLayout(stickerNames);
  await writeStickerLayout(layout);

  console.log(
    "Built optimized images:",
    `${displayNames.length} webp + ${downloadNames.length} download png + ${stickerNames.length} sticker webp`
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
