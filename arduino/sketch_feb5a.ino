const int LED_PIN = 9;     
const int MOTOR_PWM = 3;   
const int MOTOR_DIR1 = 4;  
const int MOTOR_DIR2 = 5;  

void setup() {
  Serial.begin(9600);
  
  pinMode(LED_PIN, OUTPUT);
  pinMode(MOTOR_PWM, OUTPUT);
  pinMode(MOTOR_DIR1, OUTPUT);
  pinMode(MOTOR_DIR2, OUTPUT);
  
  digitalWrite(MOTOR_DIR1, HIGH);
  digitalWrite(MOTOR_DIR2, LOW);
  
  analogWrite(LED_PIN, 0);
  analogWrite(MOTOR_PWM, 0);
  
  Serial.println("ARDUINO_ONLINE");
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    
    if (input.startsWith("L:")) {
      int val = input.substring(2).toInt();
      analogWrite(LED_PIN, constrain(val, 0, 255));
    } 
    
    else if (input.startsWith("M:")) {
      int val = input.substring(2).toInt();
      int speed = constrain(val, 0, 255);
      
      if (speed > 0) {
        digitalWrite(MOTOR_DIR1, HIGH);
        digitalWrite(MOTOR_DIR2, LOW);
      }
      
      analogWrite(MOTOR_PWM, speed);
    }
  }
}
