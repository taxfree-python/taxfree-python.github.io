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

/** Written daily by scripts/fetch-weathering.mjs into data/weathering.json. */
export type WeatheringData = {
  date: string;
  works: WeatheringWork[];
};
