import cv2
import numpy as np

def detect_fake_photo(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    laplacian_var = cv2.Laplacian(img, cv2.CV_64F).var()
    
    if laplacian_var < 50:  # Umbral para detectar imágenes con poca textura
        print("❌ Foto detectada. Acceso denegado.")
        return False
    else:
        print("✅ Imagen real detectada.")
        return True

# Prueba con una imagen
detect_fake_photo("./imgs/666.jpg")
