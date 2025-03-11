import requests
import time
import os 

#API_KEY = #os.getenv('GEOPAPIFY_API_KEY')
API_KEY="483abfe40c7c4393b51a7117d14f1235"
BASE_URL = "https://api.geoapify.com/v1/batch/geocode/search"

def geoapifyCoding(data):

    # data =  [
    #     "Chromepet, Chennai, 600044, India",
    #     "Marina Beach, Chennai, 600001, India",
    #     "MG Road, Bengaluru, 560001, India",
    #     "Connaught Place, New Delhi, 110001, India",
    #     "Marine Drive, Mumbai, 400020, India"
    # ]

    #SLEEP_TIME=len(data)//2

    try:
        response = requests.post(f"{BASE_URL}?apiKey={API_KEY}", json=data)
        response.raise_for_status()  # Raise an error if the request failed
        batch_id = response.json().get("id")
        
        if not batch_id:
            raise ValueError("Batch ID not received. API response:", response.json())

        print(f"Batch ID: {batch_id}")

    except requests.RequestException as e:
        print(f"Error sending batch request: {e}")
        exit()

    # Polling for results with a delay
    poll_url = f"{BASE_URL}?id={batch_id}&apiKey={API_KEY}"

    while True:
        try:
            res = requests.get(poll_url)
            statusCode=res.status_code
            #res.raise_for_status()
            result_data = res.json()

            if statusCode== 200:
                result_data=res.json()
                break  

            print("Waiting for results...")
            time.sleep(2)  

        except requests.RequestException as e:
            print(f"Error fetching results: {e}")
            time.sleep(2)

    #print(result_data)

    if not result_data:
        print("No results found.")
        exit()

    lonLatArr=[]
    for item in result_data:
        lon = item['lon']
        lat = item['lat']
        lonLatArr.append([lon,lat])
        #print(f"Longitude: {lon}, Latitude: {lat}")

    print(lonLatArr)
    return lonLatArr

