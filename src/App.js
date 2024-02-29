import hotBg from "./assets/hot.jpg"
import coldBg from "./assets/cold.jpg"
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";
function App() {
const [city, setCity] = useState('berlin')
const [weather, setWeather] = useState(null)
const [units, setUnits] = useState('metric')
const [bg, setBg] = useState(coldBg)

useEffect(() => {
  const fetchWeatherData = async () => {
    try {
      const data = await getFormattedWeatherData(city, units);
      if (!data) {
        throw new Error("Could not get weather data.");
      }
      setWeather(data);

      const threshold = units === "metric" ? 20 : 60;
      setBg(data.temp <= threshold ? coldBg : hotBg);
    } catch (error) {
      console.error(error);
      alert("An error occurred while obtaining weather data. Please verify that the city entered is valid and try again.");
    }
  };
  fetchWeatherData();
}, [units, city]);

const handleUnitsClick = (e) => {
  const button = e.currentTarget;
  const currentUnit = button.innerText.slice(1)
  
  const isCelsius = currentUnit === "C";
  button.innerText = isCelsius ? "ºF" : "ºC";
  setUnits(isCelsius ? "imperial" : "metric");
}
const enterKeyPressed = (e) => {
  if(e.keyCode === 13) {
    setCity(e.target.value)
  e.currentTarget.blur()
  }
}

  return (
    <div className="app" style={{backgroundImage:`url(${bg})`}}>
      <div className="overlay">
        {
          weather && (
            <div className="container">
            <div className="section section__inputs">
            <label for="city-input">City:</label>
              <input onKeyDown={enterKeyPressed} type="text" name="city" placeholder="Enter city..." />
              <button aria-label="Change temperature units" onClick={(e) => handleUnitsClick(e)}>ºF</button>
            </div>
            <div className="section section__temperature">
                <div className="icon">
                  <h3>{`${weather.name}, ${weather.country}`}</h3>
                  <img src={weather.iconURL} alt="weatherIcon" />
                  <h3>{weather.description}</h3>
                </div>
                <div className="temperature">
                  <h1>{`${weather.temp.toFixed()} º${units === "metric" ? "C":
                "F"}`}</h1>
                </div>
            </div>
            {/* bottom description */}
            <Descriptions weather={weather} units={units}/>
  
  
          </div>
          )
        }
       
      </div>

    </div>
  );
}

export default App;
