const int LED_PINS[] = {13, 12, 8, 7}; 

// Motor A (MA)
const int ENA = 9;
const int IN3 = 10;
const int IN4 = 11;

// Motor B (MB)
const int ENB = 3;
const int IN1 = 5;
const int IN2 = 6;

void setup() {
  Serial.begin(9600); // Must match server.js baudRate

  // Initialize LEDs
  for (int i = 0; i < 4; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }

  // Initialize Motor A
  pinMode(ENA, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  // Initialize Motor B
  pinMode(ENB, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);

  // Startup Test (Quick Flash)
  allLEDs(HIGH);
  delay(500);
  allLEDs(LOW);
}

void loop() {
  // Check if server.js sent a command (e.g., "L1:255\n" or "MA:120\n")
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    data.trim(); 

    int separatorIndex = data.indexOf(':');
    if (separatorIndex != -1) {
      String device = data.substring(0, separatorIndex);
      int value = data.substring(separatorIndex + 1).toInt();

      handleCommand(device, value);
    }
  }
}

void handleCommand(String device, int value) {
  // LED Logic (L1-L4)
  // React sends 0-255. We treat > 0 as ON for basic LEDs.
  if (device == "L1") digitalWrite(LED_PINS[0], value > 0 ? HIGH : LOW);
  else if (device == "L2") digitalWrite(LED_PINS[1], value > 0 ? HIGH : LOW);
  else if (device == "L3") digitalWrite(LED_PINS[2], value > 0 ? HIGH : LOW);
  else if (device == "L4") digitalWrite(LED_PINS[3], value > 0 ? HIGH : LOW);

  // Motor A Logic (MA)
  else if (device == "MA") {
    if (value > 0) {
      // Direction: Forward (matching friend's forward logic)
      digitalWrite(IN3, HIGH); 
      digitalWrite(IN4, LOW); 
      analogWrite(ENA, value); // Speed from slider (0-255)
    } else {
      digitalWrite(ENA, LOW); // Stop
    }
  }

  // Motor B Logic (MB)
  else if (device == "MB") {
    if (value > 0) {
      // Direction: Forward (matching friend's forward logic)
      digitalWrite(IN1, HIGH); 
      digitalWrite(IN2, LOW); 
      analogWrite(ENB, value); // Speed from slider (0-255)
    } else {
      digitalWrite(ENB, LOW); // Stop
    }
  }
}

void allLEDs(int state) {
  for (int i = 0; i < 4; i++) {
    digitalWrite(LED_PINS[i], state);
  }
}
