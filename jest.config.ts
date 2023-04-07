import type { Config } from 'jest';

const config: Config = {
  transform: {
    // '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.tsx?$': '@swc/jest',
  },
};

export default config;
