import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyConvertHistoryComponent } from './currency-convert-history.component';

describe('CurrencyConvertHistoryComponent', () => {
  let component: CurrencyConvertHistoryComponent;
  let fixture: ComponentFixture<CurrencyConvertHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyConvertHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConvertHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
