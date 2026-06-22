import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Pane } from "react-leaflet";
import { useEffect, useState } from "react";
import MapClickHandler from "./hooks/getCordinates";
import { getWeatherIcon } from "./config/iconsConfig";
import ZoomListener from "./hooks/ZoomListener";
import { getCurrentWeather, getForecastForNext12Hours } from "./services/weather";
import { CurrentWeather, ForecastNext12Hours, WeatherCode } from "./types/apiResponse.types";
import WeatherInfo from "./UI/weatherInfo";
import ForecastInfo from "./UI/forecastInfo";

const enum CurrentMap {
  DEFAULT = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  GOOGLE_MAPS = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  NO_LABELS_MAP = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
  LABELS_MAP = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
};

const ibagueBounds: [[number, number], [number, number]] = [
  [4.32, -75.072], [4.5658, -76.3267]
];

interface LocationPoint {
  comuna: string;
  lat: number;
  lon: number;
}

export interface WeatherWithLocation extends CurrentWeather {
  comuna: string;
}

export interface ForecastWithLocation extends ForecastNext12Hours {
  comuna: string;
}

const ibagueLocations: LocationPoint[] = [
  { comuna: "Comuna 1", lat: 4.4432, lon: -75.2408 },
  { comuna: "Comuna 2", lat: 4.4508, lon: -75.2413 },
  { comuna: "Comuna 3", lat: 4.4429, lon: -75.2245 },
  { comuna: "Comuna 4", lat: 4.4410, lon: -75.2099 },
  { comuna: "Comuna 5", lat: 4.4419, lon: -75.1957 },
  { comuna: "Comuna 6", lat: 4.4494, lon: -75.1920 },
  { comuna: "Comuna 6-7", lat: 4.4460, lon: -75.1669 },
  { comuna: "Comuna 7", lat: 4.4495, lon: -75.1456 },
  { comuna: "Comuna 8", lat: 4.4379, lon: -75.1720 },
  { comuna: "Comuna 9", lat: 4.4321, lon: -75.1864 },
  { comuna: "Comuna 10", lat: 4.4336, lon: -75.2177 },
  { comuna: "Comuna 11", lat: 4.4283, lon: -75.2263 },
  { comuna: "Comuna 12", lat: 4.4307, lon: -75.2414 },
  { comuna: "Comuna 13", lat: 4.4208, lon: -75.2550 },
  { comuna: "Comuna 14", lat: 4.4069, lon: -75.1635 },
  { comuna: "Chapetón", lat: 4.4598, lon: -75.2715 },
  { comuna: "Llanitos", lat: 4.4900, lon: -75.2861 },
  { comuna: "Pastales", lat: 4.5113, lon: -75.3022 },
  { comuna: "Villa Restrepo", lat: 4.5237, lon: -75.3103 },
  { comuna: "Juntas", lat: 4.5558, lon: -75.3267 },
];

const Map = () => {
  const [_coords, setCoords] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState(12.5);
  const [responses, setResponses] = useState<CurrentWeather[]>([]);
  const [forecast, setForecast] = useState<ForecastWithLocation[]>([]);
  const [selectedWeather, setSelectedWeather] = useState<WeatherWithLocation | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        setError(false);

        const results = await Promise.all(
          ibagueLocations.map((location) =>
            getCurrentWeather(location.lat, location.lon)
          )
        );

        const forecastResponse = await Promise.all(
          ibagueLocations.map(async (location) => {
            const forecast = await getForecastForNext12Hours(
              location.lat,
              location.lon
            );

            return {
              comuna: location.comuna,
              ...forecast
            };
          })
        );

        if (!results.length || !forecastResponse.length) {
          throw new Error("Empty response");
        }

        setResponses(results);
        setForecast(forecastResponse);

      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center shadow-2xl max-w-md">

          <div className="text-5xl mb-4">⚠️</div>

          <h1 className="text-2xl font-semibold text-white mb-2">
            Servicio no disponible
          </h1>

          <p className="text-slate-300 mb-6">
            No pudimos conectar con el servidor del clima.
            Verifica tu conexión o intenta nuevamente.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition shadow-lg"
          >
            Reintentar
          </button>

        </div>
      </div>
    );
  }
  return (
    <div className="relative w-screen h-screen">
      <MapContainer className="map h-screen w-screen"
        center={[4.43, -75.20]} // Ibague
        zoom={zoom}
        minZoom={12}
        maxZoom={15}
        maxBounds={ibagueBounds}
        maxBoundsViscosity={1}
        zoomControl={true}
        scrollWheelZoom={true}
        dragging={true}
      //style={{ height: "100%", width: "100%" }}
      >
        <ZoomListener setZoom={setZoom} />

        <MapClickHandler
          onclick={(lat, lng) => {
            setCoords([lat, lng]);
            setSelectedWeather(null);
            console.log("Cordenadas", lat, lng);
          }}

        />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url={CurrentMap.NO_LABELS_MAP}
        />

        {ibagueLocations.map((pos, index) => {
          const weather = responses[index];
          if (!weather) return null;

          const code = weather.currentWeather.condition.code;
          const temp = weather.currentWeather.temp_c;

          if (!code) return null;

          return (
            <Marker
              key={pos.comuna}
              position={[pos.lat, pos.lon]}
              icon={getWeatherIcon(temp, zoom, code as WeatherCode)}
              eventHandlers={{
                click: () => {
                  setSelectedWeather({ ...weather, comuna: pos.comuna });
                  setShowForecast(false);
                }
              }}
            />
          );
        })}

        {/* CAPA SOLO DE LABELS ENCIMA */}
        <Pane name="labels" style={{ zIndex: 650, pointerEvents: "none" }}>
          <TileLayer
            url={CurrentMap.LABELS_MAP}
            attribution="&copy; OpenStreetMap & Carto"
          />
        </Pane>

      </MapContainer>

      {selectedWeather && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-1000 w-screen max-w-md px-4">

          <div className="relative">

            {/* ❌ BOTÓN CERRAR */}
            <button
              onClick={() => {
                setSelectedWeather(null);
                setShowForecast(false);
              }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center shadow-md z-1001"
            >
              ✕
            </button>

            {/* CARD PRINCIPAL */}
            <WeatherInfo currentWeather={selectedWeather} />

            {/* BOTÓN VER PRONÓSTICO */}
            <button
              onClick={() => setShowForecast(prev => !prev)}
              className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl shadow-md transition"
            >
              {showForecast ? "Ocultar pronóstico" : "Ver pronóstico"}
            </button>

            {/* FORECAST */}
            {showForecast && forecast.length > 0 && (
              <div className="mt-4 z-1002">
                <ForecastInfo forecast={forecast[ibagueLocations.findIndex(
                  loc => loc.comuna === selectedWeather.comuna
                )]} />
              </div>
            )}

          </div>
        </div>
      )}

    </div>

  );
};

export default Map;
