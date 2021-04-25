import {Application} from 'express';
import {BusinessLogic} from '../business-logic/business-logic';

export class ApiRoutes {
    static initApiRoutes(app: Application) {
        app.post('/api/charge',BusinessLogic.charge);
    }
}