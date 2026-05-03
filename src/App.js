import "./App.css";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Recherche from "./Recherche";
import LigneBus from "./LigneBus";
import DetailsLigne from "./DetailLigne";

function App() {
  // Research state variable
  const [recherche, setRecherche] = useState("");

  // Selection state variable
  const [ligneSelectionnee, setLigneSelectionee] = useState(null);

  const lignes = [
    {
      id: 1,
      numero: " 1 ",
      depart: " Parcelles Assainies ",
      arrivee: " Plateau ",
      arrets: 14,
      listeArrets: [
        " Parcelles U14 ",
        " Parcelles U10 ",
        " Camberene ",
        " Patte d'Oie ",
        " Grand Dakar ",
        " Colobane ",
        " Ponty ",
        " Plateau ",
      ],
    },
    {
      id: 2,
      numero: " 7 ",
      depart: " Guediawaye ",
      arrivee: " Place Obe ",
      arrets: 18,
      listeArrets: [
        " Guediawaye ",
        " Pikine ",
        " Thiaroye ",
        " Keur Massar ",
        " Grand Yoff ",
        " Parcelles ",
        " Liberte 6 ",
        " Place Obe ",
      ],
    },
    {
      id: 3,
      numero: " 15 ",
      depart: " Pikine ",
      arrivee: " Medina ",
      arrets: 12,
      listeArrets: [
        " Pikine Centre ",
        " Thiaroye Gare ",
        " Hann ",
        " Colobane ",
        " Fass ",
        " Medina ",
      ],
    },
    {
      id: 4,
      numero: " 23 ",
      depart: " Ouakam ",
      arrivee: " Grand Dakar ",
      arrets: 10,
      listeArrets: [
        " Ouakam Village ",
        " Mermoz ",
        " Fann ",
        " Point E ",
        " Liberte 5 ",
        " Grand Dakar ",
      ],
    },
    {
      id: 5,
      numero: " 8 ",
      depart: " Almadies ",
      arrivee: " Colobane ",
      arrets: 16,
      listeArrets: [
        " Almadies ",
        " Ngor ",
        " Yoff ",
        " Ouest Foire ",
        " Liberte 6 ",
        " Colobane ",
      ],
    },
    {
      id: 6,
      numero: " 12 ",
      depart: " Yoff ",
      arrivee: " Sandaga ",
      arrets: 11,
      listeArrets: [
        " Yoff Village ",
        " Aeroport LSS ",
        " Parcelles U17 ",
        " Grand Yoff ",
        " HLM ",
        " Sandaga ",
      ],
    },
  ];

  // Filter the lines according to the typed text
  const lignesFiltrees = lignes.filter(
    (l) =>
      l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
      l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
      l.numero.includes(recherche),
  );

  // Clic management function
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionee(null); // re-click = unselect
    } else {
      setLigneSelectionee(ligne); // First click = select
    }
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche valeur={recherche} onChange={setRecherche} />

        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? "s" : ""}{" "}
          trouvee{lignesFiltrees.length > 1 ? "s" : ""}
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
