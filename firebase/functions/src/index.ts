import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { JWT_SECRET_KEY, JWT_ALGORITHM } from "../settings"
import {
  registerWorkers,
  updateAssistance,
  getUserData,
} from "./google_scripts/scripts"
import { UserData, AssistanceData, VerifyBioRequest, EncryptDataRequest, DecryptDataRequest } from "./types"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { DateTime } from "luxon";


export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const registerEndpoint = onRequest(async (req, res) => {
  try {
    // Manejo de CORS preflight
    if (req.method === 'OPTIONS') {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({
        status: 'error',
        message: 'Método no permitido.',
      });
      return;
    }

    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      res.status(400).json({
        status: 'error',
        message: 'Content-Type debe ser application/json.',
      });
      return;
    }
    const body = req.body;
    const { nombre, dni, id_key_pass } = body;

    if (!nombre || !dni) {
      res.status(400).json({
        status: 'error',
        message: "Campos 'nombre' y 'dni' son obligatorios.",
      });
      return;
    }

    const userData: UserData = {
      id: dni,
      nombre,
      idKeypass: id_key_pass || '',
    };

    const responseData = await registerWorkers(userData);
    console.log("responseData", responseData);
    if (responseData.status === 'success') {
      res.status(200).json({
        status: 'success',
        message: 'Usuario registrado exitosamente',
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: responseData.message || 'Error al registrar usuario.',
      });
    }

  } catch (err) {
    logger.error('Error en registerEndpoint:', err);
    res.status(500).json({
      status: 'error',
      message: 'Hubo un error, contacte con el administrador.',
    });
  }
});

export const updateAssistanceEndpoint = onRequest(async (req, res) => {
  try {
    // Verificar que sea POST
    if (req.method !== 'POST') {
      res.status(405).json({
        status: 'error',
        message: 'Método no permitido.',
      });
      return;
    }

    const data = req.body;

    // Validar que estén los campos necesarios
    const requiredFields: (keyof AssistanceData)[] = ['dni', 'nombre', 'evento', 'fecha', 'hora'];
    const missingFields = requiredFields.filter((field) => !(field in data));

    if (missingFields.length > 0) {
      res.status(400).json({
        status: 'error',
        message: 'Faltan campos en el body.',
      });
      return;
    }

    const responseData = await updateAssistance(data);

    if (responseData.status === 'success') {
      console.log('Registro exitoso:', responseData.message);
      res.status(200).json({
        status: 'success',
        message: `Asistencia actualizada: ${data.evento} a las ${data.hora}`,
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: responseData.message,
      });
    }
  } catch (err) {
    console.error('Error en updateAssistanceEndpoint:', err);
    res.status(500).json({
      status: 'error',
      message: 'Hubo un error, contacte con el administrador.',
    });
  }
});

export const verifyBio = onRequest(async (req, res) => {
  try {
    // Manejo de CORS preflight
    if (req.method === 'OPTIONS') {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({
        status: 'error',
        message: 'Método no permitido.',
      });
      return;
    }

    const data: VerifyBioRequest = req.body;

    const responseData = await getUserData(data);

    if (responseData.status === 'success' && responseData.content) {
      const content = {
        status: 'success',
        content: {
          dni: responseData.content.dni,
          nombre: responseData.content.nombre,
        },
      };
      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).json(content);
    } else {
      res.set('Access-Control-Allow-Origin', '*');
      res.status(400).json({
        status: 'error',
        message: responseData.message || 'Error al obtener los datos.',
      });
    }

  } catch (err) {
    console.error('Error en verifyBio:', err);
    res.set('Access-Control-Allow-Origin', '*');
    res.status(500).json({
      status: 'error',
      message: 'Hubo un error, contacte con el administrador.',
    });
  }
});

