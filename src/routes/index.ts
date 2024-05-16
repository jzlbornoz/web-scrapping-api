import express, { Express, Router } from "express";

const routerScrapping = require('./scrapping-routes');

function routerApi(app: Express): void {
    const router: Router = express.Router();

    app.use('/api/v1', router);

    router.use('/scrapping', routerScrapping)
}

export { routerApi } 