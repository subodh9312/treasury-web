import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, RowNode, SelectionChangedEvent, GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { CheckboxComponent } from '../../../util/checkbox.component';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { MultiSelectComponent } from '../../../util/multiselect.component';
import { TransactionService } from '../../../services/transactions.service';
import { FixedDepositInvestment } from 'src/app/models/fixed-deposit.model';
import { MatDialog } from '@angular/material/dialog';
import { InterestDetailListComponent } from '../../interest-detail-list/interest-detail-list.component';
import { CurrencyPipe } from '@angular/common';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-fd-liquidated-transactions',
  templateUrl: './fd-liquidated-transactions.component.html',
  styleUrls: ['./fd-liquidated-transactions.component.css']
})
export class FdLiquidatedTransactionsComponent implements OnInit,OnChanges {

  @ViewChild('agGrid') agGrid: AgGridAngular;

  isLoading = false;
  errorMessage: any = null;
  pageSize;
  domLayout = "autoHeight";

  //@Output() sellFixedDeposit = new EventEmitter();

  @Input() transactionUpdated: any;
  allFixedDeposits: FixedDepositInvestment[];
  selectedRowNode: RowNode;
  selectedRowValueChanged = false;

  gridApi: GridApi;
  gridColumnApi;
  gridOptions: GridOptions;

  rowData: FixedDepositInvestment[] = [];
  frameworkComponents = {
    customTooltip: CustomTooltip,
    checkboxComponent: CheckboxComponent,
    multiSelectComponent: MultiSelectComponent
  };
  tooltipShowDelay = 0;
  editType = 'fullRow';

  defaultColDef = {
    sortable: true,
    editable: false,
    filter: true,
    resizable: true,
    floatingFilter: true,
    suppressSizeToFit: false
  };

  columnDefs = [
    {
      colId: 1,
      headerName: 'Company',
      field: 'company',
      editable: false,
      checkboxSelection: true,
      tooltipComponent: 'customTooltip',
      tooltipField: 'company',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'company'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.company.name;
      }
    },
    {
      colId: 2,
      headerName: 'Counter Party',
      field: 'counterParty',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'counterParty',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'counterParty'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        if (params.data.counterParty) {
          return params.data.counterParty.counterPartyName;
        }
      }
    },
    {
      colId: 3,
      headerName: 'Transaction Details',
      field: 'transaction',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'transaction',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'transaction'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.transaction.transactionAmount;
      },
      valueFormatter: params => {
        if (!params.data) return;
        this.currencyPipe.transform(params.data.transaction.transactionAmount);
      }
    },
    { colId: 4, headerName: 'FDR Number', field: 'fdrNumber' },
    { colId: 5, headerName: 'Conventional Days', field: 'conventionalDays' },
    { colId: 6, headerName: 'Compounding Type', field: 'compoundingType' },
    { colId: 7, headerName:'Pre Closure Date', field: 'preClosureDate'},
    { colId: 8, headerName:'Penalty', field: 'preClosurePenalty'},
    {
      colId: 9,
      headerName: 'Interest Amounts',
      editable: false,
      cellRenderer: function(params) {
        return '<span><a class="material-icons">list</a></span>';
      },
    }
  ];

  constructor (
    private transactionService: TransactionService,
    private dialog: MatDialog,
    private currencyPipe: CurrencyPipe) {
    this.pageSize = Constants.DEFAULT_PAGE_SIZE;
    this.gridOptions = {
      pagination: true,
      rowModelType: 'infinite',
      cacheBlockSize: this.pageSize,
      paginationPageSize: this.pageSize
    };
  }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    if (this.gridApi) {
      this.gridApi.refreshInfiniteCache();
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();

    var datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        const page = Math.floor(params.startRow / this.gridOptions.paginationPageSize);
        this.transactionService.getAllFixedDepositInvestment(page, this.gridOptions.paginationPageSize, false)
          .subscribe(data => {
            params.successCallback(data['content'], data['totalElements']);
          });
      }
    };

    this.gridApi.setDatasource(datasource);
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    this.selectedRowNode = event.api.getSelectedNodes()[0];
  }

  

  onCellClicked(event: CellClickedEvent) {
    if (event.colDef.colId == '9') {
      this.onInterestDetails(event.data.counterParty.counterPartyName + " - " + event.data.fdrNumber, event.data.interestDetails);
    }
  }

  onInterestDetails(fdrNumber, interestDetails) {
    const dialogRef = this.dialog.open(InterestDetailListComponent, {
      data: { fdrNumber: fdrNumber, interestDetails: interestDetails },
      height: '600px',
      width: '1200px'
    });
  }

  onPageSizeChanged(value) {
    this.gridOptions.cacheBlockSize = value;
    this.gridOptions.paginationPageSize = value;
    this.gridApi.onSortChanged();
  }
}
