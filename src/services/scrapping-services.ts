import puppeteer from "puppeteer";

interface Product {
    title: string;
    price: string;
}
interface Article {
    title: string;
    review: string;
    link: string;
}
export interface Jersey {
    title: string;
    price: number | null;
    priceInSale: number;
    img: string;
    link: string;
}


class ScrappingServices {

    async getList(): Promise<any> {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            const url = 'https://www.global.jdsports.com/men/mens-clothing/league/serie-a,ligue-1,primeira-liga,la-liga,bundesliga,eredivisie/?jd_sort_order=latest&max=204'

            await page.goto(url);

            const jerseys = await page.$$eval('span.itemContainer', (sections) => {
                return sections.map((section) => {
                    const title = section.querySelector('span.itemTitle')?.lastElementChild?.innerHTML;
                    const price = parseInt(section.querySelector('span.pri')?.innerHTML.slice(1) || '0');
                    const img = section.querySelector('img')?.getAttribute('src');
                    const link = section.querySelector('a')?.getAttribute('href');

                    let priceInSale = 0

                    if (!price) {
                        //In the website when an article is in sale, the price is displayed in the 'now' tag so we need to get the price in the 'now' tag
                        const offert = parseInt(section.querySelector('span.now')?.querySelector('span')?.innerText?.slice(1) || '0')
                        priceInSale = offert
                    }


                    return { title, price: price ?? 0, priceInSale, img, link };
                });
            });
            return jerseys as Jersey[];
        } catch (error) {
            console.log(error)
        } finally {
            await browser.close();
        }

    }


}
export { ScrappingServices };