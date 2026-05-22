import "./App.css";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Recherche from "./Recherche";
import LigneBus from "./LigneBus";
import DetailsLigne from "./DetailLigne";

function App() {
  // 1. ----- Three states

  // Data uploaded from Flask
  const [lignes, setLignes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // Research state variable
  const [recherche, setRecherche] = useState("");

  // Selection state variable
  const [ligneSelectionnee, setLigneSelectionee] = useState(null);

  // Research count
  const [count, setCount] = useState(0);

  // 2. ----- Load data at startup
  useEffect(() => {
    fetch("http://127.0.0.1:5000/lignes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setLignes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Filter the lines according to the typed text
  const lignesFiltrees = lignes.filter(
    (l) =>
      l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
      l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
      l.numero.includes(recherche),
  );

  // Function that loads lines from Flask
  function loadLines() {
    setLoading(true);

    fetch("http://127.0.0.1:5000/lignes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setLignes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }

  // Function called when a line is clicked
  function handleClickLigne(ligne) {
    // if the line is already selected
    // then we deselect it
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionee(null);
    }

    // else we load the details from Flask
    else {
      fetch(`http://127.0.0.1:5000/lignes/${ligne.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors du chargement");
          }
          return response.json();
        })
        .then((data) => {
          // data contains the details returned by Flask
          setLigneSelectionee(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  // Loading screen
  if (loading) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes ...</p>
        </main>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{error}</p>
            <p>Verifiez que le serveur Flask est lance (python api/app.py).</p>
          </div>
        </main>
      </div>
    );
  }

  // Normal screen
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche
          valeur={recherche}
          onChange={setRecherche}
          count={count}
          setCount={setCount}
        />

        <button className="reload-button" onClick={() => loadLines()}>
          Recharger
        </button>

        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? "s" : ""}{" "}
          trouvee{lignesFiltrees.length > 1 ? "s" : ""}
        </p>

        <p>
          {count} recherche{count > 1 ? "s" : ""}
        </p>

        <p className="resultat-recherche">
          {lignesFiltrees.length === 0 ? "Aucune ligne trouvee" : ""}
        </p>

        {lignesFiltrees.map((ligne) => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={
              ligneSelectionnee && ligneSelectionnee.id === ligne.id
            }
            onClick={() => handleClickLigne(ligne)}
          />
        ))}
        {ligneSelectionnee && <DetailsLigne ligne={ligneSelectionnee} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
