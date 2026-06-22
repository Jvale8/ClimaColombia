import { Router } from "express";
import {
  getCurrentWeatherController,
  getForecastForNext12HoursController
} from "../controller/getForecast.controller";

const router = Router();

router.get("/current", getCurrentWeatherController);
router.get("/next-12-hours", getForecastForNext12HoursController);

export default router;
