export type ActivityCategory = 'work' | 'research' | 'others';

export interface ActivityDate {
  year: number;
  month?: number;
  day?: number;
}

export interface ActivityPeriod {
  start: ActivityDate;
  end?: ActivityDate | null;
}

export interface Activity {
  id: string;
  title: string;
  period: ActivityPeriod;
  description: string;
  category: ActivityCategory;
}

// 後方互換性のための型エイリアス
export type ProjectActivity = Activity;
