import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CurrencyComponent } from './currency/currency.component';
import { CurrencyRoutingModule } from 'src/app/currency/currency-routing.module';
import { CurrencyConverterComponent } from './currency-converter/currency-converter.component';
import { CurrencyConvertHistoryComponent } from './currency-convert-history/currency-convert-history.component';
import { CurrencyListComponent } from './currency-list/currency-list.component';

@NgModule({
  declarations: [CurrencyComponent, CurrencyConverterComponent, CurrencyConvertHistoryComponent, CurrencyListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyRoutingModule
  ]
})
export class CurrencyModule { }
