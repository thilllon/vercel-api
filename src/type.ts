/** This object contains information related to the pagination of the current request, including the necessary parameters to get the next or previous page of data. */
export interface Pagination {
  /** Amount of items in the current page. */
  count: number;
  /** Timestamp that must be used to request the next page. */
  next: number | null;
  /** Timestamp that must be used to request the previous page. */
  prev: number | null;
}

export interface ListDeploymentsRequest {
  app?: string; // Name of the deployment.
  from?: number; // Gets the deployment created after this Date timestamp. (default: current time)
  limit?: number; // Maximum number of deployments to list from a request.
  projectId?: string; // Filter deployments from the given projectId.
  since?: number; // Get Deployments created after this JavaScript timestamp.
  state?: string; // Filter deployments based on their state (BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED)
  target?: string; // Filter deployments based on the environment.
  teamId?: string; // The Team identifier or slug to perform the request on behalf of.
  to?: number; // Gets the deployment created before this Date timestamp. (default: current time)
  until?: number; // Get Deployments created before this JavaScript timestamp.
  users?: string; // Filter out deployments based on users who have created the deployment.
}

export interface ListDeploymentsResponse {
  pagination: Pagination;
  deployments: {
    /** The unique identifier of the deployment. */
    uid: string;
    /** The name of the deployment. */
    name: string;
    /** The URL of the deployment. */
    url: string;
    /** Timestamp of when the deployment got created. */
    created: number;
    /** In which state is the deployment. */
    state?: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
    /** The type of the deployment. */
    type: 'LAMBDAS';
    /** Metadata information of the user who created the deployment. */
    creator: {
      /** The unique identifier of the user. */
      uid: string;
      /** The email address of the user. */
      email?: string;
      /** The username of the user. */
      username?: string;
      /** The GitHub login of the user. */
      githubLogin?: string;
      /** The GitLab login of the user. */
      gitlabLogin?: string;
    };
    /** Metadata information from the Git provider. */
    meta?: { [key: string]: string };
    /** On which environment has the deployment been deployed to. */
    target?: ('production' | 'staging') | null;
    /** An error object in case aliasing of the deployment failed. */
    aliasError?: {
      code: string;
      message: string;
    } | null;
    aliasAssigned?: (number | boolean) | null;
    /** Timestamp of when the deployment got created. */
    createdAt?: number;
    /** Timestamp of when the deployment started building at. */
    buildingAt?: number;
    /** Timestamp of when the deployment got ready. */
    ready?: number;
    /** State of all registered checks */
    checksState?: 'registered' | 'running' | 'completed';
    /** Conclusion for checks */
    checksConclusion?: 'succeeded' | 'failed' | 'skipped' | 'canceled';
    /** Vercel URL to inspect the deployment. */
    inspectorUrl: string | null;
  }[];
}

