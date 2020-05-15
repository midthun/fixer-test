import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateTime } from 'luxon';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { FixerResponse, SearchHistoryItem } from 'src/app/currency/currency';
import { StorageService } from 'src/app/currency/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private endpoint = 'http://data.fixer.io/api';
  private key: string;

  rates: string[];

  history$ = new BehaviorSubject<SearchHistoryItem[]>([]);

  constructor(
    private http: HttpClient,
    private storage: StorageService) {
    this.key = environment.fixer.key;
    this.setRates();

    const history = this.storage.getHistory();
    this.history$.next(history);
  }

  convert(amount: number, from: string, to: string, date?: Date): Observable<number> {
    if (!date) {
      date = new Date();
    }

    const search: SearchHistoryItem = {
      amount,
      from,
      to,
      date
    };

    if (from === to) {
      return of(1);
    }

    return this.getRates(from, date)
      .pipe(
        tap(rates => search.rate = rates[to]),
        map(rates => amount * rates[to]),
        tap(result => {
          search.result = result;
          this.storage.addHistory(search);

          const history = this.history$.value;
          history.push(search);

          this.history$.next(history);
        })
      );
  }

  getRates(fromCurrency: string, date: Date) {
    if (!this.key) {
      return throwError(new Error('You need to specify a Fixer API Key in the environment settings (see README.md)'));
    }

    const resource = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');

    const cache = this.storage.getRatesFromCache(fromCurrency, resource);
    if (cache) {
      return of(cache);
    }

    const url = this.createUrl(resource);
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          if (response.error) {
            throw new Error(response?.error?.info || 'Failed to fetch exchange rates');
          }

          return response;
        }),
        map((response: FixerResponse) => {
          // free fixer.io plan fix:
          const rates = response.rates;
          const base = response.base;

          const ratio = rates[base] / rates[fromCurrency];
          for (const key in rates) {
            if (rates.hasOwnProperty(key)) {
              rates[key] = rates[key] * ratio;
            }
          }

          this.storage.addCache(rates, fromCurrency, resource);

          return rates;
        })
      );
  }

  private createUrl(resource: string) {
    return `${this.endpoint}/${resource}?access_key=${this.key}`;
  }

  private setRates() {
    const rates = [
      'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN',
      'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL',
      'BSD', 'BTC', 'BTN', 'BWP', 'BYN', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF',
      'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF',
      'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP',
      'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL',
      'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK',
      'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW',
      'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL',
      'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR',
      'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR',
      'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR',
      'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD',
      'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS',
      'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD',
      'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XCD',
      'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMK', 'ZMW', 'ZWL'];
    this.rates = rates;
  }
}
