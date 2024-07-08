let cityInput = document.getElementById('city-input'),
searchBtn = document.getElementById('search-button'),
locationBtn = document.getElementById('location-button'),
api_key = '904230aa7fc127fc6da923a01842a064',
currentWeatherCard = document.querySelectorAll('.weather-left .box')[0];
let fiveDaysForecastCard = document.querySelector('.day-forecast'),
aqiCard  = document.querySelectorAll('.highlights .box')[0],
sunriseCard = document.querySelectorAll('.highlights .box')[1],
humidityVal = document.getElementById('humidity'),
pressureVal = document.getElementById('pressure'),
visibilityVal = document.getElementById('visibility'),
feelslikeVal = document.getElementById('feelslike'),
hourlyForecastCard = document.querySelector('.hourly-forecast')
aqiList = ['Good','fair','Moderate','Poor','Very Poor'];

function getWeatherDetails(name,lat,lon,country,state){
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
    let AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`
    let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]
    let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ]
    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let {co ,no,o3,so2,pm2_5} = data.list[0].components;
        aqiCard.innerHTML = `
        <div class="box-head">
        <p>Air Quality Index</p>
        <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi-1]}</p>
    </div>
    <div class="air-indices">
        <i class="fa-solid fa-wind"></i>
        <div class="item">
            <p>PM2.5</p>
            <h2>${pm2_5}</h2>
        </div>
        <div class="item">
            <p>SO2</p>
            <h2>${so2}</h2>
        </div>
        <div class="item">
            <p>CO</p>
            <h2>${co}</h2>
        </div>
        <div class="item">
            <p>NO</p>
            <h2>${no}</h2>
        </div>
        <div class="item">
            <p>O3</p>
            <h2>${o3}</h2>
        </div>
    </div>
        `
    }).catch(()=>{
        alert('Failed to fetch pollution values')
    })
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
        <div class="current-weather">
            <div class="details">
                <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
            </div>
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
            </div>
            </div>
                <hr>
                <div class="box-footer">
                    <p><i class="fas fa-calendar-alt"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} 
                    ${date.getFullYear()}</p>
                    <p><i class="fa-solid fa-location-dot"></i>${name}, ${country}</p>
                </div>
        `;
        let {sunrise,sunset} = data.sys,
        {timezone,visibility} = data,
        {humidity, pressure, feels_like} = data.main,
        sRiseTime  = moment.utc(sunrise,'X').add(timezone,'seconds').format('hh:mm A'),
        sSetTime = moment.utc(sunset,'X').add(timezone,'seconds').format('hh:mm A');
        sunriseCard.innerHTML = `
        <div class="box-head">
        <p>Sunrise - Sunset</p>
        <div class="item">
            <div class="icon">
                <i class="fas fa-sun"></i>
            </div>
            <div class="details">
                <p>sunrise</p>
                <h2>${sRiseTime}</h2>
            </div>
        </div>
        <div class="item">
            <div class="icon">
                <i class="far fa-sun"></i>
            </div>
            <div class="details">
                <p>sunset</p>
                <h2>${sSetTime}</h2>
            </div>
        </div>
    </div>
        `;
        humidityVal.innerHTML=`${humidity}%`;
        pressureVal.innerHTML = `${pressure}hpa`;
        visibilityVal.innerHTML = `${visibility/1000}km`;
        feelslikeVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;

    }).catch(()=>{
        alert('Failed to fetch current weather')
    })
    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let hourlyForecast  = data.list;
        hourlyForecastCard.innerHTML = ``;
        for(let i=0;i<=7;i++){
            let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a ='PM';
            if(hr < 12) a ='AM';
            if(hr == 0) hr = 12;
            if(hr > 12) hr = hr - 12;
            hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="Weather Icon 3 AM">
                <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
            `;
        }
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast =>{
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate)
            }
        })
        fiveDaysForecastCard.innerHTML = '';
        for(let i=1;i<fiveDaysForecast.length;i++){
            let date = new Date(fiveDaysForecast[i].dt_txt);
            console.log(date.getMonth())
            fiveDaysForecastCard.innerHTML += `
            <div class="forecast-item">
            <div class="icon-wrapper">
                <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="Weather Icon">
                <div class="temperature">
                    <p><span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span></p>
                </div>
                <div class="forecast-details">
                    <div class="para1">
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    </div>
                    <div class="para2">
                        <p>${days[date.getDay()]}</p>
                    </div>
                </div>
            </div>
        </div>`
        }
    })
    // .catch(()=>{
    //     alert('Failed to fetch current weather2')
    // })

}

function getCityCoordinates(){
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if(!cityName) return ;
    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
        let {name,lat,lon,country,state} = data[0]
        getWeatherDetails(name,lat,lon,country,state)
    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`)
    })

}

function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude,longitude} = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            let {name,country,state} = data[0];
            getWeatherDetails(name,latitude,longitude,country,state);
        }).catch(()=>{
            alert('Failed to fetch user coordinates');
        })
    })
}

searchBtn.addEventListener('click',getCityCoordinates);
locationBtn.addEventListener('click',getUserCoordinates);