export type GetDeploymentByIdResponse =
  | {
      build: {
        /** The keys of the environment variables that were assigned during the build phase. */
        env: string[];
      };
      builds?: { [key: string]: unknown }[];
      /** The region where the deployment was first created */
      createdIn: string;
      /** The keys of the environment variables that were assigned during runtime */
      env: string[];
      /** An object used to configure your Serverless Functions */
      functions?: {
        [key: string]: {
          memory?: number;
          maxDuration?: number;
          runtime?: string;
          includeFiles?: string;
          excludeFiles?: string;
        };
      } | null;
      /** Vercel URL to inspect the deployment. */
      inspectorUrl: string | null;
      /** An object containing the deployment's metadata */
      meta: { [key: string]: string };
      /** The name of the project associated with the deployment at the time that the deployment was created */
      name: string;
      /** The unique ID of the user or team the deployment belongs to */
      ownerId: string;
      /** The pricing plan the deployment was made under */
      plan:
        | 'free'
        | 'hobby'
        | 'premium'
        | 'legacy_pro'
        | 'on-demand'
        | 'unlimited'
        | 'old-pro'
        | 'business'
        | 'enterprise'
        | 'pro'
        | 'oss';
      /** The ID of the project the deployment is associated with */
      projectId: string;
      /** A list of routes objects used to rewrite paths to point towards other internal or external paths */
      routes:
        | (
            | {
                src: string;
                dest?: string;
                headers?: { [key: string]: string };
                methods?: string[];
                continue?: boolean;
                override?: boolean;
                caseSensitive?: boolean;
                check?: boolean;
                important?: boolean;
                status?: number;
                has?: (
                  | {
                      type: 'host';
                      value: string;
                    }
                  | {
                      type: 'header' | 'cookie' | 'query';
                      key: string;
                      value?: string;
                    }
                )[];
                missing?: (
                  | {
                      type: 'host';
                      value: string;
                    }
                  | {
                      type: 'header' | 'cookie' | 'query';
                      key: string;
                      value?: string;
                    }
                )[];
                locale?: {
                  /** Construct a type with a set of properties K of type T */
                  redirect?: { [key: string]: string };
                  cookie?: string;
                };
                /** A middleware key within the `output` key under the build result. Overrides a `middleware` definition. */
                middlewarePath?: string;
                /** A middleware index in the `middleware` key under the build result */
                middleware?: number;
              }
            | {
                handle: 'filesystem' | 'hit' | 'miss' | 'rewrite' | 'error' | 'resource';
                src?: string;
                dest?: string;
                status?: number;
              }
            | {
                src: string;
                continue: boolean;
                middleware: 0;
              }
          )[]
        | null;
      /** A list of all the aliases (default aliases, staging aliases and production aliases) that were assigned upon deployment creation */
      alias: string[];
      /** A boolean that will be true when the aliases from the alias property were assigned successfully */
      aliasAssigned: boolean;
      /** An object that will contain a `code` and a `message` when the aliasing fails, otherwise the value will be `null` */
      aliasError?: {
        code: string;
        message: string;
      } | null;
      aliasFinal?: string | null;
      aliasWarning?: {
        code: string;
        message: string;
        link?: string;
        action?: string;
      } | null;
      automaticAliases?: string[];
      bootedAt: number;
      buildErrorAt?: number;
      buildingAt: number;
      canceledAt?: number;
      checksState?: 'registered' | 'running' | 'completed';
      checksConclusion?: 'succeeded' | 'failed' | 'skipped' | 'canceled';
      /** A number containing the date when the deployment was created in milliseconds */
      createdAt: number;
      /** Information about the deployment creator */
      creator: {
        /** The ID of the user that created the deployment */
        uid: string;
        /** The username of the user that created the deployment */
        username?: string;
      };
      errorCode?: string;
      errorLink?: string;
      errorMessage?: string | null;
      errorStep?: string;
      gitSource?:
        | {
            type: 'github';
            repoId: string | number;
            ref?: string | null;
            sha?: string;
            prId?: number | null;
          }
        | {
            type: 'github';
            org: string;
            repo: string;
            ref?: string | null;
            sha?: string;
            prId?: number | null;
          }
        | {
            type: 'gitlab';
            projectId: string | number;
            ref?: string | null;
            sha?: string;
            prId?: number | null;
          }
        | {
            type: 'bitbucket';
            workspaceUuid?: string;
            repoUuid: string;
            ref?: string | null;
            sha?: string;
            prId?: number | null;
          }
        | {
            type: 'bitbucket';
            owner: string;
            slug: string;
            ref?: string | null;
            sha?: string;
            prId?: number | null;
          }
        | {
            type: 'custom';
            ref: string;
            sha: string;
            gitUrl: string;
          }
        | {
            type: 'github';
            ref: string;
            sha: string;
            repoId: number;
            org?: string;
            repo?: string;
          }
        | {
            type: 'gitlab';
            ref: string;
            sha: string;
            projectId: number;
          }
        | {
            type: 'bitbucket';
            ref: string;
            sha: string;
            owner?: string;
            slug?: string;
            workspaceUuid: string;
            repoUuid: string;
          };
      /** A string holding the unique ID of the deployment */
      id: string;
      lambdas?: {
        id: string;
        createdAt?: number;
        entrypoint?: string | null;
        readyState?: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'READY';
        readyStateAt?: number;
        output: {
          path: string;
          functionName: string;
        }[];
      }[];
      /** A boolean representing if the deployment is public or not. By default this is `false` */
      public: boolean;
      /** The state of the deployment depending on the process of deploying, or if it is ready or in an error state */
      readyState: 'QUEUED' | 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'READY' | 'CANCELED';
      /** The regions the deployment exists in */
      regions: string[];
      /** Where was the deployment created from */
      source?: 'cli' | 'git' | 'import';
      /** If defined, either `staging` if a staging alias in the format `<project>.<team>.now.sh` was assigned upon creation, or `production` if the aliases from `alias` were assigned */
      target?: ('production' | 'staging') | null;
      /** The team that owns the deployment if any */
      team?: {
        /** The ID of the team owner */
        id: string;
        /** The name of the team owner */
        name: string;
        /** The slug of the team owner */
        slug: string;
      };
      type: 'LAMBDAS';
      /** A string with the unique URL of the deployment */
      url: string;
      /** An array of domains that were provided by the user when creating the Deployment. */
      userAliases?: string[];
      /** The platform version that was used to create the deployment. */
      version: 2;
    }
  | {
      /** A list of all the aliases (default aliases, staging aliases and production aliases) that were assigned upon deployment creation */
      alias: string[];
      /** A boolean that will be true when the aliases from the alias property were assigned successfully */
      aliasAssigned: boolean;
      /** An object that will contain a `code` and a `message` when the aliasing fails, otherwise the value will be `null` */
      aliasError?: {
        code: string;
        message: string;
      } | null;
      aliasFinal?: string | null;
      aliasWarning?: {
        code: string;
        message: string;
        link?: string;
        action?: string;
      } | null;
      automaticAliases?: string[];
      bootedAt: number;
      buildErrorAt?: number;
      buildingAt: number;
      canceledAt?: number;
      checksState?: 'registered' | 'running' | 'completed';
      checksConclusion?: 'succeeded' | 'failed' | 'skipped' | 'canceled';
      /** A number containing the date when the deployment was created in milliseconds */
      createdAt: number;
      /** Information about the deployment creator */
      creator: {
        /** The ID of the user that created the deployment */
        uid: string;
        /** The username of the user that created the deployment */
        username?: string;
      };
      errorCode?: string;
      errorLink?: string;
      errorMessage?: string | null;
      errorStep?: string;
      gitSource?:
        | {
            type: 'github';
            repoId: string | number;
            ref?: string | null;
            sha?: string;
            prId?: number | null;
          }
        | {
            type: 'github';
            org: string;
            repo: string;
            ref?: string | null;
            sha?: string;
            prId?: number | null;
          }
        | {
            type: 'gitlab';
            projectId: string | number;
            ref?: string | null;
            sha?: string;
            prId?: number | null;
          }
        | {
            type: 'bitbucket';
            workspaceUuid?: string;
            repoUuid: string;
            ref?: string | null;
            sha?: string;
            prId?: number | null;
          }
        | {
            type: 'bitbucket';
            owner: string;
            slug: string;
            ref?: string | null;
            sha?: string;
            prId?: number | null;
          }
        | {
            type: 'custom';
            ref: string;
            sha: string;
            gitUrl: string;
          }
        | {
            type: 'github';
            ref: string;
            sha: string;
            repoId: number;
            org?: string;
            repo?: string;
          }
        | {
            type: 'gitlab';
            ref: string;
            sha: string;
            projectId: number;
          }
        | {
            type: 'bitbucket';
            ref: string;
            sha: string;
            owner?: string;
            slug?: string;
            workspaceUuid: string;
            repoUuid: string;
          };
      /** A string holding the unique ID of the deployment */
      id: string;
      lambdas?: {
        id: string;
        createdAt?: number;
        entrypoint?: string | null;
        readyState?: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'READY';
        readyStateAt?: number;
        output: {
          path: string;
          functionName: string;
        }[];
      }[];
      /** The name of the project associated with the deployment at the time that the deployment was created */
      name: string;
      /** An object containing the deployment's metadata */
      meta: { [key: string]: string };
      /** A boolean representing if the deployment is public or not. By default this is `false` */
      public: boolean;
      /** The state of the deployment depending on the process of deploying, or if it is ready or in an error state */
      readyState: 'QUEUED' | 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'READY' | 'CANCELED';
      /** The regions the deployment exists in */
      regions: string[];
      /** Where was the deployment created from */
      source?: 'cli' | 'git' | 'import';
      /** If defined, either `staging` if a staging alias in the format `<project>.<team>.now.sh` was assigned upon creation, or `production` if the aliases from `alias` were assigned */
      target?: ('production' | 'staging') | null;
      /** The team that owns the deployment if any */
      team?: {
        /** The ID of the team owner */
        id: string;
        /** The name of the team owner */
        name: string;
        /** The slug of the team owner */
        slug: string;
      };
      type: 'LAMBDAS';
      /** A string with the unique URL of the deployment */
      url: string;
      /** An array of domains that were provided by the user when creating the Deployment. */
      userAliases?: string[];
      /** The platform version that was used to create the deployment. */
      version: 2;
    };

