import L from "leaflet";
import { WeatherCode, weatherCodeMap, weatherIcons } from "../types/apiResponse.types";

export function getWeatherIcon(temp: number, zoom: number, imageCode: WeatherCode) {
  const size = zoom * 4;

  const imagePath = getWeatherImage(imageCode);

  return new L.DivIcon({
    html: `
      <div style="position: relative; width:${size}px; height:${size}px;">
        <img 
          src="${imagePath}"
          style="width:100%; height:100%;" 
        />
        <div style="
          position:absolute;
          top:-10px;
          left:50%;
          transform:translateX(-50%);
          background:white;
          padding:2px 6px;
          border-radius:12px;
          font-size:${size * 0.25}px;
          font-weight:bold;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
        ">
          ${temp}°
        </div>
      </div>
    `,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function getWeatherImage(code : WeatherCode): string{
    const category = weatherCodeMap[code];
    return weatherIcons[category];
}

