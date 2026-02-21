import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not resolving in Vite correctly
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconRetinaUrl: iconRetina,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom User Pin
const userIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Utility component to dynamically update map center
function UpdateMapCenter({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

interface DonorMapProps {
    donors: any[];
    userLoc: { lat: number, lng: number } | null;
}

const DonorMap: React.FC<DonorMapProps> = ({ donors, userLoc }) => {
    // Default center to Mumbai roughly if no user location is provided
    const center: [number, number] = userLoc ? [userLoc.lat, userLoc.lng] : [19.0760, 72.8777];

    return (
        <div className="w-full h-80 rounded-xl overflow-hidden glass-card mb-8 border border-border mt-6 z-0 relative">
            <MapContainer center={center} zoom={11} className="w-full h-full" style={{ zIndex: 0 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <UpdateMapCenter center={center} />

                {/* Plot actual user location if available */}
                {userLoc && (
                    <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
                        <Popup>
                            <strong>Your Location</strong>
                        </Popup>
                    </Marker>
                )}

                {/* Plot active database donors */}
                {donors.map((donor) => {
                    if (!donor.lat || !donor.lng) return null;
                    return (
                        <Marker key={donor.id} position={[donor.lat, donor.lng]}>
                            <Popup>
                                <div>
                                    <h4 className="font-bold text-sm">{donor.name}</h4>
                                    <p className="text-xs">{donor.bloodType} • {donor.distance}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default DonorMap;
