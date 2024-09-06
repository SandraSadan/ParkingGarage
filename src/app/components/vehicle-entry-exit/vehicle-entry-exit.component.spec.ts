import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEntryExitComponent } from './vehicle-entry-exit.component';

describe('VehicleEntryExitComponent', () => {
  let component: VehicleEntryExitComponent;
  let fixture: ComponentFixture<VehicleEntryExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleEntryExitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleEntryExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
