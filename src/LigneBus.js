import "./LigneBus.css";

function LigneBus({ numero, depart, arrivee, arrets }) {
  return (
    <div className="ligne-bus">
      <div className="ligne-numero">{numero}</div>
      <div className="ligne-info">
        <span className="ligne-trajet">
          {depart} &rarr; {arrivee}
        </span>
        <pan className="ligne-arret">{arrets} arrets</pan>
      </div>
    </div>
  );
}

export default LigneBus;
