import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { DeploymentDeleteResponse, GetDeploymentByIdResponse, ListDeploymentsResponse } from './type';

// https://vercel.com/docs/rest-api#introduction/api-basics

export type VercelClientOptions = {
  projectId?: string;
  teamId?: string;
  axiosConfig?: Omit<CreateAxiosDefaults, 'baseURL'>;
};

const defaultOptions: Partial<VercelClientOptions> = {
  //
};

export class VercelClient {
  private static instance: VercelClient;
  private readonly client: AxiosInstance;
  private readonly _token: string;
  private readonly _teamId?: string;
  private readonly _projectId?: string;

  private constructor(token: string, options?: VercelClientOptions) {
    options = { ...defaultOptions, ...options };
    const { projectId, teamId, axiosConfig } = options;
    const { headers, ...restAxiosConfig } = axiosConfig || {};

    this._token = token;
    this._projectId = projectId;
    this._teamId = teamId;

    this.client = axios.create({
      baseURL: 'https://api.vercel.com',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      ...restAxiosConfig,
    });
  }

  static getInstance(token: string, options?: VercelClientOptions) {
    if (!VercelClient.instance) {
      VercelClient.instance = new VercelClient(token, options);
    }
    return VercelClient.instance;
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

  // https://vercel.com/docs/rest-api#endpoints/deployments/get-a-deployment-by-id-or-url
  // GET /v13/deployments/{idOrUrl}
  private async getDeployment({ deploymentId, teamId = this.teamId }: { deploymentId: string; teamId?: string }) {
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
    to = Date.now() - 7 * 24 * 86400 * 1000,
  }: {
    teamId?: string;
    projectId?: string;
    limit?: number;
    // until?: number;
    // since?: number;
    to?: number;
  }) {
    const url = `/v6/deployments`;
    return this.client.get<ListDeploymentsResponse>(url, { params: { teamId, projectId, limit, to } });
  }

  private async deleteDeployment({ deploymentId, teamId = this.teamId }: { deploymentId: string; teamId?: string }) {
    const url = `/v13/deployments/${deploymentId}`;
    return this.client.delete<DeploymentDeleteResponse>(url, { params: { teamId } });
  }

  // --------------------------------
  // project
  // --------------------------------

  // https://vercel.com/docs/rest-api#endpoints/projects/add-a-domain-to-a-project
  // vercel.project.addDomain
  // POST /v9/projects/{idOrName}/domains
  private async addProjectDomain({ projectId, projectName }: { projectId?: string; projectName?: string }) {
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
  private async addEnvironmentVariable({ projectId, projectName }: { projectId?: string; projectName?: string }) {
    const idOrName = projectId ?? projectName ?? this.projectId;
    const url = `/v9/projects/${idOrName}/env`;
    return this.client.post(url, {});
  }

  // https://vercel.com/docs/rest-api#endpoints/projects/delete-a-project
  // vercel.project.delete
  // DELETE /v9/projects/{idOrName}
  private async deleteProject({ projectId, projectName }: { projectId?: string; projectName?: string }) {
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
