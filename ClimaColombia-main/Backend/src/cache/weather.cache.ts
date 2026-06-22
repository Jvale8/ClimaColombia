import { WeatherResponseDTO } from "../types/weather.dto.schema"
import { WeatherCache } from "./weatherCache.interface";

type CacheEntry = {
    data: WeatherResponseDTO,
    expireAt: number
};

export class MemoryWeatherCache implements WeatherCache{

    private cache = new Map<string, CacheEntry>();
    private inFlight = new Map<string, Promise<WeatherResponseDTO>>();
    private TTL = 20 * 60 * 1000;

    async get(key: string): Promise<WeatherResponseDTO | null> {
        const entry = this.cache.get(key);

        if(!entry) return null;

        if(Date.now() > entry.expireAt){
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }
    async set(key: string, value: WeatherResponseDTO): Promise<void> {
        this.cache.set(key, {data: value, expireAt: Date.now() + this.TTL});
    }

    getInFlight(key:string) : Promise<WeatherResponseDTO> | undefined{
        return this.inFlight.get(key);
    } 

    setInFlight(key:string, promise: Promise<WeatherResponseDTO>) {
        this.inFlight.set(key, promise);
    }

    clearInFlight (key:string){
        this.inFlight.delete(key);
    }
    
}