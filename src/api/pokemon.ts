import { apiClient } from "./client";
import { Pokemon } from "../types/pokemon";
import { PokemonSchema } from "../types/pokemon.schema";

export const pokemonApi = {
    getById: async (id: number): Promise<Pokemon> => {
        return await apiClient.get<Pokemon>(`/pokemon/${id}`, PokemonSchema);
    },
    getByName: async (name: string): Promise<Pokemon> => {
        return await apiClient.get<Pokemon>(`/pokemon/${name}`, PokemonSchema);
    }
}