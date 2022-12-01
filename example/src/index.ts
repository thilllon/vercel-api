import dotenv from 'dotenv';
import { clearVercelDeployments } from './clean-deployment-history';

dotenv.config();

const main = async () => {
  await clearVercelDeployments();
};

main();
