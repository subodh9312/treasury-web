import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, RowEditingStartedEvent, RowEditingStoppedEvent, RowNode, SelectionChangedEvent, GridOptions, IDatasource, IGetRowsParams, GridApi, ColDef, ColGroupDef } from 'ag-grid-community';
import { finalize } from 'rxjs/operators';
import { EnumService } from '../../../services/enum.service';
import { UserService } from '../../../services/user.service';
import { CheckboxComponent } from '../../../util/checkbox.component';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { MultiSelectComponent } from '../../../util/multiselect.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from '../../../util/constants.component';
import { Authority } from '../../../models/authority.model';
import { AuthorityService } from '../../../services/authority.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnChanges {

  countries = [];
  pageSize;
  domLayout = "autoHeight";

  isLoading = false;
  errorMessage: any = null;

  allAuthorities: Authority[] = [];
  allAuthoritiesName: string[] = [];

  @Output() userUpdated = new EventEmitter();
  @Input() updatedUser: any;
  @Input() authorityUpdated: any;

  @ViewChild('agGrid') agGrid: AgGridAngular;

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
  context = {
    allAuthorities: this.allAuthorities
  };
  tooltipShowDelay = 0;
  editType = 'fullRow';

  defaultColDef = {
    sortable: true,
    editable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    suppressSizeToFit: false
  };

  columnDefs = [
    { headerName: 'Username', field: 'userName', pinned: 'left', checkboxSelection: true, editable: false },
    {
      headerName: 'Active', field: 'active',
      cellRenderer: 'checkboxComponent',
      cellEditor: 'checkboxComponent'
    },
    { headerName: 'First Name', field: 'userDetails.firstName' },
    { headerName: 'Last Name', field: 'userDetails.lastName' },
    { headerName: 'EmailId', field: 'userDetails.emailId' },
    { headerName: 'Mobile Number', field: 'userDetails.mobileNumber' },
    { headerName: 'Work Phone', field: 'userDetails.workPhone' },
    {
      headerName: 'Full Address',
      width: 230,
      children: [
        {
          headerName: 'Address', columnGroupShow: 'closed',
          editable: false,
          field: 'userDetails.address',
          tooltipComponent: 'customTooltip',
          tooltipField: 'userDetails.address',
          tooltipComponentParams: {
            color: '#ececec',
            type: 'address'
          },
          valueGetter: function(params) {
            if (params.data) {
              const displayAddress = params.data.userDetails.address;
              if (displayAddress && (displayAddress.city || displayAddress.state || displayAddress.country)) {
                return displayAddress.city + " " + displayAddress.state + " " + displayAddress.country;
              }
            }
            return;
          },
        },
        { headerName: 'AddressLine1', field: 'userDetails.address.addressLine1', columnGroupShow: 'open' },
        { headerName: 'AddressLine2', field: 'userDetails.address.addressLine2', columnGroupShow: 'open' },
        { headerName: 'Nearest LandMark', field: 'userDetails.address.nearestLandMark', columnGroupShow: 'open' },
        { headerName: 'City', field: 'userDetails.address.city', columnGroupShow: 'open' },
        { headerName: 'Postal Code', field: 'userDetails.address.postalCode', columnGroupShow: 'open' },
        { headerName: 'State', field: 'userDetails.address.state', columnGroupShow: 'open' },
        {
          headerName: 'Country', field: 'userDetails.address.country', columnGroupShow: 'open',
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            cellHeight: 50,
            values: this.countries,
          },
        }
      ],
    },
    {
      headerName: 'Authorities',
      field: 'authorities',
      width: 280,
      tooltipComponent: 'customTooltip',
      tooltipField: 'authorities',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'authority'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.authorities.map(authority => authority.context + "_" + authority.permission).join();
      },
      cellEditor: 'multiselectComponent',
      cellEditorParams: {
        allOptions: this.allAuthoritiesName
      },
      valueSetter: function(params) {
        if (!params.data) return;
        const selectedAuthorities = params.newValue;
        params.data.authorities = selectedAuthorities.map(authorityName => params.context.allAuthorities.find(authority => authority.context + "_" + authority.permission === authorityName));
        return true;
      }
    },
    { headerName: 'User Status', field: 'userStatus', editable: false }
  ];

  constructor (
    private authorityService: AuthorityService,
    private userService: UserService,
    private enumService: EnumService,
    private spinner: NgxSpinnerService
  ) {
    this.pageSize = Constants.DEFAULT_PAGE_SIZE;
    this.gridOptions = {
      pagination: true,
      rowModelType: 'infinite',
      cacheBlockSize: this.pageSize,
      paginationPageSize: this.pageSize,
      maxBlocksInCache: 1
    };


  }

  ngOnInit() {
    this.enumService.getCountries().subscribe(res => {
      this.countries = res;
      this.agGrid.api.getColumnDef('userDetails.address.country').cellEditorParams.values = this.countries;
    });
    this.authorityService.getAllAuthorities(0, Constants.MAX_PAGE_SIZE).subscribe(res => {
      this.allAuthorities = res.content;
      this.allAuthoritiesName = [...this.allAuthorities].map(authority => authority.context + "_" + authority.permission);
      this.setGridRolesParams();
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();

    var datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        const page = Math.floor(params.startRow / this.gridApi.paginationGetPageSize());
        this.userService.getAllUsers(page, this.gridApi.paginationGetPageSize())
          .subscribe(data => {
            params.successCallback(data['content'], data['totalElements']);
          });
      }
    };
    this.gridApi.setDatasource(datasource);
  }

  ngOnChanges() {
    this.authorityService.getAllAuthorities(0, Constants.MAX_PAGE_SIZE).subscribe(res => {
      this.allAuthorities = res.content;
      this.allAuthoritiesName = [...this.allAuthorities].map(authority => authority.context + "_" + authority.permission);
      this.setGridRolesParams();
    });

    if (this.gridApi) {
      this.gridApi.refreshInfiniteCache();
    }
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    this.selectedRowNode = event.api.getSelectedNodes()[0];
  }

  onRowStartEditing(event: RowEditingStartedEvent) {
    event.node.setSelected(true);
    if (!event.node.data.userDetails.address) {
      event.node.data.userDetails.address = {
        addressId: null,
        addressLine1: null,
        addressLine2: null,
        nearestLandMark: null,
        city: null,
        state: null,
        postalCode: null,
        country: null,
      };
    }
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    this.selectedRowValueChanged = true;
  }

  //Save the edited
  onRowStopEditing(event: RowEditingStoppedEvent) {
    if (this.selectedRowValueChanged) {
      const isAddressNull = Object.values(event.data.userDetails.address).every(x => (x === null));
      if (isAddressNull) {
        delete event.data.userDetails.address;
      }
      this.isLoading = true;
      this.spinner.show();
      this.userService.modifyUser(event.data)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(resp => {
          this.userUpdated.emit(resp);
          this.gridApi.refreshInfiniteCache();
        }, err => {
          this.errorMessage = err.error.errorMessages;
        });
    }
    event.node.setSelected(false);
    this.selectedRowValueChanged = false;
  }

  setGridRolesParams() {
    this.agGrid.context.allAuthorities = this.allAuthorities;
    this.agGrid.api.getColumnDef('authorities').cellEditorParams.allOptions = this.allAuthoritiesName;
  }

  onEdit() {
    this.agGrid.api.startEditingCell({
      rowIndex: this.selectedRowNode.rowIndex,
      colKey: 'userName'
    });
  }

  onSave() {
    this.agGrid.api.stopEditing();
  }

  onDelete() {
    const userData = this.selectedRowNode.data;
    const isDelete = confirm("Are you sure you want to delete user " + userData.userName);
    if (isDelete) {
      this.isLoading = true;
      this.spinner.show();
      this.userService.deleteUser(userData.userName)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.userUpdated.emit(res);
          this.gridApi.refreshInfiniteCache();
        }, err => {
          this.errorMessage = err.error.errorMessages;
        });
    }
  }

  onPageSizeChanged(value) {
    this.gridOptions.cacheBlockSize = value;
    this.gridOptions.paginationPageSize = value;
    this.gridApi.onSortChanged();
  }
}
