import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAdminCardComponent } from './loan-admin-card.component';

describe('LoanAdminCardComponent', () => {
  let component: LoanAdminCardComponent;
  let fixture: ComponentFixture<LoanAdminCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanAdminCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanAdminCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
