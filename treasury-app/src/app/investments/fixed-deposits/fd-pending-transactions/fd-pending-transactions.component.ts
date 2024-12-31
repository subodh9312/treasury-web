import { E } from '@angular/cdk/keycodes';
import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellDoubleClickedEvent, CellEditingStartedEvent, CellEditingStoppedEvent, ComponentStateChangedEvent, RowEditingStoppedEvent, RowNode, GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { InvestmentType } from '../../../enums/investment-type.enum';
import { Investment } from '../../../models/investment.model';
import { WorkflowPendingTask } from '../../../models/workflow-pending-task.model';
import { TransactionService } from '../../../services/transactions.service';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { WorkflowActionRequest } from '../../../models/workflow-action-request.model';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-fd-pending-transactions',
  templateUrl: './fd-pending-transactions.component.html',
  styleUrls: ['./fd-pending-transactions.component.css']
})
export class FdPendingTransactionsComponent implements OnInit, OnChanges {

  isLoading: boolean = false;
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

  rowData: WorkflowPendingTask<Investment>[] = [];
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
    resiable: true,
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
    {
      headerName: 'Counter Party',
      field: 'pendingObject.counterParty',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'pendingObject.counterParty',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'counterParty'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.pendingObject.counterParty.counterPartyName;
      }
    },
    {
      headerName: 'Transaction Details',
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
        return params.data.pendingObject.transaction.transactionAmount;
      },
      valueFormatter: params => {
        if (!params.data) return;
        this.currencyPipe.transform(params.data.pendingObject.transaction.transactionAmount);
      }
    },
    { headerName: 'Start Date', field: 'pendingObject.transaction.valueDate' },
    { headerName: 'Maturity Date', field: 'pendingObject.transaction.endDate' },
    { headerName: 'Interest Rate', field: 'pendingObject.interestRate' },
    { headerName: 'Comments', field: 'comment', editable: true },
    { headerName: 'Transaction Status', field: 'pendingObject.transaction.transactionStatus', pinned: 'right' }
  ];

  constructor (
    private spinner: NgxSpinnerService,
    private transactionService: TransactionService,
    private currencyPipe: CurrencyPipe
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
        this.transactionService.getAllPendingTransactionsByInvestmentType(InvestmentType.FIXED_DEPOSITS, page, size)
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
          this.editTransaction.emit(this.selectedRowNode.data);
        }
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
      this.transactionService.actionFixedDepositTransaction(workflowActionRequest)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
          this.selectedRowNode = undefined;
          this.workflowAction = '';
          this.isActionCalled = false;
        }))
        .subscribe(response => {
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
