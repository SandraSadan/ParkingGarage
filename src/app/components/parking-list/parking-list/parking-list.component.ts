import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { VehicleDetails } from '../../../interfaces/vehicle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-parking-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatButtonModule, MatPaginatorModule, MatSortModule],
  templateUrl: './parking-list.component.html',
  styleUrls: ['./parking-list.component.scss']
})
export class ParkingListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  _dataSource!: VehicleDetails[];
  dataWithPagination!: MatTableDataSource<VehicleDetails>;

  @Input("dataSource") 
  set dataSource(value: VehicleDetails[]) 
  { 
    this._dataSource = value;
    this.dataWithPagination = new MatTableDataSource(this._dataSource);
    this.length = this._dataSource.length;
    this.updatePaginator(); 
  }
  get dataSource() 
  { 
    return this._dataSource;
  }
  pageSize = 5;
  length = 100;
  displayedColumns: string[] = ['id', 'type', 'isParked', 'entryTime', 'action'];
  @Output() exit = new EventEmitter();

  constructor() { }
  
  // After the view has been initialized, assign the paginator to the table data source
  ngAfterViewInit() {
    this.updatePaginator();
  }

  updatePaginator() {
    if (this.paginator) {
      this.dataWithPagination.paginator = this.paginator;
      this.dataWithPagination.sort = this.sort;
      this.paginator.length = this._dataSource.length; // Set paginator length to data source length
      this.paginator.firstPage(); // Reset to first page when data changes
    }
  }

  markExit(vehicleId: string) {
   if (vehicleId) {
      this.exit.emit(vehicleId);
    }
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
  }
}
