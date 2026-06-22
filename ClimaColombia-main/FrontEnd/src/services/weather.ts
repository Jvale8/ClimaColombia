import { API_BASE_URL, ENDPOINTS } from "../config/weatherAPI";
import { CurrentWeather, ForecastNext12Hours } from "../types/apiResponse.types";

export const getCurrentWeather = async (lat: number, lon: number): Promise<CurrentWeather>  => {

    const response = await fetch(
        `${API_BASE_URL}${ENDPOINTS.currentWeather}?lat=${lat}&lon=${lon}`
    );
    
    return response.json();
}

export const getForecastForNext12Hours = async (lat: number, lon: number): Promise<ForecastNext12Hours>  => {

    const response = await fetch(
        `${API_BASE_URL}${ENDPOINTS.forecast}?lat=${lat}&lon=${lon}`
    );
    
    return response.json();
}
