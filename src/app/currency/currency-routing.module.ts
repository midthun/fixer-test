import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CurrencyComponent } from 'src/app/currency/currency/currency.component';
import {
  CurrencyConvertHistoryComponent
} from 'src/app/currency/currency-convert-history/currency-convert-history.component';
import {
  CurrencyConverterComponent
} from 'src/app/currency/currency-converter/currency-converter.component';
import { CurrencyListComponent } from 'src/app/currency/currency-list/currency-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      component: CurrencyComponent,
      children: [
        { path: 'convert', component: CurrencyConverterComponent },
        { path: 'history', component: CurrencyConvertHistoryComponent },
        { path: 'rates', component: CurrencyListComponent },
        { path: '', redirectTo: 'convert', pathMatch: 'full' }
      ]
    }])
  ],
  exports: [RouterModule],
  providers: []
})
export class CurrencyRoutingModule { }
