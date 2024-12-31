import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, CellValueChangedEvent, GridApi, GridOptions, IDatasource, IGetRowsParams, RowEditingStartedEvent, RowEditingStoppedEvent, RowNode, SelectionChangedEvent } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Tax } from '../../../models/tax.model';
import { TaxService } from '../../../services/tax.service';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { TaxApplicabilityListComponent } from '../tax-applicability-list/tax-applicability-list.component';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-taxes-list',
  templateUrl: './taxes-list.component.html',
  styleUrls: ['./taxes-list.component.css']
})
export class TaxesListComponent implements OnInit, OnChanges {

  isLoading = false;
  errorMessage: any = null;
  pageSize;
  domLayout = "autoHeight";

  @Input() taxUpdated;
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
    { colId: 1, headerName: 'Tax Name', field: 'taxName', checkboxSelection: true, width: 400 },
    { colId: 2, headerName: 'Description', field: 'description', checkboxSelection: false, width: 600 },
    {
      colId: 3,
      headerName: 'Tax Applicability', editable: false,
      cellRenderer: function(params) {
        return '<span><a class="material-icons">list</a></span>';
      }
    }
  ];


  constructor (
    private taxService: TaxService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
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
        this.taxService.getAllTaxes(page, this.gridOptions.paginationPageSize)
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

  onCellClicked(event: CellClickedEvent) {
    if (event.colDef.colId == '3') {
      const taxId = event.data.taxId;
      this.taxService.getAllTaxApplicabilityForTax(taxId).subscribe(res => {
        this.onTaxDetails(event.data.taxName, res.content);
      });
    }
  }

  //Save the edited
  onRowStopEditing(event: RowEditingStoppedEvent) {
    if (this.selectedRowValueChanged) {
      this.isLoading = true;
      this.spinner.show();
      this.taxService.modifyTax(event.data)
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
      colKey: 'taxName'
    });
  }

  onSave() {
    this.agGrid.api.stopEditing();
  }

  onDelete() {
    const taxData: Tax = this.selectedRowNode.data;
    const isDelete = confirm("Are you sure you want to delete Tax " + taxData.taxName);
    if (isDelete) {
      this.isLoading = true;
      this.spinner.show();
      this.taxService.deleteTax(taxData.taxId)
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

  onTaxDetails(taxName, taxApplicabilityData) {
    const dialogRef = this.dialog.open(TaxApplicabilityListComponent, {
      data: { taxName: taxName, taxApplicabilities: taxApplicabilityData },
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
