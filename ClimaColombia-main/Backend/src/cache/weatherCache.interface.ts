import { WeatherResponseDTO } from "../types/weather.dto.schema";

export interface WeatherCache{
    get(key : string) : Promise<WeatherResponseDTO | null>;
    set(key: string, value : WeatherResponseDTO): Promise<void>; 
}