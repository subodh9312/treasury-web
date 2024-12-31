import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellDoubleClickedEvent, CellEditingStartedEvent, CellEditingStoppedEvent, ComponentStateChangedEvent, RowEditingStoppedEvent, RowNode, GridOptions, GridApi, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Account } from '../../../models/account.model';
import { WorkflowActionRequest } from '../../../models/workflow-action-request.model';
import { WorkflowPendingTask } from '../../../models/workflow-pending-task.model';
import { AccountService } from '../../../services/account.service';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-pending-accounts',
  templateUrl: './pending-accounts.component.html',
  styleUrls: ['./pending-accounts.component.css']
})
export class PendingAccountsComponent implements OnInit, OnChanges {

  isLoading = false;
  errorMessage: any = null;
  pageSize;
  domLayout = "autoHeight";

  selectedRowNode: RowNode;

  commentsEnabled = false;
  tooltipShowDelay = 0;
  frameworkComponents = { customTooltip: CustomTooltip };

  editType = 'fullRow';

  editMode = false;
  isActionCalled = false;
  workflowAction: string = '';

  gridOptions: GridOptions;
  gridApi: GridApi;
  gridColumnApi;

  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('comments') comments: ElementRef;

  @Input() accountAdded;
  @Output() accountUpdated = new EventEmitter();

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    editable: true,
    suppressSizeToFit: false
  };

  columnDefs = [
    { headerName: 'Account Number', field: 'pendingObject.accountNumber', pinned: 'left', checkboxSelection: true, width: 180 },
    { headerName: 'Bank Name', field: 'pendingObject.bankName', pinned: 'left', width: 140 },
    { headerName: 'IFSC Code', field: 'pendingObject.ifscCode' },
    { headerName: 'Nickname', field: 'pendingObject.nickname' },
    { headerName: 'Bank Account GL Code', field: 'pendingObject.bankAccountGLCode' },
    { headerName: 'Opening Balance', field: 'pendingObject.openingBalance' },
    { headerName: 'Account Purpose', field: 'pendingObject.accountPurpose' },
    { headerName: 'Primary Team', field: 'pendingObject.primaryTeam' },
    {
      headerName: 'Relationship Manager',
      field: 'pendingObject.relationshipManager',
      tooltipComponent: 'customTooltip',
      tooltipField: 'pendingObject.relationshipManager',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'person'
      },

      valueGetter: function(params) {
        if (!params.data) return;
        const relationshipManager = params.data.pendingObject.relationshipManager;
        return relationshipManager.firstName + " " +
          (relationshipManager.lastName ? relationshipManager.lastName : '');
      }
    },
    {
      headerName: 'Company',
      field: 'pendingObject.company',
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
    { headerName: 'Account Currency', field: 'pendingObject.accountCurrency' },
    { headerName: 'Account Status', field: 'pendingObject.accountStatus', editable: false, pinned: 'right' },
    { headerName: 'Comments', field: 'comment', editable: true, pinned: 'right', width: 150 }
  ];

  constructor (
    private spinner: NgxSpinnerService,
    private accountService: AccountService
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
        this.accountService.getAllPendingAccounts(page, size)
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
        this.agGrid.api.startEditingCell({
          rowIndex: this.selectedRowNode.rowIndex,
          colKey: 'pendingObject.accountNumber'
        });
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
      if (this.selectedRowNode.data.pendingObject.accountStatus !== 'PENDING_RESUBMIT') {
        if (this.editType === '') {
          this.agGrid.api.startEditingCell({
            rowIndex: this.selectedRowNode.rowIndex,
            colKey: 'comment'
          });
        } else {
          this.editType = '';
        }
      } else {
        if (this.editType === 'fullRow') {
          this.agGrid.api.startEditingCell({
            rowIndex: this.selectedRowNode.rowIndex,
            colKey: 'pendingObject.accountNumber'
          });
        } else {
          this.editType = 'fullRow';
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

  executeAction(changedData: WorkflowPendingTask<Account>, workflowAction: string) {
    this.isLoading = true;
    this.spinner.show();
    if (this.selectedRowNode) {
      const workflowActionRequest: WorkflowActionRequest<Account> = {
        workflowPendingTask: changedData,
        workflowAction: workflowAction
      };
      this.accountService.actionAccount(workflowActionRequest)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
          this.selectedRowNode = undefined;
          this.workflowAction = '';
          this.isActionCalled = false;
        }))
        .subscribe(res => {
          this.accountUpdated.emit(res);
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
