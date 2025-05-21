import cv2
from face_detection.blink import detect_blink

def detect_liveness(video_path):
    cap = cv2.VideoCapture(video_path)
    parpadeos = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if detect_blink(frame):
            parpadeos += 1

    cap.release()
    return parpadeos >= 2
