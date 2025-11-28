import { z } from "zod";

const API_BASE_URL = "https://pokeapi.co/api/v2";

// generic function to get data from the API with Zod validation
export const apiClient = {
    async get<T>(endpoint: string, schema: z.ZodSchema<T>): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Validate and parse the response data
        return schema.parse(data);
    }
}