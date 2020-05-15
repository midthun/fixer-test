export interface FixerResponse {
  succes: boolean;
  historical: boolean;
  date: string;
  timestamp: number;
  base: string;
  rates: Rates;
}

export interface Rates {
  [key: string]: number;
}

export interface RateCache {
  [key: string]: {
    [key: string]: Rates
  };
}

export interface SearchHistoryItem {
  amount: number;
  from: string;
  to: string;
  result?: number;
  rate?: number;
  date: Date;
}
