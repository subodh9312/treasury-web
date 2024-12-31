import { CurrencyPipe } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, GridApi, GridOptions, RowEditingStartedEvent, RowEditingStoppedEvent, RowNode, SelectionChangedEvent } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { InterestRate } from 'src/app/models/interest-rate.model';
import { TransactionService } from 'src/app/services/transactions.service';
import { InterestDetail } from '../../models/interest-detail.model'; 

@Component({
  selector: 'app-interest-rates-list',
  templateUrl: './interest-rates-list.component.html',
  styleUrls: ['./interest-rates-list.component.css']
})
export class InterestRatesListComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InterestRatesListComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private spinner: NgxSpinnerService,
    private transactionService: TransactionService,
  ) { }

  fdrNumber: string = "";
  isLoading = false;
  errorMessage: any = null;
  editType = 'fullRow';

  @Input() interestDetailUpdated;
  @ViewChild('agGrid') agGrid: AgGridAngular;

  selectedRowNode: RowNode;
  selectedRowValueChanged = false;

  gridApi: GridApi;
  gridColumnApi;
  gridOptions: GridOptions;

  rowData: InterestDetail[] = [];
  defaultColDef = {
    sortable: true,
    editable: false,
    filter: true,
    resizable: true,
    floatingFilter: true
  };

  columnDefs = [
    { headerName: 'Effective Date', field: 'effectiveDate', editable: false,
    checkboxSelection: this.data.editAllowed, },  
    { 
      headerName: 'Interest Rate', 
      field: 'rate',editable: this.data.editAllowed
    }
  ];

  ngOnInit(): void {
    this.fdrNumber = this.data.fdrNumber;
    this.rowData = this.data.interestRates;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  ngOnChanges(): void {
    this.rowData = this.data.interestRates;
    
  }
  onEdit() {
    this.agGrid.api.startEditingCell({
      rowIndex: this.selectedRowNode.rowIndex,
      colKey: 'rate'
    });
  }
  onSelectionChanged(event: SelectionChangedEvent) {
    this.selectedRowNode = event.api.getSelectedNodes()[0];
  }

  onRowStartEditing(event: RowEditingStartedEvent) {
    event.node.setSelected(true);
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    this.selectedRowValueChanged = true;
  }
  onRowStopEditing(event: RowEditingStoppedEvent) { 
    event.node.setSelected(false);
    this.selectedRowValueChanged = false;
  }

  onCancel() {
    this.dialogRef.close({ resData: this.data });
  }
  onSave() {  

    this.agGrid.api.stopEditing();
  }
  


}
