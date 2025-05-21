import cv2
import dlib

detector = dlib.get_frontal_face_detector()

def extract_best_frame(video_path):
    cap = cv2.VideoCapture(video_path)
    best_frame = None
    max_faces = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)  # Aquí usamos el detector correctamente

        if len(faces) > max_faces:
            max_faces = len(faces)
            best_frame = frame

    cap.release()
    return best_frame