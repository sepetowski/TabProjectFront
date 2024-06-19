import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansHisotryComponent } from './loans-hisotry.component';

describe('LoansHisotryComponent', () => {
  let component: LoansHisotryComponent;
  let fixture: ComponentFixture<LoansHisotryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansHisotryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoansHisotryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
