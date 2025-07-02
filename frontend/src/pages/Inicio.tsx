import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workers } from '../functions/getWorkers';
import logo from '../../public/logo.jpg'

const Inicio: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState("");
  const selectedWorker = workers.find((w) => w.index === selectedIndex);

  const handleVerify = (id?: string) => {
    if (id) {
      navigate(`/verificacion/${id}`);
    }
  };

  const selectStyle = {
    "width": "100%",
    "padding": "8px",
    "border": "1px solid white"
  }

  return (
    <div className='component-container'>
      <div className='container'>
        <img
          src={logo} alt="Logo restaurante Donde el Che"
          style={{
            "width": "200px",
            "padding": "16px"
          }}
        />
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            style={selectStyle}
          >
            <option value="">-- Selecciona --</option>
            {workers.map((worker) => (
              <option key={worker.index} value={worker.index}>
                {worker.nombre}
              </option>
            ))}
          </select>
          <button onClick={() => handleVerify(selectedWorker?.index)} style={{ width: "300px" }}>Validar</button>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
