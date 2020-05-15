import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CurrencyService } from 'src/app/currency/currency.service';
import { Rates } from 'src/app/currency/currency';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.scss']
})
export class CurrencyListComponent implements OnInit {
  rates$: Observable<Rates>;
  objectKeys = Object.keys;
  base = 'EUR';

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.rates$ = this.currencyService
      .getRates(this.base, new Date());
  }
}
