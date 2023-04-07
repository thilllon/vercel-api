import { writeFileSync } from 'fs';
import path from 'path';
import puppeteer, { Browser } from 'puppeteer';

// https://vercel.com/docs/rest-api/endpoints

export class VercelScraper {
  static async scrape(browser: Browser) {
    const homeUrl = 'http://books.toscrape.com';
    const page = await browser.newPage();
    await page.goto(homeUrl);

    // section
    // 제목 가져오기

    //  await page.waitForSelector('.page_inner');
    // class that starts with 'hello'
    const categoryElemList = await page.$$eval(
      'div.content > div[class^="doc_section"]',
      (elem) => elem,
    );

    categoryElemList.forEach((section, idx) => {
      if (idx !== 0) {
        return;
      }

      // 섹션 제목 뽑기
      // #__next > div > div.jsx-1767ed5db6ef8821 > main > div > div > div.jsx-954dd93b77f7e8c5.content > div:nth-child(6) > div.linked-heading_container__yhHVZ > span > a

      // api 뽑기
      //

      // title
      // 'section[class^="doc_doc"]'
      // #__next > div > div.jsx-1767ed5db6ef8821 > main > div > div > div.jsx-954dd93b77f7e8c5.content > div:nth-child(1) > div:nth-child(2) > section:nth-child(1) > div.linked-heading_container__yhHVZ > span > a > h3

      // http method
      // #__next > div > div.jsx-1767ed5db6ef8821 > main > div > div > div.jsx-954dd93b77f7e8c5.content > div:nth-child(1) > div:nth-child(2) > section:nth-child(1) > h4 > span.doc_method__fk_RQ.doc_post__Y0DGt

      // endpoint url
      // #__next > div > div.jsx-1767ed5db6ef8821 > main > div > div > div.jsx-954dd93b77f7e8c5.content > div:nth-child(1) > div:nth-child(2) > section:nth-child(1) > h4 > span.doc_endpointUrl__NWdRV

      // description
      // #__next > div > div.jsx-1767ed5db6ef8821 > main > div > div > div.jsx-954dd93b77f7e8c5.content > div:nth-child(1) > div:nth-child(2) > section:nth-child(1) > p > span

      // show more button
      // #__next > div > div.jsx-1767ed5db6ef8821 > main > div > div > div.jsx-954dd93b77f7e8c5.content > div:nth-child(2) > div:nth-child(2) > section:nth-child(1) > div:nth-child(4) > div.jsx-d710006bc512fe10.expand-toggle > button

      // query parameters
      // TODO:

      // body parameters
      // TODO:

      // header parameters
      // TODO:

      // response
      // TODO:

      // reponse code
      // TODO:
    });

    return {};
  }
}

export async function scrapeVercel() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true,
  });

  const data = await VercelScraper.scrape(browser);

  await browser.close();

  writeFileSync(path.join(process.cwd(), 'data.json'), JSON.stringify(data), 'utf8');
}
