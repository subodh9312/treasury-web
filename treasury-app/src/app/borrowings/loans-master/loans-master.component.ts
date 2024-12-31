import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Loan } from '../../../app/models/loan.model';
import { InvestmentType } from '../../enums/investment-type.enum';
import { TransactionService } from '../../services/transactions.service';

@Component({
  selector: 'app-loans-master',
  templateUrl: './loans-master.component.html',
  styleUrls: ['./loans-master.component.css']
})
export class LoansMasterComponent implements OnInit {
  isAdd: boolean = false;
  isSell: boolean = false;
  selectedTabIndex = 0;
  transactionUpdated: any;
  workflowPendingObject: any;
  closeLoan: Loan;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.selectedTabIndex = this.tabGroup.selectedIndex;
  }

  onAdd() {
    this.isAdd = true;
    this.workflowPendingObject = null;
  }

  onEdit(event) {
    this.workflowPendingObject = event;
    if (this.workflowPendingObject.pendingObject.transaction.transactionSide === 'BUY') {
      this.isAdd = true;
    } else {
      this.isSell = true;
    }
  }

  onBack(event) {
    if (event != null) {
      this.selectedTabIndex = 1;
      this.onTransactionUpdated(event);
    }
    this.isAdd = false;
    this.isSell = false;
  }

  onTabSelectionChange(event) {
    this.selectedTabIndex = event.index;
  }

  onTransactionUpdated(event: any) {
    this.transactionUpdated = event;
    this.selectedTabIndex = 1;
  }

  onSell(event) {
    this.isSell = true;
    this.closeLoan = event;
  }

  fileChanged(event){
    const files = event.target.files;
    if (files && files[0]){
    const upload$ = this.transactionService.uploadTransactionExcelFile(InvestmentType.LOAN, files[0]);

    let status = 'uploading';
    upload$.subscribe({
      next: () => {
        status = 'success';
      },
      error: (error: any) => {
        status = 'fail';
        return alert(error.message);
      },
    });
    }
  }

}
