import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CurrencyService } from 'src/app/currency/currency.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  error: any;
  loading = false;
  form: FormGroup;
  rates: string[];
  convertedAmount: number;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService) { }

  convertCurrency() {
    this.error = null;
    this.loading = true;

    if (this.form.valid) {
      const data = this.form.value;

      let date: Date;
      if (data.date) {
        date = new Date(data.date);
      }

      this.currencyService.convert(data.amount, data.from, data.to, date)
        .subscribe(amount => {
          this.convertedAmount = amount;
          this.loading = false;
        }, (err: HttpErrorResponse) => {
          this.error = err;
          this.loading = false;
        });
    }
  }

  hasError(form: FormGroup, field: string, error: string): boolean {
    const control = form.get(field);
    return control.hasError(error) && control.dirty && control.touched;
  }

  private createForm() {
    this.form = this.fb.group({
      amount: this.fb.control(1, [Validators.required]),
      from: this.fb.control('NOK', [Validators.required]),
      to: this.fb.control('EUR', [Validators.required]),
      date: this.fb.control(null, [])
    }, { updateOn: 'change' });
  }

  ngOnInit() {
    this.rates = this.currencyService.rates;
    this.createForm();

    this.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(changes => {
        this.convertedAmount = null;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
