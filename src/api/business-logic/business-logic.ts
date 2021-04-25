import {Request, Response} from 'express';
import {ChargeRequest, chargeRequestPropsArr} from '../../model/charge';
import {CreditCardManager} from '../../model/credit-card';

const ERROR_MSG: any = {error: 'Card Declined'};
const MAX_RETRIES: number = 3;
const ONE_SECOND: number = 1000;

export class BusinessLogic {
    static async charge(req: Request, res: Response): Promise<void> {
        const {headers, body} = req;
        const identifier: string = headers['merchant-identifier'] as string;
        const isValid: boolean = BusinessLogic.validateRequest(body);
        if (isValid) {
            BusinessLogic.handleValidRequest(res, identifier, body);
        }
        else {
            res.sendStatus(400);
        }
    }

    static validateRequest(chargeRequest: ChargeRequest): boolean {
        for (const prop of chargeRequestPropsArr) {
            if (chargeRequest.hasOwnProperty(prop.propName)) {
                const chargeProp = chargeRequest[prop.propName];
                if (prop.checkProp) {
                    return prop.checkProp(chargeProp);
                }
                else if (typeof chargeProp !== prop.propType) {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        return true;
    }

    static async handleValidRequest(res: Response, identifier: string, chargeRequest: ChargeRequest, retryNumber: number = 1): Promise<void> {
        const chargeResult: number = await CreditCardManager.handleCreditCardRequest(identifier, chargeRequest);
        switch (chargeResult) {
            case 400:
                res.send(ERROR_MSG);
                break;
            case 500:
                if (retryNumber === MAX_RETRIES)
                    res.sendStatus(500);
                else
                    setTimeout(() => {
                        BusinessLogic.handleValidRequest(res, identifier, chargeRequest, retryNumber + 1);
                    }, (retryNumber * retryNumber * ONE_SECOND));
                break;
            default:
                res.sendStatus(chargeResult);
                break;
        }
    }
}