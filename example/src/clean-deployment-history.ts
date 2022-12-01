export const clearVercelDeployments = async () => {
  // // error, canceled이면 삭제
  // // production이면 삭제 안함
  // // dev, master, main 면 가장 최신 10개
  // // 다른 브랜치면 가장 최신 4개
  // const deploymentsToBeDeleted: Deployment[] = [];
  // let projectName = '';
  // // https://vercel.com/docs/rest-api#endpoints/deployments/list-deployments
  // // state: BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED
  // try {
  //   const DAYS_FROM_TODAY = 30;
  //   // 특정 기간 이전의 배포 목록
  //   const res = await vercelClient.get(`/v6/deployments`, {
  //     params: {
  //       projectId,
  //       teamId,
  //       limit: 100,
  //       until: new Date().getTime() - 1000 * 60 * 60 * 24 * DAYS_FROM_TODAY,
  //     },
  //   });
  //   deploymentsToBeDeleted.push(...res.data.deployments);
  //   const tmp = res.data.deployments.map((depl: any) => {
  //     return new Date(depl.createdAt).toLocaleString();
  //   });
  // } catch (err) {
  //   console.error(err);
  // }
  // try {
  //   // 실패한 deployment 목록
  //   const res = await vercelClient.get('/v6/deployments', {
  //     params: { projectId, teamId, state: 'ERROR', limit: 200 },
  //   });
  //   projectName = res.data.deployments?.[0]?.name;
  //   deploymentsToBeDeleted.push(...res.data.deployments);
  // } catch (err) {
  //   console.error(err);
  // }
  // try {
  //   // 취소된 deployment 목록
  //   const res = await vercelClient.get('/v6/deployments', {
  //     params: { projectId, teamId, state: 'CANCELED', limit: 200 },
  //   });
  //   deploymentsToBeDeleted.push(...res.data.deployments);
  // } catch (err) {
  //   console.error(err);
  // }
  // try {
  //   // 성공한 deployment 목록
  //   const res = await vercelClient.get<{ deployments: Deployment[] }>('/v6/deployments', {
  //     params: { projectId, teamId, state: 'READY', limit: 100 },
  //   });
  //   const tmpList = res.data.deployments.filter((deployment) => {
  //     if (deployment.target === 'production') {
  //       return false; // 중요!
  //     }
  //     return true;
  //   });
  //   const tmpObj = tmpList.reduce((acc, deployment) => {
  //     const ref = deployment.meta?.githubCommitRef;
  //     if (!ref) {
  //       return acc;
  //     }
  //     if (ref in acc) {
  //       acc[ref].push(deployment);
  //     } else {
  //       acc[ref] = [deployment];
  //     }
  //     return acc;
  //   }, {} as { [key: string]: Deployment[] });
  //   // 몇개씩 남겨둘것인지
  //   const MAX_DEPLOYMENT_COUNT_SECURE_BRANCH = 5;
  //   const MAX_DEPLOYMENT_COUNT_NONSECURE_BRANCH = 0;
  //   const deployments = Object.entries(tmpObj)
  //     .map(([ref, deployments]) => {
  //       const list = deployments
  //         .filter(({ createdAt }) => createdAt && createdAt > 0)
  //         .sort((a, b) => ((a.createdAt as number) > (b.createdAt as number) ? -1 : 1));
  //       if (['master', 'main', 'dev'].includes(ref)) {
  //         return list.slice(MAX_DEPLOYMENT_COUNT_SECURE_BRANCH);
  //       } else {
  //         return list.slice(MAX_DEPLOYMENT_COUNT_NONSECURE_BRANCH);
  //       }
  //     })
  //     .flat();
  //   deploymentsToBeDeleted.push(...deployments);
  // } catch (err) {
  //   console.error(err);
  // }
  // // deployment 삭제
  // // https://vercel.com/docs/rest-api#endpoints/deployments/delete-a-deployment
  // console.log('삭제될 deployment 수:', deploymentsToBeDeleted.length);
  // // for await (const deployment of deploymentsToBeDeleted) {
  // //   const res = await vercelClient.delete(`/v6/deployments/${deployment.uid}`, { params: { teamId } });
  // //   console.log(res.data.state, deployment.url, deployment.uid);
  // // }
  // await Promise.all(
  //   deploymentsToBeDeleted.map(async (deployment) => {
  //     const res = await vercelClient.delete(`/v6/deployments/${deployment.uid}`, {
  //       params: { teamId },
  //     });
  //     console.log(res.data.state, deployment.url, deployment.uid);
  //   })
  // );
};
