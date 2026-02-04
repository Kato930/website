import React, { useState } from 'react';
import { Lightbulb, Fan, Power, Activity } from 'lucide-react';

function App() {
  const [ledValue, setLedValue] = useState(0);
  const [motorValue, setMotorValue] = useState(0);
  const [isLedOn, setIsLedOn] = useState(false);
  const [isMotorOn, setIsMotorOn] = useState(false);

  const sendCommand = async (device, value) => {
    try {
      await fetch('http://localhost:5000/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device, value: parseInt(value) })
      });
    } catch (err) {
      console.warn("Backend connection failed. Run 'node server.js' first!");
    }
  };

  const handleLedToggle = () => {
    const newValue = isLedOn ? 0 : 255;
    setIsLedOn(!isLedOn);
    setLedValue(newValue);
    sendCommand('L', newValue);
  };

  const handleMotorToggle = () => {
    const newValue = isMotorOn ? 0 : 255;
    setIsMotorOn(!isMotorOn);
    setMotorValue(newValue);
    sendCommand('M', newValue);
  };

  const handleLedSlider = (e) => {
    const val = e.target.value;
    setLedValue(val);
    setIsLedOn(val > 0);
    sendCommand('L', val);
  };

  const handleMotorSlider = (e) => {
    const val = e.target.value;
    setMotorValue(val);
    setIsMotorOn(val > 0);
    sendCommand('M', val);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0f172a', 
      color: 'white',
      padding: '48px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    wrapper: {
      maxWidth: '800px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    },
    header: {
      textAlign: 'center'
    },
    title: {
      fontSize: '48px',
      fontWeight: '900',
      letterSpacing: '-2px',
      color: '#818cf8', 
      margin: 0
    },
    subtitle: {
      color: '#64748b', 
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '4px',
      marginTop: '8px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px'
    },
    card: {
      backgroundColor: '#1e293b',
      padding: '32px',
      borderRadius: '40px',
      border: '1px solid #334155',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px'
    },
    iconBox: (active, color) => ({
      padding: '20px',
      borderRadius: '24px',
      transition: 'all 0.5s ease',
      backgroundColor: active ? color : '#334155',
      color: active ? 'white' : '#64748b',
      boxShadow: active ? `0 0 40px ${color}66` : 'none'
    }),
    powerBtn: (active) => ({
      padding: '16px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: active ? '#6366f1' : '#334155',
      color: 'white'
    }),
    valueLabel: {
      fontSize: '10px',
      fontWeight: '900',
      textTransform: 'uppercase',
      color: '#64748b',
      letterSpacing: '2px',
      marginBottom: '4px'
    },
    valueDisplay: (color) => ({
      fontSize: '64px',
      fontFamily: 'monospace',
      fontWeight: '900',
      color: color,
      marginBottom: '32px'
    }),
    slider: {
      width: '100%',
      height: '12px',
      borderRadius: '6px',
      cursor: 'pointer',
      accentColor: '#6366f1'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      backgroundColor: 'rgba(30, 41, 59, 0.4)',
      padding: '20px',
      borderRadius: '24px',
      border: '1px solid rgba(51, 65, 85, 0.5)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        <header style={styles.header}>
          <h1 style={styles.title}>SYSTEM COMMAND</h1>
          <p style={styles.subtitle}>Active Device Control Center</p>
        </header>

        <div style={styles.grid}>
          
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.iconBox(isLedOn, '#eab308')}>
                <Lightbulb size={40} />
              </div>
              <button onClick={handleLedToggle} style={styles.powerBtn(isLedOn)}>
                <Power size={24} />
              </button>
            </div>
            
            <h2 style={styles.valueLabel}>LED Intensity</h2>
            <div style={styles.valueDisplay('#818cf8')}>{Math.round((ledValue/255)*100)}%</div>
            
            <input 
              type="range" min="0" max="255" value={ledValue}
              onChange={handleLedSlider}
              style={{...styles.slider, accentColor: '#818cf8'}}
            />
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.iconBox(isMotorOn, '#10b981')}>
                <div style={{
                  display: 'flex',
                  animation: isMotorOn ? `spin ${Math.max(0.1, (256-motorValue)/50)}s linear infinite` : 'none'
                }}>
                  <Fan size={40} />
                </div>
              </div>
              <button onClick={handleMotorToggle} style={styles.powerBtn(isMotorOn)}>
                <Power size={24} />
              </button>
            </div>
            
            <h2 style={styles.valueLabel}>Motor Speed</h2>
            <div style={styles.valueDisplay('#10b981')}>{Math.round((motorValue/255)*100)}%</div>
            
            <input 
              type="range" min="0" max="255" value={motorValue}
              onChange={handleMotorSlider}
              style={{...styles.slider, accentColor: '#10b981'}}
            />
          </div>

        </div>

        <footer style={styles.footer}>
          <Activity size={18} color="#818cf8" />
          <span style={{fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '4px', color: '#64748b'}}>
            Serial Bridge Active • Localhost 5000
          </span>
        </footer>

        <style>
          {`
            body, html {
              margin: 0;
              padding: 0;
              background-color: #0f172a; /* Matches the slate-900 theme */
              overflow-x: hidden;
            }

            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default App;
