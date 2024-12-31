import { TdsDetail } from './tds-detail.model';

export interface InterestDetail {
    startDate: string;
    endDate: string;
    interestAmount: number;
    tdsDetails: TdsDetail[];
}