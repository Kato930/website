import { useState } from "react";
import { updateLed } from "../api";

function LedControl({ id }) {
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(128);

  const toggleLed = async () => {
    const newState = !isOn;
    setIsOn(newState);
    await updateLed(id, newState, brightness);
  };

  const changeBrightness = async (e) => {
    const value = Number(e.target.value);
    setBrightness(value);
    await updateLed(id, isOn, value);
  };

  return (
    <div className="card">
      <h3>💡 LED {id}</h3>

      <button onClick={toggleLed}>
        {isOn ? "Turn OFF" : "Turn ON"}
      </button>

      <label>Brightness: {brightness}</label>
      <input
        type="range"
        min="0"
        max="255"
        value={brightness}
        onChange={changeBrightness}
        disabled={!isOn}
      />
    </div>
  );
}

export default LedControl;
