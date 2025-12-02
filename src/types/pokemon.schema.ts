// ============================================
// POKEMON ZOD SCHEMAS - Runtime Validation
// ============================================

import { z } from "zod";

// Helper schemas for nested objects
export const NamedResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});

// Ability structure
export const PokemonAbilitySchema = z.object({
  ability: NamedResourceSchema,
  is_hidden: z.boolean(),
  slot: z.number(),
});

// Type structure
export const PokemonTypeSchema = z.object({
  slot: z.number(),
  type: NamedResourceSchema,
});

// Stat structure
export const PokemonStatSchema = z.object({
  base_stat: z.number(),
  effort: z.number(),
  stat: NamedResourceSchema,
});

// Sprites structure (simplified - includes main images)
export const PokemonSpritesSchema = z.object({
  back_default: z.string().nullable(),
  back_female: z.string().nullable(),
  back_shiny: z.string().nullable(),
  back_shiny_female: z.string().nullable(),
  front_default: z.string().nullable(),
  front_female: z.string().nullable(),
  front_shiny: z.string().nullable(),
  front_shiny_female: z.string().nullable(),
  other: z.object({
    dream_world: z.object({
      front_default: z.string().nullable(),
      front_female: z.string().nullable(),
    }).optional(),
    home: z.object({
      front_default: z.string().nullable(),
      front_female: z.string().nullable(),
      front_shiny: z.string().nullable(),
      front_shiny_female: z.string().nullable(),
    }).optional(),
    "official-artwork": z.object({
      front_default: z.string().nullable(),
      front_shiny: z.string().nullable(),
    }).optional(),
  }).optional(),
  versions: z.record(z.any()).optional(), // Very complex nested structure - simplified
});

// Cries structure
export const PokemonCriesSchema = z.object({
  latest: z.string().nullable(),
  legacy: z.string().nullable(),
});

// Form structure
export const PokemonFormSchema = z.object({
  name: z.string(),
  url: z.string(),
});

// Game index structure
export const GameIndexSchema = z.object({
  game_index: z.number(),
  version: NamedResourceSchema,
});

// Main Pokemon schema - matches the API response
export const PokemonSchema = z.object({
  // Basic info
  id: z.number(),
  name: z.string(),
  base_experience: z.number().nullable(),
  height: z.number(),        // in decimeters (divide by 10 for meters)
  weight: z.number(),        // in hectograms (divide by 10 for kg)
  order: z.number(),
  is_default: z.boolean(),
  
  // Arrays
  abilities: z.array(PokemonAbilitySchema),
  forms: z.array(PokemonFormSchema),
  game_indices: z.array(GameIndexSchema),
  moves: z.array(z.any()),          // Very complex - simplified for now
  past_abilities: z.array(z.any()).optional(), // Optional - may not exist
  past_types: z.array(z.any()).optional(),     // Optional - may not exist
  stats: z.array(PokemonStatSchema),
  types: z.array(PokemonTypeSchema),
  
  // Objects
  sprites: PokemonSpritesSchema,
  species: NamedResourceSchema,
  cries: PokemonCriesSchema,
  location_area_encounters: z.string(),
});

// For Pokemon list endpoint
export const PokemonListItemSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonListResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(PokemonListItemSchema),
});

// Flavor text entry schema
export const FlavorTextEntrySchema = z.object({
  flavor_text: z.string(),
  language: NamedResourceSchema,
  version: NamedResourceSchema,
});

// Pokemon Species schema - focused on flavor_text_entries
export const PokemonSpeciesSchema = z.object({
  id: z.number(),
  name: z.string(),
  flavor_text_entries: z.array(FlavorTextEntrySchema),
}).passthrough(); // Allow additional fields we don't validate

// Export inferred types from schemas (optional - can use original types)
export type PokemonFromSchema = z.infer<typeof PokemonSchema>;
export type PokemonListItemFromSchema = z.infer<typeof PokemonListItemSchema>;
export type PokemonListResponseFromSchema = z.infer<typeof PokemonListResponseSchema>;
export type PokemonSpeciesFromSchema = z.infer<typeof PokemonSpeciesSchema>;
