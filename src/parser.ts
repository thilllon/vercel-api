import axios from 'axios';
import { load } from 'cheerio';

const main = async () => {
  const targetUrl = 'https://vercel.com/docs/rest-api';
  const res = await axios.get(targetUrl);

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

main();
