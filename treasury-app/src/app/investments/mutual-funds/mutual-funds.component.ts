import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { MutualFundInvestment } from '../../models/mutual-fund.model';
import { TransactionService } from 'src/app/services/transactions.service';
import { InvestmentType } from 'src/app/enums/investment-type.enum';

@Component({
  selector: 'app-mutual-funds',
  templateUrl: './mutual-funds.component.html',
  styleUrls: ['./mutual-funds.component.css']
})
export class MutualFundsComponent implements OnInit {

  isAdd = false;
  isSell = false;
  isSIP = false;
  isSWP = false;
  selectedTabIndex = 0;
  transactionUpdated: any;
  workflowPendingObject: any;
  sellMutualFund: MutualFundInvestment;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor (private transactionService: TransactionService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.selectedTabIndex = this.tabGroup.selectedIndex;
  }

  onAdd(isSIP) {
    this.isAdd = true;
    this.workflowPendingObject = null;
    this.isSIP = isSIP;
  }

  onReloadNav() {
    this.transactionService.reloadHistoricalNav().subscribe(
      response => alert(response.toString())
    );
  }

  fileChanged(event){
    const files = event.target.files;
    if (files && files[0]){
    const upload$ = this.transactionService.uploadTransactionExcelFile(InvestmentType.MUTUAL_FUNDS, files[0]);

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
    this.sellMutualFund = event;
  }

  onSWP(isSWP) {
    this.isSWP = isSWP;
  }

}
