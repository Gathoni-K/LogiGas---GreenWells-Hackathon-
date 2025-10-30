import styles from './Map.module.css';
import ShowMapButton from './ShowMapButton';
import OptimizeButton from './OptimizeButton';
import { useState, useRef, useEffect } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<leaflet.Map | null>(null);
    const [currentRoute, setCurrentRoute] = useState<any>(null);
    const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
    const [savings, setSavings] = useState<{distance: number, fuel: number} | null>(null);

    // Company location in Kisumu
    const COMPANY_LOCATION = { lat: -0.1022, lng: 34.7617 };

    useEffect(() => {
        if (mapRef.current && !mapInstanceRef.current) {
            mapInstanceRef.current = leaflet.map(mapRef.current).setView([COMPANY_LOCATION.lat, COMPANY_LOCATION.lng], 13);
            
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);
        }
    }, []);

    const handleShowMapClick = () => {
        if (!mapInstanceRef.current) return;

        // Clear existing routes
        clearRoutes();
        
        // Create popup with input
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

        // Add event listener after a small delay to ensure DOM is ready
        setTimeout(() => {
            const button = document.getElementById('calculateRouteBtn');
            const input = document.getElementById('dropoffInput') as HTMLInputElement;
            
            if (button && input) {
                button.onclick = () => {
                    const address = input.value.trim();
                    if (address) {
                        calculateRoute(address);
                        popup.close();
                    } else {
                        alert('Please enter a dropoff address!');
                    }
                };
            }
        }, 100);
    };

    const calculateRoute = async (dropoffAddress: string) => {
        if (!mapInstanceRef.current) return;

        try {
            
            const DROPOFF_LOCATION = { 
                lat: COMPANY_LOCATION.lat + 0.01, 
                lng: COMPANY_LOCATION.lng + 0.01 
            };

            // Call OSRM API for the route
            const response = await fetch(
                `http://router.project-osrm.org/route/v1/driving/` +
                `${COMPANY_LOCATION.lng},${COMPANY_LOCATION.lat};` +
                `${DROPOFF_LOCATION.lng},${DROPOFF_LOCATION.lat}?overview=full&geometries=geojson`
            );

            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
                const route = data.routes[0];
                
                // Draw the route on map (red for default)
                const routeLayer = leaflet.geoJSON(route.geometry, {
                    style: { color: 'red', weight: 6, opacity: 0.8 }
                }).addTo(mapInstanceRef.current);

                setCurrentRoute(routeLayer);
                
                // Store route info for optimization
                setCurrentRoute(route);
            }
        } catch (error) {
            console.error('Error calculating route:', error);
            alert('Error calculating route. Please try again.');
        }
    };

    const handleOptimizeRoute = async () => {
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
                
                // Draw optimized route (green)
                const optimizedLayer = leaflet.geoJSON(optimized.geometry, {
                    style: { color: '#88D54A', weight: 6, opacity: 0.8 }
                }).addTo(mapInstanceRef.current);

                setOptimizedRoute(optimizedLayer);
                
                // Calculate fake savings for demo
                const distanceSaved = (currentRoute.distance - optimized.distance) / 1000; // km
                const fuelSaved = distanceSaved * 0.08; // assuming 8L/100km
                
                setSavings({
                    distance: Math.round(distanceSaved * 100) / 100,
                    fuel: Math.round(fuelSaved * 100) / 100
                });

                // Show savings popup
                leaflet.popup()
                    .setLatLng([COMPANY_LOCATION.lat, COMPANY_LOCATION.lng])
                    .setContent(`
                        <div style="padding: 1rem;">
                            <h3 style="color: #88D54A; margin: 0 0 0.5rem 0;">Route Optimized! 🎉</h3>
                            <p style="margin: 0.25rem 0;">Distance saved: <strong>${Math.round(distanceSaved * 100) / 100} km</strong></p>
                            <p style="margin: 0.25rem 0;">Fuel saved: <strong>${Math.round(fuelSaved * 100) / 100} L</strong></p>
                        </div>
                    `)
                    .openOn(mapInstanceRef.current);
            }
        } catch (error) {
            console.error('Error optimizing route:', error);
        }
    };

    const clearRoutes = () => {
        if (mapInstanceRef.current) {
            // Clear all layers except base tile layer
            mapInstanceRef.current.eachLayer((layer) => {
                if (layer instanceof leaflet.TileLayer) return;
                mapInstanceRef.current?.removeLayer(layer);
            });
        }
        setCurrentRoute(null);
        setOptimizedRoute(null);
        setSavings(null);
    };

    return (
        <div className={styles.map}>
            <ShowMapButton onClick={handleShowMapClick} />
            <div id="map" ref={mapRef} className={styles.mapContainer}></div>
            <OptimizeButton onClick={handleOptimizeRoute} disabled={!currentRoute} />
        </div>
    )
}

export default Map;