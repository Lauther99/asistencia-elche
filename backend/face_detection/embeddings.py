import torch
from PIL import Image
from facenet_pytorch import MTCNN, InceptionResnetV1
from scipy.spatial.distance import cosine

mtcnn = MTCNN(keep_all=False)
model = InceptionResnetV1(pretrained='vggface2').eval()

def get_face_embedding(image_path):
    img = Image.open(image_path).convert("RGB")

    face = mtcnn(img)

    if face is None:
        print("No se detectó ningún rostro.")
        return None

    face = face.unsqueeze(0)

    with torch.no_grad():
        embedding = model(face)

    return embedding.numpy().flatten()

def compare_faces(embedding1, embedding2, threshold=0.5):
    distance = cosine(embedding1, embedding2)
    print(distance)
    return distance < threshold


# print(len(get_face_embedding(r"C:\\Users\\lauth\\OneDrive\\Desktop\\r\\backend\\imgs\\1.png")))