import { useEffect, useState } from "react";
import "./ListeIncidents.css"

function ListeIncidents() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/incidents")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des incidents");
                }

                return response.json();
            })
            .then(data => {
                setIncidents(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message());
                setLoading(false);
            });
    }, []);


    return (
        <div className="liste-incidents">
            <h2>Incidents signales</h2>

            {loading && (
                <p className="incident-message">
                    Chargement des incidents...
                </p>
            )}

            {error && (
                <p className="incident-erreur">
                    {error}
                </p>
            )}

            {!loading && incidents.length === 0 && (
                <p className="incident-message">
                    Aucun incident signale.
                </p>
            )}

            <div className="incidents-container">
                {incidents.map(incident => (
                    <div key={incident.id} className="incident-card">
                        <h3>Ligne {incident.ligne}</h3>
                        <p>
                            <strong>Description :</strong>
                            {" "}
                            {incident.description}
                        </p>
                        <p>
                            <strong>Lieu :</strong>
                            {" "}
                            {incident.lieu}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListeIncidents;