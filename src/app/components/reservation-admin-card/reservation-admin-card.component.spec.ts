import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAdminCardComponent } from './reservation-admin-card.component';

describe('ReservationAdminCardComponent', () => {
  let component: ReservationAdminCardComponent;
  let fixture: ComponentFixture<ReservationAdminCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationAdminCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationAdminCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
