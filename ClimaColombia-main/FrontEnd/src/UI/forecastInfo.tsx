import { getWeatherImage } from "../config/iconsConfig";
import { ForecastWithLocation } from "../map";
import { WeatherCode } from "../types/apiResponse.types";

interface forecastInfoProps {
  forecast?: ForecastWithLocation
}

export default function ForecastInfo({ forecast }: forecastInfoProps) {

  if (!forecast) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 animate-pulse">Cargando pronostico para las proximas 12 horas...</p>
      </div>
    );
  }

   return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 snap-x snap-mandatory scroll-smooth">

        {forecast.forecast.map((item, index) => {

          const iconPath = getWeatherImage(
            item.condition.code as WeatherCode
          );

          return (
            <div
              key={index}
              className="min-w-[120px] snap-start bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-md flex-shrink-0 text-center"
            >
              <img
                src={iconPath}
                alt="weather icon"
                className="w-10 h-10 mx-auto mb-2"
              />

              <p className="text-sm text-gray-500">
                {item.time.slice(-5)}
              </p>

              <p className="text-2xl font-semibold text-gray-800 mt-2">
                {item.temp_c}°
              </p>

              <p className="text-xs text-gray-500 mt-1">
                💧 {item.chance_of_rain}%
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {item.condition.text}
              </p>
            </div>
          );
        })}

      </div>
    </div>
  );

}