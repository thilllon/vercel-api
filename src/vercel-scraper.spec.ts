import dotenv from 'dotenv';
import VercelClient from './vercel';
import { VercelScraper } from './vercel-scraper';

beforeAll(async () => {
  dotenv.config({ path: '.env.test' });
});

describe('test', () => {
  let vercel: VercelClient;

  beforeAll(() => {
    vercel = new VercelClient({
      projectId: process.env.VERCEL_PROJECT_ID,
      teamId: process.env.VERCEL_TEAM_ID,
      token: process.env.VERCEL_API_TOKEN,
    });
  });

  test('scrape', async () => {
    VercelScraper.scrape();
  });
});
