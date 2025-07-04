import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TZDate } from "@date-fns/tz";
import { format, addSeconds } from "date-fns";
import { es } from "date-fns/locale";
import LoadingComponent from '../../components/LoadingComponent';
import { useAuth } from '../../components/AuthProvider';
import AsistenciaPopup from './popups/AsistenciaPopup';


const base = import.meta.env.VITE_BASE_BACKEND_URL
const update_assistance_url = base + "/updateAssistanceEndpoint"
const decrypt_token_url = base + "/decryptData"

const Asistencia: React.FC = () => {
    const { logout } = useAuth();

    const date = new Date();
    const now = new TZDate(date, "America/Lima");
    const navigate = useNavigate();
    // const location = useLocation();
    // const params = new URLSearchParams(location.search);

    const [payload, setPayload] = useState<any>(null);
    const [nombre, setNombre] = useState("");
    const [dni, setDni] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [abrirObervacionPopup, setAbrirObservacionPopup] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState(now);

    const [isVisible, setIsVisible] = useState(true);


    const midnight = new Date(currentDate);
    midnight.setHours(0, 0, 0, 0);

    useEffect(() => {
        const verifyToken = async (jwt: string) => {
            try {
                setIsLoading(true);
                const response = await fetch(decrypt_token_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "token": jwt
                    }),
                });
                const responseData = await response.json();

                if (!response.ok) {
                    const error_message = responseData.content.message ?? ""
                    console.log("Respuesta del servidor:", error_message);
                    sessionStorage.removeItem("authToken")
                    alert(error_message)
                    navigate(`/`)
                    return
                }

                setPayload({
                    "nombre": responseData.content.nombre,
                    "dni": responseData.content.dni,
                })

            } catch (error) {
                console.error("Error al verificar el token", error);
                navigate(`/`);
            } finally {
                setIsLoading(false);
            }
        }

        const jwt = sessionStorage.getItem('authToken');
        if (jwt) {
            verifyToken(jwt)
        } else {
            navigate(`/`);
        }
    }, [])

    useEffect(() => {
        if (payload) {
            setNombre(payload.nombre);
            setDni(payload.dni);
        }
    }, [payload]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate((prev) => {
                return addSeconds(prev, 1);
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const midnight = new Date(currentDate);
        midnight.setHours(0, 0, 0, 0);

        const threeAM = new Date(currentDate);
        threeAM.setHours(3, 0, 0, 0);

        if (currentDate > midnight && currentDate < threeAM) {
            let adjustedDate = new TZDate(currentDate, "America/Lima");
            adjustedDate.setDate(new TZDate(currentDate, "America/Lima").getDate() - 1);
            setIsVisible(false)
        }
    }, [currentDate]);

    const updateAssistance = async (evento: string) => {
        setIsLoading(true)
        const hora = format(currentDate, 'p', { locale: es })
        const midnight = new Date(currentDate);
        midnight.setHours(0, 0, 0, 0);

        const threeAM = new Date(currentDate);
        threeAM.setHours(3, 0, 0, 0);

        let fecha = format(currentDate, 'P', { locale: es });

        if (evento === "salida" && currentDate > midnight && currentDate < threeAM) {
            let adjustedDate = new TZDate(currentDate, "America/Lima");
            adjustedDate.setDate(new TZDate(currentDate, "America/Lima").getDate() - 1);
            fecha = format(adjustedDate, 'P', { locale: es });
        }

        const data = {
            "dni": dni.toString(),
            "nombre": nombre,
            "evento": evento,
            "fecha": fecha,
            "hora": hora
        }

        try {
            const response = await fetch(update_assistance_url, {
                method: 'POST',  // Método POST
                headers: {
                    'Content-Type': 'application/json', // Indicamos que el contenido es JSON
                },
                body: JSON.stringify(data), // Convertimos los datos a formato JSON
            });
            if (!response.ok) {
                const responseData = await response.json();
                console.log("Respuesta del servidor:", responseData);
                throw new Error(responseData.message);
            }

        } catch (error) {
            console.error(error);
            alert(error);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className='component-container'>
            <div className='container'>
                <LoadingComponent flag={isLoading} />
                <div style={{
                    margin: "auto",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px"
                }}>
                    <h1 style={{
                        fontSize: "1.8rem",
                        textAlign: "center",
                        margin: "0",
                        lineHeight: "1.5",
                        color: "#f1c40f"
                    }}>
                        {nombre}
                    </h1>
                    <h2 style={{
                        fontSize: "4rem",
                        textAlign: "center",
                        margin: "0.2rem 0",
                        fontWeight: "bold"
                    }}>
                        {format(currentDate, 'pp', { locale: es })}
                    </h2>
                    <h4 style={{
                        fontSize: "1.5rem",
                        textAlign: "center",
                        color: "bdc3c7",
                        margin: "0",
                        fontWeight: "400"
                    }}>
                        {format(currentDate, 'PPPP', { locale: es })}
                    </h4>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "12px",
                        width: "100%",
                        margin: "auto",
                    }}
                >
                    <div className="assistance-grid">
                        <button
                            className="check-assistance-btn entrada"
                            onClick={() => updateAssistance("entrada")}
                            disabled={!isVisible}
                        >
                            Entrada 1
                        </button>
                        <button
                            className="check-assistance-btn entrada2"
                            onClick={() => updateAssistance("descanso_fin")}
                            disabled={!isVisible}
                        >
                            Entrada 2
                        </button>
                        <button
                            className="check-assistance-btn salida"
                            onClick={() => updateAssistance("descanso_inicio")}
                            disabled={!isVisible}
                        >
                            Salida 1
                        </button>
                        <button
                            className="check-assistance-btn salida2"
                            onClick={() => updateAssistance("salida")}
                        >
                            Salida 2
                        </button>
                    </div>
                    <p>¿Hubo algún error o te olvidaste de marcar entrada? <span style={{ color: "yellow" }}><b>Envía una observación aquí</b></span></p>
                    <button
                        className="check-assistance-btn observacion"
                        onClick={() => setAbrirObservacionPopup(true)}>
                        ¿Tienes alguna observación?
                    </button>
                    {abrirObervacionPopup && (
                        <AsistenciaPopup
                            workerInfo={{ 
                                "nombre": nombre, 
                                "dni": dni,
                            }}
                            onClose={() => setAbrirObservacionPopup(false)}
                        />
                    )}
                    <button className="check-assistance-btn salir" onClick={() => {
                        logout()
                    }}>Salir</button>
                </div>
            </div>
        </div>
    );
};

export default Asistencia;