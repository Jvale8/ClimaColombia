import { weatherCache } from "../cache";
import { WeatherApiValidationError } from "../errors/WeatherApiValidationError";
import { WeatherDtoSchema, WeatherResponseDTO, HourDTO} from "../types/weather.dto.schema";

export const getApiResponse = async (lat: number, lon: number) => {

    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;

    const cached = await weatherCache.get(cacheKey);

    if (cached) return cached;

    const existingPromise = weatherCache.getInFlight(cacheKey);

    if (existingPromise) return existingPromise;

    const fecthPromise = (async () => {

        const API_KEY = process.env.API_KEY;
        const API_URL = process.env.API_URL;

        if(!API_KEY || !API_URL || API_KEY === "" || API_URL === "") throw new Error('Error al consultar WeatherAPI');
        const url = new URL(API_URL);

        try {
            url.searchParams.append('key', API_KEY);
            url.searchParams.append('q', `${lat},${lon}`);
            url.searchParams.append('days', '2');
            url.searchParams.append('aqi', 'no');
            url.searchParams.append('alerts', 'no');
            url.searchParams.append('lang', 'es');

            const response = await fetch(url);

            if (!response.ok) throw new Error('Error al consultar WeatherAPI');

            const rawData = await response.json();

            const validatedData = WeatherDtoSchema.safeParse(rawData);

            if (!validatedData.success) throw new WeatherApiValidationError(validatedData.error);

            weatherCache.set(cacheKey, validatedData.data);

            return validatedData.data;
        }
        finally {
            weatherCache.clearInFlight(cacheKey);
        }
    })();

    weatherCache.setInFlight(cacheKey, fecthPromise);

    return fecthPromise;
}

export const getCurrentWeather = (data: WeatherResponseDTO) => {
    return data.current;
}

export const getForecastForNext12Hours = (data : WeatherResponseDTO) => {
    try {  
        const localTime = new Date(data.location.localtime);
        const allHours: HourDTO[] = data.forecast.forecastday.flatMap(day => day.hour);

        const next12Hours = allHours
            .filter(hour => new Date(hour.time) >= localTime).slice(0,12);

        return next12Hours;
    } catch (error) {
        throw new Error(`Error al intentar obtener el pronostico: ${error}`)
    }
}