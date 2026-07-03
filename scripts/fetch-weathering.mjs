/**
 * Fetch the daily source images for the "Weathering" gallery work.
 *
 * Picks Wikipedia "On this day" events for the current JST date, finds up to
 * ten associated Wikimedia Commons images that are public domain or CC0, and
 * writes normalized JPEGs plus metadata into the repository:
 *
 *   public/images/gallery/weathering/0.jpg .. N-1.jpg   (1280px, canvas sources)
 *   data/weathering.json                                (attribution per work)
 *
 * The client shows one of the works at random per page load. Selection is
 * deterministic per date; exits non-zero without touching any files when no
 * acceptable image is found, so the previous day's works stay in place.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const USER_AGENT =
  'taxfree-python.github.io/weathering (https://github.com/taxfree-python/taxfree-python.github.io)';

const MAX_WORKS = 10;
const MIN_SOURCE_WIDTH = 640;
const IMAGE_WIDTH = 1280;

const repoRoot = path.join(import.meta.dirname, '..');
const imagesDir = path.join(repoRoot, 'public', 'images', 'gallery', 'weathering');
const metadataPath = path.join(repoRoot, 'data', 'weathering.json');

function jstToday() {
  const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getUTCFullYear();
  const mm = String(jst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(jst.getUTCDate()).padStart(2, '0');
  return { date: `${yyyy}-${mm}-${dd}`, mm, dd };
}

// FNV-1a: deterministic per-date seed for candidate selection.
function fnv1a(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(state) {
  let a = state;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(items, random) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Commons Artist markup often repeats the name in nested tags.
  return text.replace(/^(.+?) \1$/, '$1');
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
  // `all` merges events, selected, births, deaths, and holidays — a much
  // larger pool of PD-heavy pages than events alone.
  const feed = await fetchJson(
    `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${mm}/${dd}`,
  );

  const byTitle = new Map();
  for (const key of ['selected', 'events', 'births', 'deaths', 'holidays']) {
    for (const event of feed[key] ?? []) {
      for (const page of event.pages ?? []) {
        const image = page.originalimage;
        const title = page.titles?.normalized ?? page.title;
        if (!image || image.width < MIN_SOURCE_WIDTH || !title || byTitle.has(title)) {
          continue;
        }
        byTitle.set(title, {
          pageTitle: title,
          pageUrl: page.content_urls?.desktop?.page ?? '',
          event: { year: event.year ?? null, text: event.text },
        });
      }
    }
  }
  return [...byTitle.values()];
}

async function resolvePageImages(candidates) {
  const resolved = [];
  const seenFiles = new Set(); // several pages can share one page image
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
      if (fileName && !seenFiles.has(fileName)) {
        seenFiles.add(fileName);
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

function workEntry(candidate, index) {
  return {
    image: `/images/gallery/weathering/${index}.jpg`,
    event: {
      ...(candidate.event.year != null ? { year: candidate.event.year } : {}),
      text: candidate.event.text,
      pageTitle: candidate.pageTitle,
      pageUrl: candidate.pageUrl,
    },
    source: {
      fileTitle: candidate.fileTitle,
      filePageUrl: candidate.filePageUrl,
      license: candidate.license,
      ...(candidate.licenseUrl ? { licenseUrl: candidate.licenseUrl } : {}),
      ...(candidate.artist ? { artist: candidate.artist } : {}),
    },
  };
}

async function main() {
  const { date, mm, dd } = jstToday();
  console.log(`Selecting weathering works for ${date} (JST)`);

  const pages = await collectCandidates(mm, dd);
  const withFiles = await resolvePageImages(pages);
  const licensed = await filterFreelyLicensed(withFiles);
  if (licensed.length === 0) {
    console.error('No PD/CC0 candidate image found; keeping previous day.');
    process.exit(1);
  }

  // Photographs first, then diagrams; shuffled deterministically per date so
  // every run of the same day (locally or in CI) picks the same set.
  const seed = fnv1a(date);
  const random = mulberry32(seed);
  const tiers = [[], [], []];
  for (const candidate of licensed) {
    tiers[fileFormatTier(candidate.fileTitle)].push(candidate);
  }
  const ordered = tiers.flatMap((tier) =>
    seededShuffle(
      tier.sort((a, b) => a.fileTitle.localeCompare(b.fileTitle)),
      random,
    ),
  );
  const picks = ordered.slice(0, MAX_WORKS);

  const downloads = [];
  for (const candidate of picks) {
    try {
      downloads.push({
        candidate,
        buffer: await fetchRenderedImage(candidate.fileTitle, candidate.sourceWidth),
      });
      console.log(`Fetched ${candidate.fileTitle} (${candidate.license})`);
    } catch (error) {
      console.warn(`Skipping ${candidate.fileTitle}: ${error.message}`);
    }
  }
  if (downloads.length === 0) {
    console.error('All downloads failed; keeping previous day.');
    process.exit(1);
  }

  await fs.mkdir(imagesDir, { recursive: true });
  for (const stale of await fs.readdir(imagesDir)) {
    if (stale.endsWith('.jpg')) {
      await fs.unlink(path.join(imagesDir, stale));
    }
  }

  const works = [];
  for (const [index, { candidate, buffer }] of downloads.entries()) {
    const image = await sharp(buffer)
      .rotate()
      .flatten({ background: '#ffffff' })
      .resize({ width: IMAGE_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    await fs.writeFile(path.join(imagesDir, `${index}.jpg`), image);
    works.push(workEntry(candidate, index));
  }

  const metadata = { date, works };
  await fs.writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  console.log(
    `Wrote ${works.length} works to ${path.relative(repoRoot, metadataPath)} and public/images/gallery/weathering/`,
  );
}

await main();
