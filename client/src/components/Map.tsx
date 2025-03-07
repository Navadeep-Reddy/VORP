import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import './map.css';

declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
  }
}

type Location = {
  latitude: number;
  longitude: number;
  capacity: number;
};

interface MapProps {
  locations: Location[];
  calculatedRoutes?: {[key: string]: [number, number][]};
  depotIndex: number | null;
  onMapClick?: (lat: number, lng: number) => void;
}

// Handle map clicks and other events
const MapEvents = ({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
};

// Add markers and routing to the map
const MapContent = ({ locations, calculatedRoutes }: MapProps) => {
  const map = useMap();

  // Create markers for each location
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = new L.LatLngBounds([]);
      locations.forEach(loc => {
        bounds.extend([loc.latitude, loc.longitude]);
      });
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  // Create routes when calculatedRoutes changes
  useEffect(() => {
    // Clear previous routing controls
    map.eachLayer((layer) => {
      if (layer instanceof L.Routing.control) {
        map.removeLayer(layer);
      }
    });

    if (!calculatedRoutes) return;

    // Define different colors for each route
    const colors = [
      '#FF5733', // Orange-Red
      '#33FF57', // Green
      '#3357FF', // Blue
      '#F033FF', // Purple
      '#FF33A1', // Pink
      '#33FFF6', // Cyan
      '#FFBD33', // Gold
      '#8833FF', // Indigo
      '#FF3333', // Red
      '#33FFBD'  // Teal
    ];

    // Add each route with a different color
    Object.keys(calculatedRoutes).forEach((vehicleIndex, index) => {
      const routePoints = calculatedRoutes[vehicleIndex];
      const waypoints = routePoints.map(point => L.latLng(point[1], point[0]));
      
      const routingControl = L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
          styles: [{ color: colors[index % colors.length], weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 100
        },
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        showAlternatives: false,
        createMarker: function() { return null; } // Don't create markers for waypoints
      }).addTo(map);

      // Hide the itinerary
      if (routingControl && routingControl._container) {
        routingControl._container.style.display = 'none';
      }
    });

  }, [calculatedRoutes, map]);

  return null;
};

const Map: React.FC<MapProps> = ({ locations, calculatedRoutes, depotIndex, onMapClick }) => {
  // Create custom icons for regular points and depot
  const regularIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const depotIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  // Precomputed center for better performance
  const defaultCenter: [number, number] = [12.921885, 80.084661];
  
  return (
    <div className="h-full w-full">
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="h-full w-full rounded-2xl"
        preferCanvas={true} // Use canvas for better performance
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, index) => (
          <Marker 
            key={index} 
            position={[loc.latitude, loc.longitude]} 
            icon={index === depotIndex ? depotIcon : regularIcon}
          >
            <Popup>
              <div>
                <strong>{index === depotIndex ? "Depot" : `Point ${index + 1}`}</strong>
                <br />
                Capacity: {loc.capacity}
              </div>
            </Popup>
          </Marker>
        ))}
        <MapContent locations={locations} calculatedRoutes={calculatedRoutes} depotIndex={depotIndex} />
        <MapEvents onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
};

export default Map;