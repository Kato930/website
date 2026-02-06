import React, { useState } from 'react';
import { Lightbulb, Fan, Power, Activity } from 'lucide-react';

function App() {
  const [states, setStates] = useState({
    L1: 0, L2: 0, L3: 0, L4: 0, MA: 0, MB: 0
  });

  const sendCommand = async (device, value) => {
    try {
      await fetch('http://localhost:5000/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device, value: parseInt(value) })
      });
    } catch (err) {
      console.warn("Backend offline.");
    }
  };

  const handleUpdate = (device, val) => {
    setStates(prev => ({ ...prev, [device]: val }));
    sendCommand(device, val);
  };

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Inter, sans-serif' },
    wrapper: { maxWidth: '1200px', width: '100%' },
    header: { textAlign: 'center', marginBottom: '40px' },
    title: { fontSize: '42px', fontWeight: '900', color: '#818cf8', margin: 0, letterSpacing: '-1px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' },
    card: { backgroundColor: '#1e293b', padding: '25px', borderRadius: '35px', border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
    iconRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    iconBox: (val, color) => ({ padding: '15px', borderRadius: '20px', backgroundColor: val > 0 ? color : '#334155', color: 'white', transition: '0.3s' }),
    valText: (color) => ({ fontSize: '32px', fontWeight: '900', color: color, margin: '10px 0' }),
    label: { fontSize: '10px', fontWeight: '800', color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase' },
    slider: (color) => ({ width: '100%', accentColor: color, cursor: 'pointer' })
  };

  const ControlCard = ({ id, label, icon: Icon, color, value }) => (
    <div style={styles.card}>
      <div style={styles.iconRow}>
        <div style={styles.iconBox(value, color)}>
          <Icon className={id.startsWith('M') && value > 0 ? 'animate-spin' : ''} />
        </div>
        <button 
          onClick={() => handleUpdate(id, value > 0 ? 0 : 255)}
          style={{ background: value > 0 ? color : '#334155', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', color: 'white' }}
        >
          <Power size={18} />
        </button>
      </div>
      <span style={styles.label}>{label}</span>
      <div style={styles.valText(value > 0 ? color : '#475569')}>{Math.round((value/255)*100)}%</div>
      <input 
        type="range" min="0" max="255" value={value} 
        style={styles.slider(color)}
        onChange={(e) => handleUpdate(id, e.target.value)} 
      />
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>SMART-HOME</h1>
          <p style={{ color: '#64748b', fontWeight: 'bold' }}>CONTROL</p>
        </div>

        <div style={styles.grid}>
          <ControlCard id="L1" label="LED - Pin 13" icon={Lightbulb} color="#eab308" value={states.L1} />
          <ControlCard id="L2" label="LED - Pin 12" icon={Lightbulb} color="#eab308" value={states.L2} />
          <ControlCard id="L3" label="LED - Pin 8" icon={Lightbulb} color="#eab308" value={states.L3} />
          <ControlCard id="L4" label="LED - Pin 7" icon={Lightbulb} color="#eab308" value={states.L4} />
          <ControlCard id="MA" label="Motor A - Speed" icon={Fan} color="#10b981" value={states.MA} />
          <ControlCard id="MB" label="Motor B - Speed" icon={Fan} color="#3b82f6" value={states.MB} />
        </div>

        <footer style={{ marginTop: '50px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
          <Activity size={16} /> <span style={{ fontSize: '10px', letterSpacing: '2px' }}>SYSTEMS NOMINAL • LOCALHOST:5000</span>
        </footer>
      </div>
      <style>{`
        body, html { margin: 0; padding: 0; background: #0f172a; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

export default App;
