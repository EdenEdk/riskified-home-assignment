import express from 'express';
import {Application} from 'express';
import {ApiRoutes} from './api/routes/routes';

const PORT: number = 8000;
const app: Application = express();
app.use(express.json());

ApiRoutes.initApiRoutes(app);
app.listen(PORT, () => {
    console.log('Listen on Port: ' + PORT)
});