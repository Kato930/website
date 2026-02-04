import { useState } from "react";
import { updateMotor } from "../api";

function MotorControl({ id }) {
  const [isOn, setIsOn] = useState(false);
  const [speed, setSpeed] = useState(150);

  const toggleMotor = async () => {
    const newState = !isOn;
    setIsOn(newState);
    await updateMotor(id, newState, speed);
  };

  const changeSpeed = async (e) => {
    const value = Number(e.target.value);
    setSpeed(value);
    await updateMotor(id, isOn, value);
  };

  return (
    <div className="card">
      <h3>⚙️ Motor {id}</h3>

      <button onClick={toggleMotor}>
        {isOn ? "Stop Motor" : "Start Motor"}
      </button>

      <label>Speed: {speed}</label>
      <input
        type="range"
        min="0"
        max="255"
        value={speed}
        onChange={changeSpeed}
        disabled={!isOn}
      />
    </div>
  );
}

export default MotorControl;
