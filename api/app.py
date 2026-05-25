import json

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the data from the JSON file
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

with open("arrets.json", "r") as f:
    arrets = json.load(f)

@app.route("/")
def acceuil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>", "/arrets", "/stats", "/lignes/recherche?q=<nom>"]
    })

@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

# ========== Exercises additions ==========

# Exercise 1
@app.route("/arrets")
def get_arrets():
    #allStops = set()

    #for ligne in lignes:
        #allStops.update(ligne["listeArrets"])

    #return jsonify(list(allStops))
    return jsonify(arrets)

# Exercise 2
@app.route("/stats")
def get_stats():
    numLines = len(lignes)
    totalStops = sum(ligne["arrets"] for ligne in lignes)

    mostStopsLine = max(
        lignes,
        key=lambda ligne : ligne["arrets"]
    )

    return jsonify({
        "nombre_total_lignes": numLines,
        "nombre_total_arretts": totalStops,
        "ligne_avec_plus_arrets": mostStopsLine["numero"],
    })

# Exercise 3
@app.route("/lignes/recherche")
def rechercher_ligne():
    q = request.args.get("q", "").lower()

    results = [
        ligne for ligne in lignes
        if q in ligne["depart"].lower()
        or q in ligne["arrivee"].lower()
    ]

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, port=5000)