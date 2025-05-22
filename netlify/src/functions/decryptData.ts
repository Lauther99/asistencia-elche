import type { Handler } from "@netlify/functions";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_ALGORITHM, JWT_SECRET_KEY, ALLOWED_ORIGINS } from "../settings"
import { DecryptDataRequest } from "../types"

const handler: Handler = async (event) => {
  const requestOrigin = event.headers.origin || "";
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(requestOrigin);
  const headers = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? requestOrigin : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  } as Record<string, string>;

  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers,
        body: "",
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          status: "error",
          message: "Método no permitido.",
        }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: "error",
          message: "Body vacío.",
        }),
      };
    }

    const data: DecryptDataRequest = JSON.parse(event.body);
    const token = data.token;

    if (!token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: "error",
          message: "Token es requerido.",
        }),
      };
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY, {
        algorithms: [JWT_ALGORITHM as jwt.Algorithm],
      }) as JwtPayload;

      if ("exp" in decoded) {
        delete decoded.exp;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "success",
          content: decoded,
        }),
      };
    } catch (err: any) {
      console.error("Error al decodificar token:", err);

      const errorMessage =
        err.name === "TokenExpiredError"
          ? "El token ha expirado."
          : err.name === "JsonWebTokenError"
            ? "El token es inválido."
            : `Error al procesar el token: ${err.message}`;

      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          status: "error",
          content: { message: errorMessage },
        }),
      };
    }
  } catch (e: any) {
    console.error("Error inesperado:", e);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: "error",
        content: { message: `Hubo un error ${e.message}` },
      }),
    };
  }
};

export { handler };
