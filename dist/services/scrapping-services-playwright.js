"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrappingServices = void 0;
const playwright_1 = require("playwright");
class ScrappingServices {
    /**
     * Asynchronously runs the web scrapping process.
     *
     * @return {Promise<Product[]>} An array of Product objects.
     */
    async getAmazonScrapping() {
        // Launches a headless chromium browser
        const browser = await playwright_1.chromium.launch({ headless: true });
        // Creates a new page in the browser
        const page = await browser.newPage();
        // Navigates to the specified URL
        await page.goto('https://www.amazon.com/s?k=gaming+keyboard&language=es&_encoding=UTF8&content-id=amzn1.sym.8148f1e1-83ed-498f-85be-ff288b197da7&pd_rd_r=c0ec38a9-a879-4afb-bead-2505ef376119&pd_rd_w=M9ZyP&pd_rd_wg=s1BXP&pf_rd_p=8148f1e1-83ed-498f-85be-ff288b197da7&pf_rd_r=C4FAAJ5EXWE0SN375509&ref=pd_gw_unk');
        // Selects all elements with the class '.puisg-col-inner'
        // and maps each element to a Product object
        const productItems = await page.$$eval('.puisg-col-inner', (items) => {
            return items.map((item) => {
                // Retrieves the title of the product
                const title = item.querySelector('h2')?.innerText;
                // Retrieves the price of the product
                const price = item.querySelector('span.a-price-whole')?.innerText.replace('\n.', '$');
                // Returns a Product object with the title and price,
                // or null if either title or price is undefined
                return title && price ? { title, price } : null;
            });
        });
        // Closes the browser
        browser.close();
        // Filters out any null values from the array
        // and returns the result as an array of Product objects
        return productItems.filter((item) => item !== null);
    }
    /**
     * Asynchronously scrapes news articles from the developer tech website.
     *
     * @return {Promise<Article[]>} An array of Article objects.
     */
    async getNewsArticlesScrapping() {
        const browser = await playwright_1.chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://www.developer-tech.com/news/');
        const articles = await page.$$eval('section.entry-content', (sections) => {
            return sections.map((section) => {
                const title = section.querySelector('h3')?.innerText;
                const reviewSection = section.querySelector('div.post-text');
                const review = `${reviewSection?.querySelectorAll('p')[1]?.innerText || ''} ${reviewSection?.querySelectorAll('p')[2]?.innerText || ''}`;
                const link = section.querySelector('a')?.getAttribute('href');
                return { title, review, link };
            });
        });
        browser.close();
        return articles.filter((article) => article.title && article.review && article.link);
    }
    /**
     * Asynchronously scrapes jerseys from the JD Sports website.
     *
     * @return {Promise<Jersey[]>} An array of Jersey objects.
     */
    async getJerseyList() {
        const browser = await playwright_1.chromium.launch({ headless: true });
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
        browser.close();
        return jerseys;
    }
}
exports.ScrappingServices = ScrappingServices;
