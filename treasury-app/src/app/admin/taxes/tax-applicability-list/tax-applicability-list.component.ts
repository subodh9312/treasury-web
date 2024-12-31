import { Component, OnInit, Inject, Input, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgGridAngular } from 'ag-grid-angular';
import { RowNode, SelectionChangedEvent } from 'ag-grid-community';
import { TaxApplicability } from '../../../models/tax.applicability.model';
import { TaxService } from 'src/app/services/tax.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tax-applicability-list',
  templateUrl: './tax-applicability-list.component.html',
  styleUrls: ['./tax-applicability-list.component.css']
})
export class TaxApplicabilityListComponent implements OnInit, OnChanges {

  constructor (
    public dialogRef: MatDialogRef<TaxApplicabilityListComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private taxService: TaxService,
    private spinner: NgxSpinnerService
  ) { }

  taxName: string = "";

  isLoading = false;
  errorMessage: any = null;

  @Input() taxApplicabilityUpdated;
  @ViewChild('agGrid') agGrid: AgGridAngular;

  selectedRowNode: RowNode;
  selectedRowValueChanged = false;

  //gridOptions
  rowData: TaxApplicability[] = [];

  defaultColDef = {
    sortable: true,
    editable: false,
    filter: true,
    resizable: true,
    floatingFilter: true
  };

  columnDefs = [
    { headerName: 'Tax Name', field: 'tax.taxName', width: 200, checkboxSelection: true },
    { headerName: 'Investment Type', field: 'investmentType', width: 300 },
    { headerName: 'Transaction Sides', field: 'transactionSidesApplicable' },
    { headerName: 'Effective Date', field: 'effectiveDate' },
    { headerName: 'Tax Percent', field: 'taxPercent' }
  ];

  ngOnInit(): void {
    this.taxName = this.data.taxName;
    this.rowData = this.data.taxApplicabilities;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.rowData = this.data.taxApplicabilities;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    this.selectedRowNode = event.api.getSelectedNodes()[0];
  }

  onDelete() {
    const taxData: TaxApplicability = this.selectedRowNode.data;
    const isDelete = confirm("Are you sure you want to delete Tax Applicability?");
    if (isDelete) {
      this.isLoading = true;
      this.spinner.show();
      this.taxService.deleteTaxApplicability(taxData.taxApplicabilityId)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.taxService.getAllTaxApplicabilityForTax(taxData.tax.taxId).subscribe(res => {
            this.rowData = res.content;
            this.isLoading = false;
            this.spinner.hide();
            this.selectedRowNode = null;
          });
        }, err => {
          this.errorMessage = err.error.errorMessages;
        });
    }
  }
}
