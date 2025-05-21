import type { Handler } from "@netlify/functions";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import { EncryptDataRequest } from "../types"
import { JWT_ALGORITHM, JWT_SECRET_KEY } from "../settings"


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

        const data: EncryptDataRequest = JSON.parse(event.body);
        const { nombre, dni } = data;

        if (!nombre || !dni) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                } as Record<string, string>,
                body: JSON.stringify({
                    status: "error",
                    message: "nombre y dni son obligatorios.",
                }),
            };
        }

        // Hora actual en la zona horaria de Lima
        const expTime = DateTime.now()
            .setZone("America/Lima")
            .plus({ minutes: 10 })
            .toSeconds();

        const payload = {
            nombre,
            dni,
            exp: expTime,
        };

        const secretKey = JWT_SECRET_KEY;
        const algorithm = JWT_ALGORITHM as jwt.Algorithm;

        const token = jwt.sign(payload, secretKey, { algorithm });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            } as Record<string, string>,
            body: JSON.stringify({
                status: "success",
                token,
            }),
        };
    } catch (e: any) {
        console.error("Error en encryptData:", e);
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            } as Record<string, string>,
            body: JSON.stringify({
                status: "error",
                message: `Hubo un error ${e.message}`,
            }),
        };
    }
};
