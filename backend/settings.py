import os
import chromadb
from chromadb.api.models.Collection import Collection
import environ

env = environ.Env()
environ.Env.read_env()

base_dir = os.path.dirname(os.path.abspath(__file__))

filename = os.path.join(base_dir, "../database/collections/frames_collection")
tmp_path = os.path.join(base_dir, 'tmp')

os.makedirs(tmp_path, exist_ok=True)
os.makedirs(filename, exist_ok=True)

class ChromaDBSetup:
    _collections = {}

    @classmethod
    def _get_chroma_client(cls):
        """Inicializa el cliente ChromaDB solo cuando se necesita."""
        if not hasattr(cls, "_chroma_client"):
            cls._chroma_client = chromadb.PersistentClient(
                path=os.path.abspath(filename)
            )
        return cls._chroma_client

    @classmethod
    def _get_collection(cls, collection_name: str) -> Collection:
        """Obtiene una colección de ChromaDB con inicialización diferida.
        Si la colección no existe, la crea automáticamente."""
        if collection_name not in cls._collections:
            # Si la colección no existe, la creamos
            try:
                cls._collections[collection_name] = (
                    cls._get_chroma_client().get_collection(collection_name)
                )
            except Exception as e:
                print(f"Error obteniendo la colección {collection_name}: {e}")
                # Si no existe, creamos la colección con la métrica de coseno
                cls._collections[
                    collection_name
                ] = cls._get_chroma_client().create_collection(
                    collection_name,
                    metadata={"hnsw:space": "cosine", "hnsw:search_ef": 100},
                )
        return cls._collections[collection_name]

    @classmethod
    def get_frames_collection(cls) -> Collection:
        return cls._get_collection("frames_collection")

JWT_SECRET_KEY: str = env("JWT_SECRET_KEY")
JWT_ALGORITHM: str = env("JWT_ALGORITHM") or "HS256"
ALLOWED_ORIGINS: list[str] = env("ALLOWED_ORIGINS").split(',') if env("ALLOWED_ORIGINS") else ["*"]
GOOGLE_SCRIPTS_ENDPOINT: str = env("GOOGLE_SCRIPTS_ENDPOINT")