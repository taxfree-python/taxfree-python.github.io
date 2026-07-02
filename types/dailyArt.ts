export type DailyArtEvent = {
  year: number;
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

/** Written daily by scripts/fetch-daily-art.mjs into data/daily-art.json. */
export type DailyArt = {
  date: string;
  seed: number;
  image: string;
  thumbnail: string;
  event: DailyArtEvent;
  source: DailyArtSource;
};
