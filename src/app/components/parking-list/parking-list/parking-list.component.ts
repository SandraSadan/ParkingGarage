import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { VehicleDetails } from '../../../interfaces/vehicle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-parking-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './parking-list.component.html',
  styleUrl: './parking-list.component.scss'
})
export class ParkingListComponent implements OnInit, AfterViewInit {
  _dataSource!: VehicleDetails[];
  dataWithPagination!: MatTableDataSource<VehicleDetails>;
  @Input("dataSource") 
  set dataSource(value: VehicleDetails[]) 
  { 
    this._dataSource = value;
    this.dataWithPagination = new MatTableDataSource(this._dataSource);
  }
  get dataSource() 
  { 
    return this._dataSource;
  }
  pageSize = 5;
  length = 100;
  displayedColumns: string[] = ['vehicleID', 'type', 'isParked', 'time', 'action'];
  @Output() exit = new EventEmitter();
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataWithPagination.paginator = paginator;
  };

  constructor() { }
  
  ngOnInit() {
    this.dataWithPagination = new MatTableDataSource(this._dataSource);
  }

  // After the view has been initialized, assign the paginator to the table data source
  ngAfterViewInit() {
    this.dataWithPagination.paginator = this.paginator;
  }

  markExit(vehicleId: string) {
    this.exit.emit(vehicleId);
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
  }
}
