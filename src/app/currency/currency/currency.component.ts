import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SearchHistoryItem } from 'src/app/currency/currency';
import { CurrencyService } from 'src/app/currency/currency.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit, OnDestroy {
  error: any;
  loading = false;

  history: SearchHistoryItem[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private currencyService: CurrencyService) { }

  getState(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  ngOnInit() {
    this.currencyService.history$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(history => this.history = history);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
