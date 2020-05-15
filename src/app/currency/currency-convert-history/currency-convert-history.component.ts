import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import { CurrencyService } from 'src/app/currency/currency.service';
import { SearchHistoryItem } from 'src/app/currency/currency';

@Component({
  selector: 'app-currency-convert-history',
  templateUrl: './currency-convert-history.component.html',
  styleUrls: ['./currency-convert-history.component.scss']
})
export class CurrencyConvertHistoryComponent implements OnInit, OnDestroy {
  history$: Observable<SearchHistoryItem[]>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.history$ = this.currencyService.history$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(items => items
          .sort((a, b) => +new Date(b.date) - +new Date(a.date))));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
