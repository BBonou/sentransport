import "./Recherche.css";

function Recherche({ valeur, onChange, count, setCount }) {
  return (
    <div className="recherche">
      <input
        type="text"
        className="recherche-input"
        placeholder="Rechercher une ligne (depart, arrivee)..."
        value={valeur}
        onChange={(e) => {
          onChange(e.target.value);
          setCount(count + 1);
        }}
      />
      <button className="clear-button" onClick={() => onChange("")}>
        Effacer
      </button>
    </div>
  );
}

export default Recherche;
