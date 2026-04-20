import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import Statistique from "./Statistique";

function App() {
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <p>
          Bienvenu ! Cette application vous aide a trouver votre ligne de bus a
          Dakar.
        </p>
        <Statistique Label="lignes" Value="10" />
        <Statistique Label="arrêts" Value="150" />
        <Statistique Label="bus" Value="105" />
      </main>
      <Footer />
    </div>
  );
}

export default App;
