import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleDetails } from '../../../interfaces/vehicle';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-parking-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatButtonModule],
  templateUrl: './parking-list.component.html',
  styleUrl: './parking-list.component.scss'
})
export class ParkingListComponent {
@Input() dataSource: VehicleDetails[] = [];
displayedColumns: string[] = ['vehicleID', 'type', 'isParked', 'time', 'action'];
@Output() exit = new EventEmitter();

  constructor() {}

  markExit(vehicleId: string) {
    this.exit.emit(vehicleId);
  }
}
