import React from "react";
import search from "../assets/img/search_white.png"
import weatherimg from "../assets/img/weather.png"
import './styles/Home.css'

const Home = () => {
    return (
        <div className="box">
            <div className="weather-box">
                <div className="search__bar">
                    <p>Kharkiv,Ukraine</p>
                    <img src={search} alt="" />
                </div>
                <div className="weather__info">
                    <div className="numeric_info">
                        <p className="degree__number">3°<sub className="subtext__degreenumber">Feels like -2°</sub></p>
                    </div>
                    <div>
                        <img src={weatherimg} alt="" /><p>Cloudy</p>
                    </div>
                </div>
                <div className="weather-box__footer">
                        <p>January 18, 16:14</p>
                        <div className="extra">
                            <p>Day 3°</p>
                            <p>Night -1°</p>
                        </div>
                    </div>
            </div>
            <div>

            </div>
            <div>

            </div>
            <div>

            </div>
            <div>

            </div>

        </div>
    );
};

export default Home;