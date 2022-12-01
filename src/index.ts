import { VercelClient } from './vercel';

const teamId = process.env.VERCEL_API_TEAM_ID;
const projectId = process.env.VERCEL_API_PROJECT_ID;
const token = process.env.VERCEL_API_TOKEN;

export const vercelClient = VercelClient.getInstance(token, {
  projectId,
  teamId,
});

export { VercelClient, vercelClient as default };
