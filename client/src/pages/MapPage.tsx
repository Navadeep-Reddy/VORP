// src/pages/MapPage.tsx
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Map from '@/components/Map';
import SavedRoutes, { SavedRoute } from '@/components/SavedRoutes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/context/LocationContext';
import { Slider } from '@/components/ui/slider';

type Vehicle = {
  id: number;
  capacity: number;
};

const MapPage: React.FC = () => {
  // State for map points
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState<number[]>([33]);
  const { Locations, setLocations } = useLocation();

  // State for depot selection (index of the chosen point)
  const [depotIndex, setDepotIndex] = useState<number | null>(null);

  // Sidebar tab state: "points" or "vehicles"
  const [activeTab, setActiveTab] = useState<"points" | "vehicles">("points");

  // State for vehicles details
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleCapacity, setVehicleCapacity] = useState<number>(0);
  const [batchQuantity, setBatchQuantity] = useState<number>(1);

  // For the collapsible saved routes sidebar on the left
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // When a saved route is selected, update the current map points.
  const handleSavedRouteSelect = (route: SavedRoute) => {
    setLocations(route.locations);
    // Optionally, you might want to reset depotIndex if the saved route doesn't specify one.
    setDepotIndex(null);
  };

  // Points tab: Add a new map point.
  const handleAddPoint = (lat: number, lng: number, demand: number) => {
    try {
      const newPoint = { latitude: lat, longitude: lng, capacity: demand };
      const updatedLocations = [...Locations, newPoint];
      setLocations(updatedLocations);
      console.log("Updated Points:", updatedLocations);
    } catch (error) {
      console.error(error);
    }
  };

  // Points tab: Delete a map point.
  const handleDeletePoint = (index: number) => {
    const updatedLocations = Locations.filter((_, i) => i !== index);
    setLocations(updatedLocations);
    // If the deleted point was the depot, reset depotIndex.
    if (depotIndex === index) {
      setDepotIndex(null);
    }
  };

  // Vehicles tab: Add a single vehicle with provided capacity.
  const handleAddVehicle = () => {
    if (vehicleCapacity <= 0) return;
    const newVehicle: Vehicle = {
      id: vehicles.length,
      capacity: vehicleCapacity,
    };
    setVehicles([...vehicles, newVehicle]);
    setVehicleCapacity(0);
  };

  // Vehicles tab: Batch add vehicles with the same capacity.
  const handleBatchAddVehicles = () => {
    if (vehicleCapacity <= 0 || batchQuantity < 1) return;
    const newVehicles = Array.from({ length: batchQuantity }, (_, idx) => ({
      id: vehicles.length + idx,
      capacity: vehicleCapacity,
    }));
    setVehicles([...vehicles, ...newVehicles]);
    setVehicleCapacity(0);
    setBatchQuantity(1);
  };

  // Vehicles tab: Delete a vehicle from the list.
  const handleDeleteVehicle = (id: number) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
  };

  // When "Calculate Routes" is clicked, gather all data and send it to the backend.
  const handleCalculateRoutes = async () => {
    if (Locations.length < 2) {
      alert("Please add at least 2 points.");
      return;
    }
    if (vehicles.length < 1) {
      alert("Please add at least 1 vehicle.");
      return;
    }
    if (depotIndex === null) {
      alert("Please select a depot from your points.");
      return;
    }

    try {
      // Build coordinates array in [longitude, latitude] order
      const coordinates = Locations.map(loc => [loc.longitude, loc.latitude]);

      // Call OpenRouteService Matrix API to get distance matrix
      const orsResponse = await fetch('https://api.openrouteservice.org/v2/matrix/driving-car', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Content-Type': 'application/json',
          'Authorization': '5b3ce3597851110001cf62481d030c79465247dca04d9e7eceebc5f8'
        },
        body: JSON.stringify({
          locations: coordinates,
          metrics: ["distance"],
          units: "km"
        })
      });
      const orsData = await orsResponse.json();
      console.log("OpenRouteService Data:", orsData);

      // Extract the distance matrix (assuming the API returns a "distances" property)
      const distance_matrix = orsData.distances;
      
      // Build demands array: for each point, if it's the depot, demand is 0; otherwise use the point's capacity.
      const demands = Locations.map((point, index) =>
        index === depotIndex ? 0 : point.capacity
      );

      // Build vehicle capacities array
      const vehicle_capacities = vehicles.map(v => v.capacity);

      // Construct the payload for the backend CVRP solver
      const payload = {
        distance_matrix,
        demands,
        vehicle_capacities,
        num_vehicles: vehicles.length,
        depot: depotIndex
      };

      console.log("Payload for CVRP Solver:", payload);

      // Send the payload to the backend /api/solve endpoint
      const solveResponse = await fetch('http://localhost:5000/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const solveResult = await solveResponse.json();
      console.log('Solve result:', solveResult);
    } catch (error) {
      console.error("Error in calculating routes:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Main content container with padding-top to account for the fixed Navbar */}
      <div className="flex flex-grow pt-14">
        {/* Collapsible Saved Routes Sidebar (left) */}
        <div
          className={`transition-all duration-300 border-r border-gray-300 flex flex-col items-center ${sidebarOpen ? "w-64" : "w-16"}`}
        >
          <Button onClick={() => setSidebarOpen(!sidebarOpen)} className="m-2" variant="outline">
            {sidebarOpen ? "<<" : ">>"}
          </Button>
          {sidebarOpen && (
            <div className="w-full p-2">
              <SavedRoutes onSelectRoute={handleSavedRouteSelect} />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-grow">
          <div className="flex flex-grow">
            {/* Map Section */}
            <div className="p-4 flex-grow">
              <h1 className="text-2xl font-semibold py-2">Route Optimizer</h1>
              <Map locations={Locations} />
            </div>

            {/* Right Sidebar for Inputs (Points & Vehicles) */}
            <div className="w-96 p-4 border-l border-gray-300">
              {/* Tab Header */}
              <div className="flex space-x-2 mb-4">
                <Button
                  onClick={() => setActiveTab("points")}
                  className={activeTab === "points" ? "btn-solid bg-LightBlue text-BlackText hover:text-white hover:bg-LightBlue" : "btn-outline  hover:bg-LightBlue"}
                >
                  Points
                </Button>

                <Button
                  onClick={() => setActiveTab("vehicles")}
                  className={activeTab === "vehicles" ? "btn-solid  bg-LightBlue text-BlackText hover:text-white hover:bg-LightBlue" : "btn-outline hover:text-white hover:bg-LightBlue"}
                >
                  Vehicles
                </Button>
              </div>

              {/* Tab Content */}
              {activeTab === "points" && (
                <div className="points-tab">
                  <h2 className="text-2xl font-semibold">Add Points</h2>
                  <div className="flex space-x-2 my-2">
                    <Input
                      placeholder="Latitude"
                      className="w-1/2 bg-secBlue text-priWhite"
                      onChange={(e) => setLatitude(Number(e.target.value))}
                    />
                    <Input
                      placeholder="Longitude"
                      className="w-1/2 bg-secBlue text-priWhite"
                      onChange={(e) => setLongitude(Number(e.target.value))}
                    />
                  </div>
                  <div className="my-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Demand:</span>
                      <span className="text-sm font-medium">{sliderValue[0]}</span>
                    </div>
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                      className="py-2 accent-secBlue"
                    />
                  </div>
                  <Button className="bg-AccYellow text-priWhite my-2" onClick={() => handleAddPoint(latitude, longitude, sliderValue[0])}>
                    Add Point
                  </Button>
                  <div className="mt-4">
                    <h2 className="text-2xl font-semibold">Added Points</h2>
                    <div className="h-64 overflow-y-auto">
                      {Locations.length === 0 ? (
                        <p className="text-center text-gray-600">No points added yet</p>
                      ) : (
                        Locations.map((item, index) => (
                          <div key={index} className="flex gap-2 items-center py-1 mb-2">
                            <div className="border p-2 w-full rounded-md bg-white">
                              <div className="font-medium">
                                Point {index + 1} {depotIndex === index && <span className="text-secBlue font-bold">(Depot)</span>}
                              </div>
                              <div className="text-sm">
                                Lat: {item.latitude.toFixed(4)}, Lng: {item.longitude.toFixed(4)}
                              </div>
                              <div className="text-xs text-gray-500">Demand: {item.capacity}</div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button className="bg-LightBlue text-BlackText hover:text-WhiteText" onClick={() => setDepotIndex(index)}>
                                Set as Depot
                              </Button>
                              <Button className="bg-red-500 text-white" onClick={() => handleDeletePoint(index)}>
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "vehicles" && (
                <div className="vehicles-tab">
                  <h2 className="text-2xl font-semibold">Vehicle Details</h2>
                  <div className="flex flex-col space-y-2 my-2">
                    <Input
                      placeholder="Vehicle Capacity"
                      onChange={(e) => setVehicleCapacity(Number(e.target.value))}
                      className="bg-secBlue text-priWhite"
                    />
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Quantity"
                        onChange={(e) => setBatchQuantity(Number(e.target.value))}
                        className="w-1/2 bg-secBlue text-priWhite"
                      />
                      <Button className="bg-AccYellow text-priWhite" onClick={handleBatchAddVehicles}>
                        Add Multiple
                      </Button>
                    </div>
                    <Button className="bg-AccYellow text-priWhite" onClick={handleAddVehicle}>
                      Add Single
                    </Button>
                  </div>
                  <div className="mt-4">
                    <h2 className="text-2xl font-semibold">Added Vehicles</h2>
                    <div className="h-64 overflow-y-auto">
                      {vehicles.length === 0 ? (
                        <p className="text-center text-gray-600">No vehicles added yet</p>
                      ) : (
                        vehicles.map((vehicle) => (
                          <div key={vehicle.id} className="flex gap-2 items-center py-1 mb-2">
                            <div className="border p-2 w-full rounded-md bg-white">
                              <div className="font-medium">Vehicle {vehicle.id + 1}</div>
                              <div className="text-sm">Capacity: {vehicle.capacity}</div>
                            </div>
                            <Button className="bg-red-500 text-white" onClick={() => handleDeleteVehicle(vehicle.id)}>
                              Delete
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Calculate Routes Button: Visible if at least 2 points and at least 1 vehicle */}
              {(Locations.length >= 2 && vehicles.length >= 1) && (
                <div className="mt-4">
                  <Button className="bg-green-500 text-white" onClick={handleCalculateRoutes}>
                    Calculate Routes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
