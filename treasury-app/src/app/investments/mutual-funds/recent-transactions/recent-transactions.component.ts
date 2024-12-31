import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridOptions, IDatasource, IGetRowsParams, RowNode, SelectionChangedEvent } from 'ag-grid-community';
import { TransactionService } from '../../../services/transactions.service';
import { CheckboxComponent } from '../../../util/checkbox.component';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { MultiSelectComponent } from '../../../util/multiselect.component';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-mf-recent-transactions',
  templateUrl: './recent-transactions.component.html',
  styleUrls: ['./recent-transactions.component.css']
})
export class RecentTransactionsComponent implements OnInit, OnChanges {

  @ViewChild('agGrid') agGrid: AgGridAngular;

  isLoading = false;
  errorMessage: any = null;
  pageSize;
  domLayout = "autoHeight";

  @Output() isSWP = new EventEmitter<boolean>();
  @Output() sellMutualFund = new EventEmitter();

  @Input() transactionUpdated: any;
  selectedRowNode: RowNode;
  selectedRowValueChanged = false;

  gridApi: GridApi;
  gridColumnApi;
  gridOptions: GridOptions;

  frameworkComponents = {
    customTooltip: CustomTooltip,
    checkboxComponent: CheckboxComponent,
    multiselectComponent: MultiSelectComponent
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
      headerName: 'Scheme Name',
      field: 'netAssetValue',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'netAssetValue',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'netAssetValue'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.netAssetValue.schemeName;
      }
    },
    { 
      headerName: 'ISIN Code', 
      field: 'isinCode',
      editable: false,
      width: 130,
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.netAssetValue.isinCode;
      } 
    },
    // { headerName: "Investment Method", field: 'mutualFundInvestmentMethod', editable: false },
    {
      headerName: 'Investment Date',
      field: 'transaction',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'transaction.valueDate',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'transaction'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.transaction.valueDate;
      }
    },
    {
      headerName: 'Investment Amount',
      field: 'transaction',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'transaction.transactionAmount',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'transaction'
      },
      type: 'rightAligned',
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.transaction.transactionAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }
    },
    {
      headerName: 'Transaction Nav',
      field: 'transaction',
      editable: false,
      type: 'rightAligned',
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.transactionNav
      }
    },
    {
      headerName: 'MTM',
      field: 'mtm',
      editable: false,
      type: 'rightAligned',
      // tooltipComponent: 'customTooltip',
      // tooltipField: 'transaction',
      // tooltipComponentParams: {
      //   color: '#ececec',
      //   type: 'transaction'
      // },
      valueGetter: function(params) {
        if (!params.data) return;
        var mtm = ((params.data.netAssetValue.lastNav - params.data.transactionNav) * params.data.transaction.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 });
        return mtm;
      }
    },
    {
      headerName: 'Exit Charges',
      field: 'exitCharges',
      editable: false,
      type: 'rightAligned',
      // tooltipComponent: 'customTooltip',
      // tooltipField: 'transaction',
      // tooltipComponentParams: {
      //   color: '#ececec',
      //   type: 'transaction'
      // },
      valueGetter: function(params) {
        if (!params.data) return;
        var mtm = (params.data.exitCharges).toLocaleString('en-IN', { minimumFractionDigits: 2 });
        return mtm;
      }
    },
    {
      headerName: 'Days Completed',
      field: 'daysCompleted',
      editable: false,
      // tooltipComponent: 'customTooltip',
      // tooltipField: 'transaction',
      // tooltipComponentParams: {
      //   color: '#ececec',
      //   type: 'transaction'
      // },
      valueGetter: function(params) {
        if (!params.data) return;
        let currentDate = new Date();
        let dateSent = new Date(params.data.transaction.valueDate);
        return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));

      }
    },
    // {
    //   headerName: 'Transaction',
    //   field: 'transaction',
    //   editable: false,
    //   tooltipComponent: 'customTooltip',
    //   tooltipField: 'transaction',
    //   tooltipComponentParams: {
    //     color: '#ececec',
    //     type: 'transaction'
    //   },
    //   valueGetter: function(params) {
    //     return params.data.transaction.transactionSide;
    //   }
    // },
    // {
    //   headerName: 'Debit Account',
    //   field: 'transaction.debitAccount',
    //   editable: false,
    //   tooltipComponent: 'customTooltip',
    //   tooltipField: 'transaction.debitAccount',
    //   tooltipComponentParams: {
    //     color: '#ececec',
    //     type: 'account'
    //   },
    //   valueGetter: function(params) {
    //     return params.data.transaction.debitAccount.accountNumber;
    //   }
    // },

    // { headerName: 'Transaction NAV', field: 'transactionNav' },
    // { headerName: 'Exit Load Percentage', field: 'exitLoadPercentage' },
    // { headerName: 'Exit Load Min Duration', field: 'exitLoadApplicableMinimumDuration' },
    // { headerName: 'Lein Marked Amount', field: 'leinMarkedAmount' },
    // { headerName: 'Lein Marked Utilization Amount', field: 'leinMarkedUtilitzationAmount' },
    // {
    //   headerName: 'Period Of Investment', field: 'periodOfInvestment',
    //   valueGetter: function(params) {
    //     if (params.data.periodOfInvestment != 0) {
    //       return params.data.periodOfInvestment + " - " + params.data.transaction.transactionFrequency;
    //     }
    //   }
    // },
    // {
    //   headerName: 'Portfolio',
    //   field: 'transaction.portfolio',
    //   editable: false,
    //   tooltipComponent: 'customTooltip',
    //   tooltipField: 'transaction.portfolio',
    //   tooltipComponentParams: {
    //     color: '#ececec',
    //     type: 'portfolio'
    //   },
    //   valueGetter: function(params) {
    //     return params.data.transaction.portfolio.portfolioId;
    //   }
    // },
    //{ headerName: 'Transaction Status', field: 'transaction.transactionStatus', pinned: 'right' }
  ];

  constructor (
    private transactionService: TransactionService
  ) {
    this.pageSize = Constants.DEFAULT_PAGE_SIZE;
    this.gridOptions = {
      pagination: true,
      rowModelType: 'infinite',
      cacheBlockSize: this.pageSize,
      paginationPageSize: this.pageSize
    };
  }

  ngOnInit() {
  }

  ngOnChanges() {
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
        this.transactionService.getAllMutualFundsInvestment(page, this.gridOptions.paginationPageSize, true)
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

  onSell(isSWP) {
    this.isSWP.emit(isSWP);
    this.sellMutualFund.emit(this.selectedRowNode.data);
  }

  onPageSizeChanged(value) {
    this.gridOptions.cacheBlockSize = value;
    this.gridOptions.paginationPageSize = value;
    this.gridApi.onSortChanged();
  }

}
