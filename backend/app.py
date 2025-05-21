from typing import Any
import cv2
from concurrent.futures import ThreadPoolExecutor
import os
from face_detection import embeddings, liveness, extract_best_frame
import uuid
from fastapi import FastAPI, File, Form, UploadFile, status, HTTPException, Header
import shutil
from settings import ChromaDBSetup
from database.manager import add_embedding_to_collection, search_embedding
from fastapi.responses import JSONResponse
from google_scripts.manager import (
    register_workers,
    update_assistance,
    get_user_data,
    set_photo_embedding,
    set_keypass,
)
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Optional
from settings import JWT_SECRET_KEY, JWT_ALGORITHM, ALLOWED_ORIGINS
import jwt
import pytz
from datetime import datetime, timedelta

app = FastAPI()
base_dir = os.path.dirname(os.path.abspath(__file__))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    BaseHTTPMiddleware, dispatch=lambda request, call_next: call_next(request)
)


@app.post("/v1/register")
def register_endpoint(
    nombre: str = Form(...),
    dni: str = Form(...),
    id_key_pass: Optional[str] = File(None),
    foto: Optional[UploadFile] = File(None),
):
    tmp_path = os.path.join(base_dir, 'tmp')
    os.makedirs(tmp_path, exist_ok=True)
    
    rand = uuid.uuid4().hex

    try:
        user_data = {"id": dni, "nombre": nombre, "idKeypass": id_key_pass or ""}
        response_data = register_workers(user_data=user_data)

        if response_data["status"] == "success":
            if foto:
                photo_path = f"./tmp/{rand}.jpg"
                photo_path = os.path.join(base_dir, photo_path)
                
                with open(photo_path, "wb") as buffer:
                    shutil.copyfileobj(foto.file, buffer)

                embedding = embeddings.get_face_embedding(photo_path)
                os.remove(photo_path)
                if embedding is None:
                    return JSONResponse(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        content={
                            "status": "error",
                            "message": "No se pudo generar el embedding de la foto",
                        },
                    )
                collection = ChromaDBSetup.get_frames_collection()
                add_embedding_to_collection(collection, embedding, user_data, rand)
                set_photo_embedding({"idEmbedding": rand, "userDNI": dni})

                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={
                        "status": "success",
                        "message": "Usuario registrado exitosamente",
                    },
                )
            else:
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={
                        "status": "success",
                        "message": "Usuario registrado exitosamente",
                    },
                )
        else:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"status": "error", "message": response_data["message"]},
            )

    except Exception as e:
        import traceback

        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": "error",
                "message": "Hubo un error, contacte con el administrador.",
            },
        )


@app.post("/v1/verify")
def verify_endpoint(video: UploadFile = File(...)):
    tmp_path = os.path.join(base_dir, 'tmp')
    os.makedirs(tmp_path, exist_ok=True)
    
    try:
        rand = uuid.uuid4().hex

        temp_video_path = f"./tmp/{rand}-video.mp4"
        temp_video_path = os.path.join(base_dir, temp_video_path)
        
        temp_frame_path = f"./tmp/{rand}-frame.jpg"
        temp_frame_path = os.path.join(base_dir, temp_frame_path)
        
        with open(temp_video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)

        with ThreadPoolExecutor() as executor:
            future_liveness = executor.submit(liveness.detect_liveness, temp_video_path)
            future_best_frame = executor.submit(
                extract_best_frame.extract_best_frame, temp_video_path
            )

            is_real = future_liveness.result()
            frame = future_best_frame.result()

        if not is_real:
            os.remove(temp_video_path)
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"status": "error", "message": "Liveness check failed"},
            )

        if frame is None:
            os.remove(temp_video_path)
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "status": "error",
                    "message": "No se pudo extraer un frame válido",
                },
            )
        cv2.imwrite(temp_frame_path, frame)

        embedding = embeddings.get_face_embedding(temp_frame_path)

        collection = ChromaDBSetup.get_frames_collection()
        similar_embeddings = search_embedding(
            collection=collection, query_embedding=embedding, n_results=1
        )

        os.remove(temp_video_path)
        os.remove(temp_frame_path)

        if similar_embeddings:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"status": "success", "message": similar_embeddings[0][1]},
            )
        else:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"status": "success", "message": []},
            )

    except Exception as e:
        import traceback

        traceback.print_exc()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": "error",
                "message": "Hubo un error, contacte con el administrador.",
            },
        )


class BioRegisterRequest(BaseModel):
    idKeypass: str


@app.post("/v1/verify-bio")
def verify_bio(request: BioRegisterRequest):
    try:
        data = request.model_dump()
        response_data = get_user_data(data)

        if response_data["status"] == "success":
            print("Data obtenida:", response_data["content"])

            content = {
                "status": "success",
                "content": {
                    "dni": response_data["content"]["dni"],
                    "nombre": response_data["content"]["nombre"],
                },
            }
            print("Contenido de la respuesta:", content)
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=content,
            )
        else:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"status": "error", "message": response_data["message"]},
            )

    except Exception as e:
        import traceback

        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": "error",
                "message": "Hubo un error, contacte con el administrador.",
            },
        )


class AssistanceUpdateRequest(BaseModel):
    dni: str
    nombre: str
    evento: str
    fecha: str
    hora: str


@app.post("/v1/update-assistance")
def update_assistance_endpoint(request: AssistanceUpdateRequest):
    try:
        data = request.model_dump()
        response_data = update_assistance(data)

        if response_data["status"] == "success":
            print("Registro exitoso:", response_data["message"])
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": "success",
                    "message": f"Asistencia actualizada: {request.evento} a las {request.hora}",
                },
            )

        else:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"status": "error", "message": response_data["message"]},
            )
    except Exception as e:
        import traceback

        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": "error",
                "message": "Hubo un error, contacte con el administrador.",
            },
        )


class EncryptDataRequest(BaseModel):
    nombre: str
    dni: str


@app.post("/v1/encrypt-data")
def encrypt_data(request: EncryptDataRequest):
    try:
        LIMA_TZ = pytz.timezone("America/Lima")

        payload = {
            "nombre": request.nombre,
            "dni": request.dni,
            "exp": datetime.now(LIMA_TZ) + timedelta(minutes=10),
        }

        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": "success",
                "token": token,
            },
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": "error",
                "message": f"Hubo un error {str(e)}",
            },
        )


class DecryptDataRequest(BaseModel):
    token: str

@app.post("/v1/decrypt-data")
def decrypt_data(request: DecryptDataRequest):
    try:
        decoded = jwt.decode(request.token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        print(request.token)
        print(decoded)
        if "exp" in decoded:
            del decoded["exp"]

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": "success",
                "content": decoded,
            },
        )
    except jwt.ExpiredSignatureError:
        print("expirado")
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "status": "success",
                "content": {"message": "El token ha expirado."},
            },
        )
    except jwt.InvalidTokenError:
        print("invalido")
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "status": "success",
                "content": {"message": "El token es inválido."},
            },
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": "error",
                "content": {"message": f"Hubo un error {str(e)}"},
            },
        )


@app.get("/v1/auth")
def auth(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Falta el header de autorización")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Esquema inválido")
    except ValueError:
        raise HTTPException(status_code=401, detail="Formato de autorización incorrecto")

    try:
        decoded = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

    return JSONResponse(content={"message": "Token válido", "content": decoded}, status_code=200)
    
@app.get("/")
def hello_world():
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "message": "Hello World"},
    )
