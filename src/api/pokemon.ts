import { apiClient } from "./client";
import { Pokemon, PokemonSpecies, PokemonListResponse } from "../types/pokemon";
import { PokemonSchema, PokemonSpeciesSchema, PokemonListResponseSchema } from "../types/pokemon.schema";

export const pokemonApi = {
    // Pokemon API
    getById: async (id: number): Promise<Pokemon> => {
        return await apiClient.get<Pokemon>(`/pokemon/${id}`, PokemonSchema);
    },
    getByName: async (name: string): Promise<Pokemon> => {
        return await apiClient.get<Pokemon>(`/pokemon/${name}`, PokemonSchema);
    },

    // Pokemon Species API (flavor text)
    getSpeciesById: async (id: number): Promise<PokemonSpecies> => {
        return await apiClient.get<PokemonSpecies>(`/pokemon-species/${id}`, PokemonSpeciesSchema);
    },
    getSpeciesByName: async (name: string): Promise<PokemonSpecies> => {
        return await apiClient.get<PokemonSpecies>(`/pokemon-species/${name}`, PokemonSpeciesSchema);
    },

    // Pokemon list API
    getList: async (limit: number = 60, offset: number = 0): Promise<PokemonListResponse> => {
        return await apiClient.get<PokemonListResponse>(
            `/pokemon?limit=${limit}&offset=${offset}`,
            PokemonListResponseSchema
        );
    },
}