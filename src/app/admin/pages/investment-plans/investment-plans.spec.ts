import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentPlans } from './investment-plans';

describe('InvestmentPlans', () => {
  let component: InvestmentPlans;
  let fixture: ComponentFixture<InvestmentPlans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentPlans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentPlans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
