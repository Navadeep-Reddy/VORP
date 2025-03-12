# VORP - Vehicle Optimal Route Planner

VORP is an advanced vehicle routing optimization platform designed to solve complex vehicle routing problems (VRP) efficiently. The application combines powerful algorithms with an intuitive interface to help businesses optimize delivery routes, reduce operational costs, and improve logistics efficiency.

![VORP Homepage](https://github.com/Navadeep-Reddy/ProjectScreenshots-/blob/main/VORPScreenShots/Screenshot%20From%202025-03-12%2018-54-39.png)  
<p align="center">
  Modern interface with interactive route optimization
</p>

![Route Calculation](https://github.com/Navadeep-Reddy/ProjectScreenshots-/blob/main/VORPScreenShots/Screenshot%20From%202025-03-12%2019-12-41.png)  
<p align="center">
  Interactive route planning with capacity constraints
</p>

![Optimized Routes](https://github.com/Navadeep-Reddy/ProjectScreenshots-/blob/main/VORPScreenShots/Screenshot%20From%202025-03-12%20at%2019.15.05.png)  
<p align="center">
  Visualized optimized routes with detailed metrics
</p>

## Features
- **Capacitated Vehicle Routing Problem (CVRP) Solver**: Optimizes routes considering vehicle capacities and delivery demands
- **Interactive Map Interface**: Visualize locations, routes, and optimization results in real-time
- **User Authentication**: Secure login with Google OAuth via Supabase
- **Save & Load Routes**: Store and retrieve route configurations for future use
- **Multi-vehicle Support**: Configure different vehicle types with varying capacities
- **Depot Selection**: Designate any location as the central depot
- **Real-time Distance Calculation**: Uses OpenRouteService API for accurate travel distances

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Leaflet Maps
- **Backend**: Flask, OR-Tools (Google's Operations Research tools)
- **APIs**: OpenRouteService (distance matrix), Geoapify (geocoding)
- **Authentication & Database**: Supabase
- **State Management**: React Context API

## Architecture
The project follows a client-server architecture:
- **Client**: React-based SPA with responsive UI and interactive map components
- **Server**: Flask application with modular routing and controller layers
- **Algorithms**: Implements Google's OR-Tools for solving complex routing problems

## Steps to Run

### Server Setup

1. Navigate to the server directory:
```bash
cd VORP/server
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the Flask server:
```bash
python run.py
```
The server will run on http://localhost:8080

### Client Setup

1. Navigate to the client directory:
```bash
cd VORP/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The client will be available at http://localhost:5173

## How It Works

1. **Input Data**: Add delivery locations, specify demands, and define vehicle capacities
2. **Set Constraints**: Select a depot and configure vehicle fleet details
3. **Calculate Routes**: The system determines optimal routes using advanced OR-Tools algorithms
4. **Visualize Results**: Review optimized routes on the interactive map
5. **Save & Share**: Store routes for future use or share with your team

## API Endpoints

### Route Optimization
- `POST /api/v1/calculate_routes`: Calculates optimal routes based on locations, vehicle capacities, and demands

## Future Improvements
- Time window constraints for deliveries
- Driver break scheduling
- Mobile application for drivers
- Real-time traffic integration
- Multi-depot support

## License
This project is licensed under the MIT License - see the LICENSE file for details.


