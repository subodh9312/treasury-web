import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { FixedDepositInvestment } from '../../models/fixed-deposit.model';
import { InvestmentType } from 'src/app/enums/investment-type.enum';
import { TransactionService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-fixed-deposits',
  templateUrl: './fixed-deposits.component.html',
  styleUrls: ['./fixed-deposits.component.css']
})
export class FixedDepositsComponent implements OnInit {

  isAdd: boolean = false;
  isSell: boolean = false;
  selectedTabIndex = 0;
  transactionUpdated: any;
  workflowPendingObject: any;
  sellFixedDeposit: FixedDepositInvestment;

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

  fileChanged(event){
    const files = event.target.files;
    if (files && files[0]){
    const upload$ = this.transactionService.uploadTransactionExcelFile(InvestmentType.FIXED_DEPOSITS, files[0]);

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

  onTransactionUpdated(transaction) {
    this.transactionUpdated = transaction;
    this.selectedTabIndex = 1;
  }

  onSell(event) {
    this.isSell = true;
    this.sellFixedDeposit = event;
  }
  
}
