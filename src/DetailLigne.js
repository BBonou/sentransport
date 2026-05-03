import "./DetailLigne.css";

function DetailsLigne({ ligne }) {
  return (
    <div className="detail-ligne">
      <h3 className="detail-titre">
        Ligne {ligne.numero} : {ligne.depart} &arr; {ligne.arrivee}
      </h3>
      <p className="detail-info">{ligne.arrets} arrets sur ce trajet</p>
      <div className="detail-arrets">
        <h4>Arrets principaux :</h4>
        <ul className="detail-liste">
          {ligne.listeArrets.map((arret, index) => (
            <li key={index} className="detail-arret">
              <span className="arret-numero">{index + 1}</span>
              <span className="arret-nom">{arret}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DetailsLigne;
