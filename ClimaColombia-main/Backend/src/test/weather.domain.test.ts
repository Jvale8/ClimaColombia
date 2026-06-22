import { weatherCache } from "../cache";
import { WeatherApiValidationError } from "../errors/WeatherApiValidationError";
import { getApiResponse, getCurrentWeather, getForecastForNext12Hours } from "../services/getForecast.service";
import { WeatherDtoSchema } from "../types/weather.dto.schema";

const mockData = {
    location: { name: "Ibague", localtime: "2026-01-01 10:00" },
    current: {
        temp_c: 20,
        feelslike_c: 19,
        humidity: 60,
        cloud: 30,
        condition: { text: "Sunny", code: 2000 }
    },
    forecast: {
        forecastday: [
            {
                hour: [
                    {
                        time: "2026-02-16 00:00",
                        temp_c: 20,
                        feelslike_c: 19,
                        chance_of_rain: 60,
                        uv: 3,
                        condition: { text: "Sunny", code: 1000 }
                    },
                    {
                        time: "2026-02-16 00:00",
                        temp_c: 20,
                        feelslike_c: 19,
                        chance_of_rain: 60,
                        uv: 3,
                        condition: { text: "Sunny", code: 1000 }
                    },
                ]
            }

        ]
    }
};

// Unit Test
describe("Weather Service", ()=>{

    beforeEach(() => {
        jest.restoreAllMocks();
        const lat = 4.4;
        const lon = -75.2;
        const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
        weatherCache.clearInFlight(cacheKey);

        process.env.API_URL = "http://dummy.url";
        process.env.API_KEY = "dummy_key";
    });

    describe("Get API Response", () => {
        it("Should get API Response and transforme it to a correct DTO", async () => {

            jest.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                json: async () => mockData
            } as any);

            const apiResponse = await getApiResponse(4.4508, -75.2413);

            expect(apiResponse).toMatchObject(mockData);
            // expect(apiResponse.location.name).toBe("Ibague");
            // expect(apiResponse.location.localtime).toBe("2026-01-01 10:00");

            // expect(apiResponse.current.cloud).toBe(30);
            // expect(apiResponse.current.feelslike_c).toBe(19);
            // expect(apiResponse.current.humidity).toBe(60);
            // expect(apiResponse.current.temp_c).toBe(20);
            // expect(apiResponse.current.condition.code).toBe(2000);
            // expect(apiResponse.current.condition.text).toBe("Sunny");

            // apiResponse.forecast.forecastday.forEach((f) => {
            //     f.hour.forEach((hour => {
            //         expect(hour.time).toBe("2026-02-16 00:00");
            //         expect(hour.temp_c).toBe(20);
            //         expect(hour.feelslike_c).toBe(19);
            //         expect(hour.chance_of_rain).toBe(60);
            //         expect(hour.condition.text).toBe("Sunny");
            //         expect(hour.condition.code).toBe(1000);
            //         expect(hour.uv).toBe(3);
            //     }))
            // });
        });

        it("Should throw WeatherApiValidationError if schema validation fails", async () => {
            const invalidMock = {
                ...mockData,
                current: {
                    ...mockData.current,
                    temp_c: "20"
                }
            }

            jest.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                json: async () => invalidMock
            } as any);

            try {
                await getApiResponse(97.123, -33.987);
                const result = WeatherDtoSchema.safeParse(invalidMock);
                console.log(result);
                fail("Expected error was not thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(WeatherApiValidationError);
            }
        });

        it("Should manage correctly multiple API calls at same time and only return one response to them", async () => {

            jest.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                json: async () => mockData
            } as any);

            await Promise.all([
                getApiResponse(4.4, -75.2),
                getApiResponse(4.4, -75.2),
                getApiResponse(4.4, -75.2),
                getApiResponse(4.4, -75.2),
                getApiResponse(4.4, -75.2),
                getApiResponse(4.4, -75.2)
            ]);

            expect(fetch).toHaveBeenCalledTimes(1);
        });
    });

    it("Should return a correct weather", ()=>{
        
        const result = getCurrentWeather(mockData as any);

        expect(result.temp_c).toBe(20);
        expect(result.cloud).toBe(30);
        expect(result.feelslike_c).toBe(19);
        expect(result.humidity).toBe(60);
        expect(result.condition.text).toBe("Sunny");
        expect(result.condition.code).toBe(2000);
    });

    it("Should return a correct forecast for next 12 hours", ()=>{
        
        const forecast = getForecastForNext12Hours(mockData as any);

        expect(forecast).toHaveLength(2);
        forecast.forEach((f) => {
            expect(f.time).toBe("2026-02-16 00:00");
            expect(f.temp_c).toBe(20);
            expect(f.feelslike_c).toBe(19);
            expect(f.chance_of_rain).toBe(60);
            expect(f.condition.text).toBe("Sunny");
            expect(f.condition.code).toBe(1000);
            expect(f.uv).toBe(3);
        });

    });
});