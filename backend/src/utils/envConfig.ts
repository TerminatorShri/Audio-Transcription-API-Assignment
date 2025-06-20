import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  LOGGING: number;
  NODE_ENV: string;
  DB_URI: string;
  DB_NAME: string;
  CLOUD_NAME: string;
  CLOUD_API_KEY: string;
  CLOUD_API_SECRET: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  CORS_ORIGIN: string;
}

const getEnvVariable = (key: keyof EnvConfig): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};

const envConfig: EnvConfig = {
  PORT: getEnvVariable("PORT"),
  LOGGING: Number(getEnvVariable("LOGGING")),
  NODE_ENV: getEnvVariable("NODE_ENV"),
  DB_URI: getEnvVariable("DB_URI"),
  DB_NAME: getEnvVariable("DB_NAME"),
  CLOUD_NAME: getEnvVariable("CLOUD_NAME"),
  CLOUD_API_KEY: getEnvVariable("CLOUD_API_KEY"),
  CLOUD_API_SECRET: getEnvVariable("CLOUD_API_SECRET"),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  JWT_EXPIRATION: getEnvVariable("JWT_EXPIRATION"),
  CORS_ORIGIN: getEnvVariable("CORS_ORIGIN"),
};

export default envConfig;
