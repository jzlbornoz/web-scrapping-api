"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scrapping_services_1 = require("../services/scrapping-services");
const router = (0, express_1.Router)();
const services = new scrapping_services_1.ScrappingServices();
// -- Get
router.get('/', async (req, res) => {
    const products = await services.getList();
    res.status(200).json(products);
});
module.exports = router;
