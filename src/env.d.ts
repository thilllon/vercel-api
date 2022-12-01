declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    VERCEL_API_TEAM_ID: string;
    VERCEL_API_PROJECT_ID: string;
    VERCEL_API_TOKEN: string;
  }
}
