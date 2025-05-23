import { Handler } from "@netlify/functions";
import { UserData } from "../types"
import { registerWorkers } from "../google_services/scripts"
import { ALLOWED_ORIGINS, JWT_ALGORITHM, JWT_SECRET_KEY } from "../settings"
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

export const handler: Handler = async (event, context) => {
  const requestOrigin = event.headers.origin || "";
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(requestOrigin);
  const headers = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? requestOrigin : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  } as Record<string, string>;

  const headers_ = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? requestOrigin : "",
  } as Record<string, string>;

  try {
    // Manejo de CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers: headers,
        body: "",
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: headers_,
        body: JSON.stringify({
          status: "error",
          message: "Método no permitido.",
        }),
      };
    }

    const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
    if (!contentType.includes("application/json")) {
      return {
        statusCode: 400,
        headers: headers_,
        body: JSON.stringify({
          status: "error",
          message: "Content-Type debe ser application/json.",
        }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: headers_,
        body: JSON.stringify({
          status: "error",
          message: "Body no puede estar vacío.",
        }),
      };
    }

    const body = JSON.parse(event.body);
    const nombre = body.nombre;
    const dni = body.dni;
    const idKeypass = body.id_key_pass;
    const password = body.password;
    
    if (!nombre || !dni || !password) {
      return {
        statusCode: 400,
        headers: headers_,
        body: JSON.stringify({
          status: "error",
          message: "Campos nombre, dni y password son obligatorios.",
        }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      dni,
      nombre,
      hashedPassword,
    };

    const secretKey = JWT_SECRET_KEY;
    const algorithm = JWT_ALGORITHM as jwt.Algorithm;
    const hash = jwt.sign(payload, secretKey, { algorithm });

    const userData: UserData = {
      id: dni,
      nombre,
      idKeypass: idKeypass || "",
      password: hash
    };

    // Suponemos que registerWorkers es una función async que devuelve un objeto con 'status' y 'message'
    const responseData = await registerWorkers(userData);

    if (responseData.status === "success") {
      return {
        statusCode: 200,
        headers: headers_,
        body: JSON.stringify({
          status: "success",
          message: "Usuario registrado exitosamente",
        }),
      };
    } else {
      return {
        statusCode: 400,
        headers: headers_,
        body: JSON.stringify({
          status: "error",
          message: responseData.message || "Error al registrar usuario.",
        }),
      };
    }
  } catch (err) {
    console.error("Error en registerEndpoint:", err);
    return {
      statusCode: 500,
      headers: headers_,
      body: JSON.stringify({
        status: "error",
        message: "Hubo un error, contacte con el administrador.",
      }),
    };
  }
};
