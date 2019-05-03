// naimportuj modul s funkcí pro konverzi starých ikon na nové
import getWeatherIcon from './weather-icons';

const apiKey = '1b146c0d8108fce7d7cfdaacb4a5a2e1';
const apiUrlWeather = 'https://api.openweathermap.org/data/2.5/weather';
const apiUrlForecast = 'https://api.openweathermap.org/data/2.5/forecast';
const misto = 'Karolinka';

export default class Weather {
    constructor() { }

    getData() {
        fetch(`${apiUrlWeather}?APPID=${apiKey}&q=${misto}&units=metric&lang=cz`)
            .then(response => {
                response.json()
                    .then(data => this.displayData(data));
            })
            .catch(error => {
                console.log(`Došlo k chybě: ${error}`);
            });
    }

    displayData(data) {

        console.log(data);

        console.log(`název místa:: ${data.name}`);
        console.log(`aktuální teplota: ${data.main.temp}`);
        console.log(`slovní popis počasí: ${data.weather[0].description}`);
        console.log(`ID počasí: ${data.weather[0].id}`);
        console.log(`ikona počasí: ${data.weather[0].icon}`);
        console.log(`vlhkost vzduchu: ${data.main.humidity}`);
        console.log(`rychlost větru: ${data.wind.speed}`);
        console.log(`čas východu slunce: ${data.sys.sunrise}`);
        console.log(`čas západu slunce: ${data.sys.sunset}`);

        const mesto = document.querySelector('#mesto');
        mesto.textContent = data.name;

        const teplota = document.querySelector('#teplota');
        teplota.textContent = Math.round(data.main.temp);

        const popis = document.querySelector('#popis');
        popis.textContent = data.weather[0].description;

        const ikona = document.querySelector('#ikona');
        let novaIkona = getWeatherIcon(data.weather[0].id, data.weather[0].icon);
        console.log(`Nova ikona: ${novaIkona}`);

        ikona.innerHTML = novaIkona;  //data.weather[0].description;

        const vitr = document.querySelector('#vitr');
        vitr.textContent = data.wind.speed.toFixed(1);

        const vlhkost = document.querySelector('#vlhkost');
        vlhkost.textContent = data.main.humidity;

        const vychod = document.querySelector('#vychod');
        vychod.textContent = this.UnixTimestampToTime(data.sys.sunrise);

        const zapad = document.querySelector('#zapad');
        zapad.textContent = this.UnixTimestampToTime(data.sys.sunset);;
    }

    UnixTimestampToTime(hotnotaUnixTimestamp) {

        // převede UNIX timestamp (hotnotaUnixTimestamp) na javascriptový objekt datum/čas
        let datum = new Date(hotnotaUnixTimestamp * 1000);

        // z datumu pak můžeme získat hodiny, minuty (a další) pomocí vestavěných metod
        let hodiny = datum.getHours();
        let minuty = datum.getMinutes();
        return `${hodiny}:${minuty}`;
    }

    UnixTimestampToDayAndDate(hodnotaUnixTimestamp) {

        let datum = new Date(hodnotaUnixTimestamp * 1000);

        let denCislo = datum.getDay();

        let kolikatyDenMesice = datum.getDate();

        let mesic = datum.getMonth();
        mesic = mesic + 1; // korekce mesice
        if (mesic > 12) {
            mesic = mesic % 12;
        }

        // ze switche udelat metodu kdyz bude cas
        let den = '';

        switch (denCislo) {
            case 0:
                den = 'Neděle';
                break;
            case 1:
                den = "Pondělí";
                break;
            case 2:
                den = "Úterý";
                break;
            case 3:
                den = "Středa";
                break;
            case 4:
                den = "Čtvrtek";
                break;
            case 5:
                den = "Pátek";
                break;
            case 6:
                den = "Sobota";
        }
        return `${den} ${kolikatyDenMesice}.${mesic}.`;
    }


    getDataForecast() {

        fetch(`${apiUrlForecast}?APPID=${apiKey}&q=${misto}&units=metric&lang=cz`)
            .then(response => {
                response.json()
                    .then(data => this.displayDataForecast(data));
            })
            .catch(error => {
                console.log(`Došlo k chybě: ${error}`);
            });
    }

    displayDataForecast(data) {

        console.log(data);

        let htmlObsah = '';

        for (let i = 8; i <= 32; i += 8) {

            let hodnotaUnixTimestamp = data.list[i].dt;
            let predpovedDen = this.UnixTimestampToDayAndDate(hodnotaUnixTimestamp);

            let teplota = Math.round(data.list[i].main.temp);

            let ikona = getWeatherIcon(data.list[i].weather[0].id, data.list[i].weather[0].icon);
            console.log(`ikona: ${ikona}`);

            htmlObsah += `<div class="forecast">
                            <div class="forecast__day">${predpovedDen}</div>
                            <div class="forecast__icon">
                            ${ikona}
                            </div>
                            <div class="forecast__temp">${teplota} °C</div>
                        </div>`
        }

        const predpoved = document.querySelector('#predpoved');
        predpoved.innerHTML = htmlObsah;
    }

}