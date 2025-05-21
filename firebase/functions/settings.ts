import * as dotenv from "dotenv";

dotenv.config();

const configMap: Record<string, string> = {
  JWT_SECRET_KEY_: process.env.JWT_SECRET_KEY ?? "unasecretkeyfantabulosa",
  JWT_ALGORITHM_: process.env.JWT_ALGORITHM ?? "HS256",
  ALLOWED_ORIGINS_: process.env.ALLOWED_ORIGINS ?? "*",
  GOOGLE_SCRIPTS_ENDPOINT_: process.env.GOOGLE_SCRIPTS_ENDPOINT ?? "",
};

export const JWT_SECRET_KEY = configMap.JWT_SECRET_KEY_;
export const JWT_ALGORITHM = configMap.JWT_ALGORITHM_;
export const ALLOWED_ORIGINS = configMap.ALLOWED_ORIGINS_;
export const GOOGLE_SCRIPTS_ENDPOINT = configMap.GOOGLE_SCRIPTS_ENDPOINT_;
