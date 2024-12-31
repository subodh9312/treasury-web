import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, GridApi, GridOptions, IDatasource, IGetRowsParams, RowEditingStartedEvent, RowEditingStoppedEvent, RowNode, SelectionChangedEvent } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Constants } from '../../../util/constants.component';
import { AuthorityService } from '../../../services/authority.service';

@Component({
  selector: 'app-authority-list',
  templateUrl: './authority-list.component.html',
  styleUrls: ['./authority-list.component.css']
})
export class AuthorityListComponent implements OnInit, OnChanges {

  pageSize;
  domLayout = "autoHeight";

  isLoading = false;
  errorMessage: any = null;

  @Input() newAuthority: any;
  @Output() authorityUpdated: any = new EventEmitter;

  @ViewChild('agGrid') agGrid: AgGridAngular;

  selectedRowNode: RowNode;

  gridApi: GridApi;
  gridColumnApi;
  gridOptions: GridOptions;

  tooltipShowDelay = 0;

  defaultColDef = {
    sortable: true,
    editable: false,
    filter: true,
    resizable: true,
    floatingFilter: true,
    suppressSizeToFit: false
  };

  columnDefs = [
    { headerName: 'Authority Id', field: 'authorityId', checkboxSelection: true, width: 200 },
    { headerName: 'Context', field: 'context', width: 500 },
    { headerName: 'Permission', field: 'permission', width: 500 },
    { headerName: 'IsSystemAdminAuthority', field: 'systemAdminAuthority', width: 500 }
  ];

  constructor (private authorityService: AuthorityService, private spinner: NgxSpinnerService) {
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
        this.authorityService.getAllAuthorities(page, this.gridOptions.paginationPageSize)
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

  onDelete() {
    const authorityData = this.selectedRowNode.data;
    const isDelete = confirm("Are you sure you want to delete authority " + authorityData.context + "_" + authorityData.permission);
    if (isDelete) {
      this.isLoading = true;
      this.spinner.show();
      this.authorityService.removeAuthority(authorityData.authorityId)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.authorityUpdated.emit(res);
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
