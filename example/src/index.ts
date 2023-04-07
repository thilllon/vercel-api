import dotenv from 'dotenv';
import { clearDeploymentHistory } from './clean-deployment-history';

dotenv.config({ path: '.env' });

const main = async () => {
  await clearDeploymentHistory();
};

main();
