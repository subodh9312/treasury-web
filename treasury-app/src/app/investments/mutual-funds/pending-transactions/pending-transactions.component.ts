import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellDoubleClickedEvent, CellEditingStartedEvent, CellEditingStoppedEvent, ComponentStateChangedEvent, GridApi, GridOptions, IDatasource, IGetRowsParams, RowEditingStoppedEvent, RowNode } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Investment } from '../../../models/investment.model';
import { WorkflowActionRequest } from '../../../models/workflow-action-request.model';
import { WorkflowPendingTask } from '../../../models/workflow-pending-task.model';
import { TransactionService } from '../../../services/transactions.service';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { Constants } from '../../../util/constants.component';

const MUTUAL_FUNDS = "MUTUAL_FUNDS";

@Component({
  selector: 'app-mf-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.css']
})
export class PendingTransactionsComponent implements OnInit, OnChanges {

  isLoading = false;
  errorMessage: any = null;
  selectedRowNode: RowNode;
  commentsEnabled = false;
  tooltipShowDelay = 0;
  pageSize;
  domLayout = "autoHeight";
  frameworkComponents = { customTooltip: CustomTooltip };

  editType = 'fullRow';

  editMode = false;
  isActionCalled = false;
  workflowAction: string = '';

  gridApi: GridApi;
  gridColumnApi;
  gridOptions: GridOptions;

  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('comments') comments: ElementRef;

  @Output() editTransaction = new EventEmitter();

  @Input() transactionUpdated: any;

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    editable: true,
    suppressSizeToFit: false
  };

  columnDefs = [
    {
      headerName: 'Company',
      field: 'pendingObject.company',
      editable: false,
      checkboxSelection: true,
      tooltipComponent: 'customTooltip',
      tooltipField: 'pendingObject.company',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'company'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.pendingObject.company.name;
      }
    },
    { headerName: "Investment Method", field: 'pendingObject.mutualFundInvestmentMethod', editable: false },
    {
      headerName: 'NAV',
      field: 'pendingObject.netAssetValue',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'pendingObject.netAssetValue',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'netAssetValue'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.pendingObject.netAssetValue.isinCode;
      }
    },
    {
      headerName: 'Transaction',
      field: 'pendingObject.transaction',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'pendingObject.transaction',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'transaction'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.pendingObject.transaction.transactionSide;
      }
    },
    {
      headerName: 'Debit Account',
      field: 'pendingObject.transaction.debitAccount',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'pendingObject.transaction.debitAccount',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'account'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.pendingObject.transaction.debitAccount.accountNumber;
      }
    },
    { headerName: 'Scheme Type', field: 'pendingObject.schemeType' },
    { headerName: 'Transaction NAV', field: 'pendingObject.transactionNav' },
    { headerName: 'Exit Load Percentage', field: 'pendingObject.exitLoadPercentage' },
    { headerName: 'Exit Load Min Duration', field: 'pendingObject.exitLoadApplicableMinimumDuration' },
    { headerName: 'Lein Marked Amount', field: 'pendingObject.leinMarkedAmount' },
    { headerName: 'Lein Marked Utilization Amount', field: 'pendingObject.leinMarkedUtilitzationAmount' },
    {
      headerName: 'Period Of Investment', field: 'pendingObject.periodOfInvestment',
      valueGetter: function(params) {
        if (!params.data) return;
        if (params.data.pendingObject.periodOfInvestment != 0) {
          return params.data.pendingObject.periodOfInvestment + " - " + params.data.pendingObject.transaction.transactionFrequency;
        }
      }
    },
    {
      headerName: 'Portfolio',
      field: 'pendingObject.transaction.portfolio',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'pendingObject.transaction.portfolio',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'portfolio'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        if (params.data.pendingObject.transaction.portfolio) {
          return params.data.pendingObject.transaction.portfolio.portfolioId;
        }
        return null;
      }
    },
    { headerName: 'Transaction Status', field: 'pendingObject.transaction.transactionStatus', pinned: 'right' },
    { headerName: 'Comments', field: 'comment', editable: true, pinned: 'right', width: 150 }
  ];

  constructor (
    private spinner: NgxSpinnerService,
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
        const size = this.gridApi.paginationGetPageSize();
        const page = Math.floor(params.startRow / size);
        this.transactionService.getAllPendingTransactionsByInvestmentType(MUTUAL_FUNDS, page, size)
          .subscribe(data => {
            params.successCallback(data['content'], data['totalElements']);
          });
      }
    };

    this.gridApi.setDatasource(datasource);
  }

  onSelectionChanged(event) {
    this.selectedRowNode = event.api.getSelectedNodes()[0];
  }

  onCellDoubleClicked(event: CellDoubleClickedEvent) {
    event.node.setSelected(true);
    this.selectedRowNode = event.node;
    this.onEdit();
  }

  onComponentStateChanged(event: ComponentStateChangedEvent) {
    if (this.editMode) {
      if (this.agGrid.editType === '') {
        this.agGrid.api.startEditingCell({
          rowIndex: this.selectedRowNode.rowIndex,
          colKey: 'comment'
        });
      } else {
        this.editTransaction.emit(this.selectedRowNode.data);
      }
    }
  }

  onCellEditingStarted(event: CellEditingStartedEvent) {
    event.node.setSelected(true);
    this.selectedRowNode = event.node;
    this.editMode = true;
  }

  onEdit() {
    this.editMode = true;
    if (this.selectedRowNode) {
      if (this.selectedRowNode.data.pendingObject.transaction.transactionStatus !== 'PENDING_RESUBMIT') {
        if (this.editType === '') {
          this.agGrid.api.startEditingCell({
            rowIndex: this.selectedRowNode.rowIndex,
            colKey: 'comment'
          });
        } else {
          this.editType = '';
        }
      } else {
        this.editTransaction.emit(this.selectedRowNode.data);
      }
    }
  }

  onCellEditingStopped(event: CellEditingStoppedEvent) {
    this.editMode = false;
    if (this.editType === '') {
      if (!this.isActionCalled) {
        this.selectedRowNode = undefined;
        this.ngOnChanges();
        return;
      }
      this.executeAction(event.data, this.workflowAction);
    }
  }

  onRowEditingStopped(event: RowEditingStoppedEvent) {
    this.editMode = false;
    if (!this.isActionCalled) {
      this.selectedRowNode = undefined;
      this.ngOnChanges();
      return;
    }
    this.executeAction(event.data, this.workflowAction);
  }

  onAction(workflowAction: string) {
    this.isActionCalled = true;
    this.workflowAction = workflowAction;
    if (this.editMode === true) {
      this.agGrid.api.stopEditing();
    } else {
      this.executeAction(this.selectedRowNode.data, workflowAction);
    }
  }

  executeAction(changedData: WorkflowPendingTask<Investment>, workflowAction: string) {
    this.isLoading = true;
    this.spinner.show();
    if (this.selectedRowNode) {
      const workflowActionRequest: WorkflowActionRequest<Investment> = {
        workflowPendingTask: changedData,
        workflowAction: workflowAction
      };
      this.transactionService.actionMutualFundTransaction(workflowActionRequest)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
          this.selectedRowNode = undefined;
          this.workflowAction = '';
          this.isActionCalled = false;
        }))
        .subscribe(res => {
          this.gridApi.refreshInfiniteCache();
        }, err => {
          this.errorMessage = err.error.errorMessages;
          this.gridApi.refreshInfiniteCache();
        });
    }
  }

  onPageSizeChanged(value) {
    this.gridOptions.cacheBlockSize = value;
    this.gridOptions.paginationPageSize = value;
    this.gridApi.onSortChanged();
  }

}
