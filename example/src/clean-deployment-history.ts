import { VercelClient } from 'vercel-api';

const token = process.env.VERCEL_API_TOKEN as string;
const vercelClient = new VercelClient(token);
const projectId = '';
const teamId = '';

export const clearDeploymentHistory = async () => {
  // delete if
  // 1. status is error, cancelled
  // 2. not production
  // 3. not branch is one of dev, master, main

  const deploymentsToBeDeleted: Deployment[] = [];

  // https://vercel.com/docs/rest-api#endpoints/deployments/list-deployments
  // state: BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED
  try {
    const res = await vercelClient.deployment.list({
      projectId,
      teamId,
      limit: 100,
      // to: new Date().getTime() - 30 * 86400 * 1000,
      // until: new Date().getTime() - 30 * 86400 * 1000,
    });

    deploymentsToBeDeleted.push(...res.data.deployments);
    res.data.deployments.map((dpl: any) => {
      return new Date(dpl.createdAt).toLocaleString();
    });
  } catch (err) {
    console.error(err);
  }

  // list all failed deployments
  try {
    const res = await vercelClient.deployment.list({
      projectId,
      teamId,
      state: 'ERROR',
      limit: 200,
    });
    deploymentsToBeDeleted.push(...res.data.deployments);
  } catch (err) {
    console.error(err);
  }

  try {
    // cancelled deployments
    const res = await vercelClient.deployment.list({
      projectId,
      teamId,
      state: 'CANCELED',
      limit: 200,
    });
    deploymentsToBeDeleted.push(...res.data.deployments);
  } catch (err) {
    console.error(err);
  }

  try {
    // success deployments
    const res = await vercelClient.get<{ deployments: Deployment[] }>('/v6/deployments', {
      params: { projectId, teamId, state: 'READY', limit: 100 },
    });
    const tmpList = res.data.deployments.filter((deployment) => {
      if (deployment.target === 'production') {
        return false; // important!
      }
      return true;
    });
    const tmpObj = tmpList.reduce((acc, deployment) => {
      const ref = deployment.meta?.githubCommitRef;
      if (!ref) {
        return acc;
      }
      if (ref in acc) {
        acc[ref].push(deployment);
      } else {
        acc[ref] = [deployment];
      }
      return acc;
    }, {} as { [key: string]: Deployment[] });

    // how many deployments to keep
    const MAX_DEPLOYMENT_COUNT_SECURE_BRANCH = 5;
    const MAX_DEPLOYMENT_COUNT_NONSECURE_BRANCH = 0;
    const deployments = Object.entries(tmpObj)
      .map(([ref, deployments]) => {
        const list = deployments
          .filter(({ createdAt }) => createdAt && createdAt > 0)
          .sort((a, b) => ((a.createdAt as number) > (b.createdAt as number) ? -1 : 1));
        if (['master', 'main', 'dev'].includes(ref)) {
          return list.slice(MAX_DEPLOYMENT_COUNT_SECURE_BRANCH);
        } else {
          return list.slice(MAX_DEPLOYMENT_COUNT_NONSECURE_BRANCH);
        }
      })
      .flat();
    deploymentsToBeDeleted.push(...deployments);
  } catch (err) {
    console.error(err);
  }

  // delete deployments
  // https://vercel.com/docs/rest-api#endpoints/deployments/delete-a-deployment
  console.log('number of deployments to be deleted:', deploymentsToBeDeleted.length);

  await Promise.all(
    deploymentsToBeDeleted.map(async (deployment) => {
      const res = await vercelClient.deployment.delete({
        deploymentId: deployment.uid,
        projectId,
        teamId,
      });
      console.log(res.data.state, deployment.url, deployment.uid);
    }),
  );
};
