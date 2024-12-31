import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { TdsDetail } from '../../models/tds-detail.model';
import { InterestDetail } from '../../models/interest-detail.model'; 

@Component({
  selector: 'app-interest-detail-list',
  templateUrl: './interest-detail-list.component.html',
  styleUrls: ['./interest-detail-list.component.css']
})
export class InterestDetailListComponent implements OnInit, OnChanges {
  
  constructor(
    public dialogRef: MatDialogRef<InterestDetailListComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public currencyPipe: CurrencyPipe,
    public percentPipe: PercentPipe,
    
  ) {
    this.gridOptions = {     
      rowModelType: 'infinite', 
      datasource: this.data.interestDetails,
      infiniteInitialRowCount: 1000,  
    };
   }

  fdrNumber: string = "";

  @Input() interestDetailUpdated;
  @ViewChild('agGrid') agGrid: AgGridAngular;

  rowData: InterestDetail[] = [];
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
    { headerName: 'Start Date', field: 'startDate', width: 150 },
    { headerName: 'End Date', field: 'endDate', width: 150 },
    { 
      headerName: 'Gross Interest', 
      field: 'grossInterest', 
      width: 200,
      valueFormatter:params => {
        if (!params.data) return;
        let totalTds = params.data.tdsDetails.reduce((grossInterest, current: TdsDetail) => grossInterest + current.tdsAmount, 0);
        return this.currencyPipe.transform(params.data.interestAmount + totalTds);
      }
    },
    { 
      headerName: 'Nett Interest', 
      field: 'interestAmount', 
      width: 200,
      valueFormatter: params => {
        if (!params.data) return;
        return this.currencyPipe.transform(params.data.interestAmount);
      }
    },
    { 
      headerName: 'Interest Rate', 
      field: 'rate',
      width: 150,
      valueFormatter: params => {
        if (!params.data) return;
        return this.percentPipe.transform(params.data.rate / 100, '0.2-2');
      }
    },
    { 
      headerName: 'TDS Deducted', 
      field: 'totalTds', 
      width: 150,
      valueFormatter: params => {
        if (!params.data) return;
        return this.currencyPipe.transform(params.data.tdsDetails.reduce((totalTds, current: TdsDetail) => totalTds + current.tdsAmount, 0));
      }
    },
    {
      headerName: 'Average Amount',
      field: 'averageAmount',
      width: 150,
      valueFormatter: params => {
        if (!params.data) return;
        return this.currencyPipe.transform(params.data.averageAmount);
      }
    },
    {
      headerName: 'Average Rate',
      field: 'averageRate',
      width: 100,
      valueFormatter: params => {
        if (!params.data) return;
        return this.percentPipe.transform(params.data.averageRate / 100, '0.2-2');
      }
    }
  ];

  ngOnInit(): void {
    this.fdrNumber = this.data.fdrNumber;
    this.rowData = this.data.interestDetails;   
  }

  ngOnChanges(): void {
    this.rowData = this.data.interestDetails;
  }

  onCancel() {
    this.dialogRef.close();
  }
  onGridReady(params) {
    
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    var data = this.data.interestDetails;
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
      //this.gridOptions.api.setDatasource(this.data.interestDetails);
  }

}
