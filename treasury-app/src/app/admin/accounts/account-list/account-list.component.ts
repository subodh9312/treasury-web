import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, RowEditingStartedEvent, RowEditingStoppedEvent, RowNode, SelectionChangedEvent, GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Account } from '../../../models/account.model';
import { Person } from '../../../models/person.model';
import { AccountService } from '../../../services/account.service';
import { EnumService } from '../../../services/enum.service';
import { PersonService } from '../../../services/person.service';
import { CustomTooltip } from '../../../util/custom-tooltip.component';
import { AddPersonComponent } from '../../person/add-person/add-person.component';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit, OnChanges {

  persons: Person[] = [];
  managers: string[] = [];
  currencies: [] = [];
  pageSize;
  domLayout = "autoHeight";

  isLoading = false;
  errorMessage: any = null;

  @Output() personAdded = new EventEmitter();
  @Output() accountUpdated = new EventEmitter();

  @Input() accountAdded: any;
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
  frameworkComponents = { customTooltip: CustomTooltip };
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
    { headerName: 'Account Number', field: 'accountNumber', pinned: 'left', checkboxSelection: true, width: 180 },
    { headerName: 'Bank Name', field: 'bankName', pinned: 'left', width: 140 },
    { headerName: 'IFSC Code', field: 'ifscCode' },
    { headerName: 'Nickname', field: 'nickname' },
    { headerName: 'Bank Account GL Code', field: 'bankAccountGLCode' },
    { headerName: 'Opening Balance', field: 'openingBalance' },
    { headerName: 'Account Purpose', field: 'accountPurpose' },
    { headerName: 'Primary Team', field: 'primaryTeam' },
    {
      headerName: 'Relationship Manager',
      field: 'relationshipManager',
      tooltipComponent: 'customTooltip',
      tooltipField: 'relationshipManager',
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
        const relationshipManager = params.data.relationshipManager;
        if (!relationshipManager) return;
        return relationshipManager.firstName + " " +
          (relationshipManager.lastName ? relationshipManager.lastName : '');
      },
      valueSetter: function(params) {
        if (!params.data) return;
        params.data.relationshipManager = [...params.context.persons].find(person => {
          const personValue = person.firstName + " " + (person.lastName ? person.lastName : '');
          return personValue === params.newValue;
        });
        return true;
      }
    },
    {
      headerName: 'Company',
      field: 'company',
      editable: false,
      tooltipComponent: 'customTooltip',
      tooltipField: 'company',
      tooltipComponentParams: {
        color: '#ececec',
        type: 'company'
      },
      valueGetter: function(params) {
        if (!params.data) return;
        return params.data.company.name;
      }
    },
    {
      headerName: 'Account Currency',
      field: 'accountCurrency',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        cellHeight: 50,
        values: this.currencies,
      },
    },
    { headerName: 'Account Status', field: 'accountStatus', editable: false }
  ];

  constructor (
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private accountService: AccountService,
    private personService: PersonService,
    private enumService: EnumService
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
    this.personService.getAllPersons().subscribe(res => {
      this.persons = res.content;
      this.setGridPersonsParams();
    });
    this.enumService.getCurrencies().subscribe(res => {
      this.currencies = res;
      this.agGrid.api.getColumnDef('accountCurrency').cellEditorParams.values = this.currencies;
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();

    var datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        const page = Math.floor(params.startRow / this.gridOptions.paginationPageSize);
        this.accountService.getAllAccounts(page, this.gridOptions.paginationPageSize)
          .subscribe(data => {
            params.successCallback(data['content'], data['totalElements']);
          });
      }
    };

    this.gridApi.setDatasource(datasource);
  }


  ngOnChanges(): void {
    if (this.gridApi) {
      this.gridApi.refreshInfiniteCache();
    }
    this.personService.getAllPersons().subscribe(res => {
      this.persons = res.content;
      this.setGridPersonsParams();
    });
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

  setGridPersonsParams() {
    this.managers = [...this.persons].map(person => person.firstName + " " + (person.lastName ? person.lastName : ''));
    this.agGrid.api.getColumnDef('relationshipManager').cellEditorParams.values = this.managers;
    this.agGrid.context.persons = this.persons;
  }

  //Save the edited
  onRowStopEditing(event: RowEditingStoppedEvent) {
    if (this.selectedRowValueChanged) {
      this.isLoading = true;
      this.spinner.show();
      this.accountService.modifyAccount(event.data)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.accountUpdated.emit(res);
          this.gridApi.refreshInfiniteCache();
        }, err => {
          this.errorMessage = err.error.errorMessages;
        });
    } else {
    }
    event.node.setSelected(false);
    this.selectedRowValueChanged = false;
  }

  onEdit() {
    this.agGrid.api.startEditingCell({
      rowIndex: this.selectedRowNode.rowIndex,
      colKey: 'accountNumber'
    });
  }

  onSave() {
    this.agGrid.api.stopEditing();
  }

  onDelete() {
    const accountData = this.selectedRowNode.data;
    const isDelete = confirm("Are you sure you want to delete account " + accountData.accountNumber);
    if (isDelete) {
      this.isLoading = true;
      this.spinner.show();
      this.accountService.deleteAccount(accountData.accountId)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.show();
        }))
        .subscribe(res => {
          this.accountUpdated.emit(res);
          this.gridApi.refreshInfiniteCache();
        }, err => {
          this.errorMessage = err.error.errorMessages;
        });
    }
  }

  onAddRelationshipManager() {
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
