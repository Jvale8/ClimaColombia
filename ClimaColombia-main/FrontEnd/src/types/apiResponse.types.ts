export interface CurrentWeather{
    currentWeather: CurrentDTO
};

export interface ForecastNext12Hours{
    forecast: forecastDTO[]
};

export interface CurrentDTO {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    cloud: number;
    condition: ConditionDTO
};

export interface ConditionDTO {
    text: string;
    code: number;
};

export interface forecastDTO {
    time: string;
    temp_c: number;
    feelslike_c: number;
    chance_of_rain: number;
    uv: number,
    condition: ConditionDTO
};

export type WeatherCategory =
  | "sun"
  | "partlyCloud"
  | "cloudy"
  | "overcast"
  | "fog"
  | "lightDrizzle"
  | "freezingDrizzle"
  | "heavyRain"
  | "moderateRain"
  | "snowLight"
  | "snowModerate"
  | "snowHeavy"
  | "sleetLight"
  | "sleetModerate"
  | "sleetHeavy"
  | "thunder"
  | "lightRainThunder"
  | "moderateRainThunder";

export const weatherIcons: Record<WeatherCategory, string> = {
  sun: "icons/sun.png",
  partlyCloud: "icons/partly-cloud.png",
  cloudy: "icons/cloudy.png",
  overcast: "icons/overcast.png",
  fog: "icons/fog.png",
  lightDrizzle: "icons/light-drizzle.png",
  freezingDrizzle: "icons/freezing-rain.png",
  heavyRain: "icons/heavy-rain.png",
  moderateRain: "icons/moderate-rain.png",
  snowLight: "icons/snow-light.png",
  snowModerate: "icons/snow-moderate.png",
  snowHeavy: "icons/snow-heavy.png",
  sleetLight: "icons/sleet-light.png",
  sleetModerate: "icons/sleet-heavy.png",
  sleetHeavy: "icons/sleet-heavy.png",
  thunder: "icons/thundery-possibility.png",
  lightRainThunder: "icons/light-rain-thunder.png",
  moderateRainThunder: "icons/moderate-rain-thunder.png",
};

export const weatherCodeMap = {
  1000: "sun",
  1003: "partlyCloud",
  1006: "cloudy",
  1009: "overcast",

  1030: "fog",
  1135: "fog",
  1147: "fog",

  1063: "lightDrizzle",
  1150: "lightDrizzle",
  1153: "lightDrizzle",
  1180: "lightDrizzle",
  1183: "lightDrizzle",

  1168: "freezingDrizzle",

  1171: "heavyRain",
  1192: "heavyRain",
  1195: "heavyRain",
  1198: "heavyRain",
  1201: "heavyRain",

  1186: "moderateRain",
  1189: "moderateRain",

  1066: "snowLight",
  1210: "snowLight",
  1213: "snowLight",

  1216: "snowModerate",
  1219: "snowModerate",

  1222: "snowHeavy",
  1225: "snowHeavy",

  1069: "sleetLight",
  1204: "sleetLight",
  1072: "sleetLight",
  1240: "sleetLight",
  1249: "sleetLight",
  1255: "sleetLight",

  1207: "sleetModerate",
  1252: "sleetModerate",
  1243: "sleetModerate",
  1258: "sleetModerate",

  1246: "sleetHeavy",

  1087: "thunder",

  1273: "lightRainThunder",
  1279: "lightRainThunder",

  1276: "moderateRainThunder",
  1282: "moderateRainThunder",
} as const;

export type WeatherCode = keyof typeof weatherCodeMap;

// type fog = 1030 | 1035 | 1147;
// type lightDrizzle = 1063 | 1150 | 1153 | 1180 | 1183;
// type heavyRain = 1171 | 1192 | 1195 | 1198 | 1201;
// type moderateRain = 1186 | 1189;
// type snowLight = 1066 | 1210 | 1213;
// type snowModerate = 1216 | 1219;
// type snowHeavy= 1222 | 1225;
// type sleetLight =  1069 | 1204 | 1072| 1240| 1249 | 1255;
// type sleetModerate =   1207 | 1252 | 1243 | 1258;
// type lightRainThunder =  1273 | 1279;
// type moderateRainThunder =  1276| 1282;

// export interface iconCode{
//     1000: "/sun.png",
//     1003: "/partly-cloud",
//     1006: "/cloudy.png",
//     1009: "/overcast.png",
//     fog : "/fog.png",
//     lightDrizzle: "/light-drizzle.png",
//     1168: "/freezing-drizzle.png",
//     heavyRain: "/heavy-rain.png",  
//     moderateRain: "/moderate-rain.png",
//     snowLight: "/snow-light.png",
//     snowModerate: "/snow-moderate.png",
//     snowHeavy: "/snow-heavy.png",
//     sleetLight: "/sleet-light.png",
//     sleetModerate: "/sleet-moderate.png",
//     1246: "/sleet-heavy.png",
//     1087: "/thundery-posibility.png",
//     lightRainThunder: "/light-rain-thunder.png",
//     moderateRainThunder: "/moderate-rain-thunder.png",  
// };



