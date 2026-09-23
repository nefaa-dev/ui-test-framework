export type EnvironmentName = 'production';

export interface EnvironmentConfig {
  baseURL: string;
  actionTimeout: number;
}

export const environments: Record<EnvironmentName, EnvironmentConfig> = {
  production: {
    baseURL: 'https://www.saucedemo.com',
    actionTimeout: 15_000,
  },
};