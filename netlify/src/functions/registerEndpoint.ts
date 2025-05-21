import { Handler } from "@netlify/functions";
import { UserData } from "../types"
import { registerWorkers } from "../google_services/scripts"


export const handler: Handler = async (event, context) => {
  try {
    // Manejo de CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        } as Record<string, string>,
        body: "",
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Access-Control-Allow-Origin": "*" },
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
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          status: "error",
          message: "Content-Type debe ser application/json.",
        }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
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

    if (!nombre || !dni) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          status: "error",
          message: "Campos nombre y dni son obligatorios.",
        }),
      };
    }

    const userData: UserData = {
      id: dni,
      nombre,
      idKeypass: idKeypass || "",
    };

    // Suponemos que registerWorkers es una función async que devuelve un objeto con 'status' y 'message'
    const responseData = await registerWorkers(userData);

    if (responseData.status === "success") {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          status: "success",
          message: "Usuario registrado exitosamente",
        }),
      };
    } else {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
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
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        status: "error",
        message: "Hubo un error, contacte con el administrador.",
      }),
    };
  }
};
