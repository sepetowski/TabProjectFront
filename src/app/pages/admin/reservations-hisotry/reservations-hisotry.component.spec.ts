import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsHisotryComponent } from './reservations-hisotry.component';

describe('ReservationsHisotryComponent', () => {
  let component: ReservationsHisotryComponent;
  let fixture: ComponentFixture<ReservationsHisotryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsHisotryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationsHisotryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
