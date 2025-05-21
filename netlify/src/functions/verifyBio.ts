import type { Handler } from "@netlify/functions";
import { VerifyBioRequest } from "../types"
import { getUserData } from "../google_services/scripts"


export const handler: Handler = async (event, context) => {
  try {
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
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        } as Record<string, string>,
        body: JSON.stringify({
          status: "error",
          message: "Método no permitido.",
        }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        } as Record<string, string>,
        body: JSON.stringify({
          status: "error",
          message: "Body no puede estar vacío.",
        }),
      };
    }

    const data: VerifyBioRequest = JSON.parse(event.body);

    const responseData = await getUserData(data);

    if (responseData.status === "success" && responseData.content) {
      const content = {
        status: "success",
        content: {
          dni: responseData.content.dni,
          nombre: responseData.content.nombre,
        },
      };
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        } as Record<string, string>,
        body: JSON.stringify(content),
      };
    } else {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        } as Record<string, string>,
        body: JSON.stringify({
          status: "error",
          message: responseData.message || "Error al obtener los datos.",
        }),
      };
    }
  } catch (err) {
    console.error("Error en verifyBio:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      } as Record<string, string>,
      body: JSON.stringify({
        status: "error",
        message: "Hubo un error, contacte con el administrador.",
      }),
    };
  }
};
