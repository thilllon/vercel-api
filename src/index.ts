import { VercelClient } from 'src/vercel';

const token = process.env.VERCEL_API_TOKEN;

export const vercelClient = new VercelClient({ token });

export * from './vercel';
