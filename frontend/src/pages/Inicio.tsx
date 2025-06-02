import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workers } from '../functions/getWorkers';
import logo from '../../public/logo.jpg'

const Inicio: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState("");
  const selectedWorker = workers.find((w) => w.index === selectedIndex);

  // const handleRegister = () => {
  //   navigate('/registro');
  // };

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
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Centra verticalmente
          alignItems: "center", // Centra horizontalmente
          margin: "auto",
          width: "100%",
          maxWidth: "350px",
          height: "300px", // Ajusta según necesidad
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "10px",
          padding: "24px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Sombra sutil
          color: "white",
          textAlign: "center",
          backgroundColor: "#242424",
          gap: "12px"
        }}
      >
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
          {/* <button onClick={handleRegister} style={{ width: "300px" }}>Registrar</button> */}
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
    </>
  );
};

export default Inicio;
