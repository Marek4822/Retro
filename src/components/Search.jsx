import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { api_key } from "./Api.jsx";
import locationIcon from "../assets/location.png";

export default function Search() {
  const [data, setData] = useState("");
  const [location, setLocation] = useState("");

  const url = `http://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${location}&days=7&aqi=no&alerts=no`;

  const searchLocation = (e) => {
    if (e.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
      });
      setLocation("");
    }
  };

  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const searchGeolocation = () => {
    const successCallback = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    navigator.geolocation.getCurrentPosition(successCallback);

    const geolocation = `http://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`;

    axios.get(geolocation).then((response) => {
      setData(response.data);
      console.log(response.data);
    });
    setLocation("");
  };

  const settings = {
    className: "center",
    infinite: true,
    slidesToShow: 4,
    swipeToSlide: true,
    slidesToScroll: 1,
    arrows: false,
  };

  const date = new Date();
  let currentHour = date.getHours();
  const forecast = data?.forecast?.forecastday[0]?.hour || [];

  return (
    <div className="main">
      <div className="section">
        <div className="search">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={searchLocation}
            placeholder="Type City..."
          />
          <button onClick={searchGeolocation}>
            <img src={locationIcon} />
          </button>
        </div>
        {data ? (
          <div>
            <div className="verticalData">
              <p>{data.location.name}</p>
              <p>{data.location.country}</p>
              <img src={data.current.condition.icon} alt="WeatherCondition" />

              <p>{data.current.temp_c}°C</p>

              <p>{data.current.condition.text}</p>

              <div className="horizontalData">
                <p>
                  {data.current.wind_kph} km/h <p>Wind</p>
                </p>
                <p>
                  {data.current.humidity}% <p>Humidity</p>
                </p>
                <p>
                  {data.current.feelslike_c}°C
                  <p>Feels </p>
                </p>
                <p>
                  {
                    data.forecast.forecastday[0].hour[currentHour]
                      .chance_of_rain
                  }
                  %<p>Chance of rain</p>{" "}
                </p>
              </div>
            </div>

            <div className="slider">
              <Slider {...settings} initialSlide={currentHour - 2}>
                {forecast.map((forecastDay, index) => (
                  <div className="sliderDiv" key={index}>
                    <li>
                      {forecastDay.time.split(" ")[1]}
                      <img src={forecastDay.condition.icon} />
                      {forecastDay.temp_c}°C
                    </li>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
