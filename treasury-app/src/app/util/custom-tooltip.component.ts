import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'tooltip-component',
  template: `
    <div *ngIf="data.type === 'person'" class="custom-tooltip" [style.background-color]="data.color">
      <p><span>FirstName: </span>{{ data.firstName }}</p>
      <p><span>LastName: </span>{{ data.lastName }}</p>
      <p><span>EmailId: </span>{{ data.emailId }}</p>
      <p><span>MobileNumber: </span>{{ data.mobileNumber }}</p>
      <p><span>WorkPhone: </span>{{ data.workPhone }}</p>
    </div>
    <div *ngIf="data.type === 'address'" class="custom-tooltip" [style.background-color]="data.color">
      <p><span>AddressLine1: </span>{{ data.addressLine1 }}</p>
      <p><span>AddressLine2: </span>{{ data.addressLine2 }}</p>
      <p><span>Nearest Landmark: </span>{{ data.nearestLandMark }}</p>
      <p><span>City: </span>{{ data.city }}</p>
      <p><span>Postal Code: </span>{{ data.postalCode }}</p>
      <p><span>State: </span>{{ data.state }}</p>
      <p><span>Country: </span>{{ data.country }}</p>
    </div>
    <div *ngIf="data.type === 'authority'" class="custom-tooltip" [style.background-color]="data.color">
      <p *ngFor="let authority of data">
        {{ authority.context + "_" + authority.permission }}
      </p>
    </div>
    <div *ngIf="data.type === 'company'" class="custom-tooltip" [style.background-color]="data.color">
      <p><span>Name: </span>{{ data.name }}</p>
      <p><span>PAN: </span>{{ data.pan }}</p>
      <p><span>GSTN: </span>{{ data.gstNumber }}</p>
      <p><span>Legal Entity Id: </span>{{ data.legalEntityIdentifier }}</p>
      <p><span>Accounting Currency: </span>{{ data.accountingCurrency }}</p>
      <p>
    </div>
    <div *ngIf="data.type === 'account'" class="custom-tooltip" [style.background-color]="data.color">
      <p><span>Account Number: </span>{{ data.accountNumber }}</p>
      <p><span>Nickname: </span>{{ data.nickname }}</p>
      <p><span>Bank: </span>{{ data.bankName }}</p>
      <p><span>IFSC Code: </span>{{ data.ifscCode }}</p>
      <p><span>Bank Account GL Code: </span>{{ data.bankAccountGLCode }}</p>
      <p><span>Account Purpose: </span>{{ data.accountPurpose }}</p>
      <p><span>Primary Team: </span>{{ data.primaryTeam }}</p>
      <p><span>Opening Balance: </span>{{ data.openingBalance }}</p>
      <p><span>Relationship Manager: </span>{{ data.relationshipManager.firstName + ' ' + data.relationshipManager.lastName }}</p>
      <p><span>Company: </span>{{ data.company.name }}</p>
    </div>
    <div *ngIf="data.type === 'netAssetValue'" class="custom-tooltip" [style.background-color]="data.color">
      <p><span>Scheme Code: </span>{{ data.schemeCode }}</p>
      <p><span>Isin Payout: </span>{{ data.isinPayout }}</p>
      <p><span>Isin Reinvestment: </span>{{ data.isinReinvestment }}</p>
      <p><span>Fund Family: </span>{{ data.fundFamily }}</p>
      <p><span>Scheme Name: </span>{{ data.schemeName }}</p>
      <p><span>Last NAV: </span>{{ data.lastNav | currency:'INR':symbol:'1.4' }}</p>
    </div>
    <div *ngIf="data.type === 'transaction'" class="custom-tooltip" [style.background-color]="data.color">
      <p><span>Transaction Amount: </span>{{ data.transactionAmount | currency }}</p>
      <p><span>Transaction Side: </span>{{ data.transactionSide }}</p>
      <p><span>Quantity: </span>{{ data.quantity | number:'1.4' }}</p>
      <p><span>Transaction Date: </span>{{ data.transactionDate }}</p>
      <p><span>Value Date: </span>{{ data.valueDate }}</p>
      <p><span>Updated Time: </span>{{ data.updatedTime }}</p>
      <p><span>Transaction Status: </span>{{ data.transactionStatus }}</p>
      <p><span>Holding Intention: </span>{{ data.holdingIntention }}</p>
      <p><span>Country Of Investment: </span>{{ data.countryOfInvestment }}</p>
      <p><span>Transaction Frequency: </span>{{ data.transactionFrequency }}</p>
      <p><span>Next Value Date: </span>{{ data.nextValueDate }}</p>
      <p><span>End Date: </span>{{ data.endDate }}</p>
    </div>
    <div *ngIf="data.type === 'portfolio'" class="custom-tooltip" [style.background-color]="data.color">
      <p><span>Investment Type: </span>{{ data.investmentType }}</p>
      <p><span>NAV: </span>{{ data.netAssetValue.schemeCode }}</p>
      <p><span>Quantity: </span>{{ data.quantity | number:'1.4' }}</p>
      <p><span>Last Traded Price: </span>{{ data.lastTradedPrice | currency:'INR':symbol:'1.4' }}</p>
      <p><span>Invested Amount: </span>{{ data.investedAmount | currency }}</p>
      <p><span>Profit/Loss: </span>{{ data.profitLoss | currency }}</p>
      <p><span>Exit Charges: </span>{{ data.exitCharges | currency }}</p>
      <p><span>Updated Time: </span>{{ data.updatedTime }}</p>
      <p><span>Company: </span>{{ data.company.name }}</p>
    </div>
    <div *ngIf="data.type === 'counterParty'" class="custom-tooltip" [style.background-color]="data.color">
      <p><span>Counter Party Name: </span>{{ data.counterPartyName }}</p>
      <p><span>Classification: </span>{{ data.counterPartyClassification }}</p>
      <p><span>Credit Rating: </span>{{ data.creditRating }}</p>
    </div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        width: fit-content;
        height: fit-content;
        border: 1px solid cornflowerblue;
        overflow: hidden;
        pointer-events: none;
        transition: opacity 1s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;
      }

      .custom-tooltip p {
        margin: 5px;
        white-space: nowrap;
      }
    `,
  ],
})
export class CustomTooltip implements ITooltipAngularComp {
  params: any;
  data: any;

  agInit(params): void {
    this.params = params;
    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;

    const hops = params.colDef.field.split(".");
    for (let hop of hops) {
      this.data = this.data[hop];
    }

    this.data.color = this.params.color || 'white';
    this.data.type = this.params.type;
  }
}
