import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ParkingSlot, VehicleDetails } from '../../interfaces/vehicle';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ParkingListComponent } from "../parking-list/parking-list/parking-list.component";
import { MatButtonModule } from '@angular/material/button';
import { PaymentService } from '../../services/payment.service';
import { MatDialogConfig, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../dialog/payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-vehicle-entry-exit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule,
    MatSnackBarModule, ParkingListComponent, MatButtonModule, MatDialogModule],
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
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) { }

  openSnackBar(message: string, action: string, duration?: number) {
    this.matSnackBar.open(message, action, { duration });
  }

  get id() {
    return this.vehicleAddForm.get('id');
  }

  markVehicleEntry(): void {
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
    const currentVehicle = this.parkedVehicles.find(obj => obj.id === vehicleID) as VehicleDetails;
    if (!currentVehicle) {
      this.openSnackBar('Vehicle not found. Please try again.', 'X', 5000);
      return;
    }
    try {
      const paymentDetails = this.paymentService.calculatePayment(currentVehicle.entryTime);
      this.openDialog(paymentDetails, vehicleID);
    } catch (error) {
      this.openSnackBar('Error processing payment. Please try again.', 'X', 5000);
      console.error('Payment processing error:', error);
    }
  }

  openDialog(paymentDetails: number[], vehicleID: string): void {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = paymentDetails;
    const dialogRef = this.dialog.open(PaymentDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: boolean) => {
       if (result) {
        this.parkedVehicles = this.parkedVehicles.filter(obj => obj.id !== vehicleID);
        this.openSnackBar('Vehicled removed from parking successfully!', 'X', 5000);
      }
    });
  }
}
