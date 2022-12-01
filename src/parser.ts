/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { load } from 'cheerio';

const main = async () => {
  const res = await axios.get('https://vercel.com/docs/rest-api');
  // console.log(res.data);

  const $ = load(res.data);
  // $('main > div > div > div.content > div > div > div > section > h3 > span').map((idx, element) => {
  //   console.log(idx);
  //   const t1 = $(element).find('h3>span:nth-of-type(1)').text().trim();
  //   console.log(t1);
  // });
  $('section span').map((idx, element) => {
    console.log(idx);
    const t1 = $(element).find('h3>span:nth-of-type(1)').text().trim();
    console.log(t1);
  });
};

const tmp = async () => {
  const res = await axios.get('https://finance.naver.com/marketindex/exchangeDailyQuote.nhn');
  // console.log(res.data);

  const $ = load(res.data);
  const scrapingResult: any = {
    date: '',
    the_basic_rate: '',
    buy: '',
    sell: '',
  };

  const list = $('.tbl_exchange tbody tr').map((idx, element) => {
    scrapingResult['date'] = $(element).find('td:nth-of-type(1)').text().trim();
    scrapingResult['the_basic_rate'] = $(element).find('td:nth-of-type(2)').text().trim();
    scrapingResult['buy'] = $(element).find('td:nth-of-type(4)').text().trim();
    scrapingResult['sell'] = $(element).find('td:nth-of-type(5)').text().trim();
    console.log(scrapingResult);
  });
};

main();
// tmp();
