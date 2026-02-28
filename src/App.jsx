import { useEffect, useState } from "react";

function App() {

  const [pokemons, setPokemons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState(""); // 🔎 estado del buscador

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
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
    const isFavorite = favorites.find(fav => fav.id === pokemon.id);

    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== pokemon.id));
    } else {
      if (favorites.length < 6) {
        setFavorites([...favorites, pokemon]);
      } else {
        alert("Solo puedes tener 6 Pokémon en tu equipo");
      }
    }
  };

  // 🔎 filtro por nombre
  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Lista de Pokemon - Primera Generación
      </h1>

      {/* 🔎 Buscador */}
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
            border: "1px solid gray"
          }}
        />
      </div>

      <h2 style={{ textAlign: "center" }}>
        Mi Equipo ({favorites.length}/6)
      </h2>

      {/* Equipo */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
          border: "1px solid green",
          padding: "20px"
        }}
      >
        {favorites.map((pokemon) => (
          <div
            key={pokemon.id}
            style={{
              border: "2px solid green",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "center",
              width: "120px"
            }}
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
            />
            <p>{pokemon.name}</p>
          </div>
        ))}
      </div>

      {/* Lista de Pokémon */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "20px",
          padding: "20px"
        }}
      >
        {filteredPokemons.map((pokemon) => {
          const isFavorite = favorites.find(fav => fav.id === pokemon.id);

          return (
            <div
              key={pokemon.id}
              style={{
                border: "1px solid gray",
                padding: "10px",
                textAlign: "center",
                borderRadius: "10px"
              }}
            >
              <h3>#{pokemon.id}</h3>
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
              />
              <p>{pokemon.name}</p>
              <p>
                {pokemon.types.map((type) => type.type.name).join(", ")}
              </p>

              <button
                onClick={() => toggleFavorite(pokemon)}
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isFavorite ? "#007BFF" : "#cccccc",
                  color: isFavorite ? "white" : "black"
                }}
              >
                {isFavorite
                  ? "Quitar del equipo"
                  : "Agregar al equipo"}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;