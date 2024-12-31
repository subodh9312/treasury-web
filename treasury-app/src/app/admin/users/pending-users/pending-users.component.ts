import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellEditingStartedEvent, CellEditingStoppedEvent, GridApi, GridOptions, IDatasource, IGetRowsParams, RowNode } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { User } from '../../../models/user.model';
import { WorkflowActionRequest } from '../../../models/workflow-action-request.model';
import { WorkflowPendingTask } from '../../../models/workflow-pending-task.model';
import { UserService } from '../../../services/user.service';
import { CheckboxComponent } from '../../../util/checkbox.component';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-pending-users',
  templateUrl: './pending-users.component.html',
  styleUrls: ['./pending-users.component.css']
})
export class PendingUsersComponent implements OnInit {

  isLoading = false;
  errorMessage: any = null;
  pageSize;
  domLayout = "autoHeight";

  selectedRowNode: RowNode;

  commentsEnabled = false;
  tooltipShowDelay = 0;
  frameworkComponents = {
    customTooltip: CustomTooltip,
    checkboxComponent: CheckboxComponent
  };

  gridOptions: GridOptions;
  gridApi: GridApi;
  gridColumnApi;

  editMode = false;
  isActionCalled = false;
  workflowAction = '';

  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('comments') comments: ElementRef;

  @Input() userAdded;
  @Output() userUpdated = new EventEmitter();

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: false,
    floatingFilter: true,
    suppressSizeToFit: false
  };

  columnDefs = [
    { headerName: 'Username', field: 'pendingObject.userName', pinned: 'left', checkboxSelection: true },
    {
      headerName: 'Active', field: 'pendingObject.active',
      cellRenderer: 'checkboxComponent'
    },
    { headerName: 'First Name', field: 'pendingObject.userDetails.firstName' },
    { headerName: 'Last Name', field: 'pendingObject.userDetails.lastName' },
    { headerName: 'EmailId', field: 'pendingObject.userDetails.emailId' },
    { headerName: 'Mobile Number', field: 'pendingObject.userDetails.mobileNumber' },
    { headerName: 'Work Phone', field: 'pendingObject.userDetails.workPhone' },
    {
      headerName: 'Full Address',
      width: 230,
      children: [
        {
          headerName: 'Address', columnGroupShow: 'closed',
          editable: false,
          field: 'pendingObject.userDetails.address',
          tooltipComponent: 'customTooltip',
          tooltipField: 'pendingObject.userDetails.address',
          tooltipComponentParams: {
            color: '#ececec',
            type: 'address'
          },
          valueGetter: function(params) {
            if (!params.data) return;
            const displayAddress = params.data.pendingObject.userDetails.address;
            if (displayAddress && (displayAddress.city || displayAddress.state || displayAddress.country)) {
              return displayAddress.city + " " + displayAddress.state + " " + displayAddress.country;
            }
            return;
          },
        },
        { headerName: 'AddressLine1', field: 'pendingObject.userDetails.address.addressLine1', columnGroupShow: 'open' },
        { headerName: 'AddressLine2', field: 'pendingObject.userDetails.address.addressLine2', columnGroupShow: 'open' },
        { headerName: 'Nearest LandMark', field: 'pendingObject.userDetails.address.nearestLandMark', columnGroupShow: 'open' },
        { headerName: 'City', field: 'pendingObject.userDetails.address.city', columnGroupShow: 'open' },
        { headerName: 'Postal Code', field: 'pendingObject.userDetails.address.postalCode', columnGroupShow: 'open' },
        { headerName: 'State', field: 'pendingObject.userDetails.address.state', columnGroupShow: 'open' },
        { headerName: 'Country', field: 'pendingObject.userDetails.address.country', columnGroupShow: 'open' }
      ],
    },
    {
      headerName: 'Authorities',
      field: 'pendingObject.authorities',
      width: 280,
      tooltipComponent: 'customTooltip',
      tooltipField: 'pendingObject.authorities',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'authority'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.pendingObject.authorities.map(authority => authority.context + "_" + authority.permission).join();
      }
    },
    { headerName: 'User Status', field: 'pendingObject.userStatus', pinned: 'right' },
    { headerName: 'Comments', field: 'comment', editable: true, pinned: 'right', width: 150 }
  ];

  constructor (private userService: UserService, private spinner: NgxSpinnerService) {
    this.pageSize = Constants.DEFAULT_PAGE_SIZE;
    this.gridOptions = {
      pagination: true,
      rowModelType: 'infinite',
      cacheBlockSize: this.pageSize,
      paginationPageSize: this.pageSize,
      maxBlocksInCache: 1
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
        this.userService.getAllPendingUsers(page, size)
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

  onEdit() {
    this.editMode = true;
    this.agGrid.api.startEditingCell({
      rowIndex: this.selectedRowNode.rowIndex,
      colKey: 'comment'
    });
  }

  onCellEditingStarted(event: CellEditingStartedEvent) {
    event.node.setSelected(true);
    this.selectedRowNode = event.node;
    this.editMode = true;
    this.agGrid.api.startEditingCell({
      rowIndex: this.selectedRowNode.rowIndex,
      colKey: 'comment'
    });
  }

  onCellEditingStopped(event: CellEditingStoppedEvent) {
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

  executeAction(data: WorkflowPendingTask<User>, workflowAction: string) {
    this.isLoading = true;
    this.spinner.show();
    if (this.selectedRowNode) {
      const workflowActionRequest: WorkflowActionRequest<User> = {
        workflowPendingTask: data,
        workflowAction: workflowAction
      };
      this.userService.actionUser(workflowActionRequest)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
          this.selectedRowNode = undefined;
          this.workflowAction = '';
          this.isActionCalled = false;
        }))
        .subscribe(res => {
          this.userUpdated.emit(res);
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
