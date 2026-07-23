/**
 * Shared domain types — the single source of truth for every data shape that
 * crosses module boundaries (data/*.{yaml,json,ts} → lib loaders → components).
 *
 * Types that are implementation details of a single module (component props,
 * renderer internals such as lib/weathering/engine.ts) stay in that module.
 */

// ---- Primitives ----

/** Calendar date with optional precision: year, year/month, or year/month/day. */
export type CalendarDate = {
  year: number;
  month?: number;
  day?: number;
};

/** Date range. `end` is absent while ongoing. */
export type CalendarPeriod = {
  start: CalendarDate;
  end?: CalendarDate;
};

/** External URL with a display label. */
export type LabeledLink = {
  label: string;
  url: string;
};

// ---- Activities (data/activities.yaml) ----

export const ACTIVITY_CATEGORIES = ['work', 'research', 'others'] as const;
export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export type Activity = {
  id: string;
  title: string;
  period: CalendarPeriod;
  description: string;
  category: ActivityCategory;
  featured?: boolean;
};

// ---- Publications (data/publications.yaml) ----

export const PUBLICATION_TYPES = ['oral', 'poster', 'talk'] as const;
export type PublicationType = (typeof PUBLICATION_TYPES)[number];

export type Publication = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  type: PublicationType;
  date: CalendarDate;
  links?: LabeledLink[];
};

// ---- Profile (data/profile.ts) ----

export type HeroSubtitle = {
  xOptions: readonly [string, ...string[]];
  yOptions: readonly [string, ...string[]];
  connector: string;
};

export type HeroContent = {
  title: string;
  subtitle: HeroSubtitle;
  socialLinks: LabeledLink[];
};

export type Certification = {
  name: string;
  issuer: string;
  acquiredDate: CalendarDate;
  score?: string;
  description?: string;
};

export type CertificationsContent = {
  title: string;
  certifications: Certification[];
};

// ---- Blog posts (content/posts/*.md) ----

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  draft: boolean;
  math: boolean;
  description?: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

// ---- Gallery (data/gallery.yaml) ----

export type GalleryWork = {
  id: string;
  title: string;
  date: string;
  /** Route path to the work page. */
  href: string;
  description?: string;
  tools?: string[];
};

// ---- Weathering (data/weathering.json, written daily by scripts/fetch-weathering.mjs) ----

export type WeatheringEvent = {
  year?: number; // absent for holidays
  text: string;
  pageTitle: string;
  pageUrl: string;
};

export type WeatheringSource = {
  fileTitle: string;
  filePageUrl: string;
  license: string;
  licenseUrl?: string;
  artist?: string;
};

export type WeatheringWork = {
  image: string;
  event: WeatheringEvent;
  source: WeatheringSource;
};

export type WeatheringData = {
  date: string;
  works: WeatheringWork[];
};
