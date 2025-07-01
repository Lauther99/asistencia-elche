import { Handler } from "@netlify/functions";
import { login } from "../google_services/scripts"
import { ALLOWED_ORIGINS, JWT_ALGORITHM, JWT_SECRET_KEY } from "../settings"
import { DateTime } from "luxon";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from "jsonwebtoken";


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
        const dni = body.dni;
        const password = body.password;
        const role = body.role;

        if (!password || !dni) {
            return {
                statusCode: 400,
                headers: headers_,
                body: JSON.stringify({
                    status: "error",
                    message: "Campos dni y password son obligatorios.",
                }),
            };
        }


        const userData = {
            dni: dni,
            password: "password"
        };

        // Suponemos que registerWorkers es una función async que devuelve un objeto con 'status' y 'message'
        const responseData = await login(userData);

        if (responseData.status === "success") {
            const token = responseData.content.hash

            const decoded = jwt.verify(token, JWT_SECRET_KEY, {
                algorithms: [JWT_ALGORITHM as jwt.Algorithm],
            }) as JwtPayload;

            const hashedPassword = decoded.hashedPassword
            const isValid = await bcrypt.compare(password, hashedPassword);

            if (isValid) {
                const expTime = DateTime.now()
                    .setZone("America/Lima")
                    .plus({ minutes: role === "worker"? 5 : 30 })
                    .toSeconds();

                const payload = {
                    "nombre": decoded.nombre,
                    "dni": decoded.dni,
                    exp: expTime,
                };

                const secretKey = JWT_SECRET_KEY;
                const algorithm = JWT_ALGORITHM as jwt.Algorithm;
                const token_2 = jwt.sign(payload, secretKey, { algorithm });

                return {
                    statusCode: 200,
                    headers: headers_,
                    body: JSON.stringify({
                        status: "success",
                        token: token_2,
                    }),
                };
            } else {
                return {
                    statusCode: 401,
                    headers: headers_,
                    body: JSON.stringify({
                        status: "error",
                        message: "Dni o contraseña inválidos.",
                    }),
                };
            }

        } else {
            return {
                statusCode: 400,
                headers: headers_,
                body: JSON.stringify({
                    status: "error",
                    message: responseData.message || "Error al iniciar sesion.",
                }),
            };
        }
    } catch (err) {
        console.error("Error en loginEndpoint:", err);
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
