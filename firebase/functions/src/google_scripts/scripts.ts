import {GOOGLE_SCRIPTS_ENDPOINT} from "../../settings";
import {ResponseData} from "../types";


export async function registerWorkers(userData: Record<string, any>) {
  const url = GOOGLE_SCRIPTS_ENDPOINT;

  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();

  const res: ResponseData = {
    status: responseData["status"],
    message: responseData["message"],
  };

  return res;
}

export async function updateAssistance(userData: Record<string, any>) {
  const url = `${GOOGLE_SCRIPTS_ENDPOINT}?accion=actualizar_asistencias`;

  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();

  const res: ResponseData = {
    status: responseData["status"],
    message: responseData["message"],
  };

  return res;
}

export async function getUserData(userData: Record<string, any>) {
  const url = `${GOOGLE_SCRIPTS_ENDPOINT}?accion=get_user_data`;

  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();

  return responseData;
}

export async function setPhotoEmbedding(userData: Record<string, any>) {
  const url = `${GOOGLE_SCRIPTS_ENDPOINT}?accion=set_photo_embedding`;

  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();

  const res: ResponseData = {
    status: responseData["status"],
    message: responseData["message"],
  };

  return res;
}

export async function setKeypass(userData: Record<string, any>) {
  const url = `${GOOGLE_SCRIPTS_ENDPOINT}?accion=set_keypass`;

  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();

  const res: ResponseData = {
    status: responseData["status"],
    message: responseData["message"],
  };

  return res;
}

