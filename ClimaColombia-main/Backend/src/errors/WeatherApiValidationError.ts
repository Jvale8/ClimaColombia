export class WeatherApiValidationError extends Error {
  constructor(public details: unknown) {
    super("La respuesta de la API externa no coincide con el DTO esperado");
    this.name = "WeatherApiValidationError";
  }
}
