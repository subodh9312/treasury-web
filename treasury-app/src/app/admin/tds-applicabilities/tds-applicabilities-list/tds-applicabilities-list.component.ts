import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, GridApi, GridOptions, IDatasource, IGetRowsParams, RowNode, SelectionChangedEvent } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { TdsApplicability } from '../../../models/tds-applicability.model';
import { TdsService } from '../../../services/tds.service';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-tds-applicabilities-list',
  templateUrl: './tds-applicabilities-list.component.html',
  styleUrls: ['./tds-applicabilities-list.component.css']
})
export class TdsApplicabilitiesListComponent implements OnInit, OnChanges {

  isLoading = false;
  errorMessage: any = null;
  pageSize;
  domLayout = "autoHeight";

  @Input() tdsUpdated;
  @ViewChild('agGrid') agGrid: AgGridAngular;

  selectedRowNode: RowNode;
  selectedRowValueChanged = false;

  gridApi: GridApi;
  gridColumnApi;
  gridOptions: GridOptions;

  tooltipShowDelay = 0;
  editType = 'fullRow';
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
    { colId: 1, headerName: 'Investment Type', field: 'investmentType', pinned: 'left', checkboxSelection: true },
    { colId: 2, headerName: 'Effective Date', field: 'effectiveDate' },
    { colId: 3, headerName: 'TDS Percent', field: 'tdsPercent' },
    { colId: 4, headerName: 'Minimum Transaction Amount', field: 'minimumTransactionAmount' },
    { colId: 5, headerName: 'Counter Party', field: 'counterParty.counterPartyName' },
    { colId: 6, headerName: 'Company', field: 'company.name' }
  ];

  constructor (
    private tdsService: TdsService,
    private spinner: NgxSpinnerService
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
        this.tdsService.getAllTdsApplicabilities(page, this.gridOptions.paginationPageSize)
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

  onDelete() {
    const tdsData: TdsApplicability = this.selectedRowNode.data;
    const isDelete = confirm("Are you sure you want to delete Tds Applicability " + tdsData.investmentType);
    if (isDelete) {
      this.isLoading = true;
      this.spinner.show();
      this.tdsService.deleteTdsApplicability(tdsData.tdsApplicabilityId)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
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
