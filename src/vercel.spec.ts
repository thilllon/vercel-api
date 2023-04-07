import dotenv from 'dotenv';
import VercelClient from './vercel';

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

  it('test', () => {
    expect(1).toBe(1);
  });
});
