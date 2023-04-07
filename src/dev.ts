import { scrapeBook } from './book-scraper';
import { scrapeVercel } from './vercel-scraper';

async function main() {
  // scrapeBook();
  scrapeVercel();
}

main();
