import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"
import "./Carte.css"

// Fix Leaflet icons (webpack bug)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Special icon for the nearest stop
const nearestIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Calculate the distance between 2 GPS points (km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Center position button
function RecenterMap({position}) {
    const map = useMap();

    useEffect(() => {
        function handleCenter() {
            if (position) {
                map.setView(position, 15);
            }
        }

        window.addEventListener("center-user-position", handleCenter);

        return () => {
            window.removeEventListener("center-user-position", handleCenter);
        };
    }, [position, map]);
}

function Carte() {
    const [arrets, setArrets] = useState([]);
    const [positionUtilisateur, setPositionUtilisateur] = useState(null);
    const [arretsProches, setArretProches] = useState([]);
    const DAKAR = [14.6928, -17.4467];

    // Load stops from Flask
    useEffect(() => {
        fetch("http://127.0.0.1:5000/arrets")
            .then(r => r.json())
            .then(data => setArrets(data))
            .catch(err => console.error("Erreur arrets: ", err));
    }, []);

    // Geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setPositionUtilisateur([
                    position.coords.latitude,
                    position.coords.longitude,
                ]);
            },
                () => console.log("Geolocation refusee")
            );
        }
    }, []);

    // Find the 3 nearest stops
    useEffect(() => {
        if (positionUtilisateur && arrets.length > 0) {
            const arretsAvecDistance = arrets.map(a => ({
                ...a,
                distance: calculateDistance(
                    positionUtilisateur[0],
                    positionUtilisateur[1],
                    a.lat, a.lon
                ),
            }));

            const proches = arretsAvecDistance
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 3);
            setArretProches(proches);
        }
    }, [positionUtilisateur, arrets]);

    return (
        <div className="carte-container">
            <h2 className="carte-titre">Carte des arrets</h2>
            {
                arretsProches.length > 0 && (
                    <div className="arret-proche">
                        <h3>3 arrets les plus procjes :</h3>
                        <ul>
                            {arretsProches.map((a, index) => (
                                <li key={a.id}>
                                    {index + 1}. <strong>{a.nom}</strong>
                                    {" "}- {a.distance.toFixed(1)} km
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
            <button className="btn-center" onClick={() => {const event = new CustomEvent("center-user-position"); window.dispatchEvent(event);}}>Centrer sur ma position</button>
            <MapContainer center={DAKAR} zoom={13} className="carte">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                />
                <RecenterMap position={positionUtilisateur} />
                {arrets.map(a => (
                    <Marker key={a.id} position={[a.lat, a.lon]} icon={arretsProches.some(ap => ap.id == a.id) ? nearestIcon : new L.Icon.Default()}>
                        <Popup>
                            <strong>{a.nom}</strong><br />
                            Lignes : {a.lignes.join(", ")}
                        </Popup>
                    </Marker>
                ))}
                {positionUtilisateur && (
                    <Marker position={positionUtilisateur}>
                        <Popup>Vous etes ici</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}

export default Carte;