export const encryptData = onRequest(async (req, res) => {
  try {
    // Manejo de CORS preflight
    if (req.method === 'OPTIONS') {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({
        status: 'error',
        message: 'Método no permitido.',
      });
      return;
    }

    const data: EncryptDataRequest = req.body;

    const { nombre, dni } = data;

    if (!nombre || !dni) {
      res.status(400).json({
        status: 'error',
        message: "'nombre' y 'dni' son obligatorios.",
      });
      return;
    }

    // Hora actual en la zona horaria de Lima
    const expTime = DateTime.now().setZone('America/Lima').plus({ minutes: 10 }).toSeconds();

    const payload = {
      nombre,
      dni,
      exp: expTime, // exp en segundos UNIX
    };

    const a: string = JWT_SECRET_KEY;
    const b: jwt.Algorithm = JWT_ALGORITHM as jwt.Algorithm;

    const token = jwt.sign(payload, a, { algorithm: b });

    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (e: any) {
    console.error('Error en encryptData:', e);
    res.set('Access-Control-Allow-Origin', '*');
    res.status(400).json({
      status: 'error',
      message: `Hubo un error ${e.message}`,
    });
  }
});

export const decryptData = onRequest(async (req, res) => {
  try {
    // Manejo de preflight CORS
    if (req.method === 'OPTIONS') {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({
        status: 'error',
        message: 'Método no permitido.',
      });
      return;
    }

    const data: DecryptDataRequest = req.body;
    const token = data.token;

    if (!token) {
      res.status(400).json({
        status: 'error',
        message: 'Token es requerido.',
      });
      return;
    }

    const a: string = JWT_SECRET_KEY;
    const b: jwt.Algorithm = JWT_ALGORITHM as jwt.Algorithm;

    try {
      // Decodificar token JWT
      const decoded = jwt.verify(token, a, {
        algorithms: [b],
      }) as JwtPayload;

      console.log('Token decodificado:', decoded);

      if ('exp' in decoded) {
        delete decoded.exp;
      }

      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).json({
        status: 'success',
        content: decoded,
      });

    } catch (err: any) {
      console.error('Error al decodificar token:', err);

      res.set('Access-Control-Allow-Origin', '*');

      if (err.name === 'TokenExpiredError') {
        res.status(401).json({
          status: 'error',
          content: { message: 'El token ha expirado.' },
        });
      } else if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
          status: 'error',
          content: { message: 'El token es inválido.' },
        });
      } else {
        res.status(400).json({
          status: 'error',
          content: { message: `Error al procesar el token: ${err.message}` },
        });
      }
    }

  } catch (e: any) {
    console.error('Error inesperado:', e);
    res.set('Access-Control-Allow-Origin', '*');
    res.status(400).json({
      status: 'error',
      content: { message: `Hubo un error ${e.message}` },
    });
  }
});

export const auth = onRequest((req, res) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      status: 'error',
      detail: 'Falta el header de autorización',
    });
    return;
  }

  let token = '';
  try {
    const [scheme, extractedToken] = authorization.split(' ');

    if (scheme.toLowerCase() !== 'bearer') {
      throw new Error('Esquema inválido');
    }

    token = extractedToken;
  } catch {
    res.status(401).json({
      status: 'error',
      detail: 'Formato de autorización incorrecto',
    });
    return;
  }

  const a: string = JWT_SECRET_KEY;
  console.log(a);
  const b: jwt.Algorithm = JWT_ALGORITHM as jwt.Algorithm;

  try {
    const decoded = jwt.verify(token, a, {
      algorithms: [b],
    }) as JwtPayload;

    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      message: 'Token válido',
      content: decoded,
    });
  } catch (err: any) {
    res.set('Access-Control-Allow-Origin', '*');

    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        status: 'error',
        detail: 'Token expirado',
      });
    } else if (err.name === 'JsonWebTokenError') {
      res.status(401).json({
        status: 'error',
        detail: 'Token inválido',
      });
    } else {
      res.status(401).json({
        status: 'error',
        detail: 'Error al verificar el token',
      });
    }
  }
});