import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, CellValueChangedEvent, GridApi, GridOptions, IDatasource, IGetRowsParams, RowEditingStartedEvent, RowEditingStoppedEvent, RowNode, SelectionChangedEvent } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { Loan } from '../../../models/loan.model';
import { LoansService } from '../../../services/loans.service';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { Constants } from '../../../util/constants.component';
import { TransactionService } from 'src/app/services/transactions.service';
import { AddInterestRateComponent } from 'src/app/investments/add-interest-rate/add-interest-rate.component';
import { AddLoanTransactionComponent } from '../add-loan-transaction/add-loan-transaction.component';
import { InterestDetailListComponent } from 'src/app/investments/interest-detail-list/interest-detail-list.component';
import { CurrencyPipe } from '@angular/common';
import { LoanTransactionDetailsComponent } from '../loan-transaction-details/loan-transaction-details.component';
import { CloseLoanComponent } from '../close-loan/close-loan.component';


@Component({
  selector: 'app-closed-loans-list',
  templateUrl: './closed-loans-list.component.html',
  styleUrls: ['./closed-loans-list.component.css']
})
export class ClosedLoansListComponent implements OnInit {

  isLoading = false;
  errorMessage: any = null;
  pageSize;
  domLayout = "autoHeight";

  @Input() loanUpdated;
  @ViewChild('agGrid') agGrid: AgGridAngular;

  selectedRowNode: RowNode;
  selectedRowValueChanged = false;

  gridApi: GridApi;
  gridColumnApi;
  gridOptions: GridOptions;

  tooltipShowDelay = 0;
  frameworkComponents = {
    customTooltip: CustomTooltip
  };

  defaultColDef = {
    sortable: true,
    editable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    suppressSizeToFit: false
  };

  columnDefs = [
    { colId: 1, headerName: 'Counterparty', field: 'counterParty.counterPartyName', checkboxSelection: true, width: 300 },
    { colId: 2, headerName: 'Company', field: 'company.name', width: 300 },
    { colId: 3, headerName: 'Reference Number', field: 'referenceNumber', width: 300 },
    { colId: 4, headerName: 'Sanction Amount', field: 'transaction', width: 300,
      valueFormatter: params => {
        if (!params.data) return;
        return this.currencyPipe.transform(params.data.transaction.transactionAmount);
      }
    },
    { colId: 5, headerName: 'Outstanding Amount', field: 'currentOutstandingAmount', width: 300,
      valueFormatter: params => {
        if (!params.data) return;
        return this.currencyPipe.transform(params.data.currentOutstandingAmount);
      }
    },
    {
      colId: 6, headerName: 'Transaction Details', width: 300,
      editable: false,
      cellRenderer: function(params) {
        return '<span><a class="material-icons">list</a></span>';
      }
    },
    { colId: 7, headerName: 'Interest Amounts', width: 300,
      editable: false,
      cellRenderer: function(params) {
        return '<span><a class="material-icons">list</a></span>';
      }
    }
  ];

  constructor (
    private loanService: LoansService,
    private transactionService: TransactionService,
    private spinner: NgxSpinnerService,
    private currencyPipe: CurrencyPipe,
    public dialog: MatDialog) {
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

  ngOnChanges(changes: SimpleChanges): void {
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
        this.transactionService.getAllLoans(page, this.gridOptions.paginationPageSize, false)
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

  onCellValueChanged(event: CellValueChangedEvent) {
    this.selectedRowValueChanged = true;
  }

  onCellClicked(event: CellClickedEvent) {
    if (event.colDef.colId == '6') {
      this.onLoanTransactionDetails(event.data.counterParty.counterPartyName + " - " + event.data.referenceNumber, event.data.loanTransactions);
    } else if (event.colDef.colId == '7') {
      this.onInterestDetails(event.data.counterParty.counterPartyName + " - " + event.data.referenceNumber, event.data.interestDetails);
    }
  }

  onLoanTransactionDetails(referenceNumber, loanTransactions) {
    const dialogRef = this.dialog.open(LoanTransactionDetailsComponent, {
      data: { fdrNumber: "Transaction Details for " + referenceNumber, loanTransactions: loanTransactions },
      height: '600px',
      width: '1200px'
    })
  }

  onInterestDetails(referenceNumber, interestDetails) {
    const dialogRef = this.dialog.open(InterestDetailListComponent, {
      data: { fdrNumber: referenceNumber, interestDetails: interestDetails },
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