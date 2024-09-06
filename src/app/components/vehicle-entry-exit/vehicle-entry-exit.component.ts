import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ParkingSlot, VehicleDetails } from '../../interfaces/vehicle';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ParkingListComponent } from "../parking-list/parking-list/parking-list.component";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vehicle-entry-exit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule, MatSnackBarModule, ParkingListComponent, MatButtonModule],
  templateUrl: './vehicle-entry-exit.component.html',
  styleUrl: './vehicle-entry-exit.component.scss',
})
export class VehicleEntryExitComponent {
  vehicle?: VehicleDetails;
  parkingTypes: string[] = ['Regular', 'Compact', 'Handicapped'];
  vehicleAddForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(4)]),
    type: new FormControl('Regular'),
    isParked: new FormControl(false),
    entryTime: new FormControl()
  });

  parkingSlots : ParkingSlot = {
    'Regular': 10,
    'Compact': 6,
    'Handicapped': 2
  }
  parkedVehicles: VehicleDetails[] = [];

  constructor(private matSnackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string, duration?: number) {
    this.matSnackBar.open(message, action, { duration });
  }

  get id() {
    return this.vehicleAddForm.get('id');
  }

  markVehicleEntry() {
    const vehicleType = (this.vehicleAddForm.get('type')?.value) || 'Regular';
    const isParkingAvailable: boolean = this.parkingSlots[vehicleType] > 0;
    if (isParkingAvailable) {
      this.vehicleAddForm.patchValue({
        isParked: true,
        entryTime: new Date(),
      });
      this.parkedVehicles.push(this.vehicleAddForm.value as VehicleDetails);
      this.parkedVehicles = [...this.parkedVehicles];
      this.openSnackBar('Vehicled added to parking successfully!', 'Close', 5000);
      this.parkingSlots[vehicleType]--;
      this.vehicleAddForm.reset();
    } else {
      this.openSnackBar('No parking available', 'Close', 5000);
    }
  }

  markVehicleExit(vehicleID: string) {
    this.parkedVehicles =  this.parkedVehicles.filter(obj => obj.id !== vehicleID);
    this.openSnackBar('Vehicled removed from parking successfully!', 'X', 5000)
  }
}
