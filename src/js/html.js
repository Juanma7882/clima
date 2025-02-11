import { climaHoy, weatherImage } from "./logic.js"


export const generateWeatherCurrent = (data) => {
  const { timezone, current } = data
  const { temperature_2m, apparent_temperature, precipitation, surface_pressure, wind_speed_10m, relative_humidity_2m } = current
  const uv_index_max = data.daily.uv_index_max[0]
  const cityName = timezone.replace(/[/_]/g, ' ');

  const climaAhora = climaHoy(data)
  let imagenDelClima = weatherImage(climaAhora)
  try {
    const weatherCard = `
        <h5 class="weather__location">${cityName}</h5>
          <div class="weather__summary">
            <div class="weather__details">
              <p class="weather__temperature">${temperature_2m} ° c</p>
              <p class="weather__condition">${climaAhora}</p>
            </div>
            <div class="weather__icon">
              <img src="${imagenDelClima}" alt="" />
            </div>
          </div>
          <div class="weather__additional">
            <p class="weather__info">sensación térmica : ${apparent_temperature} °c</p>
            <p class="weather__info">indice uv max: ${uv_index_max} </p>
            <p class="weather__info">precipitaciones : ${precipitation}</p>
            <p class="weather__info">presión : ${(surface_pressure / 1013.25).toFixed(3)} ATM</p>
            <p class="weather__info">Viento: ${wind_speed_10m} km/h</p>
            <p class="weather__info">Humedad: ${relative_humidity_2m} %</p>
          </div>`
    return weatherCard
  } catch (error) {
    console.log(`Error al generar la tarjeta del clima ${error}`)
  }
}



export const generateForecastWeek = (apparent_temperature_max, apparent_temperature_min, dayIndex, clima) => {
  try {
    let imagenDelClima = weatherImage(clima)
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const dayName = daysOfWeek[dayIndex]; // Ciclar por los días de la semana

    return `
        <div class="forecast__day">
            <h3 class="forecast__day-name">${dayName}</h3>
            <div class="forecast__hour--img ">
            <img
              class="forecast__icon"
              src="${imagenDelClima}"
              alt="Weather Icon"
            />
            </div>
            <div class="forecast__temperatures">
              <p class="forecast__temperature--max">Max: ${apparent_temperature_max} °C</p>
              <p class="forecast__temperature--min">Min: ${apparent_temperature_min} °C</p>
            </div>
          </div>`;
  } catch (error) {
    console.error(`Error al generar la tarjeta del clima: ${error}`);
  }
};


export const generateForecastHours = (hora, temperaturaNow, stateDayPerHours) => {
  try {
    const imgForecastHours = weatherImage(stateDayPerHours);
    const weatherCard = `
            <div class="swiper-slide forecast__hour">
                <h3 class="forecast__hour--name">${hora}</h3>
                <div class="forecast__hour--img">
                <img
                    class="forecast__icon forecast__icon--hours"
                    src="${imgForecastHours}"
                    alt=""
                />
                </div>
                <p class="forecast__temperatures--max">${temperaturaNow}*C</p>
            </div>
    `
    return weatherCard
  } catch (error) {
    console.log(`Error al generar la tarjeta del clima ${error}`)
  }
}