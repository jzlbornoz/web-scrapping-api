import { Router, Response, Request } from "express";
import { ScrappingServices } from "../services/scrapping-services";

const router = Router();
const services = new ScrappingServices();


// -- Get
router.get('/',
    async (req: Request, res: Response) => {
        const products = await services.getList();
        res.status(200).json(products);
    })

module.exports = router;