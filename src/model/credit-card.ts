import {ChargeRequest} from './charge';
import axios from 'axios';
import * as https from 'https';

export const validCardCompanies: string[] = ['visa', 'mastercard'];
export const cardExprRegex: string = '^(0[1-9]|1[0-2])\\/?([0-9]{2})$';

export class CreditCardManager {
    static async handleCreditCardRequest(identifier: string, requestBody: ChargeRequest): Promise<number> {
        switch (requestBody.creditCardCompany) {
            case 'visa':
                return CreditCardManager.handleVisa(identifier, requestBody);
            case 'mastercard':
                return CreditCardManager.handleMasterCard(identifier, requestBody);
        }
    }

    static async handleVisa(identifier: string, requestBody: ChargeRequest): Promise<number> {
        const url: string = 'https://interview.riskxint.com/visa/api/chargeCard';
        const visaProps = {
            fullName: requestBody.fullName,
            number: requestBody.creditCardNumber,
            expiration: requestBody.expirationDate,
            cvv: requestBody.cvv,
            totalAmount: requestBody.amount
        };
        try {
            const axiosResponse: any = await axios.post(url, visaProps, {
                httpsAgent: new https.Agent({rejectUnauthorized: false}),
                headers: {
                    identifier,
                    'Content-Type': 'application/json'
                }
            });
            const chargeResult = axiosResponse.data.chargeResult;
            if (chargeResult === 'Success') {
                return 200;
            }
            else if (chargeResult === 'Failure') {
                return 400;
            }
        }
        catch (e) {
            if (e.response.data)
                return 400;
            return 500;
        }
    }

    static async handleMasterCard(identifier: string, requestBody: ChargeRequest): Promise<number> {
        const url: string = 'https://interview.riskxint.com/mastercard/capture_card';
        const splitName: string[] = requestBody.fullName.split(' ');
        const splitDate: string[] = requestBody.expirationDate.split('/');

        const masterCardProps = {
            first_name: splitName[0],
            last_name: splitName[1],
            card_number: requestBody.creditCardNumber,
            expiration: `${splitDate[0]}-${splitDate[1]}`,
            cvv: requestBody.cvv,
            charge_amount: requestBody.amount
        };
        try {
            const response = await axios.post(url, masterCardProps, {
                headers: {
                    identifier,
                    'Content-Type': 'application/json'
                }
            });
            return response.status;
        }
        catch (e) {
            if (e.response.data)
                return 400;
            return 500;
        }
    }
}
