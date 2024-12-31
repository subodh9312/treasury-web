import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, RowEditingStartedEvent, RowEditingStoppedEvent, RowNode, SelectionChangedEvent, GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { finalize } from 'rxjs/operators';
import { Company } from '../../../models/company.model';
import { Person } from '../../../models/person.model';
import { CompanyService } from '../../../services/company.service';
import { EnumService } from '../../../services/enum.service';
import { PersonService } from '../../../services/person.service';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { AddPersonComponent } from '../../person/add-person/add-person.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit, OnChanges {

  isLoading = false;
  errorMessage: any = null;
  pageSize;
  domLayout = "autoHeight";

  persons: Person[] = [];
  managers: string[] = [];

  countries = [];
  currencies = [];

  @Output() personAdded = new EventEmitter();
  @Output() companyUpdated = new EventEmitter();

  @Input() companyCreated: Company;
  @Input() userUpdated: any;
  @Input() personUpdated: any;

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
  context = {
    persons: this.persons
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
    { headerName: 'Name', field: 'name', pinned: 'left', checkboxSelection: true },
    { headerName: 'GSTN', field: 'gstNumber', pinned: 'left' },
    { headerName: 'PAN', field: 'pan' },
    {
      headerName: 'Accounting Currency',
      field: 'accountingCurrency',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        cellHeight: 50,
        values: this.currencies,
      },
    },
    {
      headerName: 'Primary Contact',
      field: 'primaryContact',
      tooltipComponent: 'customTooltip',
      tooltipField: 'primaryContact',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'person'
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        cellHeight: 50,
        values: this.managers,
      },
      valueGetter: function(params) {
        if (!params.data) return;
        const primaryContact = params.data.primaryContact;
        if (!primaryContact) return;
        return primaryContact.firstName + " " +
          (primaryContact.lastName ? primaryContact.lastName : '');
      },
      valueSetter: function(params) {
        if (!params.data) return;
        params.data.primaryContact = [...params.context.persons].find(person => {
          const personValue = person.firstName + " " + (person.lastName ? person.lastName : '');
          return personValue === params.newValue;
        });
        return true;
      }
    },
    {
      headerName: 'Full Address',
      width: 230,
      children: [
        {
          headerName: 'Address', columnGroupShow: 'closed', editable: false,
          field: 'address',
          tooltipComponent: 'customTooltip',
          tooltipField: 'address',
          tooltipComponentParams: {
            color: '#ececec',
            type: 'address'
          },
          valueGetter: function(params) {
            if (!params.data) return;
            const displayAddress = params.data.address;
            if (displayAddress && (displayAddress.city || displayAddress.state || displayAddress.country)) {
              return displayAddress.city + " " + displayAddress.state + " " + displayAddress.country;
            }
            return;
          },
        },
        { headerName: 'AddressLine1', field: 'address.addressLine1', columnGroupShow: 'open' },
        { headerName: 'AddressLine2', field: 'address.addressLine2', columnGroupShow: 'open' },
        { headerName: 'Nearest LandMark', field: 'address.nearestLandMark', columnGroupShow: 'open' },
        { headerName: 'City', field: 'address.city', columnGroupShow: 'open' },
        { headerName: 'Postal Code', field: 'address.postalCode', columnGroupShow: 'open' },
        { headerName: 'State', field: 'address.state', columnGroupShow: 'open' },
        {
          headerName: 'Country', field: 'address.country', columnGroupShow: 'open',
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            cellHeight: 50,
            values: this.countries,
          },
        }
      ],
    },
    { headerName: 'Legal Entity Identifier', field: 'legalEntityIdentifier', width: 240 }
  ];

  constructor (
    private companyService: CompanyService,
    private personService: PersonService,
    public dialog: MatDialog,
    private enumService: EnumService,
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
    this.enumService.getCountries().subscribe(res => {
      this.countries = res;
      this.agGrid.api.getColumnDef('address.country').cellEditorParams.values = this.countries;
    });
    this.enumService.getCurrencies().subscribe(res => {
      this.currencies = res;
      this.agGrid.api.getColumnDef('accountingCurrency').cellEditorParams.values = this.currencies;
    });
    this.personService.getAllPersons().subscribe(res => {
      this.persons = res.content;
      this.setGridPersonsParams();
    });
  }

  ngOnChanges() {
    if (this.gridApi) {
      this.gridApi.refreshInfiniteCache();
    }
    this.personService.getAllPersons().subscribe(res => {
      this.persons = res.content;
      this.setGridPersonsParams();
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();

    var datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        const page = Math.floor(params.startRow / this.gridOptions.paginationPageSize);
        this.companyService.getAllCompanies(page, this.gridOptions.paginationPageSize)
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
    if (!event.node.data.address) {
      event.node.data.address = {
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

  setGridPersonsParams() {
    this.managers = [...this.persons].map(person => person.firstName + " " + (person.lastName ? person.lastName : ''));
    this.agGrid.api.getColumnDef('primaryContact').cellEditorParams.values = this.managers;
    this.agGrid.context.persons = this.persons;
  }

  //Save the edited
  onRowStopEditing(event: RowEditingStoppedEvent) {
    if (this.selectedRowValueChanged) {
      this.isLoading = true;
      this.spinner.show();
      const isAddressNull = Object.values(event.data.address).every(x => (x === null));
      if (isAddressNull) {
        delete event.data.address;
      }
      this.companyService.modifyCompany(event.data)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.companyUpdated.emit(res);
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
      colKey: 'name'
    });
  }

  onSave() {
    this.agGrid.api.stopEditing();
  }

  onDelete() {
    const companyData = this.selectedRowNode.data;
    const isDelete = confirm("Are you sure you want to delete company " + companyData.name);
    if (isDelete) {
      this.isLoading = true;
      this.spinner.show();
      this.companyService.deleteCompany(companyData.companyId)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.companyUpdated.emit(res);
          this.gridApi.refreshInfiniteCache();
        }, err => {
          this.errorMessage = err.error.errorMessages;
        });
    }
  }

  onAddPrimaryContact() {
    const dialogRef = this.dialog.open(AddPersonComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personAdded.emit(result);
        this.personService.getAllPersons().subscribe(res => {
          this.persons = res.content;
          this.setGridPersonsParams();
        });
      }
    });
  }

  onPageSizeChanged(value) {
    this.gridOptions.cacheBlockSize = value;
    this.gridOptions.paginationPageSize = value;
    this.gridApi.onSortChanged();
  }
}