export type Deployment = {
  /** The unique identifier of the deployment. */
  uid: string;
  /** The name of the deployment. */
  name: string;
  /** The URL of the deployment. */
  url: string;
  /** Timestamp of when the deployment got created. */
  created: number;
  /** In which state is the deployment. */
  state?: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
  /** The type of the deployment. */
  type: 'LAMBDAS';
  /** Metadata information of the user who created the deployment. */
  creator: {
    /** The unique identifier of the user. */
    uid: string;
    /** The email address of the user. */
    email?: string;
    /** The username of the user. */
    username?: string;
    /** The GitHub login of the user. */
    githubLogin?: string;
    /** The GitLab login of the user. */
    gitlabLogin?: string;
  };
  /** Metadata information from the Git provider. */
  meta?: { [key: string]: string };
  /** On which environment has the deployment been deployed to. */
  target?: ('production' | 'staging') | null;
  /** An error object in case aliasing of the deployment failed. */
  aliasError?: {
    code: string;
    message: string;
  } | null;
  aliasAssigned?: (number | boolean) | null;
  /** Timestamp of when the deployment got created. */
  createdAt?: number;
  /** Timestamp of when the deployment started building at. */
  buildingAt?: number;
  /** Timestamp of when the deployment got ready. */
  ready?: number;
  /** State of all registered checks */
  checksState?: 'registered' | 'running' | 'completed';
  /** Conclusion for checks */
  checksConclusion?: 'succeeded' | 'failed' | 'skipped' | 'canceled';
  /** Vercel URL to inspect the deployment. */
  inspectorUrl: string | null;
};

// deployment delete response
export interface DeploymentDeleteResponse {
  /** The removed deployment ID. */
  uid: string;
  /** A constant with the final state of the deployment. */
  state: 'DELETED';
}
