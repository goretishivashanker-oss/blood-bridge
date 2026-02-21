import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
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

// Custom green donor icon for available donors
const availableIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom grey icon for unavailable donors
const unavailableIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

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
    const center: [number, number] = userLoc ? [userLoc.lat, userLoc.lng] : [19.0760, 72.8777];

    return (
        <div className="w-full h-96 rounded-xl overflow-hidden glass-card mb-8 border border-border mt-6 z-0 relative">
            <MapContainer center={center} zoom={12} className="w-full h-full" style={{ zIndex: 0 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <UpdateMapCenter center={center} />

                {/* User location marker with radius circle */}
                {userLoc && (
                    <>
                        <Circle
                            center={[userLoc.lat, userLoc.lng]}
                            radius={800}
                            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.12, weight: 2 }}
                        />
                        <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
                            <Popup>
                                <strong>📍 You are here</strong><br />
                                <span style={{ fontSize: '11px', color: '#888' }}>{userLoc.lat.toFixed(5)}, {userLoc.lng.toFixed(5)}</span>
                            </Popup>
                        </Marker>
                    </>
                )}

                {/* Donor markers with full details */}
                {donors.map((donor) => {
                    if (!donor.lat || !donor.lng) return null;
                    const markerIcon = donor.available ? availableIcon : unavailableIcon;
                    return (
                        <Marker key={donor.id} position={[donor.lat, donor.lng]} icon={markerIcon}>
                            <Popup minWidth={220}>
                                <div style={{ fontFamily: 'Inter, sans-serif', padding: '4px 2px' }}>
                                    {/* Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <strong style={{ fontSize: '14px' }}>{donor.name}</strong>
                                        <span style={{
                                            fontSize: '11px',
                                            padding: '2px 8px',
                                            borderRadius: '999px',
                                            background: donor.available ? '#16a34a22' : '#71717a22',
                                            color: donor.available ? '#4ade80' : '#a1a1aa',
                                            border: `1px solid ${donor.available ? '#16a34a55' : '#52525b55'}`,
                                            marginLeft: '8px',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {donor.available ? '✅ Available' : '⛔ Unavailable'}
                                        </span>
                                    </div>

                                    {/* Blood type badge */}
                                    <div style={{
                                        display: 'inline-block',
                                        background: '#ef444422',
                                        border: '1px solid #ef444466',
                                        color: '#ef4444',
                                        fontWeight: 700,
                                        fontSize: '16px',
                                        padding: '4px 14px',
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}>
                                        🩸 {donor.bloodType}
                                    </div>

                                    {/* Details grid */}
                                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ color: '#888', paddingBottom: '4px', paddingRight: '8px' }}>📍 City</td>
                                                <td style={{ fontWeight: 600, paddingBottom: '4px' }}>{donor.city}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ color: '#888', paddingBottom: '4px', paddingRight: '8px' }}>🎂 Age</td>
                                                <td style={{ fontWeight: 600, paddingBottom: '4px' }}>{donor.age} yrs</td>
                                            </tr>
                                            <tr>
                                                <td style={{ color: '#888', paddingBottom: '4px', paddingRight: '8px' }}>🕐 Last Donated</td>
                                                <td style={{ fontWeight: 600, paddingBottom: '4px' }}>{donor.lastDonation}</td>
                                            </tr>
                                            {donor.contact && (
                                                <tr>
                                                    <td style={{ color: '#888', paddingRight: '8px' }}>📞 Contact</td>
                                                    <td style={{ fontWeight: 600 }}>
                                                        <a href={`tel:${donor.contact}`} style={{ color: '#ef4444', textDecoration: 'none' }}>
                                                            {donor.contact}
                                                        </a>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                    {/* Call button */}
                                    {donor.available && donor.contact && (
                                        <a
                                            href={`tel:${donor.contact}`}
                                            style={{
                                                display: 'block',
                                                marginTop: '10px',
                                                background: '#ef4444',
                                                color: '#fff',
                                                textAlign: 'center',
                                                padding: '7px',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                textDecoration: 'none'
                                            }}
                                        >
                                            📞 Call Now
                                        </a>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Legend */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(10,10,10,0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '8px 12px',
                zIndex: 1000,
                fontSize: '11px',
                color: '#ccc',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#4ade80' }}>🟢</span> Available donor
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚫</span> Unavailable donor
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#ef4444' }}>🔴</span> Your location
                </div>
            </div>
        </div>
    );
};

export default DonorMap;
