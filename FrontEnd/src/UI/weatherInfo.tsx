import { WeatherWithLocation } from "../map";

interface WeatherInfoProps {
    currentWeather?: WeatherWithLocation
}

export default function WeatherInfo ({currentWeather} : WeatherInfoProps) {

    if (!currentWeather) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500 animate-pulse">Cargando clima...</p>
            </div>
        );
    }

    const {
        temp_c,
        feelslike_c,
        humidity,
        cloud,
        condition,
    } = currentWeather.currentWeather;

    const {comuna}= currentWeather;

      return (
    <div className="max-w-sm w-full mx-auto bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/40">

          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Estado del Clima
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {condition.text}
            </p>


            <p className="text-gray-500 text-sm mt-1">
              {comuna}
            </p>
          </div>

      {/* Temperatura principal */}
      <div className="flex justify-center items-center mt-6">
        <span className="text-4xl font-bold text-gray-800">
          {temp_c}°
        </span>
        <span className="text-gray-500 text-lg ml-1">C</span>
      </div>

      {/* Info secundaria */}
      <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-gray-700 ">

        <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col justify-center items-center">
          <p className="text-gray-500">Sensación térmica</p>
          <p className="font-semibold">{feelslike_c}°C</p>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col justify-center items-center">
          <p className="text-gray-500">Humedad</p>
          <p className="font-semibold">{humidity}%</p>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col justify-center items-center">
          <p className="text-gray-500">Nubosidad</p>
          <p className="font-semibold">{cloud}%</p>
        </div>

      </div>
    </div>
  );
  
}