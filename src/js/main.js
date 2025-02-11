console.log("Estamos conectados")



import { fetchWeatherData, fetchLocation } from "./data.js";
import { initSwiper } from "./carrusel.js";
import { generateWeatherCurrent } from "./html.js";
import { generateDailyTemperatureCards, enterDataPerHour } from "./logic.js"

const inputTxt = document.querySelector(".weather__form--input")
const buttonSearch = document.querySelector(".weather--search")

const displayCurrent = document.querySelector(".weather__current")
const displayDays = document.querySelector(".forecast--week")
const displayHours = document.querySelector(".forecast--hours")

const modal = document.querySelector(".modal")
const modal__texto = document.querySelector(".modal__texto")

const renderCard = async (dataWeatherCard, querySelector) => {
    try {
        const weatherContainer = document.querySelector(querySelector)

        // Validar que el contenedor existe
        if (!weatherContainer) {
            throw new Error(`No se encontró un elemento con el selector: "${querySelector}"`);
        }
        // Generar todas las tarjetas

        //inyectamos el Html         
        weatherContainer.innerHTML = dataWeatherCard
    } catch (error) {
        console.log(`Error al renderizar la tarjeta del clima ${error}`)
    }
}

const renderCards = (cards, querySelector) => {
    try {
        const weatherContainer = document.querySelector(querySelector);

        if (!weatherContainer) {
            throw new Error(`No se encontró un elemento con el selector: "${querySelector}"`);
        }

        // Generar todas las tarjetas y unirlas en un solo string
        weatherContainer.innerHTML = cards.join('');
    } catch (error) {
        console.error(`Error al renderizar las tarjetas del clima: ${error}`);
    }
};

const Validar = (inputTxt) => {
    const inputValue = inputTxt.trim(); // Elimina espacios al inicio y final
    if (inputValue === "") {
        console.log("El campo está vacío");
        return false; // Retorna false si está vacío
    }
    console.log("Texto ingresado:", inputValue);

    return inputValue; // Retorna el texto si no está vacío
};

const buscar = async (inputTxt) => {
    try {
        hideCards()
        const inputValue = Validar(inputTxt); // Obtiene el valor validado
        if (!inputValue) {
            modal__texto.textContent = "El campo está vacío, por favor escriba el nombre de alguna ciudad";

            return;
        } // Si es false, no ejecuta la búsqueda
        modal__texto.textContent = "Cargando.....";

        console.log(inputValue)

        const localization = await fetchLocation(inputValue)

        const { lat, lon } = localization[0]

        const data = await fetchWeatherData(lat, lon);

        cards(data)
        console.log("Buscando datos para:", inputValue);

        return data

    } catch (error) {
        console.error(`Error en la inicialización: ${error.message}`);
    }
}

const showCards = () => {
    displayCurrent.classList.remove("none")
    displayDays.classList.remove("none")
    displayHours.classList.remove("none")
    modal.classList.add("none")

}
const hideCards = () => {
    displayCurrent.classList.add("none")
    displayDays.classList.add("none")
    displayHours.classList.add("none")
    modal.classList.remove("none")
    console.log(modal.classList)
}

const cards = (data) => {

    showCards()
    // Renderizar el clima actual
    const currentWeatherCard = generateWeatherCurrent(data);
    renderCard(currentWeatherCard, '.weather__current');

    // Renderizar el pronóstico semanal
    const forecastDayCards = generateDailyTemperatureCards(data)
    renderCards(forecastDayCards, '.forecast--week');

    const forecastHours = enterDataPerHour(data)
    renderCards(forecastHours, '.forecast-swiper-wrapper')
    initSwiper();

}

const init = async () => {
    try {

        inputTxt.addEventListener("input", () => Validar(inputTxt.value));

        buttonSearch.addEventListener("click", (event) => {
            event.preventDefault(); // Evita que el formulario se envíe y la página se recargue
            buscar(inputTxt.value)
        });
    } catch (error) {
        console.error(`Error en la inicialización: ${error.message}`);
    }

};

init();

