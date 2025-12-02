import { Routes, Route } from 'react-router-dom';
import { PokemonListPage } from './pages/PokemonListPage';
import { PokemonDetailPage } from './pages/PokemonDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PokemonListPage />} />
      <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
    </Routes>
  );
}

export default App;