export interface WeatherResponseDTO {
  location: LocationDTO;
  current: CurrentDTO;
  forecast: {
    forecastday: {
      hour: HourDTO[];
    }[];
  };
}

export interface LocationDTO {
    name: string;
    localtime: string;
  };

export interface CurrentDTO {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    cloud: number;
    condition: ConditionDTO
};

export interface HourDTO {
    time: string;
    temp_c: number;
    feelslike_c: number;
    chance_of_rain: number;
    uv: number;
    condition: ConditionDTO
};

export interface ConditionDTO {
    text: string;
    code: number;
};
