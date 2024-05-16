"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrappingServices = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class ScrappingServices {
    async getList() {
        // Launch the browser and open a new blank page
        const browser = await puppeteer_1.default.launch();
        try {
            const page = await browser.newPage();
            const url = 'https://www.global.jdsports.com/men/mens-clothing/league/serie-a,ligue-1,primeira-liga,la-liga,bundesliga,eredivisie/?jd_sort_order=latest&max=204';
            await page.goto(url);
            const jerseys = await page.$$eval('span.itemContainer', (sections) => {
                return sections.map((section) => {
                    const title = section.querySelector('span.itemTitle')?.lastElementChild?.innerHTML;
                    const price = parseInt(section.querySelector('span.pri')?.innerHTML.slice(1) || '0');
                    const img = section.querySelector('img')?.getAttribute('src');
                    const link = section.querySelector('a')?.getAttribute('href');
                    let priceInSale = 0;
                    if (!price) {
                        //In the website when an article is in sale, the price is displayed in the 'now' tag so we need to get the price in the 'now' tag
                        const offert = parseInt(section.querySelector('span.now')?.querySelector('span')?.innerText?.slice(1) || '0');
                        priceInSale = offert;
                    }
                    return { title, price: price ?? 0, priceInSale, img, link };
                });
            });
            return jerseys;
        }
        catch (error) {
            console.log(error);
        }
        finally {
            await browser.close();
        }
    }
}
exports.ScrappingServices = ScrappingServices;
