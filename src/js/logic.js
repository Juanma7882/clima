import { generateForecastWeek, generateForecastHours } from "./html.js"


// ! Funciones generales 

// Función para determinar el clima principal basado en los datos
export function determinarClima(probLluvia, temp, velocidadViento, probTormenta, nubladoPorcentaje, nieve) {
    if (probTormenta > 50) {
        return "Tormentas";
    } else if (probLluvia > 50 && temp <= 0) {
        return "Nieve";
    } else if (probLluvia > 50 && nieve != 0) {
        return "Lluvia";
    } else if (velocidadViento > 20) {
        return "Viento";
    } else if (nubladoPorcentaje > 70) {
        return "Nublado";
    } else {
        return "Soleado";
    }
}

// Función para determinar la imagen del clima basado en los datos
export function weatherImage(clima) {
    switch (clima) {
        case "Tormentas":
            return "/src/img/tormenta.png";
        case "Nieve":
            return '/src/img/nieve.png';
        case "Lluvia":
            return '/src/img/lluvia2.png';
        case "Viento":
            return '/src/img/viento.png';
        case "Nublado":
            return '/src/img/nublado.png';
        case "Soleado":
            return '/src/img/soleado.png';
        default:
            return "image error"
    }
}



// ! Funciones para el clima de hoy generateWeatherCurrent

// Clima de hoy
export function climaHoy(datos) {
    const { current } = datos
    const { precipitation, temperature_2m, wind_speed_10m, rain, cloud_cover, snowfall } = current;
    return determinarClima(precipitation, temperature_2m, wind_speed_10m, rain, cloud_cover, snowfall);
}

// ! Funciones para el clima por semana 


// creo el Array de Dias dinámico 
const daysArray = () => {
    const fecha = new Date();
    const cortado = fecha.toString().slice(0, 3); // Obtiene los primeros tres caracteres del día de la semana
    let startDay;

    switch (cortado) {
        case "Sun":
            startDay = 0;
            break;
        case "Mon":
            startDay = 1;
            break;
        case "Tue":
            startDay = 2;
            break;
        case "Wed":
            startDay = 3;
            break;
        case "Thu":
            startDay = 4;
            break;
        case "Fri":
            startDay = 5;
            break;
        case "Sat":
            startDay = 6;
            break;
        default:
            return []; // Devuelve un array vacío si no se puede determinar el día
    }

    // Generar el array basado en el día actual
    const days = [];
    for (let i = startDay; i < startDay + 7; i++) {
        days.push(i % 7); // El uso de % 7 asegura que el día vuelva a 0 después de 6
    }

    return days;
}


export const generateDailyTemperatureCards = (data) => {
    try {

        const { daily } = data;
        const { apparent_temperature_max, apparent_temperature_min } = daily;

        // Verifica que los datos existan
        if (!apparent_temperature_max || !apparent_temperature_min) {
            console.error("Datos de temperaturas diarias no encontrados.");
            return [];
        }
        // Obtener los días dinámicos empezando desde el día actual
        const dynamicDays = daysArray();
        // const climaAhora = estadDelClimaPorDia(data)

        const clima = estadDelClimaPorDia(data)
        // Generar las tarjetas para cada día
        const cards = apparent_temperature_max.map((max, index) => {
            // Obtener el día correspondiente desde el array dinámico
            const dayIndex = dynamicDays[index % dynamicDays.length];
            const min = apparent_temperature_min[index];


            return generateForecastWeek(max, min, dayIndex, clima[index]);
        });

        return cards;
    } catch (error) {
        console.log(`error en generateDailyTemperatureCards error : ${error}`)
    }
}


export const estadDelClimaPorDia = (data) => {
    try {

        const { daily } = data
        // console.log(hourly.precipitation[1])
        const { precipitation_sum, temperature_2m_min, wind_speed_10m_max, rain_sum, cloud_cover_mean, snowfall_sum } = daily
        // const end = Math.min(startGettingData + 6, precipitation_sum.length);

        const climaPorDias = []
        for (let i = 0; i <= 6; i++) {
            climaPorDias.push(determinarClima(precipitation_sum[i], temperature_2m_min[i], wind_speed_10m_max[i], rain_sum[i], cloud_cover_mean[i], snowfall_sum[i]))
        }
        return climaPorDias
    } catch (error) {
        console.error(`Error en la inicialización: ${error.message}`);
    }
}



// ! Funciones para el clima por horas


const hoursArray = () => {
    const fechaActual = new Date();

    // Obtener la hora, minutos y segundos actuales
    const horas = fechaActual.getHours(); // Horas (0-23)
    const arrayHours = []

    for (let i = horas; i < horas + 24; i++) {
        arrayHours.push(i % 24)
    }
    return arrayHours
}

const getTemperatureForHours = (data) => {

    const { hourly } = data
    const lista = hourly.temperature_2m
    // obtenemos la hora para saber desde donde comenzar a leer los datos 
    const startGettingData = hoursArray()[0]
    // es lo mismo que un for pero mas simple
    const temperatures = lista.slice(startGettingData, startGettingData + 24);
    return temperatures
}

export const enterDataPerHour = (data) => {
    // Obtener horas y temperaturas

    const horas = hoursArray();
    const temperatura = getTemperatureForHours(data);

    const stateDayPerHours = estadDelClimaPorHoras(data)
    // Generar tarjetas formateadas para cada hora y temperatura
    const cardsHTML = horas.map((hora, index) => {
        const temperaturaNow = temperatura[index]
        return generateForecastHours(hora, temperaturaNow, stateDayPerHours[index])
    }) // Unimos el HTML generado en un solo string
    return cardsHTML
};


export const estadDelClimaPorHoras = (data) => {
    try {

        const { hourly } = data
        // console.log(hourly.precipitation[1])
        const { precipitation, temperature_2m, wind_speed_10m, rain, cloud_cover, snowfall } = hourly

        const startGettingData = hoursArray()[0]
        const end = Math.min(startGettingData + 23, precipitation.length);

        const climaPorHoras = []
        for (let i = startGettingData; i <= end; i++) {
            climaPorHoras.push(determinarClima(precipitation[i], temperature_2m[i], wind_speed_10m[i], rain[i], cloud_cover[i], snowfall[i]))
        }
        return climaPorHoras
    } catch (error) {
        console.error(`Error en la inicialización: ${error.message}`);
    }
} 