import { Injectable } from '@angular/core';
import { get } from 'lodash';

import { SearchHistoryItem, RateCache, Rates } from 'src/app/currency/currency';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  addHistory(item: SearchHistoryItem) {
    const history: SearchHistoryItem[] = JSON.parse(localStorage.getItem('history')) ?? [];

    history.push(item);

    localStorage.setItem('history', JSON.stringify(history));
  }

  getHistory(): SearchHistoryItem[] {
    return JSON.parse(localStorage.getItem('history')) ?? [];
  }

  addCache(rates: Rates, currency: string, date: string) {
    const cache = this.getCache();
    if (!cache[currency]) {
      cache[currency] = {};
    }
    cache[currency][date] = rates;

    localStorage.setItem('cache', JSON.stringify(cache));
  }

  getRatesFromCache(currency: string, date: string): Rates {
    const cache = this.getCache();
    return get(cache, [currency, date]);
  }

  private getCache(): RateCache {
    return JSON.parse(localStorage.getItem('cache')) ?? {};
  }
}
