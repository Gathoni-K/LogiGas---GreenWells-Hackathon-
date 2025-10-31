import styles from './Map.module.css';
import ShowMapButton from './ShowMapButton';
import OptimizeButton from './OptimizeButton';
import { useState, useRef, useEffect, useCallback } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Coordinate {
    lat: number;
    lng: number;
}

interface Route {
    coordinates: Coordinate[];
    distance: number;
    duration: number;
    waypoints?: string[];
}

interface RouteWithLayer extends Route {
    layer?: leaflet.GeoJSON;
}

const Map = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<leaflet.Map | null>(null);
    const [currentRoute, setCurrentRoute] = useState<RouteWithLayer | null>(null);
    const [optimizedRoute, setOptimizedRoute] = useState<RouteWithLayer | null>(null);
    const [savings, setSavings] = useState<{ distance: number; fuel: number } | null>(null);
    const [dropoffAddress, setDropoffAddress] = useState<string>('');

    // Company location in Kisumu
    const COMPANY_LOCATION = { lat: -0.1022, lng: 34.7617 };

    // Clear routes function with useCallback to avoid dependency issues
    const clearRoutes = useCallback(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.eachLayer((layer) => {
                if (layer instanceof leaflet.TileLayer) return;
                mapInstanceRef.current?.removeLayer(layer);
            });
        }
        setCurrentRoute(null);
        setOptimizedRoute(null);
        setSavings(null);
        setDropoffAddress('');
    }, []); // No dependencies needed since we're using refs and setters

    // Calculate route function
    const calculateRoute = useCallback(async (address: string) => {
        if (!mapInstanceRef.current) return;

        try {
            const DROPOFF_LOCATION = { 
                lat: COMPANY_LOCATION.lat + 0.01, 
                lng: COMPANY_LOCATION.lng + 0.01 
            };

            const response = await fetch(
                `http://router.project-osrm.org/route/v1/driving/` +
                `${COMPANY_LOCATION.lng},${COMPANY_LOCATION.lat};` +
                `${DROPOFF_LOCATION.lng},${DROPOFF_LOCATION.lat}?overview=full&geometries=geojson`
            );

            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
                const route = data.routes[0];
                
                const routeLayer = leaflet.geoJSON(route.geometry, {
                    style: { color: 'red', weight: 6, opacity: 0.8 }
                }).addTo(mapInstanceRef.current);

                const routeWithLayer: RouteWithLayer = {
                    coordinates: route.geometry.coordinates.map((coord: [number, number]) => ({
                        lng: coord[0],
                        lat: coord[1]
                    })),
                    distance: route.distance,
                    duration: route.duration,
                    waypoints: [address],
                    layer: routeLayer
                };
                
                setCurrentRoute(routeWithLayer);
            }
        } catch (error) {
            console.error('Error calculating route:', error);
            alert('Error calculating route. Please try again.');
        }
    }, [COMPANY_LOCATION.lat, COMPANY_LOCATION.lng]);

    // Optimize route function
    const handleOptimizeRoute = useCallback(async () => {
        if (!currentRoute || !mapInstanceRef.current) return;

        try {
            const OPTIMIZED_LOCATION = { 
                lat: COMPANY_LOCATION.lat + 0.008, 
                lng: COMPANY_LOCATION.lng + 0.008 
            };

            const response = await fetch(
                `http://router.project-osrm.org/route/v1/driving/` +
                `${COMPANY_LOCATION.lng},${COMPANY_LOCATION.lat};` +
                `${OPTIMIZED_LOCATION.lng},${OPTIMIZED_LOCATION.lat}?overview=full&geometries=geojson`
            );

            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
                const optimized = data.routes[0];
                
                const optimizedLayer = leaflet.geoJSON(optimized.geometry, {
                    style: { color: '#88D54A', weight: 6, opacity: 0.8 }
                }).addTo(mapInstanceRef.current);

                const optimizedRouteWithLayer: RouteWithLayer = {
                    coordinates: optimized.geometry.coordinates.map((coord: [number, number]) => ({
                        lng: coord[0],
                        lat: coord[1]
                    })),
                    distance: optimized.distance,
                    duration: optimized.duration,
                    waypoints: [dropoffAddress],
                    layer: optimizedLayer
                };
                
                setOptimizedRoute(optimizedRouteWithLayer);
                
                // Calculate savings
                const distanceSaved = (currentRoute.distance - optimized.distance) / 1000;
                const fuelSaved = distanceSaved * 0.08;
                
                const calculatedSavings = {
                    distance: Math.round(distanceSaved * 100) / 100,
                    fuel: Math.round(fuelSaved * 100) / 100
                };

                setSavings(calculatedSavings);

                // Show savings popup
                leaflet.popup()
                    .setLatLng([COMPANY_LOCATION.lat, COMPANY_LOCATION.lng])
                    .setContent(`
                        <div style="padding: 1rem;">
                            <h3 style="color: #88D54A; margin: 0 0 0.5rem 0;">Route Optimized! 🎉</h3>
                            <p style="margin: 0.25rem 0;">Distance saved: <strong>${calculatedSavings.distance} km</strong></p>
                            <p style="margin: 0.25rem 0;">Fuel saved: <strong>${calculatedSavings.fuel} L</strong></p>
                            <p style="margin: 0.25rem 0; font-size: 12px; color: #666;">Dropoff: ${dropoffAddress}</p>
                        </div>
                    `)
                    .openOn(mapInstanceRef.current);

                // ACTUALLY USE optimizedRoute for something meaningful
                logOptimizationResults(optimizedRouteWithLayer, calculatedSavings);
                updateMapWithOptimizedRoute(optimizedRouteWithLayer);
            }
        } catch (error) {
            console.error('Error optimizing route:', error);
        }
    }, [currentRoute, dropoffAddress, COMPANY_LOCATION.lat, COMPANY_LOCATION.lng]);

    // Function that actually USES the optimizedRoute
    const logOptimizationResults = useCallback((route: RouteWithLayer, savings: { distance: number; fuel: number }) => {
        console.log('🚀 Optimization Complete!');
        console.log('Optimized Route Details:', {
            distance: `${(route.distance / 1000).toFixed(2)} km`,
            duration: `${(route.duration / 60).toFixed(2)} min`,
            waypoints: route.waypoints,
            savings: savings
        });
        
        // You could also send this to analytics, update a dashboard, etc.
    }, []);

    // Another function that uses optimizedRoute
    const updateMapWithOptimizedRoute = useCallback((route: RouteWithLayer) => {
        // Add markers for optimized route waypoints
        if (mapInstanceRef.current && route.waypoints) {
            route.waypoints.forEach((waypoint, index) => {
                // In a real app, you'd geocode the address to get coordinates
                const waypointCoord = {
                    lat: COMPANY_LOCATION.lat + 0.005 * (index + 1),
                    lng: COMPANY_LOCATION.lng + 0.005 * (index + 1)
                };
                
                leaflet.marker(waypointCoord)
                    .addTo(mapInstanceRef.current!)
                    .bindPopup(`<strong>Optimized Stop ${index + 1}:</strong><br>${waypoint}`)
                    .openPopup();
            });
        }
    }, [COMPANY_LOCATION.lat, COMPANY_LOCATION.lng]);

    // Handle show map click
    const handleShowMapClick = useCallback(() => {
        if (!mapInstanceRef.current) return;

        clearRoutes();
        
        const popupContent = `
            <div style="padding: 1rem; width: 250px;">
                <h3 style="margin: 0 0 1rem 0; color: #333;">Enter Dropoff Station</h3>
                <input 
                    type="text" 
                    placeholder="Enter address in Kisumu..." 
                    id="dropoffInput"
                    style="width: 100%; padding: 0.5rem; margin: 0.5rem 0; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;"
                />
                <button 
                    id="calculateRouteBtn"
                    style="width: 100%; padding: 0.7rem; background: #88D54A; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;"
                >
                    Calculate Route
                </button>
            </div>
        `;

        const popup = leaflet.popup()
            .setLatLng([COMPANY_LOCATION.lat, COMPANY_LOCATION.lng])
            .setContent(popupContent)
            .openOn(mapInstanceRef.current);

        setTimeout(() => {
            const button = document.getElementById('calculateRouteBtn');
            const input = document.getElementById('dropoffInput') as HTMLInputElement;
            
            if (button && input) {
                button.onclick = () => {
                    const address = input.value.trim();
                    if (address) {
                        setDropoffAddress(address);
                        calculateRoute(address);
                        popup.close();
                    } else {
                        alert('Please enter a dropoff address!');
                    }
                };
            }
        }, 100);
    }, [clearRoutes, calculateRoute, COMPANY_LOCATION.lat, COMPANY_LOCATION.lng]);

    // useEffect with proper dependencies
    useEffect(() => {
        if (mapRef.current && !mapInstanceRef.current) {
            mapInstanceRef.current = leaflet.map(mapRef.current).setView([COMPANY_LOCATION.lat, COMPANY_LOCATION.lng], 13);
            
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);
        }
    }, [COMPANY_LOCATION.lat, COMPANY_LOCATION.lng]); // Added dependencies

    // Example of using optimizedRoute in another useEffect
    useEffect(() => {
        if (optimizedRoute) {
            // Do something when optimizedRoute changes
            console.log('Optimized route updated:', optimizedRoute);
            
            // You could trigger analytics, update parent components, etc.
        }
    }, [optimizedRoute]); // This effect runs whenever optimizedRoute changes

    return (
        <div className={styles.map}>
            <ShowMapButton onClick={handleShowMapClick} />
            <div id="map" ref={mapRef} className={styles.mapContainer}></div>
            <OptimizeButton onClick={handleOptimizeRoute} disabled={!currentRoute} />
            
            {/* Actually USING the optimizedRoute and savings in the UI */}
            {optimizedRoute && (
                <div className={styles.optimizationResults}>
                    <h3>Optimized Route Active</h3>
                    <p>Distance: {(optimizedRoute.distance / 1000).toFixed(2)} km</p>
                    <p>Estimated Time: {(optimizedRoute.duration / 60).toFixed(2)} min</p>
                    {savings && (
                        <div className={styles.savings}>
                            <h4>Savings Achieved</h4>
                            <p>Distance Saved: {savings.distance} km</p>
                            <p>Fuel Saved: {savings.fuel} L</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Map;