const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'sensor_monitor'
});

db.connect(err => {
  if (err) {
    console.error("❌ XAMPP Error: Make sure MySQL is started in XAMPP Control Panel!");
  } else {
    console.log('✅ Connected to XAMPP Database!');
    const initTable = `
      CREATE TABLE IF NOT EXISTS control_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        device VARCHAR(20),
        value INT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    db.query(initTable, (err) => {
      if (err) console.error("Table Init Error:", err.message);
      else console.log("✅ Database Table is Ready");
    });
  }
});

const ARDUINO_PORT = 'COM4'; 
const port = new SerialPort({ path: ARDUINO_PORT, baudRate: 9600 });

port.on('open', () => console.log(`🔌 Serial Port ${ARDUINO_PORT} is now open.`));
port.on('error', (err) => console.error('❌ Serial Error: ', err.message));

app.post('/control', (req, res) => {
  const { device, value } = req.body; 
  
  if (!device || value === undefined) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const command = `${device}:${value}\n`;
  
  port.write(command, (err) => {
    if (err) {
      console.error("Write Error:", err.message);
      return res.status(500).json({ error: 'Failed to send to hardware' });
    }
    
    db.query('INSERT INTO control_history (device, value) VALUES (?, ?)', 
      [device === 'L' ? 'LED' : 'Motor', value], (dbErr) => {
        if (dbErr) console.error("DB Log Error:", dbErr.message);
      });
    
    console.log(`📤 Dispatched: ${command.trim()}`);
    res.json({ success: true, message: `Sent ${command.trim()}` });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 BACKEND SERVER RUNNING AT http://localhost:${PORT}`);
});
