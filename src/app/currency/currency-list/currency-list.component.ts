import { Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { CurrencyService } from 'src/app/currency/currency.service';
import { Rates } from 'src/app/currency/currency';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.scss']
})
export class CurrencyListComponent implements OnInit {
  rates$: Observable<Rates>;
  objectKeys = Object.keys;
  base = 'EUR';
  error: any;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.rates$ = this.currencyService
      .getRates(this.base, new Date())
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.error = err;
          return throwError(err);
        })
      );
  }
}
