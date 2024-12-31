import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { RowNode, SelectionChangedEvent, RowEditingStartedEvent, CellValueChangedEvent, RowEditingStoppedEvent, GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { EnumService } from '../../../services/enum.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CounterPartyService } from '../../../services/counterparty.service';
import { finalize } from 'rxjs/operators';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-counterparty-list',
  templateUrl: './counterparty-list.component.html',
  styleUrls: ['./counterparty-list.component.css']
})
export class CounterpartyListComponent implements OnInit, OnChanges {

  isLoading = false;
  errorMessage: any = null;
  counterPartyClassifications: [] = [];
  creditRatings: [] = [];
  investmentTypes: [] = [];
  pageSize;
  domLayout = "autoHeight";

  @Input() counterPartyUpdated;
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
    { headerName: 'Counter Party Name', field: 'counterPartyName', checkboxSelection: true, width: 400 },
    {
      headerName: 'Classification',
      field: 'counterPartyClassification',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        cellHeight: 50,
        values: this.counterPartyClassifications,
      },
      width: 400
    },
    {
      headerName: 'Credit Rating', field: 'creditRating', cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        cellHeight: 50,
        values: this.creditRatings,
      }, width: 400
    },
    {
      headerName: 'Enabled Insvestement Types', field: 'enabledInvestmentTypes', cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        cellHeight: 50,
        values: this.investmentTypes,
      }, width: 400
    }
  ];

  constructor (
    private enumService: EnumService,
    private counterPartyService: CounterPartyService,
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
    this.enumService.getCounterPartyClassifications().subscribe(res => {
      this.counterPartyClassifications = res;
      this.agGrid.api.getColumnDef('counterPartyClassification').cellEditorParams.values = this.counterPartyClassifications;
    });
    this.enumService.getCreditRatings().subscribe(res => {
      this.creditRatings = res;
      this.agGrid.api.getColumnDef('creditRating').cellEditorParams.values = this.creditRatings;
    });
    this.enumService.getInvestmentTypes().subscribe(response => {
      this.investmentTypes = response;
      this.agGrid.api.getColumnDef('enabledInvestmentTypes').cellEditorParams.values = this.investmentTypes;
    });
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
        this.counterPartyService.getAllCounterParties(page, this.gridOptions.paginationPageSize)
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

  onRowStartEditing(event: RowEditingStartedEvent) {
    event.node.setSelected(true);
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    this.selectedRowValueChanged = true;
  }

  //Save the edited
  onRowStopEditing(event: RowEditingStoppedEvent) {
    if (this.selectedRowValueChanged) {
      this.isLoading = true;
      this.spinner.show();
      this.counterPartyService.modifyCounterParty(event.data)
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
    event.node.setSelected(false);
    this.selectedRowValueChanged = false;
  }

  onEdit() {
    this.agGrid.api.startEditingCell({
      rowIndex: this.selectedRowNode.rowIndex,
      colKey: 'counterPartyName'
    });
  }

  onSave() {
    this.agGrid.api.stopEditing();
  }

  onDelete() {
    const counterPartyData = this.selectedRowNode.data;
    const isDelete = confirm("Are you sure you want to delete counter party " + counterPartyData.counterPartyName);
    if (isDelete) {
      this.isLoading = true;
      this.spinner.show();
      this.counterPartyService.deleteCounterParty(counterPartyData.counterPartyId)
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
