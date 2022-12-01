import dotenv from 'dotenv';

beforeAll(async () => {
  dotenv.config({ path: '.env.test' });
});

describe('test', () => {
  it('test', () => {
    expect(1).toBe(1);
  });
});
