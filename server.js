const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. DATABASE CONFIGURATION (Auto-Initialization)
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: ''
};

const db = mysql.createConnection(dbConfig);

db.connect(err => {
  if (err) {
    console.error("❌ XAMPP Error: Make sure MySQL is started in XAMPP!");
    return;
  }
  
  console.log('✅ Connected to MySQL Server...');

  // Create database if missing
  db.query(`CREATE DATABASE IF NOT EXISTS sensor_monitor`, (err) => {
    if (err) return console.error("❌ DB Creation Error:", err.message);
    
    db.query(`USE sensor_monitor`, (err) => {
      if (err) return console.error("❌ Error switching DB:", err.message);
      
      console.log("✅ Using 'sensor_monitor' database.");

      // Create history table
      const initTable = `
        CREATE TABLE IF NOT EXISTS control_history (
          id INT AUTO_INCREMENT PRIMARY KEY,
          device VARCHAR(20),
          value INT,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      db.query(initTable, (err) => {
        if (err) console.error("❌ Table Init Error:", err.message);
        else console.log("✅ Database & Table are Ready");
      });
    });
  });
});

// 2. ARDUINO SERIAL CONNECTION
// Update 'COM4' to your actual Arduino Port
const ARDUINO_PORT = 'COM4'; 
const port = new SerialPort({ path: ARDUINO_PORT, baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

port.on('open', () => console.log(`🔌 Serial Bridge Open on ${ARDUINO_PORT}`));
port.on('error', (err) => console.error('❌ Serial Error: ', err.message));

// 3. CONTROL ENDPOINT (Matches the 6-Device React UI)
app.post('/control', (req, res) => {
  const { device, value } = req.body; 
  const command = `${device}:${value}\n`;
  
  // Forward command to Arduino
  port.write(command, (err) => {
    if (err) {
      console.error("❌ Write Error:", err.message);
      return res.status(500).json({ error: 'Serial failed' });
    }
    
    // Log the specific device ID (L1, L2, L3, L4, MA, or MB)
    db.query('INSERT INTO control_history (device, value) VALUES (?, ?)', [device, value]);
    
    console.log(`📤 Dispatched [${device}] -> ${value}`);
    res.json({ success: true });
  });
});

app.listen(5000, () => {
  console.log('🚀 BACKEND ONLINE at http://localhost:5000');
});
