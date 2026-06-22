import { z } from "zod";

export const LocationSchema = z.object({
    name: z.string(),
    localtime: z.string(),
  });

export const ConditionSchema = z.object({
  text: z.string(),
  code: z.number(),
});

export const HourSchema = z.object({
  time: z.string(),
  temp_c: z.number(),
  feelslike_c: z.number(),
  chance_of_rain: z.number(),
  uv: z.number(),
  condition: ConditionSchema,
});

export const CurrentSchema = z.object({
    temp_c: z.number(),
    feelslike_c: z.number(),
    humidity: z.number(),
    cloud: z.number(),
    condition: ConditionSchema,
  });

export const WeatherDtoSchema = z.object({
  location: LocationSchema,
  current: CurrentSchema,
  forecast: z.object({
    forecastday: z.array(
      z.object({
        hour: z.array(HourSchema),
      })
    ),
  }),
});

export type WeatherResponseDTO = z.infer<typeof WeatherDtoSchema>;
export type HourDTO = z.infer<typeof HourSchema>;
