import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ParkingSlot, VehicleDetails } from '../../interfaces/vehicle';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ParkingListComponent } from "../parking-list/parking-list/parking-list.component";
import { MatButtonModule } from '@angular/material/button';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-vehicle-entry-exit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule,
    MatSnackBarModule, ParkingListComponent, MatButtonModule],
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
  displayForm: boolean = false;

  parkingSlots : ParkingSlot = {
    'Regular': 10,
    'Compact': 6,
    'Handicapped': 2
  }
  parkedVehicles: VehicleDetails[] = [];

  constructor(private matSnackBar: MatSnackBar,
    private paymentService: PaymentService) { }

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
      this.displayForm = false;
      this.openSnackBar('Vehicled added to parking successfully!', 'Close', 5000);
      this.parkingSlots[vehicleType]--;
      this.vehicleAddForm.reset();
    } else {
      this.openSnackBar('No parking available', 'Close', 5000);
    }
  }

  markVehicleExit(vehicleID: string): void {
    this.processExitPayment(vehicleID);
    this.parkedVehicles = this.parkedVehicles.filter(obj => obj.id !== vehicleID);
    this.openSnackBar('Vehicled removed from parking successfully!', 'X', 5000)
  }

  processExitPayment(vehicleID: string): void {
    const currentVehicle = this.parkedVehicles.find(obj => obj.id === vehicleID) as VehicleDetails;
    if (!currentVehicle) {
      this.openSnackBar('Vehicle not found. Please try again.', 'X', 5000);
      return;
    }

    try {
      const amountToPay = this.paymentService.calculatePayment(currentVehicle.entryTime);
      this.openSnackBar(`The amount to pay is Rs. ${amountToPay}`, 'X', 5000);
      console.log(`Payment for vehicle ${vehicleID}: Rs. ${amountToPay}`);
    } catch (error) {
      this.openSnackBar('Error processing payment. Please try again.', 'X', 5000);
      console.error('Payment processing error:', error);
    }
  }
}
