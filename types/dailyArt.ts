export type DailyArtEvent = {
  year?: number; // absent for holidays
  text: string;
  pageTitle: string;
  pageUrl: string;
};

export type DailyArtSource = {
  fileTitle: string;
  filePageUrl: string;
  license: string;
  licenseUrl?: string;
  artist?: string;
};

export type DailyArtWork = {
  image: string;
  event: DailyArtEvent;
  source: DailyArtSource;
};

/** Written daily by scripts/fetch-daily-art.mjs into data/daily-art.json. */
export type DailyArt = {
  date: string;
  seed: number;
  thumbnail: string;
  works: DailyArtWork[];
};
