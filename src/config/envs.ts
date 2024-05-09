import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_LOGGING: string;
  DB_LOGGING_ENABLE: boolean;
  DB_NAME: string;
  PRODUCT_MSV_HOST: string;
  PRODUCT_MSV_PORT: number;
  NATS_SERVERS: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_LOGGING: joi.string().required(),
    DB_LOGGING_ENABLED: joi.boolean().required(),
    PRODUCT_MSV_HOST: joi.string().required(),
    PRODUCT_MSV_PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string().required()),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if (error) {
  throw new Error(`Config Validation Error: ${error}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUsername: envVars.DB_USERNAME,
  dbPassword: envVars.DB_PASSWORD,
  dbLogging: envVars.DB_LOGGING,
  dbLoggingEnable: envVars.DB_LOGGING_ENABLE,
  dbName: envVars.DB_NAME,
  productMsvHost: envVars.PRODUCT_MSV_HOST,
  productMsvPort: envVars.PRODUCT_MSV_PORT,
  natsServers: envVars.NATS_SERVERS,
};
