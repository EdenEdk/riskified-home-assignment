import {PropertyValidation} from './property-validation';
import {cardExprRegex, validCardCompanies} from './credit-card';

export interface ChargeRequest {
    fullName: string;
    creditCardNumber: string;
    creditCardCompany: string;
    expirationDate: string;
    cvv: string;
    amount: number;
}

export const chargeRequestPropsArr: PropertyValidation<ChargeRequest>[] = [
    {propName: 'fullName', propType: 'string'},
    {propName: 'creditCardNumber', propType: 'string'},
    {
        propName: 'creditCardCompany',
        propType: 'string',
        checkProp: (creditCardCompany: string) => validCardCompanies.includes(creditCardCompany)
    },
    {
        propName: 'expirationDate',
        propType: 'string',
        checkProp: (expirationDate: string) => expirationDate.match(cardExprRegex) !== null
    },
    {propName: 'cvv', propType: 'string'},
    {propName: 'amount', propType: 'number'}
];