import requests
from settings import GOOGLE_SCRIPTS_ENDPOINT

def register_workers(user_data):
    register_url = GOOGLE_SCRIPTS_ENDPOINT

    headers = {"Content-Type": "application/json"}

    response = requests.post(register_url, json=user_data, headers=headers)
    response_data = response.json()
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)
    
    return response_data

def update_assistance(data):
    update_url = f"{GOOGLE_SCRIPTS_ENDPOINT}?accion=actualizar_asistencias"
    
    headers = {"Content-Type": "application/json"}
    print(data)
    response = requests.post(update_url, json=data, headers=headers)
    
    response_data = response.json()
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)

    return response_data

def get_user_data(data):
    update_url = f"{GOOGLE_SCRIPTS_ENDPOINT}?accion=get_user_data"
    
    headers = {"Content-Type": "application/json"}
    print(data)
    response = requests.post(update_url, json=data, headers=headers)
    
    response_data = response.json()
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)

    return response_data

def set_photo_embedding(data):
    update_url = f"{GOOGLE_SCRIPTS_ENDPOINT}?accion=set_photo_embedding"
    
    headers = {"Content-Type": "application/json"}
    print(data)
    response = requests.post(update_url, json=data, headers=headers)
    
    response_data = response.json()
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)

    return response_data

def set_keypass(data):
    update_url = f"{GOOGLE_SCRIPTS_ENDPOINT}?accion=set_keypass"
    
    headers = {"Content-Type": "application/json"}
    print(data)
    response = requests.post(update_url, json=data, headers=headers)
    
    response_data = response.json()
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)

    return response_data