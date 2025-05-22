import type { Handler } from "@netlify/functions";
import { AssistanceData } from "../types"
import { updateAssistance } from "../google_services/scripts"
import { ALLOWED_ORIGINS } from "../settings"

export const handler: Handler = async (event, context) => {
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
        statusCode: 200,
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
        headers: headers,
        body: JSON.stringify({
          status: "error",
          message: "Método no permitido.",
        }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({
          status: "error",
          message: "Body no puede estar vacío.",
        }),
      };
    }

    const data = JSON.parse(event.body);

    const requiredFields: (keyof AssistanceData)[] = [
      "dni", "nombre", "evento", "fecha", "hora",
    ];

    const missingFields = requiredFields.filter((field) => !(field in data));

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({
          status: "error",
          message: "Faltan campos en el body.",
        }),
      };
    }

    // Asumo que updateAssistance es async y devuelve { status: string; message?: string }
    const responseData = await updateAssistance(data);

    if (responseData.status === "success") {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
          status: "success",
          message: `Asistencia actualizada: ${data.evento} a las ${data.hora}`,
        }),
      };
    } else {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({
          status: "error",
          message: responseData.message,
        }),
      };
    }
  } catch (err) {
    console.error("Error en updateAssistanceEndpoint:", err);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        status: "error",
        message: "Hubo un error, contacte con el administrador.",
      }),
    };
  }
};
