import type { Handler } from "@netlify/functions";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM!;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
} as Record<string, string>;

export const handler: Handler = async (event) => {
  const authHeader = event.headers.authorization;

  if (!authHeader) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        status: "error",
        detail: "Falta el header de autorización",
      }),
    };
  }

  let token = "";
  try {
    const [scheme, extractedToken] = authHeader.split(" ");
    if (scheme.toLowerCase() !== "bearer") {
      throw new Error("Esquema inválido");
    }
    token = extractedToken;
  } catch {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        status: "error",
        detail: "Formato de autorización incorrecto",
      }),
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY, {
      algorithms: [JWT_ALGORITHM as jwt.Algorithm],
    }) as JwtPayload;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Token válido",
        content: decoded,
      }),
    };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          status: "error",
          detail: "Token expirado",
        }),
      };
    } else if (err.name === "JsonWebTokenError") {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          status: "error",
          detail: "Token inválido",
        }),
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          status: "error",
          detail: "Error al verificar el token",
        }),
      };
    }
  }
};
