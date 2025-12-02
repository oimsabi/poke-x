// ============================================
// POKEMON TYPES - Based on PokeAPI Response
// ============================================

// Helper types for nested objects
export interface NamedResource {
    name: string;
    url: string;
  }
  
  // Ability structure
  export interface PokemonAbility {
    ability: NamedResource;
    is_hidden: boolean;
    slot: number;
  }
  
  // Type structure
  export interface PokemonType {
    slot: number;
    type: NamedResource;
  }
  
  // Stat structure
  export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: NamedResource;
  }
  
  // Sprites structure (simplified - includes main images)
  export interface PokemonSprites {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other?: {
      dream_world?: {
        front_default: string | null;
        front_female: string | null;
      };
      home?: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      "official-artwork"?: {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
    versions?: Record<string, any>; // Very complex nested structure - simplified
  }
  
  // Cries structure
  export interface PokemonCries {
    latest: string | null;
    legacy: string | null;
  }
  
  // Form structure
  export interface PokemonForm {
    name: string;
    url: string;
  }
  
  // Game index structure
  export interface GameIndex {
    game_index: number;
    version: NamedResource;
  }
  
  // Main Pokemon interface - matches the API response
  export interface Pokemon {
    // Basic info
    id: number;
    name: string;
    base_experience: number | null;
    height: number;        // in decimeters (divide by 10 for meters)
    weight: number;        // in hectograms (divide by 10 for kg)
    order: number;
    is_default: boolean;
    
    // Arrays
    abilities: PokemonAbility[];
    forms: PokemonForm[];
    game_indices: GameIndex[];
    moves: any[];          // Very complex - simplified for now
    past_abilities?: any[]; // Optional - may not exist
    past_types?: any[];     // Optional - may not exist
    stats: PokemonStat[];
    types: PokemonType[];
    
    // Objects
    sprites: PokemonSprites;
    species: NamedResource;
    cries: PokemonCries;
    location_area_encounters: string;
  }
  
  // For Pokemon list endpoint
  export interface PokemonListItem {
    name: string;
    url: string;
    id?: number;
    types?: PokemonType[];
  }
  
  export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
  }

  // Flavor text entry structure
  export interface FlavorTextEntry {
    flavor_text: string;
    language: NamedResource;
    version: NamedResource;
  }

  // Pokemon Species interface - for flavor text and other species data
  export interface PokemonSpecies {
    id: number;
    name: string;
    flavor_text_entries: FlavorTextEntry[];
    
    // Add other species fields
    [key: string]: any; // Allow for other fields we might not need
  }

  // Cached Pokemon interface - for Pokemon cache management
  export interface CachedPokemon {
    pokemon: Pokemon;
    loaded: boolean;
  }

  // Carousel configuration interface
  export interface CarouselConfig {
    batchSize: number;
    prefetchRange: number;
    autoPlayInterval: number;
  }