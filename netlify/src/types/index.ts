export interface UserData {
  id: string;
  nombre: string;
  idKeypass: string;
  password: string;
}

export interface AssistanceData {
  dni: string;
  nombre: string;
  evento: string;
  fecha: string;
  hora: string;
}

export interface ResponseData {
  status: string;
  message: string;
}

export interface VerifyBioRequest {
  idKeypass: string;
}

export interface GetUserDataResponse {
  status: string;
  message?: string;
  content?: {
    dni: string;
    nombre: string;
  };
}

export interface EncryptDataRequest {
  nombre: string;
  dni: string;
}

export interface DecryptDataRequest {
  token: string;
}

