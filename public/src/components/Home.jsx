import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Search, Wind, Droplets, Sun, BarChart2 } from "lucide-react";
import './styles/Home.css';

const Home = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [activeButton, setActiveButton] = useState("Today");
    const [isScrolled, setIsScrolled] = useState(false);
    const [error, setError] = useState(null);

    const API_KEY = '6bc3ad07adb84016a66115850242110';
    const city = 'Floridablanca';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios.get(
                    `/api/forecast.json?key=${API_KEY}&q=${city}&days=10&aqi=yes&alerts=yes`
                );
                setWeatherData(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching weather data:", err);
                if (err.response) {
                    setError(`Error ${err.response.status}: ${err.response.data.error?.message || 'Unknown error'}`);
                } else if (err.request) {
                    setError("No response received from server. Please check your internet connection.");
                } else {
                    setError("An error occurred while setting up the request.");
                }
                setWeatherData(null);
            }
        };

        fetchWeatherData();
    }, []);

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!weatherData) {
        return <div className="loading">Loading weather data...</div>;
    }

    const current = weatherData.current;
    const location = weatherData.location;
    const forecast = weatherData.forecast.forecastday;

    const renderForecastContent = () => {
        switch (activeButton) {
            case "Today":
                return renderTodayForecast(forecast[0]);
            case "Tomorrow":
                return renderTodayForecast(forecast[1]);
            case "Next 10 Days":
                return renderTenDayForecast(forecast);
            default:
                return null;
        }
    };

    const renderTodayForecast = (day) => (
        <>
            <div className="weather-cards">
                <div className="card">
                    <div className="card-header">
                        <Wind className="card-icon" />
                        <span className="card-title">Wind speed</span>
                    </div>
                    <p className="card-value">{day.day.maxwind_kph} km/h</p>
                    <p className="card-change increase">↑ 2 km/h</p>
                </div>
                <div className="card">
                    <div className="card-header">
                        <Droplets className="card-icon" />
                        <span className="card-title">Rain chance</span>
                    </div>
                    <p className="card-value">{day.day.daily_chance_of_rain}%</p>
                    <p className="card-change increase">↑ 10%</p>
                </div>
                <div className="card">
                    <div className="card-header">
                        <Sun className="card-icon" />
                        <span className="card-title">UV Index</span>
                    </div>
                    <p className="card-value">{day.day.uv}</p>
                    <p className="card-change decrease">↓ 0.3</p>
                </div>
                <div className="card">
                    <div className="card-header">
                        <BarChart2 className="card-icon" />
                        <span className="card-title">Pressure</span>
                    </div>
                    <p className="card-value">{day.hour[0].pressure_mb} hpa</p>
                    <p className="card-change increase">↑ 32 hpa</p>
                </div>
            </div>
            <div className="hourly-forecast">
                <h3>Hourly forecast</h3>
                <div className="hourly-scroll">
                    {day.hour.map((hour, index) => (
                        <div key={index} className="hourly-item">
                            <p>{new Date(hour.time).getHours()}:00</p>
                            <img src={hour.condition.icon} alt="Weather" />
                            <p>{Math.round(hour.temp_c)}°</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    const renderTenDayForecast = (forecastDays) => (
        <div className="ten-day-forecast">
            {forecastDays.map((day, index) => (
                <div key={index} className="forecast-day">
                    <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <img src={day.day.condition.icon} alt="Weather condition" />
                    <p>{Math.round(day.day.maxtemp_c)}°C / {Math.round(day.day.mintemp_c)}°C</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="box">
            <div className={`weather-box ${isScrolled ? 'scrolled' : ''}`}>
                <div className="search__bar">
                    <p>{location.name}, {location.country}</p>
                    <Search color="white" size={24} />
                </div>
                <div className="weather__info">
                    <div className="numeric_info">
                        <p className="degree__number">
                            {Math.round(current.temp_c)}°
                            <span className="subtext__degreenumber">
                                Feels like {Math.round(current.feelslike_c)}°
                            </span>
                        </p>
                    </div>
                    <div className="weather-icon">
                        <img src={current.condition.icon} alt="Weather" />
                        <p>{current.condition.text}</p>
                    </div>
                </div>
                <div className="weather-box__footer">
                    <p>{new Date(location.localtime).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
                    <div className="extra">
                        <p>Day {Math.round(forecast[0].day.maxtemp_c)}°</p>
                        <p>Night {Math.round(forecast[0].day.mintemp_c)}°</p>
                    </div>
                </div>
            </div>
            
            <div className="content">
                <div className="options">
                    <button 
                        className={activeButton === "Today" ? "active" : ""}
                        onClick={() => handleButtonClick("Today")}
                    >
                        Today
                    </button>
                    <button 
                        className={activeButton === "Tomorrow" ? "active" : ""}
                        onClick={() => handleButtonClick("Tomorrow")}
                    >
                        Tomorrow
                    </button>
                    <button 
                        className={activeButton === "Next 10 Days" ? "active" : ""}
                        onClick={() => handleButtonClick("Next 10 Days")}
                    >
                        Next 10 Days
                    </button>
                </div>

                <div className="forecast-content">
                    {renderForecastContent()}
                </div>

                {current.air_quality && (
                    <div className="air-quality">
                        <h3>Air Quality</h3>
                        <p>US EPA Index: {current.air_quality['us-epa-index']}</p>
                        <p>UK DEFRA Index: {current.air_quality['gb-defra-index']}</p>
                    </div>
                )}

                {weatherData.alerts && weatherData.alerts.alert && weatherData.alerts.alert.length > 0 && (
                    <div className="weather-alerts">
                        <h3>Weather Alerts</h3>
                        {weatherData.alerts.alert.map((alert, index) => (
                            <div key={index} className="alert">
                                <p><strong>{alert.event}</strong></p>
                                <p>{alert.headline}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;