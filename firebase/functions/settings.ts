import { defineSecret } from 'firebase-functions/params';
import * as dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process?.env?.NODE_ENV ?? 'PROD';

// Define los secretos *siempre* (aunque no se usen en dev)
const JWT_SECRET = defineSecret('JWT_SECRET_KEY');
const JWT_ALGO = defineSecret('JWT_ALGORITHM');
const ALLOWED = defineSecret('ALLOWED_ORIGINS');
const GOOGLE_ENDPOINT = defineSecret('GOOGLE_SCRIPTS_ENDPOINT');

const configMap: Record<string, string> = {
  JWT_SECRET_KEY_: NODE_ENV === "PROD" ? JWT_SECRET.value() : process.env.JWT_SECRET_KEY ?? 'unasecretkeyfantabulosa',
  JWT_ALGORITHM_: NODE_ENV === "PROD" ? JWT_ALGO.value() : process.env.JWT_ALGORITHM ?? 'HS256',
  ALLOWED_ORIGINS_: NODE_ENV === "PROD" ? ALLOWED?.value() ?? '*' : process.env.ALLOWED_ORIGINS ?? '*',
  GOOGLE_SCRIPTS_ENDPOINT_: NODE_ENV === "PROD" ? GOOGLE_ENDPOINT.value() : process.env.GOOGLE_SCRIPTS_ENDPOINT ?? '',
};

export const JWT_SECRET_KEY = configMap.JWT_SECRET_KEY_;
export const JWT_ALGORITHM = configMap.JWT_ALGORITHM_;
export const ALLOWED_ORIGINS = configMap.ALLOWED_ORIGINS_;
export const GOOGLE_SCRIPTS_ENDPOINT = configMap.GOOGLE_SCRIPTS_ENDPOINT_;