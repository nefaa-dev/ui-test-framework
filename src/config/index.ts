import dotenv from 'dotenv';
import { environments, EnvironmentConfig, EnvironmentName } from './environments';
import { User } from '../models';

dotenv.config();

export type Persona = 'standard' | 'lockedOut' | 'problem' | 'performanceGlitch';

const USERNAMES: Record<Persona, string> = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
};

export interface AppConfig {
  env: EnvironmentName;
  baseURL: string;
  actionTimeout: number;
  users: Record<Persona, User>;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function resolveEnvironment(): EnvironmentName {
  const env = (process.env.TEST_ENV ?? 'production') as EnvironmentName;
  if (!(env in environments)) {
    throw new Error(
      `Unknown TEST_ENV "${env}". Valid options: ${Object.keys(environments).join(', ')}`,
    );
  }
  return env;
}

function buildConfig(): AppConfig {
  const env = resolveEnvironment();
  const envConfig: EnvironmentConfig = environments[env];
  const password = required('SAUCE_PASSWORD');

  const users = Object.fromEntries(
    Object.entries(USERNAMES).map(([persona, username]) => [persona, { username, password }]),
  ) as Record<Persona, User>;

  return {
    env,
    baseURL: envConfig.baseURL,
    actionTimeout: envConfig.actionTimeout,
    users,
  };
}

export const config: AppConfig = buildConfig();