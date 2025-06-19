import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  LOGGING: number;
  NODE_ENV: string;
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
};

export default envConfig;
