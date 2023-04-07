import { writeFileSync } from 'fs';
import path from 'path';
import puppeteer, { Browser, EvaluateFuncWith } from 'puppeteer';

// https://vercel.com/docs/rest-api/endpoints

type PageDataObject = {
  pageNumber: number;

  bookTitle: string;
  bookPrice: string;
  noAvailable: string;
  imageUrl: string;
  bookDescription: string;
  upc: string;
};

type Category = string;

const scrapedData: Record<Category, PageDataObject> = {};

class BookScraper {
  static async scrape(browser: Browser, category: string) {
    const homeUrl = 'http://books.toscrape.com';
    const page = await browser.newPage();
    await page.goto(homeUrl);

    const selectedCategoryUrl = await page.$$eval(
      '.side_categories > ul > li > ul > li > a',
      (links, _category) => {
        // Search for the element that has the matching text
        links = links.map((a) =>
          a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, '') === _category
            ? a
            : null,
        );
        const link = links.filter((tx) => tx !== null)[0];
        return link.href;
      },
      category,
    );

    await page.goto(selectedCategoryUrl);

    type ScrapedData = Record<string, any>[];

    const scrapedData: ScrapedData = [];

    let pageNumber = 0;

    async function scrapeCurrentPage(): Promise<ScrapedData> {
      pageNumber++;
      // console.log(pageNumber++);

      await page.waitForSelector('.page_inner');
      const urls = await page.$$eval('section ol > li', (links) => {
        return (
          links
            // Make sure the book to be scraped is in stock
            .filter(
              (link) =>
                link.querySelector('.instock.availability > i').textContent !== 'In stock' &&
                link.querySelector('h3 > a'),
            )
            // Extract the links from the data
            .map<string>((el) => el.querySelector('h3 > a')?.href)
        );
      });

      // Loop through each of those links, open a new page instance and get the relevant data from them
      const getPageData = async (link: string) => {
        const pageDataObj = {} as PageDataObject;
        const newPage = await browser.newPage();
        await newPage.goto(link);

        pageDataObj.pageNumber = pageNumber;
        pageDataObj['bookTitle'] = await newPage.$eval(
          '.product_main > h1',
          (text) => text.textContent,
        );
        pageDataObj['bookPrice'] =
          (await newPage.$eval('.price_color', (text) => text.textContent)) ?? '';
        pageDataObj['noAvailable'] = await newPage.$eval('.instock.availability', (text) => {
          const NotVailableString = '0';
          // Strip new line and tab spaces
          const stripped = text?.textContent?.replace(/(\r\n\t|\n|\r|\t)/gm, '') ?? '';
          // Get the number of stock available
          return (
            new RegExp('^.*((.*)).*$', 'i').exec(stripped)?.[1].split(' ')[0] ?? NotVailableString
          );
        });
        pageDataObj['imageUrl'] = await newPage.$eval('#product_gallery img', (img) => img.src);
        pageDataObj['bookDescription'] = await newPage.$eval(
          '#product_description',
          (div) => div.nextSibling.nextSibling.textContent,
        );
        pageDataObj['upc'] = await newPage.$eval(
          '.table.table-striped > tbody > tr > td',
          (table) => table?.textContent ?? '',
        );

        await newPage.close();
        return pageDataObj;
      };

      scrapedData.push(
        ...(await Promise.all(
          urls.map(async (link, idx) => {
            // console.log(pageNumber, idx);
            return getPageData(link);
          }),
        )),
      );

      // When all the data on this page is done, click the next button and start the scraping of the next page
      // You are going to check if this button exist first, so you know if there really is a next page.
      try {
        console.log('go to the next page');
        await page.$eval('.next > a', (a) => a.textContent);
        await page.click('.next > a');
        // Call this function recursively
        return scrapeCurrentPage();
      } catch (err) {
        console.error(err);
        console.error('Scraping terminated');
      }

      await page.close();
      return scrapedData;
    }

    return scrapeCurrentPage();
  }
}

export async function scrapeBook() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true,
  });

  // const categoryList = ['Travel', 'HistoricalFiction', 'Mystery'];
  // scrapedData['Travel'] = await BookScraper.scrape(browser, 'Travel');
  // scrapedData['Historical Fiction'] = await BookScraper.scrape(browser, 'Historical Fiction');
  // scrapedData['Mystery'] = await BookScraper.scrape(browser, 'Mystery');
  scrapedData['Nonfiction'] = await BookScraper.scrape(browser, 'Nonfiction');

  // console.log(scrapedData);

  await browser.close();

  writeFileSync(path.join(process.cwd(), 'data.json'), JSON.stringify(scrapedData), 'utf8');
}
