from app import create_app
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app=create_app()
CORS(app)

app.config['ORS_API_KEY']=os.getenv("ORS_API_KEY")
app.config['GEOPAPIFY_API_KEY']=os.getenv("GEOPAPIFY_API_KEY")



if __name__=='__main__':
    app.run(debug=True,host='0.0.0.0',port=8080)