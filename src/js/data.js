
export const fetchLocation = async (ciudad) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${ciudad}&format=json`)
        // const response = await fetch(`/public/data/mock-clima.json`)

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json()
        return data
    }
    catch (error) {
        console.log(`Error al conectarse a la Api ${error}`)
    };
}


export const fetchWeatherData = async (lat, lon) => {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,cloud_cover,surface_pressure,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation,rain,showers,snowfall,cloud_cover,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,wind_speed_10m_max&timezone=auto&daily=cloud_cover_mean`)
        // const response = await fetch(`/public/data/mock-data.json`)

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json()
        return data
    }
    catch (error) {
        console.log(`Error al conectarse a la Api ${error}`)
    };
}