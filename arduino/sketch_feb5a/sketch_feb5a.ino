const int LED_PINS[] = {13, 12, 8, 7};

const int ENA = 9;
const int IN3 = 10;
const int IN4 = 11;

const int ENB = 3;
const int IN1 = 5;
const int IN2 = 6;

void setup() {
  Serial.begin(9600); 

  for (int i = 0; i < 4; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }

  pinMode(ENA, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);

  stopMA();
  stopMB();

  allLEDs(HIGH);
  delay(300);
  allLEDs(LOW);
}

void loop() {
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
  if (device == "L1") digitalWrite(LED_PINS[0], value > 0 ? HIGH : LOW);
  else if (device == "L2") digitalWrite(LED_PINS[1], value > 0 ? HIGH : LOW);
  else if (device == "L3") digitalWrite(LED_PINS[2], value > 0 ? HIGH : LOW);
  else if (device == "L4") digitalWrite(LED_PINS[3], value > 0 ? HIGH : LOW);

  else if (device == "MA") {
    if (value > 0) {
      digitalWrite(IN3, HIGH); 
      digitalWrite(IN4, LOW); 
      analogWrite(ENA, value);
    } else {
      stopMA();
    }
  }

  else if (device == "MB") {
    if (value > 0) {
      digitalWrite(IN1, HIGH); 
      digitalWrite(IN2, LOW); 
      analogWrite(ENB, value);
    } else {
      stopMB();
    }
  }
}

void stopMA() {
  analogWrite(ENA, 0);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void stopMB() {
  analogWrite(ENB, 0);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
}

void allLEDs(int state) {
  for (int i = 0; i < 4; i++) {
    digitalWrite(LED_PINS[i], state);
  }
}
