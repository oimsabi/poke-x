import { useState } from 'react';
import { usePokemon } from './hooks/usePokemon';
import { PokemonCard } from './components/PokemonCard';

function App() {
  // State to store which Pokemon ID the user wants to see
  const [pokemonId, setPokemonId] = useState(1);
  
  // Use our custom hook to fetch Pokemon data
  const { pokemon, loading, error } = usePokemon(pokemonId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold mb-2">Poke X</h1>
      <p className="text-gray-400 mb-8">Explore • Experience • Expert</p>
      
      {/* Input to let user choose which Pokemon to see */}
      <div className="my-5">
        <label className="text-lg">
          Pokemon ID: 
          <input
            type="number"
            value={pokemonId}
            onChange={(e) => setPokemonId(Number(e.target.value))}
            min="1"
            max="1025"
            className="ml-2 px-2 py-1 rounded border border-gray-600 bg-gray-800 text-white"
          />
        </label>
      </div>
      
      {/* Show loading message while fetching */}
      {loading && <p className="text-lg">Loading Pokemon...</p>}
      
      {/* Show error if something went wrong */}
      {error && <p className="text-red-500 text-lg">Error: {error}</p>}
      
      {/* Show Pokemon card when data is loaded */}
      {pokemon && <PokemonCard pokemon={pokemon} />}
    </div>
  )
}

export default App