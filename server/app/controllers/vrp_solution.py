
from flask import jsonify
from ..utils import vrp_solver,distance_matrix,geocoding
import pandas as pd


def calculate_routes(data,excel_file):

    try:
        if excel_file:
            df=pd.read_excel(excel_file).fillna('')
            address_list = [", ".join(map(str, filter(None, row))) for row in df.itertuples(index=False, name=None)]
            print(address_list)
        

            locations=geocoding.geoapifyCoding(address_list)

        if not excel_file:
            locations = data["locations"]
        
        num_vehicles = data["num_vehicles"]
        depot = data["depot"]
        vehicle_capacities = data["capacities"]
        demands = data["demands"]
        
        
        # Convert locations to a list of lists
        osrm_coords = [[lon, lat] for lon, lat in locations]

        print(osrm_coords)

        dist_matrix=distance_matrix.distance_matrix_calc(osrm_coords)
        print()
        print(dist_matrix)
        data = {
        "distance_matrix": dist_matrix,
        "demands": demands,
        "vehicle_capacities": vehicle_capacities,
        "num_vehicles": num_vehicles,
        "depot": depot
    }
        res=vrp_solver.solve_cvrp(data)
        print(res)

        # OR-Tools response
        response = {
        'status': 'success',
        'objective_value': 5,
        'routes': [
            {'vehicle_id': 0, 'route': [{'node': 0, 'load': 0}, {'node': 1, 'load': 50}, {'node': 0, 'load': 50}], 'distance': 2, 'load': 50},
            {'vehicle_id': 1, 'route': [{'node': 0, 'load': 0}, {'node': 2, 'load': 75}, {'node': 3, 'load': 175}, {'node': 0, 'load': 175}], 'distance': 3, 'load': 175}
        ],
        'total_distance': 5,
        'total_load': 225
    }

    # Transform response into desired format
        formatted_routes = {
            int(route['vehicle_id']): [locations[step['node']]+[step['load']] for step in route['route']]
            for route in res['routes']
        }

        formatted_routes={}
        for route in res['routes']:
            temp_list=[]
            prev_load=0
            for step in route['route'][:-1]:
                temp_list.append(locations[step['node']]+[step['load']-prev_load])
                prev_load=step['load']
            formatted_routes[route['vehicle_id']]=temp_list

        
        print('\n\nFinal Calculated routes')
        print(formatted_routes)

        return {"message": "Success", "calculated_routes": formatted_routes}

    except Exception as e:
        return {"error": str(e)}
    
