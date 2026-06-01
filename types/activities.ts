export type ActivityCategory = 'work' | 'research' | 'others';

export type ActivityDate = {
  year: number;
  month?: number;
  day?: number;
};

export type ActivityPeriod = {
  start: ActivityDate;
  end?: ActivityDate | null;
};

export type Activity = {
  id: string;
  title: string;
  period: ActivityPeriod;
  description: string;
  category: ActivityCategory;
};

// 後方互換性のための型エイリアス
export type ProjectActivity = Activity;
