import "./Statistique.css";

function Statistique({ Label, Value }) {
  return (
    <p>
      {Value} {Label}
    </p>
  );
}

export default Statistique;
