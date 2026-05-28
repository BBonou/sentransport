import { useState, useEffect } from "react";
import "./Meteo.css"

function Meteo() {
    const [meteo, setMeteo] = useState(null);
    const [previsions, setPrevisions] = useState([]);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        const API_KEY = process.env.REACT_APP_OWM_KEY;
        if (!API_KEY) {
            setErreur("Cle API manquante (.env)");
            return;
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Dakar&appid=${API_KEY}&units=metric&lang=fr`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Dakar&appid=${API_KEY}&units=metric&lang=fr`;

        fetch (url)
            .then(r => {
                if (!r.ok) throw new Error("Erreur : " + r.status);
                return r.json();
            })
            .then(data => {
                setMeteo({
                    temperature: Math.round(data.main.temp),
                    description: data.weather[0].description,
                    condition: data.weather[0].main,
                    humidite: data.main.humidity,
                    icone: data.weather[0].icon,
                });
            })
            .catch(err => setErreur(err.message));

        // Exercise 2 Lab6
        fetch(forecastUrl)
            .then(r => {
                if (!r.ok) throw new Error("Erreur previsions : " + r.status);
                return r.json();
            })
            .then(data => {
                const midiForecasts = data.list
                    .filter(item => item.dt_txt.includes("12:00:00"))
                    .slice(0, 3)
                    .map(item => ({
                        date: item.dt_txt.split(" ")[0],
                        temperature: Math.round(item.main.temp),
                        description: item.weather[0].description,
                        icone: item.weather[0].icon,
                    }));

                setPrevisions(midiForecasts);
            })
            .catch(err => console.error(err));
    }, []);

    function getAlerte(condition) {
        if (condition === "Rain" || condition === "Drizzle") {
            return {
                message: "Plue detectee - risque de retards",
                classe: "alerte-pluie"
            };
        }
        if (condition === "Thunderstorm") {
            return {
                message: "Orage en cours - soyez prudents",
                classe: "alerte-orage"
            };
        }
        return null;
    }

    if (erreur) {
        return (
            <div className="meteo meteo-erreur">
                <p>Meteo indisponible</p>
                <p className="meteo-detail">{erreur}</p>
            </div>
        );
    }

    if (!meteo) {
        return <div className="meteo">Chargement meteo...</div>;
    }

    const alerte = getAlerte(meteo.condition);

    return (
        <div className="meteo">
            <div className="meteo-info">
                <img
                    src={`https://openweathermap.org/img/wn/${meteo.icone}@2x.png`}
                    alt={meteo.description}
                    className="meteo-icone"
                />
                <div>
                    <span className="meteo-temp">
                        {meteo.temperature}&deg;C
                    </span>
                    <span className="meteo-desc">
                        {meteo.description}
                    </span>
                </div>
                <span className="meteo-humidite">
                    Humidite : {meteo.humidite}%
                </span>
            </div>
            <div className="meteo-previsions">
                <h3>Previsions sur 3 jours</h3>

                <div className="previsions-grid">
                    {previsions.map((jour, index) => (
                        <div key={index} className="prevision-card">
                            <p>{jour.date}</p>

                            <img
                                src={`https://openweathermap.org/img/wn/${jour.icone}.png`}
                                alt={jour.description}
                            />

                            <p>{jour.temperature}&deg;C</p>
                            <p>{jour.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            {alerte && (
                <div className={`meteo-alerte ${alerte.classe}`}>
                    {alerte.message}
                </div>
            )}
        </div>
    );
}

export default Meteo;