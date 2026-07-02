/**
 * Fetch the daily source image for the "Memory of Today" gallery work.
 *
 * Picks a Wikipedia "On this day" event for the current JST date, finds an
 * associated image on Wikimedia Commons that is public domain or CC0, and
 * writes a normalized JPEG plus metadata into the repository:
 *
 *   public/images/gallery/daily/current.jpg        (1280px, canvas source)
 *   public/images/gallery/daily/current-thumb.jpg  (640px, gallery card)
 *   public/images/gallery/daily/YYYY-MM-DD.jpg     (dated archive copy)
 *   data/daily-art.json                            (attribution + seed)
 *
 * Exits non-zero without touching any files when no acceptable image is
 * found, so the previous day's work stays in place.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const USER_AGENT =
  'taxfree-python.github.io/daily-art (https://github.com/taxfree-python/taxfree-python.github.io)';

const MIN_SOURCE_WIDTH = 640;
const IMAGE_WIDTH = 1280;
const THUMB_WIDTH = 640;

const repoRoot = path.join(import.meta.dirname, '..');
const dailyDir = path.join(repoRoot, 'public', 'images', 'gallery', 'daily');
const metadataPath = path.join(repoRoot, 'data', 'daily-art.json');

function jstToday() {
  const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getUTCFullYear();
  const mm = String(jst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(jst.getUTCDate()).padStart(2, '0');
  return { date: `${yyyy}-${mm}-${dd}`, mm, dd };
}

// FNV-1a: deterministic seed shared by this script and the client renderer.
function fnv1a(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function chunk(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isFreeLicense(licenseShortName) {
  return /public domain|\bpd\b|cc0/i.test(licenseShortName);
}

function fileFormatTier(fileName) {
  if (/\.jpe?g$/i.test(fileName)) return 0; // photographs first
  if (/\.png$/i.test(fileName)) return 1;
  return 2; // svg and others: flags, seals, diagrams
}

async function collectCandidates(mm, dd) {
  const feed = await fetchJson(
    `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${mm}/${dd}`,
  );

  const byTitle = new Map();
  for (const event of feed.events ?? []) {
    for (const page of event.pages ?? []) {
      const image = page.originalimage;
      const title = page.titles?.normalized ?? page.title;
      if (!image || image.width < MIN_SOURCE_WIDTH || !title || byTitle.has(title)) {
        continue;
      }
      byTitle.set(title, {
        pageTitle: title,
        pageUrl: page.content_urls?.desktop?.page ?? '',
        event: { year: event.year, text: event.text },
      });
    }
  }
  return [...byTitle.values()];
}

async function resolvePageImages(candidates) {
  const resolved = [];
  for (const group of chunk(candidates, 50)) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      formatversion: '2',
      prop: 'pageimages',
      piprop: 'name',
      pilimit: 'max',
      titles: group.map((candidate) => candidate.pageTitle).join('|'),
    });
    const data = await fetchJson(`https://en.wikipedia.org/w/api.php?${params}`);
    const fileByTitle = new Map(
      (data.query?.pages ?? [])
        .filter((page) => page.pageimage)
        .map((page) => [page.title, page.pageimage]),
    );
    for (const candidate of group) {
      const fileName = fileByTitle.get(candidate.pageTitle);
      if (fileName) {
        resolved.push({ ...candidate, fileTitle: `File:${fileName}` });
      }
    }
  }
  return resolved;
}

async function filterFreelyLicensed(candidates) {
  const licensed = [];
  for (const group of chunk(candidates, 50)) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      formatversion: '2',
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
      titles: group.map((candidate) => candidate.fileTitle).join('|'),
    });
    const data = await fetchJson(`https://en.wikipedia.org/w/api.php?${params}`);
    const infoByTitle = new Map(
      (data.query?.pages ?? [])
        .filter((page) => page.imageinfo?.[0])
        .map((page) => [page.title, page.imageinfo[0]]),
    );
    for (const candidate of group) {
      const info = infoByTitle.get(candidate.fileTitle);
      const meta = info?.extmetadata;
      const license = meta?.LicenseShortName?.value ?? '';
      if (!info || !isFreeLicense(license) || info.width < MIN_SOURCE_WIDTH) {
        continue;
      }
      licensed.push({
        ...candidate,
        license: stripHtml(license),
        licenseUrl: meta?.LicenseUrl?.value ?? '',
        artist: stripHtml(meta?.Artist?.value ?? ''),
        filePageUrl: info.descriptionurl ?? '',
        sourceWidth: info.width,
      });
    }
  }
  return licensed;
}

async function fetchRenderedImage(fileTitle, sourceWidth) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: String(Math.min(IMAGE_WIDTH, sourceWidth)),
    titles: fileTitle,
  });
  const data = await fetchJson(`https://en.wikipedia.org/w/api.php?${params}`);
  const info = data.query?.pages?.[0]?.imageinfo?.[0];
  const url = info?.thumburl ?? info?.url;
  if (!url) {
    throw new Error(`no rendered URL for ${fileTitle}`);
  }
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.status} ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const { date, mm, dd } = jstToday();
  console.log(`Selecting daily art for ${date} (JST)`);

  const pages = await collectCandidates(mm, dd);
  const withFiles = await resolvePageImages(pages);
  const licensed = await filterFreelyLicensed(withFiles);
  if (licensed.length === 0) {
    console.error('No PD/CC0 candidate image found; keeping previous day.');
    process.exit(1);
  }

  // Prefer photographs over diagrams, then pick deterministically by date so
  // every run of the same day (locally or in CI) chooses the same image.
  const bestTier = Math.min(...licensed.map((c) => fileFormatTier(c.fileTitle)));
  const pool = licensed
    .filter((c) => fileFormatTier(c.fileTitle) === bestTier)
    .sort((a, b) => a.fileTitle.localeCompare(b.fileTitle));
  const seed = fnv1a(date);
  const picked = pool[seed % pool.length];
  console.log(`Picked ${picked.fileTitle} (${picked.license}) from ${pool.length} candidates`);
  console.log(`Event: ${picked.event.year} — ${picked.event.text}`);

  const original = await fetchRenderedImage(picked.fileTitle, picked.sourceWidth);
  const base = sharp(original).rotate().flatten({ background: '#ffffff' });
  const image = await base
    .clone()
    .resize({ width: IMAGE_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  const thumb = await base
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const metadata = {
    date,
    seed,
    image: '/images/gallery/daily/current.jpg',
    thumbnail: '/images/gallery/daily/current-thumb.jpg',
    event: {
      year: picked.event.year,
      text: picked.event.text,
      pageTitle: picked.pageTitle,
      pageUrl: picked.pageUrl,
    },
    source: {
      fileTitle: picked.fileTitle,
      filePageUrl: picked.filePageUrl,
      license: picked.license,
      ...(picked.licenseUrl ? { licenseUrl: picked.licenseUrl } : {}),
      ...(picked.artist ? { artist: picked.artist } : {}),
    },
  };

  await fs.mkdir(dailyDir, { recursive: true });
  await fs.writeFile(path.join(dailyDir, 'current.jpg'), image);
  await fs.writeFile(path.join(dailyDir, 'current-thumb.jpg'), thumb);
  await fs.writeFile(path.join(dailyDir, `${date}.jpg`), image);
  await fs.writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  console.log(`Wrote ${path.relative(repoRoot, metadataPath)} and images under public/images/gallery/daily/`);
}

await main();
