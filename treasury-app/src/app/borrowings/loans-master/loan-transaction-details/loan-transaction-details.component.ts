import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { LoanTransaction } from '../../../models/loan-transaction.model';

@Component({
  selector: 'app-loan-transaction-details',
  templateUrl: './loan-transaction-details.component.html',
  styleUrls: ['./loan-transaction-details.component.css']
})
export class LoanTransactionDetailsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoanTransactionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public currencyPipe: CurrencyPipe,
    public percentPipe: PercentPipe) {
      this.gridOptions = {     
        rowModelType: 'infinite', 
        datasource: this.data.loanTransactions,
        infiniteInitialRowCount: 1000,  
      };
  }

  fdrNumber: string = "";

  @Input() interestDetailUpdated;
  @ViewChild('agGrid') agGrid: AgGridAngular;

  rowData: LoanTransaction[] = [];
  gridApi: GridApi;
  gridColumnApi;
  gridOptions: GridOptions;

  defaultColDef = {
    sortable: true,
    editable: false,
    filter: false,
    resizable: true,
    floatingFilter: false
  };

  columnDefs = [
    { headerName: 'Transaction Date', field: 'transactionDate', width: 100 },
    {
      headerName: 'Transaction Amount',
      field: 'transactionAmount',
      width: 150,
      valueFormatter: params => {
        if (!params.data) return;
        return this.currencyPipe.transform(params.data.transactionAmount);
      }
    },
    { headerName: 'Transaction Type', field: 'loanTransactionType', width: 150 },
    { headerName: 'Remark', field: 'remark', width: 400 }
  ];

  ngOnInit(): void {
    this.fdrNumber = this.data.fdrNumber;
    this.rowData = this.data.loanTransactions;
  }

  ngOnChanges(): void {
    this.rowData = this.data.loanTransactions;
  }

  onCancel() {
    this.dialogRef.close();
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    var data = this.data.loanTransactions;
    var datasource: IDatasource = {
      rowCount: undefined,
      getRows: (params: IGetRowsParams) => {

        setTimeout(function () {
          // take a slice of the total rows
          const rowsThisPage = data.slice(params.startRow, params.endRow);
          // if on or after the last page, work out the last row.
          let lastRow = -1;
          if (data.length <= params.endRow) {
            lastRow = data.length;
          }
          // call the success callback
          params.successCallback(rowsThisPage, lastRow);
        }, 500);
      }
    };
    this.gridApi.setDatasource(datasource);
  }

}
