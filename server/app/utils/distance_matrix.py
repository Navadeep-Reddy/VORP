import requests
import json
import os

ORS_URL = "https://api.openrouteservice.org/v2/matrix/driving-car"
API_KEY = os.getenv('ORS_API_KEY')

def distance_matrix_calc(locations):
    #Summa dummy locations (lon,lat) format
    # locations = [
    #     [80.2707, 13.0827],  # Chennai Central
    #     [80.2442, 13.0604],  # Marina Beach
    #     [80.2101, 13.0067],  # Guindy
    #     [80.2332, 13.0358]   # T Nagar
    # ]


    payload = {
        "locations": locations,
        "metrics": ["distance"],  
        "units": "km"  
    }

    headers = {
        "Authorization": API_KEY,
        "Content-Type": "application/json"
    }

    response = requests.post(ORS_URL, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        data = response.json()
        dist_matrix = data.get("distances", [])
        
        
        print("\nDistance Matrix (kilo meters):")
        for row in dist_matrix:
            print(row)
    else:
        print(f"Error {response.status_code}: {response.text}")

    return dist_matrix





