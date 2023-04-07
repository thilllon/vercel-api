import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import {
  DeploymentDeleteResponse,
  GetDeploymentByIdResponse,
  ListDeploymentsResponse,
} from './vercel.type';

export type VercelClientOptions = {
  token?: string;
  projectId?: string;
  teamId?: string;
  axiosConfig?: Omit<CreateAxiosDefaults, 'baseURL'>;
};

const defaultOptions: Partial<VercelClientOptions> = {};

/**
 * https://vercel.com/docs/rest-api#introduction/api-basics
 */
export class VercelClient {
  private readonly client: AxiosInstance;
  private readonly _token: string;
  private readonly _teamId?: string;
  private readonly _projectId?: string;

  constructor(options: VercelClientOptions = {}) {
    options = { ...defaultOptions, ...options };
    const { token, projectId, teamId, axiosConfig } = options;
    const { headers, ...restAxiosConfig } = axiosConfig || {};

    this._token = token ?? process.env.VERCEL_API_TOKEN;
    this._projectId = projectId ?? process.env.VERCEL_API_PROJECT_ID;
    this._teamId = teamId ?? process.env.VERCEL_API_TEAM_ID;

    this.client = axios.create({
      baseURL: 'https://api.vercel.com',
      headers: {
        ...((headers as any) ?? {}),
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      ...restAxiosConfig,
    });
  }

  get token() {
    return this._token;
  }

  get projectId() {
    return this._projectId;
  }

  get teamId() {
    return this._teamId;
  }

  deployment = {
    get: this.getDeployment,
    list: this.listDeployments,
    delete: this.deleteDeployment,
  };

  project = {
    create: this.createProject,
    get: this.getProject,
    delete: this.deleteProject,
    addDomain: this.addProjectDomain,
    addEnvironmentVariable: this.addEnvironmentVariable,
    updateEnvironmentVariable: this.updateEnvironmentVariable,
    verifyDomain: this.verifyProjectDomain,
  };

  // --------------------------------
  // deployment
  // --------------------------------

  // https://vercel.com/docs/rest-api#endpoints/deployments/cancel-a-deployment
  // cancel a deployment
  // PATCH /v12/deployments/{id}/cancel

  private async cancelDeployment({ deploymentId }: { deploymentId: string }) {
    const url = `/v12/deployments/${deploymentId}/cancel`;
    return this.client.patch(url, {});
  }

  // https://vercel.com/docs/rest-api#endpoints/deployments/get-a-deployment-by-id-or-url
  // GET /v13/deployments/{idOrUrl}
  private async getDeployment({
    deploymentId,
    teamId = this.teamId,
  }: {
    deploymentId: string;
    teamId?: string;
  }) {
    const url = `/v13/deployments/${deploymentId}`;
    return this.client.get<GetDeploymentByIdResponse>(url, { params: { teamId } });
  }

  // https://vercel.com/docs/rest-api#endpoints/deployments/list-deployments
  // GET /v6/deployments
  private async listDeployments({
    teamId = this.teamId,
    projectId = this.projectId,
    limit = 100,
    // until = (Date.now() - 7 * 24 * 86400 * 1000) / 1000,
    // since = Date.now() - 10 * 24 * 86400 * 1000,
    to,
    state,
  }: {
    teamId?: string;
    projectId?: string;
    limit?: number;
    // until?: number;
    // since?: number;
    to?: number;
    state?: string; // Filter deployments based on their state (BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED)
  }) {
    const url = `/v6/deployments`;
    return this.client.get<ListDeploymentsResponse>(url, {
      params: {
        teamId,
        projectId,
        limit,
        to,
        state,
      },
    });
  }

  private async deleteDeployment({
    deploymentId,
    projectId,
    teamId = this.teamId,
  }: {
    deploymentId: string;
    projectId?: string;
    teamId?: string;
  }) {
    const url = `/v13/deployments/${deploymentId}`;
    return this.client.delete<DeploymentDeleteResponse>(url, {
      params: {
        projectId,
        teamId,
      },
    });
  }

  // --------------------------------
  // project
  // --------------------------------

  // https://vercel.com/docs/rest-api#endpoints/projects/add-a-domain-to-a-project
  // vercel.project.addDomain
  // POST /v9/projects/{idOrName}/domains
  private async addProjectDomain({
    projectId,
    projectName,
  }: {
    projectId?: string;
    projectName?: string;
  }) {
    const idOrName = projectId ?? projectName ?? this.projectId;
    const url = `/v9/projects/${idOrName}/domains`;
    return this.client.post(url, {});
  }

  // https://vercel.com/docs/rest-api#endpoints/projects/create-a-new-project
  // vercel.project.create
  // POST /v9/projects
  private async createProject() {
    const url = `/v9/projects`;
    return this.client.post(url, {});
  }

  // https://vercel.com/docs/rest-api#endpoints/projects/create-one-or-more-environment-variables
  // vercel.project.addEnvironmentVariable
  // POST /v9/projects/{idOrName}/env
  private async addEnvironmentVariable({
    projectId,
    projectName,
  }: {
    projectId?: string;
    projectName?: string;
  }) {
    const idOrName = projectId ?? projectName ?? this.projectId;
    const url = `/v9/projects/${idOrName}/env`;
    return this.client.post(url, {});
  }

  // https://vercel.com/docs/rest-api#endpoints/projects/delete-a-project
  // vercel.project.delete
  // DELETE /v9/projects/{idOrName}
  private async deleteProject({
    projectId,
    projectName,
  }: {
    projectId?: string;
    projectName?: string;
  }) {
    const idOrName = projectId ?? projectName ?? this.projectId;
    const url = `/v9/projects/${idOrName}`;
    return this.client.delete(url, {});
  }

  // https://vercel.com/docs/rest-api#endpoints/projects/edit-an-environment-variable
  // vercel.project.updateEnvironmentVariable
  // PATCH /v9/projects/{idOrName}/env/{id}
  private async updateEnvironmentVariable({
    projectId,
    projectName,
    envId,
  }: {
    projectId?: string;
    projectName?: string;
    envId?: any; // string ? number ?
  }) {
    const idOrName = projectId ?? projectName ?? this.projectId;
    const url = `/v9/projects/${idOrName}/env/${envId}`;
    return this.client.patch(url, {});
  }

  // https://vercel.com/docs/rest-api#endpoints/projects/find-a-project-by-id-or-name
  // vercel.project.get
  // GET /v9/projects/{idOrName}
  private async getProject({
    projectId,
    projectName,
    teamId,
  }: {
    projectId?: string;
    projectName?: string;
    teamId?: string;
  }) {
    const url = `/v9/projects/${projectId ?? projectName}`;
    return this.client.get(url, { params: { teamId } });
  }

  // https://vercel.com/docs/rest-api#endpoints/projects/get-a-project-domain
  // Get a project domain
  // vercel.project.getDomain
  // GET /v9/projects/{idOrName}/domains/{domain}
  private async getProjectDomain({
    projectId,
    projectName,
    domain,
  }: {
    projectId?: string;
    projectName?: string;
    domain: string;
  }) {
    const idOrName = projectId ?? projectName ?? this.projectId;
    const url = `/v9/projects/${idOrName}/domains/${domain}`;
    return this.client.get(url, {});
  }

  // https://vercel.com/docs/rest-api#endpoints/projects/verify-project-domain
  // vercel.project.verifyDomain
  private async verifyProjectDomain() {
    //
  }
}

export default VercelClient;
