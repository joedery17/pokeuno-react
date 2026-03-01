import { useEffect, useState } from "react";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const data = await response.json();

        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );

        setPokemons(detailedPokemons);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchPokemons();
  }, []);

  
  const toggleFavorite = (pokemon) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === pokemon.id);

      if (exists) {
        return prev.filter((fav) => fav.id !== pokemon.id);
      } else {
        if (prev.length < 6) {
          return [...prev, pokemon];
        } else {
          alert("Solo puedes tener 6 Pokémon en tu equipo");
          return prev;
        }
      }
    });
  };

  
  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Lista de Pokemon - Primera Generación
      </h1>

      
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "8px",
            border: "1px solid gray",
          }}
        />
      </div>

      
      <h2 style={{ textAlign: "center" }}>
        Mi Equipo ({favorites.length}/6)
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
          border: "2px solid green",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {favorites.length === 0 && (
          <p>No hay Pokémon en tu equipo</p>
        )}

        {favorites.map((pokemon) => (
          <div
            key={pokemon.id}
            style={{
              border: "2px solid green",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "center",
              width: "120px",
            }}
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
            />
            <p style={{ textTransform: "capitalize" }}>
              {pokemon.name}
            </p>
          </div>
        ))}
      </div>

    
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "20px",
          padding: "20px",
        }}
      >
        {filteredPokemons.map((pokemon) => {
          const isFavorite = favorites.find(
            (fav) => fav.id === pokemon.id
          );

          return (
            <div
              key={pokemon.id}
              style={{
                border: "1px solid gray",
                padding: "10px",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <h3>#{pokemon.id}</h3>

              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
              />

              <p style={{ textTransform: "capitalize" }}>
                {pokemon.name}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedPokemon(pokemon)}
                >
                  Ver
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(pokemon)}
                >
                  {isFavorite ? "Quitar" : "Agregar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

  
      {selectedPokemon && (
        <div
          onClick={() => setSelectedPokemon(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              width: "350px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedPokemon(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                border: "none",
                background: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            <h2 style={{ textTransform: "capitalize" }}>
              {selectedPokemon.name}
            </h2>

            <img
              src={
                selectedPokemon.sprites.other["official-artwork"]
                  .front_default
              }
              alt={selectedPokemon.name}
              style={{ width: "180px" }}
            />

            <p> Puntos de vida: {selectedPokemon.stats[0].base_stat}</p>
            <p> Ataque: {selectedPokemon.stats[1].base_stat}</p>
            <p> Defensa: {selectedPokemon.stats[2].base_stat}</p>
            <p> Velocidad: {selectedPokemon.stats[5].base_stat}</p>
            <p> Altura: {selectedPokemon.height}</p>
            <p> Peso: {selectedPokemon.weight}</p>

            <div style={{ marginTop: "10px" }}>
              {selectedPokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  style={{
                    margin: "5px",
                    padding: "5px 10px",
                    borderRadius: "10px",
                    backgroundColor: "#eee",
                  }}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;