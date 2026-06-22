import { Request, Response, NextFunction } from "express";
import {
  getApiResponse,
  getCurrentWeather,
  getForecastForNext12Hours
} from "../services/getForecast.service";

/**
 * GET /weather/current
 */
export const getCurrentWeatherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        error: "Latitud o longitud incorrectos o no enviados"
      });
    }

    const weatherData = await getApiResponse(lat, lon);
    const currentWeather = getCurrentWeather(weatherData);

    return res.json({ currentWeather });

  } catch (error) {
    next(error);
  }
};


/**
 * GET /weather/next-12-hours
 */
export const getForecastForNext12HoursController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        error: "Latitud o longitud incorrectos o no enviados"
      });
    }

    const weatherData = await getApiResponse(lat, lon);
    const forecast = getForecastForNext12Hours(weatherData);

    return res.json({ forecast });

  } catch (error) {
    next(error);
  }
};
