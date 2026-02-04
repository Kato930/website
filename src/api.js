const BASE_URL = "http://localhost:5000/api";

export const updateLed = async (id, state, brightness) => {
  await fetch(`${BASE_URL}/led`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, state, brightness }),
  });
};

export const updateMotor = async (id, state, speed) => {
  await fetch(`${BASE_URL}/motor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, state, speed }),
  });
};
