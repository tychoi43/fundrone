document.addEventListener('DOMContentLoaded', function() {
    // Weather API constants
    const WEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your actual API key
    const DEFAULT_CITY = 'Seoul'; // Default city for weather information
    
    // Weather elements
    const currentTemp = document.getElementById('current-temp');
    const currentConditions = document.getElementById('current-conditions');
    const windSpeed = document.getElementById('wind-speed');
    const flightRecommendation = document.getElementById('flight-recommendation');
    const weatherIcon = document.querySelector('.weather-icon i');
    
    // Fetch the weather data
    function getWeatherData() {
        // If you don't have an API key yet, use demo data
        if (WEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
            setDemoWeatherData();
            return;
        }
        
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&units=metric&appid=${WEATHER_API_KEY}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                updateWeatherUI(data);
            })
            .catch(error => {
                console.error('There was a problem fetching the weather data:', error);
                setDemoWeatherData(); // Fallback to demo data
            });
    }
    
    // Update the UI with weather data
    function updateWeatherUI(data) {
        const temperature = Math.round(data.main.temp);
        const conditions = data.weather[0].description;
        const wind = data.wind.speed;
        
        currentTemp.textContent = `${temperature}°C`;
        currentConditions.textContent = capitalizeFirstLetter(conditions);
        windSpeed.textContent = `풍속: ${wind} m/s`;
        
        // Set weather icon based on conditions
        setWeatherIcon(data.weather[0].icon);
        
        // Set flight recommendation
        setFlightRecommendation(temperature, wind, data.weather[0].id);
    }
    
    // Set the appropriate weather icon
    function setWeatherIcon(iconCode) {
        let iconClass = 'fa-cloud-sun'; // Default icon
        
        if (iconCode.includes('01')) {
            iconClass = 'fa-sun'; // Clear sky
        } else if (iconCode.includes('02')) {
            iconClass = 'fa-cloud-sun'; // Few clouds
        } else if (iconCode.includes('03') || iconCode.includes('04')) {
            iconClass = 'fa-cloud'; // Scattered/broken clouds
        } else if (iconCode.includes('09')) {
            iconClass = 'fa-cloud-showers-heavy'; // Shower rain
        } else if (iconCode.includes('10')) {
            iconClass = 'fa-cloud-rain'; // Rain
        } else if (iconCode.includes('11')) {
            iconClass = 'fa-bolt'; // Thunderstorm
        } else if (iconCode.includes('13')) {
            iconClass = 'fa-snowflake'; // Snow
        } else if (iconCode.includes('50')) {
            iconClass = 'fa-smog'; // Mist, fog, etc.
        }
        
        // Remove all icon classes and add the correct one
        weatherIcon.className = '';
        weatherIcon.classList.add('fas', iconClass);
    }
    
    // Set flight recommendation based on weather conditions
    function setFlightRecommendation(temp, wind, weatherId) {
        let recommendation = '';
        let isGoodWeather = true;
        let reasons = [];
        
        // Temperature check
        if (temp < 0) {
            isGoodWeather = false;
            reasons.push('저온은 배터리 성능을 저하시킬 수 있습니다');
        } else if (temp > 35) {
            isGoodWeather = false;
            reasons.push('고온은 드론 전자장치에 안 좋습니다');
        }
        
        // Wind check
        if (wind > 8) {
            isGoodWeather = false;
            reasons.push('강한 바람은 드론 조종을 어렵게 합니다');
        }
        
        // Weather condition check
        if (weatherId >= 200 && weatherId < 300) { // Thunderstorm
            isGoodWeather = false;
            reasons.push('번개가 치는 날씨에는 드론 비행을 피해야 합니다');
        } else if (weatherId >= 300 && weatherId < 600) { // Drizzle, Rain, Snow
            isGoodWeather = false;
            reasons.push('비나 눈은 드론 전자장치에 손상을 줄 수 있습니다');
        } else if (weatherId >= 700 && weatherId < 800) { // Atmosphere (fog, mist, etc.)
            isGoodWeather = false;
            reasons.push('안개로 인해 시야가 제한됩니다');
        }
        
        if (isGoodWeather) {
            recommendation = '오늘은 드론 비행에 적합한 날씨입니다! 즐거운 비행 되세요.';
            flightRecommendation.style.color = 'green';
        } else {
            recommendation = `드론 비행 주의: ${reasons.join(', ')}.`;
            flightRecommendation.style.color = '#e74c3c';
        }
        
        flightRecommendation.textContent = recommendation;
    }
    
    // Demo weather data for when API key is not available
    function setDemoWeatherData() {
        const demoData = {
            main: {
                temp: 22.5
            },
            weather: [
                {
                    description: '맑음',
                    icon: '01d',
                    id: 800
                }
            ],
            wind: {
                speed: 3.5
            }
        };
        
        updateWeatherUI(demoData);
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Get weather data on page load
    getWeatherData();
    
    // Update weather data every 30 minutes
    setInterval(getWeatherData, 30 * 60 * 1000);
}); 